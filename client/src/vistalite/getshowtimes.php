<?php
// ✅ Allow dynamic local dev CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Content-Type: application/json");

require_once __DIR__ . '/classes/Show.php';

$movieId = isset($_GET['movie_id']) ? intval($_GET['movie_id']) : null;

if (!$movieId) {
    echo json_encode([
        "success" => false,
        "error" => "Missing movie_id"
    ]);
    exit;
}

try {
    $show = new Show();
    $groupedTimes = $show->getGroupedShowtimes($movieId); // returns [date => [time1, time2...]]

    $now = new DateTime();
    $filtered = [];

    foreach ($groupedTimes as $date => $times) {
        $validTimes = [];

        foreach ($times as $time) {
            $full = new DateTime("$date $time");
            if ($full > $now) {
                $validTimes[] = $time;
            }
        }

        if (!empty($validTimes)) {
            $filtered[$date] = $validTimes;
        }
    }

    echo json_encode([
        "success" => true,
        "dateTime" => $filtered
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Server error: " . $e->getMessage()
    ]);
}
?>
