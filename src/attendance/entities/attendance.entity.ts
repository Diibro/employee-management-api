import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'datetime', nullable: true })
  checkInTime: Date;

  @Column({ type: 'datetime', nullable: true })
  checkOutTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
