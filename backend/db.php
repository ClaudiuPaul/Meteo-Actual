<?php
// Permitem accesul aplicației React la acest fișier
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Răspundem cu "OK" la verificările automate ale browser-ului
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Datele pentru baza de date
$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "meteo_app";

// Conectarea la baza de date
$conn = new mysqli($host, $user, $pass, $dbname);

// Oprim tot dacă avem eroare de conexiune
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Eroare la conectarea la baza de date."]));
}

// Setăm suportul pentru diacritice
$conn->set_charset("utf8mb4");
?>
