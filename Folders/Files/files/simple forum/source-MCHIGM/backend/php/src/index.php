<?php
/**
 * MCHIGM Platform API Entry Point
 * 
 * Main entry point for the PHP backend API
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Response helper function
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple routing
if ($path === '/' || $path === '/api') {
    jsonResponse([
        'code' => 200,
        'message' => 'MCHIGM API Server',
        'version' => 'v1.0.0',
        'status' => 'running'
    ]);
}

// Health check endpoint
if ($path === '/api/health') {
    jsonResponse([
        'code' => 200,
        'message' => 'success',
        'data' => [
            'status' => 'healthy',
            'timestamp' => time()
        ]
    ]);
}

// Test endpoint
if ($path === '/api/test') {
    jsonResponse([
        'code' => 200,
        'message' => 'Test endpoint working',
        'data' => [
            'method' => $method,
            'path' => $path,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
}

// 404 for unknown routes
jsonResponse([
    'code' => 404,
    'message' => 'Endpoint not found',
    'path' => $path
], 404);
