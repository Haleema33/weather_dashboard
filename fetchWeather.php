<?php

$apiKey = '9dd59fac71daa30560dd5799784cedaf';

if (isset($_GET['lat']) && isset($_GET['lon'])) {
    $lat = htmlspecialchars(strip_tags($_GET['lat']));
    $lon = htmlspecialchars(strip_tags($_GET['lon']));
    $url = "http://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&units=metric&appid={$apiKey}";

    // Log the URL to debug
    error_log("Fetching weather data from URL: $url");

    // Fetch the response from the API
    $response = @file_get_contents($url);

    if ($response === FALSE) {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching weather data from OpenWeatherMap API.']);
        error_log("Error fetching weather data from OpenWeatherMap API.");
        exit;
    }

    // Set the content type to JSON and output the response
    header('Content-Type: application/json');
    echo $response;

} elseif (isset($_GET['city']) && !empty($_GET['city'])) {
    $city = htmlspecialchars(strip_tags($_GET['city']));
    $forecast = isset($_GET['forecast']) ? true : false;

    // Construct the appropriate URL based on the forecast parameter
    if ($forecast) {
        $url = "http://api.openweathermap.org/data/2.5/forecast?q={$city}&units=metric&appid={$apiKey}";
    } else {
        $url = "http://api.openweathermap.org/data/2.5/weather?q={$city}&units=metric&appid={$apiKey}";
    }

    // Log the URL to debug
    error_log("Fetching weather data from URL: $url");

    // Fetch the response from the API
    $response = @file_get_contents($url);

    if ($response === FALSE) {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching weather data from OpenWeatherMap API.']);
        error_log("Error fetching weather data from OpenWeatherMap API.");
        exit;
    }

    // Set the content type to JSON and output the response
    header('Content-Type: application/json');
    echo $response;

} else {
    http_response_code(400);
    echo json_encode(['error' => 'City or coordinates parameter is required.']);
    error_log("City or coordinates parameter is required.");
    exit;
}


?>
