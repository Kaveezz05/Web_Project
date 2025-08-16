<?php
// ✅ Dynamic CORS for dev
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// ✅ Required classes
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Movie.php';
require_once __DIR__ . '/classes/Show.php';

$movie = new Movie();
$show = new Show();

// ✅ Collect inputs
$movieId = $_POST['movie_id'] ?? null;
$showId = $_POST['show_id'] ?? null;
$title = $_POST['movie_title'] ?? null;
$show_datetime = $_POST['show_datetime'] ?? null;
$show_price = $_POST['show_price'] ?? null;

if (!$movieId || !$showId) {
    echo json_encode(["success" => false, "error" => "Missing movie_id or show_id"]);
    exit;
}

// ✅ Update movie title only if provided
if ($title) {
    $existing = $movie->getMovieById($movieId);
    if (!$existing) {
        echo json_encode(["success" => false, "error" => "Movie not found"]);
        exit;
    }
    $existing['title'] = $title;
    $movie->updateMovie($movieId, $existing);
}

// ✅ Update show details if provided
if ($show_datetime || $show_price) {
    $updateFields = [];
    $params = [];

    if ($show_datetime) {
        $updateFields[] = "show_datetime = ?";
        $params[] = $show_datetime;
    }
    if ($show_price) {
        $updateFields[] = "show_price = ?";
        $params[] = $show_price;
    }

    if ($updateFields) {
        $params[] = $showId;
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE shows SET " . implode(", ", $updateFields) . " WHERE id = ?");
        $stmt->execute($params);
    }
}

echo json_encode(["success" => true, "message" => "Show updated successfully"]);
