import { Injectable } from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';

@Injectable()
export class ReportsService {
  constructor(private readonly attendanceService: AttendanceService) {}

  async generatePdfReport(date: string): Promise<Buffer> {
    const attendances = await this.attendanceService.getAttendanceByDate(date);

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Attendance Report - ${date}`, 20, 20);

    doc.setFontSize(10);
    let y = 40;

    doc.text('Employee Name', 20, y);
    doc.text('Check-In Time', 80, y);
    doc.text('Check-Out Time', 140, y);

    y += 10;

    attendances.forEach((attendance) => {
      const checkIn = attendance.checkInTime
        ? new Date(attendance.checkInTime).toLocaleTimeString()
        : 'N/A';
      const checkOut = attendance.checkOutTime
        ? new Date(attendance.checkOutTime).toLocaleTimeString()
        : 'N/A';

      doc.text(attendance.employee.names, 20, y);
      doc.text(checkIn, 80, y);
      doc.text(checkOut, 140, y);

      y += 8;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  async generateExcelReport(date: string): Promise<Buffer> {
    const attendances = await this.attendanceService.getAttendanceByDate(date);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.columns = [
      { header: 'Employee Name', key: 'name', width: 30 },
      { header: 'Check-In Time', key: 'checkIn', width: 20 },
      { header: 'Check-Out Time', key: 'checkOut', width: 20 },
    ];

    attendances.forEach((attendance) => {
      worksheet.addRow({
        name: attendance.employee.names,
        checkIn: attendance.checkInTime
          ? new Date(attendance.checkInTime).toLocaleString()
          : 'N/A',
        checkOut: attendance.checkOutTime
          ? new Date(attendance.checkOutTime).toLocaleString()
          : 'N/A',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
