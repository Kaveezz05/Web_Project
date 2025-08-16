<?php
// /vistalite/logout.php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ----- CORS (exact origin + credentials) -----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only POST/GET
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST','GET'], true)) {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Kill session data
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    // Force-delete the session cookie
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'] ?? false, $params['httponly'] ?? true);
}
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out']);
