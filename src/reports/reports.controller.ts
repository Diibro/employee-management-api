import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance/pdf')
  @ApiOperation({ summary: 'Generate PDF attendance report' })
  @ApiQuery({ name: 'date', example: '2026-02-08', required: true })
  @ApiResponse({ status: 200, description: 'PDF report generated' })
  async getPdfReport(@Query('date') date: string, @Res() res: Response) {
    const buffer = await this.reportsService.generatePdfReport(date);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=attendance-${date}.pdf`,
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }

  @Get('attendance/excel')
  @ApiOperation({ summary: 'Generate Excel attendance report' })
  @ApiQuery({ name: 'date', example: '2026-02-08', required: true })
  @ApiResponse({ status: 200, description: 'Excel report generated' })
  async getExcelReport(@Query('date') date: string, @Res() res: Response) {
    const buffer = await this.reportsService.generateExcelReport(date);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=attendance-${date}.xlsx`,
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }
}
