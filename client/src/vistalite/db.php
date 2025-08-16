<?php
// Load the Database class from the classes folder
require_once __DIR__ . '/classes/Database.php';

// Get the PDO connection
$conn = Database::getInstance();
