<?php
// ✅ Allow CORS from localhost (development)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ✅ Load required classes
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Booking.php';

try {
  $movieId  = isset($_GET['movie_id']) ? (int)$_GET['movie_id'] : 0;
  $datetime = isset($_GET['datetime']) ? trim((string)$_GET['datetime']) : '';

  if ($movieId <= 0 || $datetime === '') {
    echo json_encode(["success" => false, "error" => "movie_id and datetime are required"]);
    exit;
  }

  $booking = new Booking();
  $seats = $booking->getTakenSeats($movieId, $datetime);

  echo json_encode(["success" => true, "seats" => $seats]);
} catch (Throwable $e) {
  echo json_encode(["success" => false, "error" => "Server error: " . $e->getMessage()]);
}
