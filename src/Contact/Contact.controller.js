import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Regular expressions for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile numbers (10-digit, starts with 6-9)

export const createMessage = async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;

        // Validate required fields
        if (!name || !email || !mobile || !message) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address!" });
        }

        // Validate Indian mobile number format
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: "Please enter a valid 10-digit Indian mobile number!" });
        }

        // Configure Nodemailer
        const smtp = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Send confirmation email to the sender (HR or user)
        await smtp.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Thank You for Contacting Me!",
            html: emailTemplate(name, mobile, message),
        });

        // Send a notification email to yourself (so you get the message in your inbox)
        await smtp.sendMail({
            from: process.env.SMTP_EMAIL,
            to: process.env.SMTP_EMAIL, // Your email to receive the message
            subject: `New Message from ${name}`,
            html: adminNotificationTemplate(name, email, mobile, message),
        });

        res.json({ message: "Your message has been sent successfully. A confirmation email has been sent to you." });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};


// ✅ Email Template for the Sender (HR/User)
const emailTemplate = (name, mobile, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Me</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; width: 100%; }
            .container { width: 100%; background: #fff; padding: 20px; }
            .body { font-size: 16px; color: #333; line-height: 1.6; }
            .message-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; font-style: italic; color: #555; }
            .contact-info { margin-top: 20px; font-size: 16px; font-weight: bold; color: #007bff; }
            .footer { background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="body">
                <p>Dear <strong>${name}</strong>,</p>
                <p>Thank you for contacting me. I have received your message and will respond as soon as possible.</p>
                <p><strong>Your Message:</strong></p>
                <div class="message-box">${message}</div>
                <p>If your inquiry is urgent, feel free to contact me directly.</p>
                <p class="contact-info">📧 Email: ${process.env.SMTP_EMAIL} | 📞 Mobile: +91-8806014060</p>
                <p>Looking forward to connecting with you soon!</p>
            </div>
            <div class="footer">&copy; 2025 Vishal Portfolio | Built with ❤️ by Vishal Lengare</div>
        </div>
    </body>
    </html>
    `;
};

// ✅ Email Template for You (Admin Notification)
const adminNotificationTemplate = (name, email, mobile, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; width: 100%; }
            .container { width: 100%; background: #fff; padding: 20px; }
            .body { font-size: 16px; color: #333; line-height: 1.6; }
            .message-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #dc3545; font-style: italic; color: #555; }
            .contact-info { margin-top: 20px; font-size: 16px; font-weight: bold; color: #dc3545; }
            .footer { background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="body">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Message:</strong></p>
                <div class="message-box">${message}</div>
            </div>
            <div class="footer">&copy; 2025 Vishal Portfolio | You received this email because someone contacted you.</div>
        </div>
    </body>
    </html>
    `;
};
