<?php
header("Access-Control-Allow-Origin: *");
if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
    exit;
}
?>
