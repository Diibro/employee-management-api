import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: jest.Mocked<Repository<Employee>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repository = module.get(getRepositoryToken(Employee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createDto = {
        names: 'John Doe',
        email: 'john@test.com',
        employeeIdentifier: 'EMP001',
        phoneNumber: '+1234567890',
      };

      const employee = { id: '1', ...createDto };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(employee as any);
      repository.save.mockResolvedValue(employee as any);

      const result = await service.create(createDto);

      expect(result).toEqual(employee);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException if email exists', async () => {
      const createDto = {
        names: 'John Doe',
        email: 'john@test.com',
        employeeIdentifier: 'EMP001',
        phoneNumber: '+1234567890',
      };

      repository.findOne.mockResolvedValueOnce({} as any);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of employees', async () => {
      const employees = [{ id: '1', names: 'John Doe' }];
      repository.find.mockResolvedValue(employees as any);

      const result = await service.findAll();

      expect(result).toEqual(employees);
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      const employee = { id: '1', names: 'John Doe' };
      repository.findOne.mockResolvedValue(employee as any);

      const result = await service.findOne('1');

      expect(result).toEqual(employee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const employee = { id: '1', names: 'John Doe' };
      repository.findOne.mockResolvedValue(employee as any);
      repository.remove.mockResolvedValue(employee as any);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith(employee);
    });
  });
});
