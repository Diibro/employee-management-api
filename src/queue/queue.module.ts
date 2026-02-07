import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './email.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    MailModule,
  ],
  providers: [EmailProcessor],
  exports: [BullModule],
})
export class QueueModule {}
