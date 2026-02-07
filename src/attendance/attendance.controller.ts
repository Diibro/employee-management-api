import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check in employee' })
  @ApiResponse({ status: 201, description: 'Check-in successful' })
  @ApiResponse({ status: 400, description: 'Already checked in today' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  checkIn(@Body() checkInDto: CheckInDto) {
    return this.attendanceService.checkIn(checkInDto.employeeId);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check out employee' })
  @ApiResponse({ status: 201, description: 'Check-out successful' })
  @ApiResponse({ status: 400, description: 'No check-in found or already checked out' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  checkOut(@Body() checkOutDto: CheckOutDto) {
    return this.attendanceService.checkOut(checkOutDto.employeeId);
  }

  @Get()
  @ApiOperation({ summary: 'Get attendance by date' })
  @ApiQuery({ name: 'date', example: '2026-02-08', required: true })
  @ApiResponse({ status: 200, description: 'Attendance records retrieved' })
  getAttendance(@Query('date') date: string) {
    return this.attendanceService.getAttendanceByDate(date);
  }
}
