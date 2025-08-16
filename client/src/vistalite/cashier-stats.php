<?php
// cashier-stats.php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

require_once __DIR__ . '/classes/Database.php';

try {
  /** @var PDO $pdo */
  $pdo = Database::getInstance(); // <-- your singleton returns the PDO conn

  // total bookings
  $total = (int)$pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();

  // today's bookings
  $today = (int)$pdo->query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at)=CURDATE()")->fetchColumn();

  // total revenue (paid only) — your column is `is_paid`
  $rev = (float)$pdo->query("SELECT COALESCE(SUM(amount),0) FROM bookings WHERE is_paid=1")->fetchColumn();

  echo json_encode([
    'success' => true,
    'total_bookings' => $total,
    'today_bookings' => $today,
    'total_revenue' => $rev,
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => 'Failed to load cashier stats',
    'details' => $e->getMessage(),
  ]);
}
