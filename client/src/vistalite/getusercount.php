<?php
// ✅ Dynamic CORS for localhost dev
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// ✅ Load required classes
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/User.php';

try {
    $user = new User();
    $total = $user->getUserCount();

    echo json_encode([
        "success" => true,
        "total_users" => $total
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Server error: " . $e->getMessage()
    ]);
}
