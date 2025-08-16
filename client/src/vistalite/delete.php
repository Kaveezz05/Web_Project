<?php
// ✅ Dynamic CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Movie.php';
require_once __DIR__ . '/classes/Show.php';

$movieId = $_POST['movie_id'] ?? null;
$showId = $_POST['show_id'] ?? null;

if (!$movieId || !$showId) {
    echo json_encode(["success" => false, "error" => "Missing movie_id or show_id"]);
    exit;
}

$movie = new Movie();
$show = new Show();

// ✅ Delete selected show
$deleted = $show->deleteShowById($showId);

// ✅ Check if any shows remain for that movie
$db = Database::getInstance();
$stmt = $db->prepare("SELECT COUNT(*) FROM shows WHERE movie_id = ?");
$stmt->execute([$movieId]);
$count = $stmt->fetchColumn();

// ✅ Delete movie if no shows left
if ($count == 0) {
    $movie->deleteMovie($movieId);
}

echo json_encode(["success" => true, "message" => "Show (and maybe movie) deleted"]);
