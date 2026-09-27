<?php
/**
 * cPanel Form Email Lead Handler
 * Connects landing page lead form to client's email inbox
 */

header('Content-Type: application/json');

// Configuration - Change to client's destination email
$to_email = "sales@aureliapalms.com";
$subject = "New Landing Page Enquiry - Aurelia Palms";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $phone = isset($_POST['mobile']) ? strip_tags(trim($_POST['mobile'])) : (isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '');
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $form_source = isset($_POST['form_source']) ? strip_tags(trim($_POST['form_source'])) : 'Landing Page Form';

    if (empty($name) || empty($phone) || empty($email)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
        exit;
    }

    $email_content = "New Real-Estate Lead Received:\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Source: $form_source\n";
    $email_content .= "Date: " . date("Y-m-d H:i:s") . "\n";

    $email_headers = "From: no-reply@" . $_SERVER['SERVER_NAME'] . "\r\n";
    $email_headers .= "Reply-To: $email\r\n";

    if (mail($to_email, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Enquiry received successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send email."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
