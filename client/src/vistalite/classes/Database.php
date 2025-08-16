<?php
// This class connects to the database using PDO
class Database {
    private static $instance = null; // Only one object of this class
    private $conn; // The database connection

    // Database settings
    private $host = 'localhost';
    private $db   = 'vistalite';
    private $user = 'root';
    private $pass = '';
    private $charset = 'utf8mb4';

    // This runs when we create the class for the first time
    private function __construct() {
        try {
            $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$this->charset";
            $this->conn = new PDO($dsn, $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Show errors
        } catch (PDOException $e) {
            die("Database Error: " . $e->getMessage());
        }
    }

    // Use this to get the database connection
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database(); // Create only once
        }
        return self::$instance->conn;
    }
}
?>
