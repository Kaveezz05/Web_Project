<?php
session_start();
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

if (!isset($_SESSION['user']) || $_SESSION['user']['username'] !== 'admin') {
    echo json_encode(["success" => false, "error" => "Unauthorized (admin only)"]); exit;
}

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Trailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid method']); exit;
}

$title = trim($_POST['title'] ?? '');
$url = trim($_POST['url'] ?? '');

if (!$title || !$url) {
    echo json_encode(['success' => false, 'error' => 'Missing data']); exit;
}

$trailer = new Trailer();
if ($trailer->add($title, $url)) {
    echo json_encode(['success' => true, 'message' => 'Trailer added']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to add trailer']);
}
?>
