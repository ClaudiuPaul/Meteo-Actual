<?php
require 'db.php';

// Citim datele trimise din frontend
$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->email) && isset($data->password) && isset($data->city)) {
    $username = $conn->real_escape_string($data->username);
    $email = $conn->real_escape_string($data->email);
    // Hash-uim parola pentru securitate
    $password = password_hash($data->password, PASSWORD_DEFAULT);
    $city = $conn->real_escape_string($data->city);

    // Verificăm dacă utilizatorul sau email-ul există deja
    $check_sql = "SELECT id FROM users WHERE email='$email' OR username='$username'";
    $check_res = $conn->query($check_sql);

    if($check_res->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email-ul sau numele de utilizator sunt deja folosite!"]);
    } else {
        $sql = "INSERT INTO users (username, email, password, city) VALUES ('$username', '$email', '$password', '$city')";
        if($conn->query($sql) === TRUE) {
            $last_id = $conn->insert_id;
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
            echo json_encode(["success" => false, "message" => "Eroare la crearea contului: " . $conn->error]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Date incomplete."]);
}

$conn->close();
?>
