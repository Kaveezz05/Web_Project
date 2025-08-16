<?php
// ---- CORS ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ---- Require POST ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success"=>false,"error"=>"Method not allowed"]);
    exit;
}

// ---- Session / auth ----
if (session_status() === PHP_SESSION_NONE) session_start();
if (empty($_SESSION['user']['id'])) {
    echo json_encode(["success"=>false,"error"=>"Not authenticated"]);
    exit;
}

// ---- Classes ----
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Booking.php';

// ---- Parse body ----
$raw = file_get_contents('php://input');
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
$body = (stripos($ctype, 'application/json') !== false)
    ? (json_decode($raw, true) ?: [])
    : ($_POST ?: []);
if (empty($body) && $raw) parse_str($raw, $body);

// ---- Inputs ----
$bookingId  = (int)($body['booking_id'] ?? 0);
$paymentRef = isset($body['payment_ref']) ? trim((string)$body['payment_ref']) : null;
$amount     = isset($body['amount']) ? (float)$body['amount'] : null;

if ($bookingId <= 0) {
    echo json_encode(["success"=>false,"error"=>"booking_id required"]);
    exit;
}

try {
    $booking = new Booking();
    $ok = $booking->markPaid($bookingId, $paymentRef, $amount);
    echo json_encode(["success"=>$ok]);
} catch (Throwable $e) {
    echo json_encode(["success"=>false,"error"=>"Server error: ".$e->getMessage()]);
}
