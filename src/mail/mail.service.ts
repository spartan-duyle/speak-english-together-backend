import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import VerificationTokenPayload from './payload/verificationToken.payload';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async sendEmailConfirmation(user: { email: string; name: string }) {
    const payload: VerificationTokenPayload = { email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.config.get('mail.jwtVerificationSecret'),
      expiresIn: `${this.config.get('mail.jwtVerificationExpiration')}s`,
    });

    const url = `${this.config.get('app.root')}/verify?token=${token}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Welcome! Please confirm your Email',
        template: 'confirmation.hbs',
        context: {
          name: user.name,
          url,
        },
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  }

  async sendResetPasswordEmail(
    user: { email: string; name: string },
    token: string,
  ) {
    const url = `${this.config.get(
      'app.root',
    )}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Use the below URL to reset password, please don't share it",
      template: 'reset-password',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
