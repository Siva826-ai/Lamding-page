<?php
/**
 * Secure Form Email Lead Handler with Honeypot Bot Defense
 */

header('Content-Type: application/json');

// Security: Disallow external frames & clickjacking
header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');

// Configuration - Destination email
$to_email = "muthupattan@propfinder.org.in";
$subject = "New Lead Enquiry - TVS Emerald AVALON";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. HONEYPOT BOT DEFENSE: If hidden field is filled, silently discard bot submission
    if (!empty($_POST['website_hp'])) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Enquiry received successfully."]);
        exit;
    }

    // 2. INPUT SANITIZATION & XSS PROTECTION
    $raw_name = isset($_POST['name']) ? $_POST['name'] : '';
    $raw_phone = isset($_POST['mobile']) ? $_POST['mobile'] : (isset($_POST['phone']) ? $_POST['phone'] : '');
    $raw_email = isset($_POST['email']) ? $_POST['email'] : '';
    $raw_source = isset($_POST['form_source']) ? $_POST['form_source'] : 'Landing Page Form';
    $raw_interest = isset($_POST['interest']) ? $_POST['interest'] : (isset($_POST['config']) ? $_POST['config'] : (isset($_POST['interested_configuration']) ? $_POST['interested_configuration'] : 'Not Specified'));

    $name = htmlspecialchars(strip_tags(trim($raw_name)), ENT_QUOTES, 'UTF-8');
    $phone = preg_replace('/[^0-9\+\-\s\(\)]/', '', trim($raw_phone));
    $email = filter_var(trim($raw_email), FILTER_VALIDATE_EMAIL);
    $form_source = htmlspecialchars(strip_tags(trim($raw_source)), ENT_QUOTES, 'UTF-8');
    $interest = htmlspecialchars(strip_tags(trim($raw_interest)), ENT_QUOTES, 'UTF-8');

    if (empty($name) || empty($phone) || !$email) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please complete all required fields with valid details."]);
        exit;
    }

    // 3. HEADER INJECTION PREVENTION: Remove newlines from strings used in headers
    $clean_name = str_replace(array("\r", "\n"), '', $name);
    $clean_email = str_replace(array("\r", "\n"), '', $email);

    $email_content = "New Real-Estate Lead Received:\n\n";
    $email_content .= "Project Name: TVS Emerald AVALON\n";
    $email_content .= "Lead Name: $name\n";
    $email_content .= "Phone Number: $phone\n";
    $email_content .= "Email Address: $clean_email\n";
    $email_content .= "Interested Configuration: $interest\n";
    $email_content .= "Form Source: $form_source\n";
    $email_content .= "Submission Time: " . date("Y-m-d H:i:s") . "\n";

    // Standardized secure MIME headers
    $domain = !empty($_SERVER['SERVER_NAME']) ? preg_replace('/[^a-zA-Z0-9\.\-]/', '', $_SERVER['SERVER_NAME']) : 'aureliapalms.com';
    $email_headers  = "MIME-Version: 1.0\r\n";
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $email_headers .= "From: TVS Emerald Avalon <no-reply@" . $domain . ">\r\n";
    $email_headers .= "Reply-To: $clean_name <$clean_email>\r\n";
    $email_headers .= "X-Mailer: PHP/" . phpversion();

    if (@mail($to_email, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Enquiry received successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send email. Server mail configuration issue."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
