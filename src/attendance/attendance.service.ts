import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { EmployeesService } from '../employees/employees.service';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly employeesService: EmployeesService,
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async checkIn(employeeId: string): Promise<Attendance> {
    const employee = await this.employeesService.findOne(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (existing) {
      throw new BadRequestException('Already checked in today');
    }

    const attendance = this.attendanceRepository.create({
      employeeId,
      date: today,
      checkInTime: new Date(),
    });

    const saved = await this.attendanceRepository.save(attendance);

    await this.emailQueue.add('attendance-notification', {
      email: employee.email,
      name: employee.names,
      type: 'check-in',
      time: saved.checkInTime,
    });

    return saved;
  }

  async checkOut(employeeId: string): Promise<Attendance> {
    const employee = await this.employeesService.findOne(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (!attendance) {
      throw new BadRequestException('No check-in found for today');
    }

    if (attendance.checkOutTime) {
      throw new BadRequestException('Already checked out today');
    }

    attendance.checkOutTime = new Date();
    const saved = await this.attendanceRepository.save(attendance);

    await this.emailQueue.add('attendance-notification', {
      email: employee.email,
      name: employee.names,
      type: 'check-out',
      time: saved.checkOutTime,
    });

    return saved;
  }

  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { date },
      relations: ['employee'],
    });
  }
}
