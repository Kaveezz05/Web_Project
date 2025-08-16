<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Movie.php';

try {
  $movie = new Movie();
  $allMovies = $movie->getMovieSummaries(); // ✅ clean lightweight list

  // Decode genres
  foreach ($allMovies as &$m) {
    $m['genres'] = json_decode($m['genres']);
  }

  echo json_encode(["success" => true, "movies" => $allMovies]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
