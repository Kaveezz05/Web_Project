<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

if (!isset($_SESSION['user']) || $_SESSION['user']['username'] !== 'admin') {
    echo json_encode(["success" => false, "error" => "Unauthorized (admin only)"]); exit;
}

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Reminder.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid method']); exit;
}

$title = trim($_POST['title'] ?? '');
$date = trim($_POST['date'] ?? '');

if (!$title || !$date) {
    echo json_encode(['success' => false, 'error' => 'Missing title or date']); exit;
}

$admin_id = $_SESSION['user']['id']; // Make sure this is set at login!
$reminder = new Reminder();
$reminder->deleteExpired($admin_id);

if ($reminder->add($title, $date, $admin_id)) {
    echo json_encode(['success' => true, 'message' => 'Reminder added']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to add reminder']);
}
?>
