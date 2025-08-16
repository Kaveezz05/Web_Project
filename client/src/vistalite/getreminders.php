<?php
session_start();

// --- CORS headers (localhost only, match your style)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// --- Handle preflight (OPTIONS) requests for CORS ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ❌ If not logged in or not admin → block
if (!isset($_SESSION['user']) || $_SESSION['user']['username'] !== 'admin') {
    echo json_encode([
        "success" => false,
        "error" => "Unauthorized (admin only)"
    ]);
    exit;
}

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Reminder.php';

// Use admin's id from session, or username if you use that as key
$admin_id = $_SESSION['user']['id']; // or 'admin' or $_SESSION['user']['username'] for string key

$reminder = new Reminder();
$reminder->deleteExpired($admin_id);

$data = $reminder->getAll($admin_id);

echo json_encode([
    'success' => true,
    'reminders' => $data
]);
?>
