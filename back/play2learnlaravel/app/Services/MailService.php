<?php

namespace App\Services;

use Mockery\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class MailService
{
    public function sendMail($nombre, $email, $view, $data = [], $pdfPath = null)
    {
        $mail = new PHPMailer(true);

        try {
            // Renderizar la plantilla Blade como cadena
            $body = view($view, $data)->render();

            // Configuración del servidor SMTP
            $mail->isSMTP();
            $mail->Host = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth = true;
            $mail->Username = env('MAIL_USERNAME');
            $mail->Password = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION', 'ssl');
            $mail->Port = env('MAIL_PORT', 587);

            // Configurar el correo
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($email, $nombre);

            // Contenido del correo
            $mail->isHTML(true);
            $mail->Subject = 'Bienvenido a Play2Learn';
            $mail->Body = $body;

            // Adjuntar el PDF si existe
            if ($pdfPath && file_exists($pdfPath)) {
                $mail->addAttachment($pdfPath, 'informacion_usuario.pdf');
            }

            // Enviar el correo
            $mail->send();
            return true;

        } catch (Exception $e) {
            return "Error al enviar el correo: " . $e->getMessage();
        }
    }
}
