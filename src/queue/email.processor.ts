import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailService } from '../mail/mail.service';

interface AttendanceNotificationData {
  email: string;
  name: string;
  type: 'check-in' | 'check-out';
  time: Date;
}

@Processor('email')
export class EmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('attendance-notification')
  async handleAttendanceNotification(job: Job<AttendanceNotificationData>) {
    const { email, name, type, time } = job.data;
    await this.mailService.sendAttendanceNotification(email, name, type, time);
    return { success: true };
  }
}
