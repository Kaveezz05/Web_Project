<?php
session_start();
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Trailer.php';

$trailer = new Trailer();
$data = $trailer->getAll();

echo json_encode(['success' => true, 'trailers' => $data]);
?>
