<?php
session_start();
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
require_once __DIR__ . '/classes/Database.php';


if (!isset($_SESSION['user'])) {
  echo json_encode(['success' => false, 'error' => 'Not logged in']); 
  exit;
}

$user_id = $_SESSION['user']['id'];
$db = Database::getInstance();

try {
  $stmt = $db->prepare("SELECT m.* FROM favorites f JOIN movies m ON f.movie_id = m.id WHERE f.user_id=?");
  $stmt->execute([$user_id]);
  $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(['success' => true, 'favorites' => $movies]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
