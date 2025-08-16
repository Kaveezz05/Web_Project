<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

/**
 * Function to require login — call this in other scripts
 */
function ensure_logged_in(): void {
    if (empty($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "Not logged in"
        ]);
        exit;
    }
}

// If this file is accessed directly via browser, show user status
if (basename($_SERVER['SCRIPT_FILENAME']) === basename(__FILE__)) {
    if (!empty($_SESSION['user'])) {
        echo json_encode([
            "success" => true,
            "user" => $_SESSION['user']
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "Not logged in"
        ]);
    }
}
