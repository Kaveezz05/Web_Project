<?php
// ✅ Allow CORS from localhost (development)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// ✅ Load required classes
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Show.php';
require_once __DIR__ . '/classes/Movie.php';

try {
  $show = new Show();

  // ✅ Cleanup expired shows and their movies
  $show->cleanupExpiredMovies();

  // ✅ Fetch updated shows
  $shows = $show->getAllShows();

  echo json_encode([
    "success" => true,
    "shows" => $shows
  ]);
} catch (Exception $e) {
  echo json_encode([
    "success" => false,
    "error" => "Server error: " . $e->getMessage()
  ]);
}
?>
