<?php
class Booking {
    /** @var PDO */
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /** Return already taken seats for a given movie+datetime */
    public function getTakenSeats(int $movieId, string $datetime): array {
        $sql = "SELECT bs.seat_code
                FROM booking_seats bs
                JOIN bookings b ON b.id = bs.booking_id
                WHERE bs.movie_id = ?
                  AND bs.show_datetime = ?
                  AND b.status IN ('pending','paid')";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$movieId, $datetime]);
        return array_map('strtoupper', array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'seat_code'));
    }

    /** Create booking + seats atomically */
    public function create(int $userId, int $movieId, string $datetime, array $seats, float $amount): int {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare(
                "INSERT INTO bookings (user_id, movie_id, show_datetime, amount, status, is_paid)
                 VALUES (?, ?, ?, ?, 'pending', 0)"
            );
            $stmt->execute([$userId, $movieId, $datetime, $amount]);
            $bookingId = (int)$this->db->lastInsertId();

            $ins = $this->db->prepare(
                "INSERT INTO booking_seats (booking_id, movie_id, show_datetime, seat_code)
                 VALUES (?, ?, ?, ?)"
            );
            foreach ($seats as $s) {
                $seat = strtoupper(trim((string)$s));
                if ($seat !== '') {
                    $ins->execute([$bookingId, $movieId, $datetime, $seat]);
                }
            }

            $this->db->commit();
            return $bookingId;
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /** List bookings for a user (shape tailored for MyBookings.jsx) */
    public function listForUser(int $userId): array {
        $sql = "SELECT b.id, b.amount, b.status, b.show_datetime,
                       m.title, m.runtime, m.backdrop_path
                FROM bookings b
                JOIN movies m ON m.id = b.movie_id
                WHERE b.user_id = ?
                ORDER BY b.created_at DESC, b.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $seatStmt = $this->db->prepare("SELECT seat_code FROM booking_seats WHERE booking_id = ?");
        $result = [];
        foreach ($rows as $r) {
            $seatStmt->execute([(int)$r['id']]);
            $seats = array_column($seatStmt->fetchAll(PDO::FETCH_ASSOC), 'seat_code');

            // Build usable poster path
            $poster = (string)($r['backdrop_path'] ?? '');
            if ($poster === '') {
                $posterWeb = '/assets/default-poster.jpg';
            } elseif (strpos($poster, 'http') === 0) {
                $posterWeb = $poster;
            } else {
                $posterWeb = '/uploads/' . ltrim($poster, '/');
            }

            $result[] = [
                'id' => (int)$r['id'],
                'isPaid' => $r['status'] === 'paid',
                'amount' => (float)$r['amount'],
                'bookedSeats' => array_values($seats),
                'show' => [
                    'showDateTime' => $r['show_datetime'],
                    'movie' => [
                        'title' => (string)$r['title'],
                        'runtime' => (int)$r['runtime'],
                        'poster_path' => $posterWeb,
                    ],
                ],
            ];
        }

        return $result;
    }

    /** Mark booking paid, optionally update amount, and set is_paid=1 */
    public function markPaid(int $bookingId, ?string $paymentRef = null, ?float $amount = null): bool {
        if ($amount !== null) {
            $stmt = $this->db->prepare(
                "UPDATE bookings 
                 SET status='paid', is_paid=1, payment_ref=?, amount=? 
                 WHERE id=?"
            );
            return $stmt->execute([$paymentRef, $amount, $bookingId]);
        } else {
            $stmt = $this->db->prepare(
                "UPDATE bookings 
                 SET status='paid', is_paid=1, payment_ref=? 
                 WHERE id=?"
            );
            return $stmt->execute([$paymentRef, $bookingId]);
        }
    }
public function cancelBooking($bookingId, $userId) {
    // Ensure this booking belongs to this user
    $query = "DELETE FROM bookings WHERE id = :id AND user_id = :user_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":id", $bookingId, PDO::PARAM_INT);
    $stmt->bindParam(":user_id", $userId, PDO::PARAM_INT);

    return $stmt->execute();
}



}
