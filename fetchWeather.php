<?php
$apiKey = '9dd59fac71daa30560dd5799784cedaf';

// Validate and sanitize the city parameter
if (isset($_GET['city']) && !empty($_GET['city'])) {
    $city = htmlspecialchars(strip_tags($_GET['city']));
} else {
    http_response_code(400);
    echo json_encode(['error' => 'City parameter is required.']);
    exit;
}

// Check if forecast parameter is set
$forecast = isset($_GET['forecast']) ? true : false;

// Construct the appropriate URL based on the forecast parameter
if ($forecast) {
    $url = "http://api.openweathermap.org/data/2.5/forecast?q={$city}&units=metric&appid={$apiKey}";
} else {
    $url = "http://api.openweathermap.org/data/2.5/weather?q={$city}&units=metric&appid={$apiKey}";
}

// Fetch the response from the API
$response = @file_get_contents($url);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Error fetching weather data.']);
    exit;
}

// Set the content type to JSON and output the response
header('Content-Type: application/json');
echo $response;
?>
