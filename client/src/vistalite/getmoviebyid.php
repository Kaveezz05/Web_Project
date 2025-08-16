<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Movie.php';
require_once __DIR__ . '/classes/Show.php';

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "error" => "Missing movie ID"]);
    exit;
}

try {
    $movieId = intval($_GET['id']);
    $movie = new Movie();
    $show = new Show();

    $movieData = $movie->getMovieWithGenres($movieId);

    if (!$movieData) {
        echo json_encode(["success" => false, "error" => "Movie not found"]);
        exit;
    }

    // Normalize poster path
    $movieData['backdrop_path'] = ltrim($movieData['backdrop_path'], '/');

    // Get showtimes
    $showtimes = $show->getGroupedShowtimes($movieId);
    $movieData['showDateTime'] = $showtimes;

    echo json_encode(["success" => true, "movie" => $movieData]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
