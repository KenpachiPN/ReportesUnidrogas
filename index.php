<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Obtener datos</title>
</head>

<body>
    <?php

    $url = "https://apiunidrogas.unidrogas.net:3800/general";
    $token = "1JHEXDHBCKD9M";

    $data = [
        'accion' => 'UNID_Reportes_Bodegas',
        'params' => 'test&SUCING0199',
    ];

    $data = http_build_query($data);

    $headers = [
        'Content-Type: application/x-www-form-urlencoded',
        'Authorization: Bearer ' . $token,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $errorMsg = curl_error($ch);
        echo "Falló la petición: $errorMsg";
    } else {
        $data = json_decode($response, true);
        echo "<pre>";
        print_r($data);
    }

    curl_close($ch);
    ?>


</body>

</html>