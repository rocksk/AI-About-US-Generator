<?php
// Set header to indicate the response is JSON
header('Content-Type: application/json');

// IMPORTANT: Replace with your actual Gemini API Key
$apiKey = 'Your-api-keys'; 
$apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

// 1. Get the JSON data sent from the JavaScript
$input = json_decode(file_get_contents('php://input'), true);

// Check if data is received correctly
if (json_last_error() !== JSON_ERROR_NONE || !isset($input['name'], $input['niche'], $input['email'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    exit;
}

// 2. Extract variables from the input
$websiteName = $input['name'];
$websiteNiche = $input['niche'];
$contactEmail = $input['email'];

// 3. Create the detailed prompt for the AI
$promptText = "Generate a complete 'About Us' page based on the following details. The page should be professional, welcoming, and enthusiastic.\n\n" .
              "**Website Details:**\n" .
              "- Website Name: " . $websiteName . "\n" .
              "- Website Niche: " . $websiteNiche . "\n" .
              "- Contact Email: " . $contactEmail . "\n\n" .
              "**Required Structure:**\n" .
              "1. **Introduction:** Start with a warm welcome, introducing the website by its name and its focus on the niche.\n" .
              "2. **Mission:** Write a paragraph about the website's mission to help users, from beginners to experts, master the skills related to the niche.\n" .
              "3. **Offerings:** Create a section titled 'At " . $websiteName . ", you\'ll find:' followed by a bulleted list of three key features relevant to the niche. Briefly explain each one.\n" .
              "4. **Closing Statement:** Write a concluding paragraph about the power and potential of the niche field.\n" .
              "5. **Contact:** End with a clear call to action: 'Have questions or feedback? We\'d love to hear from you! Contact us at " . $contactEmail . ". '";

// 4. Prepare the data structure for the Gemini API
$data = [
    'contents' => [
        [
            'parts' => [
                ['text' => $promptText]
            ]
        ]
    ]
];
$jsonData = json_encode($data);

// 5. Use cURL to send the request to the Gemini API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 6. Process the response from Gemini
if ($httpcode == 200) {
    $responseData = json_decode($response, true);
    // Extract the generated text
    $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'Sorry, content could not be generated.';
    echo json_encode(['success' => true, 'text' => $generatedText]);
} else {
    // Handle API errors
    echo json_encode(['success' => false, 'message' => 'Failed to connect to the AI service.', 'details' => json_decode($response)]);
}
?>