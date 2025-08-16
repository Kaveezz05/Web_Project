<?php
// ✅ CORS for local dev
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
  $rawShows = $show->getActiveShows(); // ✅ Use Show class method

  $grouped = [];
  $now = date("Y-m-d H:i:s");

  foreach ($rawShows as $row) {
    if ($row['show_datetime'] < $now) continue; // ✅ Skip expired shows

    $id = $row['movie_id'];

    if (!isset($grouped[$id])) {
      $grouped[$id] = [
        "movie_id" => $id,
        "title" => $row["title"],
        "backdrop_path" => $row["backdrop_path"],
        "vote_average" => $row["vote_average"],
        "show_price" => $row["show_price"],
        "showtimes" => [],
      ];
    }

    $grouped[$id]["showtimes"][] = $row["show_datetime"];
  }

  echo json_encode([
    "success" => true,
    "shows" => array_values($grouped)
  ]);
} catch (Exception $e) {
  echo json_encode([
    "success" => false,
    "error" => "Server error: " . $e->getMessage()
  ]);
}
