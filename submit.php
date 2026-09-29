<?php
/**
 * cPanel Form Email Lead Handler
 * Connects landing page lead form to client's email inbox
 */

header('Content-Type: application/json');

// Configuration - Change to destination email
$to_email = "muthupattan@propfinder.org.in";
$subject = "New Lead Enquiry - TVS Emerald AVALON";

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
    $email_content .= "Project Name: TVS Emerald AVALON\n";
    $email_content .= "Lead Name: $name\n";
    $email_content .= "Phone Number: $phone\n";
    $email_content .= "Email Address: $email\n";
    $email_content .= "Form Source: $form_source\n";
    $email_content .= "Submission Time: " . date("Y-m-d H:i:s") . "\n";

    // Proper MIME Headers for Gmail deliverability
    $domain = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'aureliapalms.com';
    $email_headers  = "MIME-Version: 1.0\r\n";
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $email_headers .= "From: TVS Emerald Avalon <no-reply@" . $domain . ">\r\n";
    $email_headers .= "Reply-To: $name <$email>\r\n";
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
