<?php
// ✅ CORS and session headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

// ✅ Load user class
require_once __DIR__ . '/classes/User.php';

$user = new User();

// ✅ Get form inputs
$email = $_POST['email'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// ✅ Validate inputs
if (!$email || !$username || !$password) {
    echo json_encode([
        'success' => false,
        'message' => 'Username, email, and password are required'
    ]);
    exit;
}

// ✅ Try to register the user
try {
    $result = $user->register($username, $email, $password);

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'User registered successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
