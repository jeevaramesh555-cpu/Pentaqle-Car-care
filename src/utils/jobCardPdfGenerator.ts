import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FullJobCardDetail } from '../services/jobRepository';
import { WorkshopSettings } from '../types/settings';
import { formatDate, formatOdometer } from './formatters';

export const generateJobCardPdf = (
  details: FullJobCardDetail,
  settings: WorkshopSettings
): jsPDF => {
  const { job, customer, vehicle, complaints, inspections, services, parts, recommendations } =
    details;

  // Initialize PDF in A4 portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  // Colors
  const primaryNavy = [15, 23, 42] as [number, number, number]; // Slate-900
  const headerBg = [241, 245, 249] as [number, number, number]; // Slate-100
  const borderColor = [203, 213, 225] as [number, number, number]; // Slate-300
  const darkGray = [51, 65, 85] as [number, number, number]; // Slate-700
  const mutedGray = [100, 116, 139] as [number, number, number]; // Slate-500

  // Helper to ensure enough vertical space or add new page
  const checkPageOverflow = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - 20) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // 1. TOP HEADER & WORKSHOP IDENTITY
  // -------------------------------------------------------------
  doc.setFillColor(...primaryNavy);
  doc.rect(margin, currentY, contentWidth, 2, 'F');
  currentY += 5;

  // Workshop Name & details (Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryNavy);
  doc.text((settings.workshopName || 'AUTO CLINIC').toUpperCase(), margin, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkGray);
  if (settings.tagline) {
    doc.text(settings.tagline, margin, currentY);
    currentY += 4;
  }

  const contactLine1 = [
    settings.address,
    settings.city ? `${settings.city} ${settings.pin || ''}` : '',
    settings.state,
  ]
    .filter(Boolean)
    .join(', ');
  if (contactLine1) {
    doc.text(contactLine1, margin, currentY);
    currentY += 3.8;
  }

  const contactLine2 = [
    settings.phone ? `Tel: ${settings.phone}` : '',
    settings.whatsApp ? `WA: ${settings.whatsApp}` : '',
    settings.email ? `Email: ${settings.email}` : '',
    settings.gstin ? `GSTIN: ${settings.gstin}` : '',
  ]
    .filter(Boolean)
    .join('  |  ');
  if (contactLine2) {
    doc.text(contactLine2, margin, currentY);
    currentY += 4;
  }

  // Right Header: Job Card Box
  const badgeWidth = 62;
  const badgeHeight = 24;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = margin + 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedGray);
  doc.text('JOB CARD / WORK ORDER', badgeX + 4, badgeY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryNavy);
  doc.text(job.id, badgeX + 4, badgeY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkGray);
  doc.text(`Date: ${formatDate(job.date)}`, badgeX + 4, badgeY + 17);
  doc.text(`Status: ${job.status.toUpperCase()}`, badgeX + 4, badgeY + 21);

  currentY = Math.max(currentY + 3, badgeY + badgeHeight + 4);

  // Horizontal divider
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 4;

  // 2. CUSTOMER & VEHICLE INFORMATION BOXES
  // -------------------------------------------------------------
  const boxWidth = (contentWidth - 4) / 2;
  const infoBoxHeight = 36;

  // Customer Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(margin, currentY, boxWidth, infoBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryNavy);
  doc.text('CUSTOMER INFORMATION', margin + 3.5, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(customer?.name || 'Walk-in Customer', margin + 3.5, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkGray);
  doc.text(`Phone: ${customer?.mobile || 'N/A'}${customer?.alternateMobile ? ` / ${customer.alternateMobile}` : ''}`, margin + 3.5, currentY + 16);
  doc.text(`Email: ${customer?.email || 'N/A'}`, margin + 3.5, currentY + 20.5);
  const custAddress = customer?.address
    ? `${customer.address}${customer.city ? `, ${customer.city}` : ''}`
    : customer?.city || 'N/A';
  const addressLines = doc.splitTextToSize(`Address: ${custAddress}`, boxWidth - 7);
  doc.text(addressLines.slice(0, 2), margin + 3.5, currentY + 25);

  // Vehicle Box
  const vehX = margin + boxWidth + 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(vehX, currentY, boxWidth, infoBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryNavy);
  doc.text('VEHICLE INFORMATION', vehX + 3.5, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(vehicle?.registrationNumber || 'N/A', vehX + 3.5, currentY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkGray);
  doc.text(
    `${vehicle?.make || ''} ${vehicle?.model || ''} ${vehicle?.variant || ''} ${vehicle?.year ? `(${vehicle.year})` : ''}`.trim() || 'Vehicle Details',
    vehX + 3.5,
    currentY + 16
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Chassis / VIN: ${vehicle?.vin || 'N/A'}`, vehX + 3.5, currentY + 20.5);
  doc.text(
    `Fuel: ${vehicle?.fuelType || 'N/A'} · Trans: ${vehicle?.transmission || 'N/A'}${vehicle?.color ? ` · Color: ${vehicle.color}` : ''}`,
    vehX + 3.5,
    currentY + 25
  );
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Odometer: ${formatOdometer(job.odometer)}  |  Fuel Tank: ${job.fuelLevel}`,
    vehX + 3.5,
    currentY + 29.5
  );

  currentY += infoBoxHeight + 3;

  // Operational meta bar (Advisor, Technician, Expected delivery)
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, contentWidth, 7.5, 1, 1, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkGray);
  const advisorText = `Advisor: ${job.serviceAdvisor || 'Not Assigned'}`;
  const techText = `Technician: ${job.assignedTechnician || 'Not Assigned'}`;
  const deliveryText = `Expected Delivery: ${job.expectedCompletionDate ? formatDate(job.expectedCompletionDate) : 'Pending Assessment'}`;
  doc.text(advisorText, margin + 4, currentY + 5);
  doc.text(techText, margin + (contentWidth / 3), currentY + 5);
  doc.text(deliveryText, margin + (contentWidth * 2 / 3), currentY + 5);

  currentY += 10;

  // 3. SECTION: CUSTOMER REPORTED COMPLAINTS
  // -------------------------------------------------------------
  checkPageOverflow(25);
  const complaintRows = complaints.length > 0
    ? complaints.map((c, index) => [
        String(index + 1),
        c.complaint,
        c.category,
        c.priority,
        c.status,
        c.technicianNotes || '-',
      ])
    : [['-', 'No specific complaints reported by customer on intake', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Customer Complaint / Reported Symptom', 'Category', 'Priority', 'Status', 'Technician Diagnostic Notes']],
    body: complaintRows,
    theme: 'grid',
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: darkGray,
      lineColor: borderColor,
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 62 },
      2: { cellWidth: 26 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 42 },
    },
    didDrawPage: () => {
      // reserved for pagination if needed
    },
  });

  // Update currentY after table
  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

  // 4. SECTION: MULTI-POINT VEHICLE INSPECTION
  // -------------------------------------------------------------
  checkPageOverflow(25);
  const inspectionRows = inspections.length > 0
    ? inspections.map((ins, index) => [
        String(index + 1),
        ins.finding,
        ins.category,
        ins.severity,
        ins.approvalStatus,
        ins.technician,
        ins.recommendation || ins.notes || '-',
      ])
    : [['-', 'No multi-point inspection items logged', '-', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Inspection Checkpoint / System', 'Category', 'Condition', 'Approval', 'Inspector', 'Action Recommendation']],
    body: inspectionRows,
    theme: 'grid',
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: darkGray,
      lineColor: borderColor,
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [30, 41, 59], // Slate-800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 24 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 25 },
      6: { cellWidth: 34 },
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

  // 5. SECTION: SERVICES & WORK CARRIED OUT
  // -------------------------------------------------------------
  checkPageOverflow(25);
  const serviceRows = services.length > 0
    ? services.map((s, index) => [
        String(index + 1),
        s.serviceName,
        s.category,
        s.technician,
        s.status,
        s.completedDate ? formatDate(s.completedDate) : 'In Progress',
        s.notes || s.description || '-',
      ])
    : [['-', 'No service tasks recorded yet', '-', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Service / Work Carried Out', 'Category', 'Technician', 'Status', 'Date Done', 'Remarks']],
    body: serviceRows,
    theme: 'grid',
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: darkGray,
      lineColor: borderColor,
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: primaryNavy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 24 },
      3: { cellWidth: 25 },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 27 },
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

  // 6. SECTION: REPLACEMENT PARTS & CONSUMABLES
  // -------------------------------------------------------------
  checkPageOverflow(25);
  const partRows = parts.length > 0
    ? parts.map((p, index) => [
        String(index + 1),
        p.partName,
        p.brand,
        p.partNumber || '-',
        String(p.quantity),
        p.action,
        p.warrantyNotes || 'Standard',
      ])
    : [['-', 'No replacement parts or consumables logged', '-', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Part / Consumable Description', 'Brand / Mfr', 'Part No.', 'Qty', 'Action', 'Warranty / Note']],
    body: partRows,
    theme: 'grid',
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: darkGray,
      lineColor: borderColor,
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 28 },
      3: { cellWidth: 28 },
      4: { cellWidth: 12, halign: 'center' },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 30 },
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

  // 7. SECTION: ADVISOR RECOMMENDATIONS
  // -------------------------------------------------------------
  if (recommendations.length > 0) {
    checkPageOverflow(20);
    const recRows = recommendations.map((r, index) => [
      String(index + 1),
      r.recommendation,
      r.priority,
      r.recommendedNextKm ? `Due at ${formatOdometer(r.recommendedNextKm)}` : 'Next Service Visit',
      r.status,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['#', 'Advisor Maintenance Recommendation for Future Visit', 'Priority', 'Due Mileage / Timeframe', 'Status']],
      body: recRows,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: darkGray,
        lineColor: borderColor,
        lineWidth: 0.2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 7, halign: 'center' },
        1: { cellWidth: 95 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 35 },
        4: { cellWidth: 20, halign: 'center' },
      },
    });

    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;
  }

  // 8. INTERNAL NOTES / HANDOVER CHECKLIST (If available)
  // -------------------------------------------------------------
  if (job.internalNotes || job.completionNotes) {
    checkPageOverflow(18);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...borderColor);
    const notesText = [
      job.internalNotes ? `Workshop Notes: ${job.internalNotes}` : '',
      job.completionNotes ? `Completion Remarks: ${job.completionNotes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const splitNotes = doc.splitTextToSize(notesText, contentWidth - 8);
    const boxH = Math.max(14, splitNotes.length * 3.5 + 8);
    doc.roundedRect(margin, currentY, contentWidth, boxH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryNavy);
    doc.text('INTERNAL WORKSHOP & HANDOVER NOTES', margin + 4, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...darkGray);
    doc.text(splitNotes, margin + 4, currentY + 8.5);

    currentY += boxH + 4;
  }

  // 9. TERMS & VEHICLE RELEASE AUTHORIZATION
  // -------------------------------------------------------------
  checkPageOverflow(38);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderColor);
  doc.rect(margin, currentY, contentWidth, 14, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...primaryNavy);
  doc.text('TERMS OF SERVICE & REPAIR AUTHORIZATION', margin + 3, currentY + 3.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(...darkGray);
  const terms = [
    '1. Authorization: I hereby authorize the repair work and replacement parts specified in this job card. Workshop personnel may operate the vehicle for diagnostic, road testing, or delivery purposes at my risk.',
    '2. Personal Articles: The customer is requested to remove all personal valuables. The workshop accepts no liability for loss of personal property or cash left inside the vehicle.',
    '3. Vehicle Delivery: Delivery will be rendered upon full settlement of repair dues. Dismantled parts not claimed within 24 hours of delivery will be discarded.',
  ];
  terms.forEach((t, i) => {
    doc.text(t, margin + 3, currentY + 6.8 + i * 3.2);
  });

  currentY += 17;

  // 10. SIGNATURES & STAMPS
  // -------------------------------------------------------------
  const sigBoxW = (contentWidth - 6) / 2;
  const sigBoxH = 22;

  // Customer Signature Box
  doc.setDrawColor(...borderColor);
  doc.roundedRect(margin, currentY, sigBoxW, sigBoxH, 1.5, 1.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...primaryNavy);
  doc.text('CUSTOMER SIGNATURE / AUTHORIZATION', margin + 3, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...mutedGray);
  doc.text('I agree to the repair scope, terms & conditions above.', margin + 3, currentY + 8);

  doc.setLineWidth(0.2);
  doc.line(margin + 5, currentY + sigBoxH - 5, margin + sigBoxW - 5, currentY + sigBoxH - 5);
  doc.text('Authorized Customer Signature & Date', margin + 5, currentY + sigBoxH - 2);

  // Workshop Signature Box
  const wsX = margin + sigBoxW + 6;
  doc.roundedRect(wsX, currentY, sigBoxW, sigBoxH, 1.5, 1.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...primaryNavy);
  doc.text('WORKSHOP SERVICE ADVISOR & STAMP', wsX + 3, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...mutedGray);
  doc.text(`Advisor: ${job.serviceAdvisor || 'Authorized Staff'}`, wsX + 3, currentY + 8);

  doc.line(wsX + 5, currentY + sigBoxH - 5, wsX + sigBoxW - 5, currentY + sigBoxH - 5);
  doc.text('Quality Inspector / Service Advisor Signature & Seal', wsX + 5, currentY + sigBoxH - 2);

  // 11. FOOTER ON ALL PAGES
  // -------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom rule
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...mutedGray);

    // Left
    doc.text(
      `${settings.workshopName || 'Auto Clinic'} · Job Card Ref: ${job.id} · Vehicle: ${vehicle?.registrationNumber || 'N/A'}`,
      margin,
      pageHeight - 6.5
    );

    // Center
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      pageWidth / 2,
      pageHeight - 6.5,
      { align: 'center' }
    );

    // Right
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  }

  return doc;
};

/**
 * Generates and triggers browser download of the Job Card PDF
 */
export const downloadJobCardPdf = (
  details: FullJobCardDetail,
  settings: WorkshopSettings
): void => {
  const doc = generateJobCardPdf(details, settings);
  const regNumber = details.vehicle?.registrationNumber
    ? details.vehicle.registrationNumber.replace(/[^a-zA-Z0-9]/g, '_')
    : 'Vehicle';
  const fileName = `${details.job.id}_Job_Card_${regNumber}.pdf`;
  doc.save(fileName);
};
