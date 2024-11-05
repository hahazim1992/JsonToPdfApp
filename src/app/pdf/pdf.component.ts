import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
  jsonData: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.jsonData = data;
    });
  }

  generatePdf() {
    const doc = new jsPDF();

    // Add Header
    doc.setFontSize(18);
    doc.text('PDF Document Header', 10, 10);

    // Add a line below the header
    doc.setLineWidth(0.5);
    doc.line(10, 15, 200, 15);

    // Add Content
    doc.setFontSize(12);
    doc.text(`Field 1: ${this.jsonData.field1}`, 10, 30);
    doc.text(`Field 2: ${this.jsonData.field2}`, 10, 40);
    doc.text(`Field 3: ${this.jsonData.field3}`, 10, 50);

    // Add Footer
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setLineWidth(0.5);
    doc.line(10, pageHeight - 20, 200, pageHeight - 20);
    doc.setFontSize(10);
    doc.text('PDF Document Footer', 10, pageHeight - 10);

    // Save the PDF
    doc.save('data.pdf');
  }
}