<?php
// cashier-auth.php
session_start();

// Allow CORS if needed

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

// Only allow cashier
if ($_SESSION['username'] !== 'cashier') {
    echo json_encode(['success' => false, 'error' => 'Forbidden']);
    exit;
}
?>
