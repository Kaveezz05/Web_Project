<?php
class Reminder {
    private $db;
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function add($title, $date, $admin_id) {
        $stmt = $this->db->prepare("INSERT INTO reminders (title, date, admin_id) VALUES (?, ?, ?)");
        return $stmt->execute([$title, $date, $admin_id]);
    }

    public function getAll($admin_id) {
        $stmt = $this->db->prepare("SELECT * FROM reminders WHERE admin_id=? ORDER BY date ASC, id ASC");
        $stmt->execute([$admin_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteExpired($admin_id) {
        $stmt = $this->db->prepare("DELETE FROM reminders WHERE admin_id=? AND date < CURDATE()");
        return $stmt->execute([$admin_id]);
    }
}
?>
