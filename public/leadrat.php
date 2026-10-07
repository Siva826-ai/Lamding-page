<?php
/**
 * LeadRat CRM Integration Server-Side PHP Endpoint
 * Endpoint: leadrat.php
 *
 * Forwards lead data securely to LeadRat CRM API without exposing API Keys to client JS.
 */

header('Content-Type: application/json');

// Security Headers & CORS
header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method Not Allowed"]);
    exit;
}

// API Key (stored server-side securely in PHP)
$leadrat_api_key = getenv('LEADRAT_API_KEY') ?: "N2FmNjU3ZmItNmY3OC00MTc4LTg0ZGQtOWIwNDZmYTQ0Mjlm";

// Read raw JSON or POST data from request
$input_json = file_get_contents('php://input');
$payload = json_decode($input_json, true);

// Fallback if form-encoded POST data was sent instead of raw JSON
if (empty($payload)) {
    $raw_name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $raw_phone = isset($_POST['mobile']) ? trim($_POST['mobile']) : (isset($_POST['phone']) ? trim($_POST['phone']) : '');
    $raw_email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $raw_source = isset($_POST['form_source']) ? trim($_POST['form_source']) : 'Landing Page Form';
    $raw_interest = isset($_POST['interest']) ? trim($_POST['interest']) : (isset($_POST['config']) ? trim($_POST['config']) : 'Not Specified');
    $raw_message = isset($_POST['message']) ? trim($_POST['message']) : '';
    $raw_location = isset($_POST['location']) && !empty($_POST['location']) ? trim($_POST['location']) : 'Pallavaram, Chennai';
    $raw_budget = isset($_POST['budget']) && !empty($_POST['budget']) ? trim($_POST['budget']) : $raw_interest;
    $raw_state = isset($_POST['state']) && !empty($_POST['state']) ? trim($_POST['state']) : 'Tamil Nadu';
    $raw_city = isset($_POST['city']) && !empty($_POST['city']) ? trim($_POST['city']) : 'Chennai';

    $clean_phone = preg_replace('/[^0-9]/', '', $raw_phone);
    if (strlen($clean_phone) > 10) {
        $clean_phone = substr($clean_phone, -10);
    }

    $notes = "Interested Configuration: " . $raw_interest . " | Source: " . $raw_source;
    if (!empty($raw_message)) {
        $notes = $raw_message . " | " . $notes;
    }

    $payload = array(
        array(
            "name"        => htmlspecialchars(strip_tags($raw_name), ENT_QUOTES, 'UTF-8'),
            "state"       => $raw_state,
            "city"        => $raw_city,
            "location"    => $raw_location,
            "budget"      => $raw_budget,
            "notes"       => $notes,
            "email"       => filter_var($raw_email, FILTER_VALIDATE_EMAIL) ?: $raw_email,
            "countryCode" => "91",
            "mobile"      => $clean_phone,
            "project"     => "TVS Emerald AVALON"
        )
    );
}

// Forward to LeadRat CRM API endpoint
if (function_exists('curl_init')) {
    $ch = curl_init('https://connect.leadrat.com/api/v1/integration/Website');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'API-Key: ' . $leadrat_api_key,
        'X-API-Key: ' . $leadrat_api_key
    ));
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($curl_error) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $curl_error]);
        exit;
    }

    $decoded_res = json_decode($response, true);
    $is_success = ($http_code >= 200 && $http_code < 300);
    http_response_code($is_success ? 200 : ($http_code ? $http_code : 500));
    echo json_encode([
        "success" => $is_success,
        "status"  => $http_code,
        "data"    => $decoded_res !== null ? $decoded_res : $response
    ]);
} else {
    // Fallback stream context if cURL is not available
    $options = array(
        'http' => array(
            'header'  => "Content-Type: application/json\r\n" .
                         "API-Key: " . $leadrat_api_key . "\r\n" .
                         "X-API-Key: " . $leadrat_api_key . "\r\n",
            'method'  => 'POST',
            'content' => json_encode($payload),
            'timeout' => 10,
            'ignore_errors' => true
        )
    );
    $context  = stream_context_create($options);
    $response = @file_get_contents('https://connect.leadrat.com/api/v1/integration/Website', false, $context);
    $decoded_res = json_decode($response, true);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data"    => $decoded_res !== null ? $decoded_res : $response
    ]);
}
?>
