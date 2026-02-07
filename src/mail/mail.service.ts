import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  sendPasswordResetEmail(email: string, token: string): void {
    console.log(`[EMAIL] Password reset email sent to ${email}`);
    console.log(`[EMAIL] Reset token: ${token}`);
    console.log(
      `[EMAIL] Reset link: http://localhost:${this.configService.get('PORT')}/reset-password?token=${token}`,
    );
  }

  sendAttendanceNotification(
    email: string,
    name: string,
    type: 'check-in' | 'check-out',
    time: Date,
  ): void {
    console.log(`[EMAIL] Attendance notification sent to ${email}`);
    console.log(`[EMAIL] Employee: ${name}`);
    console.log(`[EMAIL] Type: ${type}`);
    console.log(`[EMAIL] Time: ${time.toISOString()}`);
  }
}
