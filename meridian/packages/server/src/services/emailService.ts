/**
 * Email service — transactional email delivery via SMTP or a provider API.
 *
 * @module services/emailService
 */
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  from: string;
}

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  private constructor() {
    this.config = {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
      from: process.env.EMAIL_FROM || 'Meridian <noreply@arcturus-labs.io>',
    };

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: this.config.auth,
    });
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /** Send a transactional email */
  async send(options: EmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  /** Send a password reset email with a tokenized link */
  async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.send({
      to,
      subject: 'Reset your Meridian password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
      text: `Reset your password: ${resetUrl}`,
    });
  }

  /** Send a welcome email to a newly registered user */
  async sendWelcome(to: string, displayName: string): Promise<void> {
    await this.send({
      to,
      subject: 'Welcome to Meridian',
      html: `<p>Hi ${displayName}, welcome to Meridian by Arcturus Labs. Get started by joining a channel!</p>`,
    });
  }
}

