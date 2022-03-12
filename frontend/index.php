<?php

/**
 * utility for serving static files
 */

header('Access-control-allow-origin: http://localhost:8080');

$url = $_SERVER["REQUEST_URI"];

//print_r(file_get_contents('php://input'));


$segments = explode(".", $url);
$type = $segments[sizeof($segments) - 1];
$contentType = "text/html";
switch ($type) {
  case "css":
    $contentType = "text/css";
    break;
  case "js":
    $contentType = "text/javascript";
    break;
  case "json":
    $contentType = "application/json";
    break;
  case "jpg":
  case "jpeg":
    $contentType = "image/jpeg";
    break;
  case "png":
    $contentType = "image/png";
    break;
}

header("Content-type: $contentType");

readfile(__DIR__ . '/src/assets' . $url);
