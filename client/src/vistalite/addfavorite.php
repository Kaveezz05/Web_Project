<?php
session_start();
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
require_once __DIR__ . '/classes/Database.php';

if (!isset($_SESSION['user'])) {
  echo json_encode(['success' => false, 'error' => 'Not logged in']); exit;
}

$user_id = $_SESSION['user']['id'];
$movie_id = intval($_POST['movie_id'] ?? 0);

if (!$movie_id) {
  echo json_encode(['success' => false, 'error' => 'Invalid movie']); exit;
}

$db = Database::getInstance();
$stmt = $db->prepare("INSERT IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)");
$ok = $stmt->execute([$user_id, $movie_id]);

echo json_encode(['success' => $ok]);
?>
