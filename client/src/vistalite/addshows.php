<?php
// ✅ CORS & content headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// ✅ Load classes
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Movie.php';
require_once __DIR__ . '/classes/Show.php';

// ✅ Validate required fields
$required = ['title', 'tagline', 'language', 'runtime', 'release_date', 'overview', 'genres', 'price', 'showDateTime'];
foreach ($required as $field) {
    if (!isset($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
        exit;
    }
}

// ✅ Poster file upload
if (!isset($_FILES['poster'])) {
    echo json_encode(['success' => false, 'message' => "Poster not uploaded"]);
    exit;
}

$posterFile = $_FILES['poster'];
$targetDir = __DIR__ . "/uploads/";
if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

$filename = time() . "_" . basename($posterFile["name"]);
$posterPath = "uploads/" . $filename;
$fullPosterPath = $targetDir . $filename;

if (!move_uploaded_file($posterFile["tmp_name"], $fullPosterPath)) {
    echo json_encode(['success' => false, 'message' => "Failed to upload poster"]);
    exit;
}

// ✅ Sanitize and collect movie data
$movieData = [
    'title' => $_POST['title'],
    'tagline' => $_POST['tagline'],
    'language' => $_POST['language'],
    'runtime' => intval($_POST['runtime']),
    'release_date' => $_POST['release_date'],
    'overview' => $_POST['overview'],
    'genres' => json_decode($_POST['genres'], true),
    'vote_average' => 7.5,
    'backdrop_path' => $posterPath
];

// ✅ Parse showtime data
$showDateTimeArray = json_decode($_POST['showDateTime'], true);
$price = floatval($_POST['price']);

// ✅ Try to insert movie and shows
try {
    $movie = new Movie();
    $movieAdded = $movie->addMovie($movieData);

    if (!$movieAdded) {
        echo json_encode(['success' => false, 'message' => "Failed to insert movie"]);
        exit;
    }

    $conn = Database::getInstance();
    $movieId = $conn->lastInsertId();

    $show = new Show();
    $show->addShowtimes($movieId, $showDateTimeArray, $price);

    echo json_encode(['success' => true, 'message' => "Show added successfully"]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}  