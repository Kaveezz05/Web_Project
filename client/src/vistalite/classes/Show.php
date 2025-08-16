<?php
require_once 'Database.php';

/**
 * Class Show handles all show-related operations:
 * - Adding showtimes
 * - Retrieving showtimes
 * - Deleting showtimes
 * - Auto-cleaning expired movies
 */
class Show {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Add multiple showtimes for a movie
     */
    public function addShowtimes($movieId, $showDateTimeArray, $price) {
        $stmt = $this->db->prepare("
            INSERT INTO shows (movie_id, show_datetime, show_price, created_at)
            VALUES (?, ?, ?, NOW())
        ");

        foreach ($showDateTimeArray as $date => $times) {
            foreach ($times as $time) {
                $datetime = "$date $time";
                $stmt->execute([$movieId, $datetime, $price]);
            }
        }

        return true;
    }

    /**
     * Get all shows with movie details
     */
    public function getAllShows() {
        $stmt = $this->db->prepare("
            SELECT 
                shows.id,
                shows.movie_id,
                movies.title AS movie_title,
                shows.show_datetime,
                shows.show_price,
                shows.created_at
            FROM shows
            JOIN movies ON shows.movie_id = movies.id
            ORDER BY shows.created_at ASC
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get active (future) shows with movie details
     */
    public function getActiveShows() {
        $stmt = $this->db->prepare("
            SELECT 
                s.movie_id,
                s.show_datetime,
                s.show_price,
                m.title,
                m.backdrop_path,
                m.vote_average
            FROM shows s
            JOIN movies m ON s.movie_id = m.id
            ORDER BY s.show_datetime ASC
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Group showtimes by date for a movie
     */
    public function getGroupedShowtimes($movieId) {
        $stmt = $this->db->prepare("
            SELECT show_datetime FROM shows 
            WHERE movie_id = ? 
            ORDER BY show_datetime ASC
        ");
        $stmt->execute([$movieId]);
        $results = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $grouped = [];
        foreach ($results as $dt) {
            [$date, $time] = explode(' ', $dt);
            $grouped[$date][] = $time;
        }

        return $grouped;
    }

    /**
     * Get all showtimes for a specific date
     */
    public function getShowtimesByDate($movieId, $date) {
        $stmt = $this->db->prepare("
            SELECT id, show_datetime, show_price 
            FROM shows 
            WHERE movie_id = ? AND DATE(show_datetime) = ?
            ORDER BY show_datetime ASC
        ");
        $stmt->execute([$movieId, $date]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Delete all showtimes of a movie
     */
    public function deleteShowtimesByMovie($movieId) {
        $stmt = $this->db->prepare("DELETE FROM shows WHERE movie_id = ?");
        return $stmt->execute([$movieId]);
    }

    /**
     * Delete a specific show by its ID
     */
    public function deleteShowById($showId) {
        $stmt = $this->db->prepare("DELETE FROM shows WHERE id = ?");
        return $stmt->execute([$showId]);
    }

    /**
     * Delete movies with no upcoming shows (auto-clean expired)
     */
    public function cleanupExpiredMovies() {
        $now = date("Y-m-d H:i:s");

        $stmt = $this->db->query("SELECT DISTINCT movie_id FROM shows");
        $movieIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($movieIds as $movieId) {
            $check = $this->db->prepare("
                SELECT COUNT(*) FROM shows 
                WHERE movie_id = ? AND show_datetime > ?
            ");
            $check->execute([$movieId, $now]);
            $count = $check->fetchColumn();

            if ($count == 0) {
                $this->db->prepare("DELETE FROM shows WHERE movie_id = ?")->execute([$movieId]);
                $this->db->prepare("DELETE FROM movies WHERE id = ?")->execute([$movieId]);
            }
        }
    }
}
?>
