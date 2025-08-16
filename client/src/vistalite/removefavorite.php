<?php
// POST { booking_id }
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json');

require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Booking.php';

// auth (matches your favorites example)
if (empty($_SESSION['user']['id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}
$userId = (int)$_SESSION['user']['id'];

// parse input (form or JSON)
$raw    = file_get_contents('php://input') ?: '';
$ctype  = $_SERVER['CONTENT_TYPE'] ?? '';
$body   = (stripos($ctype, 'application/json') !== false) ? (json_decode($raw, true) ?: []) : $_POST;

$bookingId = isset($body['booking_id']) ? (int)$body['booking_id'] : 0;
if ($bookingId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid booking_id']);
    exit;
}

$booking = new Booking();
$result  = $booking->cancelUserBooking($bookingId, $userId);

if (empty($result['success'])) {
    http_response_code($result['code'] ?? 400);
    echo json_encode(['success' => false, 'error' => $result['message'] ?? 'Cancel failed']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Booking cancelled']);
