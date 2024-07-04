export const mailPassword = (token) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contraseña</title>
  <style>
    body {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      background-color: #FAFAFA;
      color: #333333;
      padding: 0;
      margin: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      background-color: #000000;
      padding: 10px;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #FFFFFF;
    }
    .content h2 {
      text-align: center;
      font-size: 24px;
      margin: 20px 0;
    }
    .content p, .content ol {
      font-size: 14px;
      line-height: 1.5;
    }
    .content ol {
      padding-left: 20px;
    }
    .button {
      display: block;
      width: auto;
      max-width: 300px;
      margin: 20px auto;
      padding: 10px 30px;
      background-color: #000000;
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CSport</h1>
    </div>
    <div class="content">
      <h2>Restablecer Contraseña</h2>
      <p>Después de hacer clic en el botón, complete los siguientes pasos:</p>
      <ol>
        <li>Introduzca una nueva contraseña.</li>
        <li>Confirma tu nueva contraseña.</li>
        <li>Haga clic en Enviar.</li>
      </ol>
      <a href="http://localhost:5173/api/v1/restorePass/token=${token}" class="button">RESTABLECER CONTRASEÑA</a>
      <p>Este enlace es válido una sola vez y expira en 1 hora.</p>
      <p>Si no solicitó restablecer su contraseña, ignore este mensaje o comuníquese con nuestro servicio al cliente.</p>
    </div>
    <div class="footer">
      <p>CSport &copy; 2024</p>
    </div>
  </div>
</body>
</html>
    `
}