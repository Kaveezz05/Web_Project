<?php
// ---- CORS ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ---- Session / auth ----
if (session_status() === PHP_SESSION_NONE) session_start();
if (empty($_SESSION['user']['id'])) {
  echo json_encode(["success"=>false,"error"=>"Not authenticated"]);
  exit;
}
$userId = (int)$_SESSION['user']['id'];

// ---- Classes ----
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Booking.php';

try {
  $booking = new Booking();
  $list = $booking->listForUser($userId);

 
  $scheme = (!empty($_SERVER['REQUEST_SCHEME'])) ? $_SERVER['REQUEST_SCHEME'] : ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
  $base   = $scheme . '://' . $_SERVER['HTTP_HOST'] . '/vistalite';

  // We'll need DB for looking up show_price
  $db = Database::getInstance();
  $priceStmt = $db->prepare("SELECT show_price FROM shows WHERE movie_id = ? AND show_datetime = ? LIMIT 1");

  foreach ($list as &$b) {
    // --- Poster path normalization ---
    $poster = $b['show']['movie']['poster_path'] ?? '';
    if ($poster !== '') {
      // If it's not an absolute URL, make it absolute under /vistalite
      if (!preg_match('#^https?://#i', $poster)) {
        // Ensure exactly one slash after /vistalite
        if ($poster[0] !== '/') {
          $poster = '/' . $poster;
        }
        $poster = $base . $poster;
      }
      $b['show']['movie']['poster_path'] = $poster;
    }

    // --- Amount calculation from shows.show_price if empty/zero ---
    $seatCount = isset($b['bookedSeats']) && is_array($b['bookedSeats']) ? count($b['bookedSeats']) : 0;
    if (empty($b['amount']) || (float)$b['amount'] <= 0) {
      $movieId = $b['show']['movie_id'] ?? null; // if your Booking::listForUser didn’t include this, use a safe fallback below
      $showDT  = $b['show']['showDateTime'] ?? null;

      // If Booking::listForUser didn't include movie_id, infer it by querying bookings table for this id
      if (!$movieId && !empty($b['id'])) {
        $q = $db->prepare("SELECT movie_id FROM bookings WHERE id=? LIMIT 1");
        $q->execute([$b['id']]);
        $movieId = (int)($q->fetchColumn() ?: 0);
      }

      if ($movieId && $showDT && $seatCount > 0) {
        $priceStmt->execute([$movieId, $showDT]);
        $price = (float)($priceStmt->fetchColumn() ?: 0);
        if ($price > 0) {
          $b['amount'] = $price * $seatCount;
        }
      }
    }
  }
  unset($b);

  echo json_encode(["success"=>true,"bookings"=>$list]);
} catch (Throwable $e) {
  echo json_encode(["success"=>false,"error"=>"Server error: ".$e->getMessage()]);
}
