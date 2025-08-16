<?php
// cashier-get-bookings-by-date.php
// Returns bookings for a given calendar date (YYYY-MM-DD).

session_start();

// ---------- CORS (local dev) ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
header('Content-Type: application/json');

// ---------- Toggle auth (set to true if/when you wire cashier auth) ----------
if (!defined('ENFORCE_AUTH')) {
    define('ENFORCE_AUTH', false);
}

try {
    // Optional cashier/admin auth (off by default)
    if (ENFORCE_AUTH) {
        // If you have a cashier-auth file, include it here.
        $authFile = __DIR__ . '/cashier-auth.php';
        if (file_exists($authFile)) {
            require_once $authFile;
        }
        $role = $_SESSION['user']['role'] ?? $_SESSION['role'] ?? null;
        if (!$role || !in_array(strtolower($role), ['cashier', 'admin'], true)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized']);
            exit;
        }
    }

    // ---------- Input validation ----------
    $date = $_GET['date'] ?? '';
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing or invalid date. Use YYYY-MM-DD.']);
        exit;
    }

    // ---------- DB bootstrap ----------
    // Try both locations seen in your project
    $dbFile1 = __DIR__ . '/classes/Database.php';
    $dbFile2 = __DIR__ . '/Database.php';
    if (file_exists($dbFile1)) {
        require_once $dbFile1;
    } elseif (file_exists($dbFile2)) {
        require_once $dbFile2;
    } else {
        throw new RuntimeException('Database.php not found (tried /classes/Database.php and /Database.php).');
    }

    // Get a PDO handle (support either style your class provides)
    $pdo = null;
    if (is_callable(['Database', 'getConnection'])) {
        $pdo = Database::getConnection();
    } elseif (is_callable(['Database', 'getInstance'])) {
        $maybe = Database::getInstance();
        if ($maybe instanceof PDO) {
            $pdo = $maybe;
        } elseif (is_object($maybe) && method_exists($maybe, 'getConnection')) {
            $pdo = $maybe->getConnection();
        }
    }
    if (!$pdo instanceof PDO) {
        throw new RuntimeException('Could not obtain a PDO connection from Database class.');
    }

    // ---------- Query ----------
    // Note: we join movies by b.movie_id and use b.show_datetime directly (no b.show_id in your schema).
    // Seats come from booking_seats via GROUP_CONCAT.
    $sql = "
        SELECT
            b.id                           AS id,
            b.user_id                      AS user_id,
            COALESCE(u.username, u.email)  AS username,
            m.title                        AS movie_title,
            b.show_datetime                AS show_datetime,
            GROUP_CONCAT(bs.seat_code ORDER BY bs.seat_code) AS seats_csv
        FROM bookings b
        JOIN users   u ON u.id = b.user_id
        JOIN movies  m ON m.id = b.movie_id
        LEFT JOIN booking_seats bs ON bs.booking_id = b.id
        WHERE DATE(b.show_datetime) = :the_date
        GROUP BY b.id
        ORDER BY b.show_datetime DESC, b.id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':the_date' => $date]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    // Normalize seats to an array
    $bookings = array_map(function ($r) {
        $seats = [];
        if (!empty($r['seats_csv'])) {
            $seats = array_values(array_filter(array_map('trim', explode(',', $r['seats_csv']))));
        }
        return [
            'id'            => (int)$r['id'],
            'user_id'       => (int)$r['user_id'],
            'username'      => (string)$r['username'],
            'movie_title'   => (string)$r['movie_title'],
            'show_datetime' => (string)$r['show_datetime'],
            'seats'         => $seats,
        ];
    }, $rows);

    echo json_encode([
        'success'  => true,
        'date'     => $date,
        'count'    => count($bookings),
        'bookings' => $bookings,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to load bookings by date',
        'details' => $e->getMessage(),
    ]);
}
