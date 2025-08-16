<?php
// /vistalite/login.php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ----- Dynamic CORS (any localhost port) -----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

require_once __DIR__ . '/classes/User.php';

try {
    // Accept form-encoded or JSON
    $username = $_POST['username'] ?? null;
    $password = $_POST['password'] ?? null;

    if ($username === null || $password === null) {
        $raw = file_get_contents('php://input');
        if ($raw) {
            $json = json_decode($raw, true);
            if (is_array($json)) {
                $username = $username ?? ($json['username'] ?? null);
                $password = $password ?? ($json['password'] ?? null);
            }
        }
    }

    $username = is_string($username) ? trim($username) : '';
    $password = is_string($password) ? (string)$password : '';

    if ($username === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and password required']);
        exit;
    }

    $user = new User();

    // User::login should set $_SESSION['user'] on success
    if ($user->login($username, $password)) {
        // Make sure we return what the frontend expects
        $sessUser = $_SESSION['user'] ?? ['username' => $username];
        $resp = [
            'success'  => true,
            'username' => $sessUser['username'] ?? $username,
        ];
        // If your session stores a role/id, return them as a bonus (harmless if missing)
        if (!empty($sessUser['role'])) { $resp['role'] = $sessUser['role']; }
        if (!empty($sessUser['id']))   { $resp['id']   = $sessUser['id'];   }

        echo json_encode($resp);
        exit;
    }

    // Invalid credentials
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
} catch (Throwable $e) {
    // Don’t leak details in production
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
