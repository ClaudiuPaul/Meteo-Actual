<?php
// Setăm headerele pentru CORS (să permită accesul de la React)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$pass = ""; // Parola default în XAMPP este goală
$dbname = "meteo_app";

// Ne conectăm la baza de date
$conn = new mysqli($host, $user, $pass, $dbname);

// Verificăm conexiunea
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Eroare la conectarea la baza de date."]));
}
// Setăm caracterele la UTF-8
$conn->set_charset("utf8mb4");
?>
