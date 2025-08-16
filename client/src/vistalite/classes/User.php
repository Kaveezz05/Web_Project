<?php
require_once 'Database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    // Register new user
    public function register($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->db->prepare("
            INSERT INTO users (username, email, password_hash, created_at, updated_at, profile_complete)
            VALUES (?, ?, ?, NOW(), NOW(), 0)
        ");

        return $stmt->execute([$username, $email, $hashedPassword]);
    }

    // Login user
    public function login($username, $password) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
            ];
            return true;
        }

        return false;
    }

    // Check if logged in
    public function isLoggedIn() {
        return isset($_SESSION['user']);
    }

    // Logout user
    public function logout() {
        session_destroy();
        $_SESSION = [];
    }
public function getUserCount() {
    $stmt = $this->db->query("SELECT COUNT(*) AS total FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'] ?? 0;
}

}
?>
