<?php
// Ne conectăm la baza de date
require 'db.php';

// Preluăm datele trimise de aplicație
$data = json_decode(file_get_contents("php://input"));

// Verificăm dacă avem toate datele necesare
if(isset($data->username) && isset($data->email) && isset($data->password) && isset($data->city)) {
    // Securizăm datele text
    $username = $conn->real_escape_string($data->username);
    $email = $conn->real_escape_string($data->email);
    // Criptăm parola
    $password = password_hash($data->password, PASSWORD_DEFAULT);
    $city = $conn->real_escape_string($data->city);

    // Verificăm dacă email-ul sau user-ul există deja
    $check_sql = "SELECT id FROM users WHERE email='$email' OR username='$username'";
    $check_res = $conn->query($check_sql);

    // Dacă există deja, returnăm eroare
    if($check_res->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email-ul sau utilizatorul sunt deja folosite!"]);
    } else {
        // Dacă nu există, inserăm noul utilizator
        $sql = "INSERT INTO users (username, email, password, city) VALUES ('$username', '$email', '$password', '$city')";
        
        // Dacă s-a salvat cu succes
        if($conn->query($sql) === TRUE) {
            $last_id = $conn->insert_id; // Luăm ID-ul noului cont
            // Răspundem cu succes
            echo json_encode([
                "success" => true, 
                "message" => "Cont creat cu succes!",
                "user" => [
                    "id" => $last_id,
                    "username" => $username,
                    "city" => $city
                ]
            ]);
        } else {
            // Eroare la salvare
            echo json_encode(["success" => false, "message" => "Eroare: " . $conn->error]);
        }
    }
} else {
    // Lipsesc date
    echo json_encode(["success" => false, "message" => "Date incomplete."]);
}

// Închidem conexiunea
$conn->close();
?>
