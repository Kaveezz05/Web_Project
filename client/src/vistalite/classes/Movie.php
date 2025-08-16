<?php
require_once 'Database.php';

// This class handles movies: add, get, update, delete
class Movie {
    private $db;

    // Connect to the database
    public function __construct() {
        $this->db = Database::getInstance();
    }

    // Add a new movie to the database
    public function addMovie($data) {
        $stmt = $this->db->prepare("
            INSERT INTO movies (title, tagline, genres, original_language, runtime, release_date, overview, backdrop_path, vote_average, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ");

        return $stmt->execute([
            $data['title'],
            $data['tagline'],
            json_encode($data['genres']),
            $data['language'],
            $data['runtime'],
            $data['release_date'],
            $data['overview'],
            $data['backdrop_path'],
            $data['vote_average']
        ]);
    }

    // Get one movie by its ID
    public function getMovieById($id) {
        $stmt = $this->db->prepare("SELECT * FROM movies WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get all movies
    public function getAllMovies() {
        $stmt = $this->db->query("SELECT * FROM movies ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Update an existing movie
    public function updateMovie($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE movies SET 
                title = ?, 
                tagline = ?, 
                genres = ?, 
                original_language = ?, 
                runtime = ?, 
                release_date = ?, 
                overview = ?, 
                backdrop_path = ?, 
                vote_average = ?, 
                updated_at = NOW()
            WHERE id = ?
        ");

        return $stmt->execute([
            $data['title'],
            $data['tagline'],
            json_encode($data['genres']),
            $data['language'],
            $data['runtime'],
            $data['release_date'],
            $data['overview'],
            $data['backdrop_path'],
            $data['vote_average'],
            $id
        ]);
    }

    // Delete a movie by its ID
    public function deleteMovie($id) {
        $stmt = $this->db->prepare("DELETE FROM movies WHERE id = ?");
        return $stmt->execute([$id]);
    }
   public function getMovieSummaries() {
  $stmt = $this->db->query("
    SELECT id, title, tagline, release_date, runtime, genres, backdrop_path, vote_average, created_at 
    FROM movies 
    ORDER BY created_at ASC
  ");
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
// ✅ Fetch one movie and decode genres
public function getMovieWithGenres($id) {
    $movie = $this->getMovieById($id);
    if ($movie) {
        $movie['genres'] = json_decode($movie['genres'], true);
    }
    return $movie;
}


}
?>
