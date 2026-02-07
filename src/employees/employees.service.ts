import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingByEmail = await this.employeeRepository.findOne({
      where: { email: createEmployeeDto.email },
    });
    if (existingByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingByIdentifier = await this.employeeRepository.findOne({
      where: { employeeIdentifier: createEmployeeDto.employeeIdentifier },
    });
    if (existingByIdentifier) {
      throw new ConflictException('Employee identifier already exists');
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingByEmail = await this.employeeRepository.findOne({
        where: { email: updateEmployeeDto.email },
      });
      if (existingByEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (
      updateEmployeeDto.employeeIdentifier &&
      updateEmployeeDto.employeeIdentifier !== employee.employeeIdentifier
    ) {
      const existingByIdentifier = await this.employeeRepository.findOne({
        where: { employeeIdentifier: updateEmployeeDto.employeeIdentifier },
      });
      if (existingByIdentifier) {
        throw new ConflictException('Employee identifier already exists');
      }
    }

    Object.assign(employee, updateEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { email } });
  }
}
