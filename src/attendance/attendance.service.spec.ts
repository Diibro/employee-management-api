import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { EmployeesService } from '../employees/employees.service';
import { getQueueToken } from '@nestjs/bull';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let repository: jest.Mocked<Repository<Attendance>>;
  let employeesService: jest.Mocked<EmployeesService>;
  let emailQueue: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EmployeesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getQueueToken('email'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    repository = module.get(getRepositoryToken(Attendance));
    employeesService = module.get(EmployeesService);
    emailQueue = module.get(getQueueToken('email'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkIn', () => {
    it('should create check-in record', async () => {
      const employeeId = '1';
      const employee = { id: '1', email: 'test@test.com', names: 'John Doe' };
      const attendance = {
        id: '1',
        employeeId,
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date(),
      };

      employeesService.findOne.mockResolvedValue(employee as any);
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(attendance as any);
      repository.save.mockResolvedValue(attendance as any);

      const result = await service.checkIn(employeeId);

      expect(result).toHaveProperty('checkInTime');
      expect(emailQueue.add).toHaveBeenCalled();
    });

    it('should throw BadRequestException if already checked in', async () => {
      const employeeId = '1';
      const employee = { id: '1', email: 'test@test.com', names: 'John Doe' };

      employeesService.findOne.mockResolvedValue(employee as any);
      repository.findOne.mockResolvedValue({} as any);

      await expect(service.checkIn(employeeId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if employee not found', async () => {
      employeesService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.checkIn('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkOut', () => {
    it('should update check-out time', async () => {
      const employeeId = '1';
      const employee = { id: '1', email: 'test@test.com', names: 'John Doe' };
      const attendance = {
        id: '1',
        employeeId,
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date(),
        checkOutTime: null,
      };

      employeesService.findOne.mockResolvedValue(employee as any);
      repository.findOne.mockResolvedValue(attendance as any);
      repository.save.mockResolvedValue({
        ...attendance,
        checkOutTime: new Date(),
      } as any);

      const result = await service.checkOut(employeeId);

      expect(result).toHaveProperty('checkOutTime');
      expect(emailQueue.add).toHaveBeenCalled();
    });
  });

  describe('getAttendanceByDate', () => {
    it('should return attendance records for a date', async () => {
      const date = '2026-02-08';
      const attendances = [{ id: '1', date }];

      repository.find.mockResolvedValue(attendances as any);

      const result = await service.getAttendanceByDate(date);

      expect(result).toEqual(attendances);
      expect(repository.find).toHaveBeenCalledWith({
        where: { date },
        relations: ['employee'],
      });
    });
  });
});
