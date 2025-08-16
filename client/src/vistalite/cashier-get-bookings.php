<?php
// cashier-get-bookings.php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

require_once __DIR__ . '/classes/Database.php';


try {
    // ✅ Use singleton connection
    $conn = Database::getInstance();

    $sql = "
        SELECT 
            u.id AS user_id,
            u.username AS user_name,
            m.title AS movie_title,
            b.show_datetime,
            GROUP_CONCAT(bs.seat_code ORDER BY bs.seat_code ASC) AS seats
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN movies m ON b.movie_id = m.id
        JOIN booking_seats bs ON bs.booking_id = b.id
        GROUP BY b.id, u.id, u.username, m.title, b.show_datetime
        ORDER BY b.id ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert seats into array
    foreach ($bookings as &$booking) {
        $booking['seats'] = explode(',', $booking['seats']);
    }

    echo json_encode([
        'success' => true,
        'bookings' => $bookings
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to load bookings',
        'details' => $e->getMessage()
    ]);
}
