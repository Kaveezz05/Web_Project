<?php
// getbookingstats.php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

require_once __DIR__ . '/classes/Database.php';

try {
    // IMPORTANT: your Database.php uses a private constructor + getInstance()
    // and returns the PDO connection from getInstance()
    /** @var PDO $db */
    $db = Database::getInstance();

    // total bookings (all rows)
    $q1 = $db->query("SELECT COUNT(*) AS total_bookings FROM bookings");
    $row1 = $q1->fetch(PDO::FETCH_ASSOC);
    $totalBookings = (int)($row1['total_bookings'] ?? 0);

    // total revenue (sum of paid bookings only)
    // column is `is_paid` in your table (not isPaid)
    $q2 = $db->query("SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM bookings WHERE is_paid = 1");
    $row2 = $q2->fetch(PDO::FETCH_ASSOC);
    $totalRevenue = (float)($row2['total_revenue'] ?? 0);

    echo json_encode([
        "success" => true,
        "total_bookings" => $totalBookings,
        "total_revenue"  => $totalRevenue
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Failed to load booking stats",
        "details" => $e->getMessage()
    ]);
}
