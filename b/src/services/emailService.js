const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendVerificationEmail(to, token) {
    try {
      // Формируем ссылку для подтверждения
      const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/confirm?token=${token}`;
      console.log('🔗 Email confirmation link:', confirmUrl);
      
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: 'Email Verification - Solar System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Confirm Registration
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; word-break: break-all;">
              <a href="${confirmUrl}" style="color: #333; text-decoration: none;">${confirmUrl}</a>
            </div>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
        `,
        text: `Please confirm your registration by visiting this link: ${confirmUrl}`,
      });

      console.log('Verification email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendTemporaryPassword(to, tempPassword) {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: 'Your Temporary Password - Solar System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Your Temporary Password</h2>
            <p>Here is your temporary password to access your account:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <code style="font-size: 16px; color: #333;">${tempPassword}</code>
            </div>
            <p style="color: #d73a49; margin-top: 20px;">🔔 Important Security Notice:</p>
            <ul style="color: #666;">
              <li>Please change this password immediately after logging in</li>
              <li>Never share your password with anyone</li>
              <li>Make sure to use a strong password</li>
            </ul>
            <p>If you didn't request this password reset, please contact support immediately.</p>
          </div>
        `,
        text: `Your temporary password is: ${tempPassword}\n\nIMPORTANT: Please change this password immediately after logging in.`,
      });

      console.log('Temporary password email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending temporary password email:', error);
      throw error;
    }
  }

  async sendCompanyCreatedEmail(to, companyName) {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: 'Company Created Successfully - Solar System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Company Registration Successful</h2>
            <p>Congratulations! Your company has been successfully registered in our system.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0;">Company Name:</h3>
              <p style="font-size: 16px; color: #333; margin: 10px 0 0 0;">${companyName}</p>
            </div>
            <p>You can now start managing your company through our platform.</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
          </div>
        `,
        text: `Congratulations! Your company "${companyName}" has been successfully registered in our system.`,
      });

      console.log('Company creation email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending company creation email:', error);
      throw error;
    }
  }

  async sendPasswordReset(to, token) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${token}`;
      console.log('🔗 Password reset link:', resetUrl);
      
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: 'Password Reset - Solar System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; word-break: break-all;">
              <a href="${resetUrl}" style="color: #333; text-decoration: none;">${resetUrl}</a>
            </div>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
        `,
        text: `Reset your password by visiting this link: ${resetUrl}`,
      });

      console.log('Password reset email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();