<?php
/**
 * Hostinger Apache/PHP Production Entrypoint for BxStrength
 * Serves compiled React/Vite single page application
 */

header("Access-Control-Allow-Origin: *");

$distIndex = __DIR__ . '/dist/index.html';
$rootIndex = __DIR__ . '/index.html';

if (file_exists($distIndex)) {
    readfile($distIndex);
    exit;
}

if (file_exists($rootIndex)) {
    readfile($rootIndex);
    exit;
}

http_response_code(404);
echo "BxStrength Platform: index.html build file not found.";
?>
