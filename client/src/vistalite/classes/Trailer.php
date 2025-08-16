<?php
class Trailer {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function add($title, $url) {
        $stmt = $this->db->prepare("INSERT INTO trailers (title, url) VALUES (?, ?)");
        return $stmt->execute([$title, $url]);
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM trailers ORDER BY created_at ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>
