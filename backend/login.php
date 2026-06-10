<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $conn->real_escape_string($data->email);
    $password = $data->password;

    $sql = "SELECT id, username, password, city FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Verificăm parola cu hash-ul salvat
        if(password_verify($password, $row['password'])) {
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
            echo json_encode(["success" => false, "message" => "Parola este incorectă."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Nu există un cont cu acest email."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Date incomplete."]);
}

$conn->close();
?>
