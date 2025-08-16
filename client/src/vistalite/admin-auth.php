<?php
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// ❌ If not logged in or not admin → block
if (!isset($_SESSION['user']) || $_SESSION['user']['username'] !== 'admin') {
  echo json_encode([
    "success" => false,
    "error" => "Unauthorized (admin only)"
  ]);
  exit;
}

// ✅ If accessed directly (like via fetch in Dashboard), return user info
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
  echo json_encode([
    "success" => true,
    "user" => $_SESSION['user']
  ]);
  exit;
}

// 
