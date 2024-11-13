import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { svg2pdf } from 'svg2pdf.js';

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

  async generatePdf() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Load SVG images
    const logoUrlCimb = 'assets/image/logo.svg';
    const logoUrlCimbIslamic = 'assets/image/logo-CIMB-Islamic.svg';

    // Add the first logo
    const logoCimb = await fetch(logoUrlCimb).then(res => res.text());
    const svgElementCimb = new DOMParser().parseFromString(logoCimb, 'image/svg+xml').documentElement;
    svg2pdf(svgElementCimb, doc, { x: 10, y: 10, width: 30 });

    // Add the second logo
    const logoCimbIslamic = await fetch(logoUrlCimbIslamic).then(res => res.text());
    const svgElementCimbIslamic = new DOMParser().parseFromString(logoCimbIslamic, 'image/svg+xml').documentElement;
    svg2pdf(svgElementCimbIslamic, doc, { x: 50, y: 10, width: 30 });

    // Header Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Confidential Report', pageWidth / 2, 20, { align: 'center' });

    // Header Line
    doc.setLineWidth(0.5);
    doc.line(10, 35, pageWidth - 10, 35);

    // Content Table
    autoTable(doc, {
      startY: 45,
      margin: { left: 10, right: 10 },
      head: [['Field', 'Value']],
      body: [
        ['Field 1', this.jsonData.field1],
        ['Field 2', this.jsonData.field2],
        ['Field 3', this.jsonData.field3]
      ],
      theme: 'grid',
      styles: {
        halign: 'left',
        cellPadding: 5,
        fontSize: 11,
      },
      headStyles: {
        fillColor: [236, 29, 35], // RGB for #ec1d23
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [40, 40, 40]
      }
    });

    // Footer with Confidential Text and Pagination
    const footerY = pageHeight - 20;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Confidential - Do not distribute', 10, footerY);

    // Pagination
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, footerY, { align: 'right' });
    }

    // Save the PDF
    doc.save('StyledDataReport.pdf');
  }
}