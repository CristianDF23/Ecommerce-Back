export const mailDeletedProduct = (prod) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuenta eliminada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        h2 {
            color: #555555;
            font-size: 20px;
            margin-bottom: 10px;
        }
        p {
            color: #333333;
            font-size: 16px;
            line-height: 1.5;
        }
        .contact-info {
            margin-top: 20px;
            font-size: 14px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Información importante de Cuenta CSport</h1>
        <h2>Estimado Usuario,</h2>
        <p>Le comunicamos que su producto id ${prod._id} ha sido eliminado.</p>
        <p>Modelo ${prod.category}</p>
        <p>Marca ${prod.brand}</p>
        <p>Modelo ${prod.title}</p>
        <hr/>
        <p class="contact-info">
            <strong>CSport</strong><br>
            Correo electrónico: <a href="mailto:soporte@csport.com">soporte@csport.com</a><br>
            Teléfono: +54 (3775) 464377<br>
            Dirección: 1234 Calle Principal, Parana, Entre Ríos, Argentina
        </p>
        <p class="contact-info">
            Gracias por ser parte de CSport.<br>
            Saludos cordiales,<br>
            El equipo de CSport
        </p>
    </div>
</body>
</html>
    `
}