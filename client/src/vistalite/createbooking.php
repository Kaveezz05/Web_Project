<?php
declare(strict_types=1);

// ==== CORS for localhost (dev) ====
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Preflight response
    exit;
}
header("Content-Type: application/json");

// ==== Only allow POST ====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ==== Session / Auth Check ====
if (session_status() === PHP_SESSION_NONE) session_start();
if (empty($_SESSION['user']) || empty($_SESSION['user']['id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'You must be logged in to book tickets']);
    exit;
}
$userId = (int)$_SESSION['user']['id'];

// ==== Load Classes ====
require_once __DIR__ . '/classes/Database.php';
require_once __DIR__ . '/classes/Booking.php';

// ==== Get Inputs ====
$movieId   = (int)($_POST['movie_id'] ?? 0);
$showDate  = trim((string)($_POST['show_date'] ?? $_POST['date'] ?? ''));
$showTime  = trim((string)($_POST['show_time'] ?? $_POST['time'] ?? ''));
$seats     = $_POST['seats'] ?? [];
$amount    = (float)($_POST['amount'] ?? 0);

$seats = is_array($seats) ? array_values(array_filter($seats, 'strlen')) : [];

// ==== Validate Inputs ====
if ($movieId <= 0 || $showDate === '' || $showTime === '' || count($seats) === 0) {
    echo json_encode([
        'success' => false,
        'error' => 'movie_id, show_date/time and seats[] are required'
    ]);
    exit;
}

$datetime = $showDate . ' ' . $showTime;

try {
    $booking = new Booking();

    // ✅ Check if seats are already taken
    $taken = $booking->getTakenSeats($movieId, $datetime);
    $conflicts = array_intersect(
        array_map('strtoupper', $taken),
        array_map('strtoupper', $seats)
    );
    if (!empty($conflicts)) {
        echo json_encode([
            'success' => false,
            'error' => 'Some seats are already taken',
            'takenSeats' => $conflicts
        ]);
        exit;
    }

    // ✅ Create booking linked to logged-in user
    $bookingId = $booking->create($userId, $movieId, $datetime, $seats, $amount);

    echo json_encode([
        'success' => true,
        'booking_id' => $bookingId
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}
