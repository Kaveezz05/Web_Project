<?php
session_start();

/* ---- CORS (localhost any port) ---- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // preflight
}

/* ---- Auth check (match your app) ---- */
if (!isset($_SESSION['user']) || empty($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}
$userId = (int) $_SESSION['user']['id'];

/* ---- Load DB ---- */
require_once __DIR__ . '/classes/Database.php';
try {
    // Your Database.php appears to expose getInstance()
    $db = Database::getInstance();
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}

/* ---- Read input (JSON or form) ---- */
$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) $payload = $_POST;

$bookingId = isset($payload['booking_id']) ? (int)$payload['booking_id'] : 0;
if ($bookingId <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid booking_id']);
    exit;
}

try {
    $db->beginTransaction();

    // Optional: free seats if such a table exists. Ignore if not present.
    try {
        $stmtSeats = $db->prepare("DELETE FROM booked_seats WHERE booking_id = ?");
        $stmtSeats->execute([$bookingId]);
    } catch (Throwable $ignored) {
        // table might not exist in your schema; safely ignore
    }

    // Delete booking but only if it belongs to this user
    $stmt = $db->prepare("DELETE FROM bookings WHERE id = ? AND user_id = ?");
    $stmt->execute([$bookingId, $userId]);

    if ($stmt->rowCount() < 1) {
        // Nothing deleted: either not found or not this user's booking
        $db->rollBack();
        echo json_encode(['success' => false, 'error' => 'Booking not found or not owned by user']);
        exit;
    }

    $db->commit();
    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
