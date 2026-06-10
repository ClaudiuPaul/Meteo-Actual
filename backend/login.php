<?php
// Ne conectăm la baza de date
require 'db.php';

// Preluăm datele trimise de aplicație (email și parolă)
$data = json_decode(file_get_contents("php://input"));

// Verificăm dacă am primit email și parolă
if(isset($data->email) && isset($data->password)) {
    // Securizăm email-ul împotriva atacurilor
    $email = $conn->real_escape_string($data->email);
    $password = $data->password;

    // Căutăm utilizatorul în baza de date
    $sql = "SELECT id, username, password, city FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    // Dacă utilizatorul există
    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Verificăm dacă parola este corectă
        if(password_verify($password, $row['password'])) {
            // Logare cu succes: trimitem datele utilizatorului înapoi
            echo json_encode([
                "success" => true,
                "message" => "Autentificare reușită!",
                "user" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "city" => $row['city']
                ]
            ]);
        } else {
            // Parolă greșită
            echo json_encode(["success" => false, "message" => "Parola este incorectă."]);
        }
    } else {
        // Email negăsit
        echo json_encode(["success" => false, "message" => "Nu există un cont cu acest email."]);
    }
} else {
    // Lipsesc date
    echo json_encode(["success" => false, "message" => "Date incomplete."]);
}

// Închidem conexiunea
$conn->close();
?>
