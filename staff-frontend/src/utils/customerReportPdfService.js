// utils/customerReportPdfService.js
import jsPDF from 'jspdf';
import { format } from 'date-fns';

/**
 * Format currency in LKR
 */
const formatLKR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'LKR 0.00';
  return `LKR ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format date nicely
 */
const formatDateStr = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy');
  } catch (e) {
    return 'N/A';
  }
};

/**
 * Add standard header to PDF pages
 */
const addHeader = async (pdf, titleText, subtitleText) => {
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Try to load Susaru Agro logo
  try {
    const logoModule = await import('../assets/susaruLogo.png');
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = logoModule.default;

    await new Promise((resolve) => {
      logoImg.onload = () => {
        try {
          const logoCanvas = document.createElement('canvas');
          const logoCtx = logoCanvas.getContext('2d');
          logoCanvas.width = logoImg.width;
          logoCanvas.height = logoImg.height;
          logoCtx.drawImage(logoImg, 0, 0);
          const logoDataUrl = logoCanvas.toDataURL('image/png');
          pdf.addImage(logoDataUrl, 'PNG', 14, 12, 36, 18);
          resolve();
        } catch (err) {
          resolve();
        }
      };
      logoImg.onerror = () => resolve();
      setTimeout(resolve, 2000);
    });
  } catch (e) {
    // Continue without logo if fail
  }

  // Header Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(34, 139, 34); // Susaru Green
  pdf.text('SUSARU AGRO (PVT) LTD', pageWidth - 14, 18, { align: 'right' });

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(titleText || 'Customer Report', pageWidth - 14, 24, { align: 'right' });
  pdf.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, pageWidth - 14, 29, { align: 'right' });

  if (subtitleText) {
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    pdf.text(subtitleText, pageWidth - 14, 34, { align: 'right' });
  }

  // Header Line
  pdf.setDrawColor(34, 139, 34);
  pdf.setLineWidth(0.5);
  pdf.line(14, 37, pageWidth - 14, 37);
};

/**
 * Add standard page numbers footer
 */
const addFooter = (pdf) => {
  const totalPages = pdf.internal.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.3);
    pdf.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    pdf.text('CONFIDENTIAL - SUSARU AGRO (PVT) LTD | Customer Information Systems', 14, pageHeight - 9);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 9, { align: 'right' });
  }
};

/**
 * Helper to check page overflow and add new page if needed
 */
const checkPageBreak = (pdf, currentY, neededHeight = 20) => {
  const pageHeight = pdf.internal.pageSize.getHeight();
  if (currentY + neededHeight > pageHeight - 20) {
    pdf.addPage();
    return 45; // Reset Y position below header
  }
  return currentY;
};

/**
 * Generate PDF for an Individual Customer
 */
export const generateIndividualCustomerPDF = async (customerData) => {
  if (!customerData) return false;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  await addHeader(pdf, 'Individual Customer Dossier', `Customer ID: ${customerData.customer_id || 'N/A'}`);

  let y = 45;

  // Title Banner
  pdf.setFillColor(240, 248, 240);
  pdf.rect(14, y, pageWidth - 28, 16, 'F');
  pdf.setDrawColor(34, 139, 34);
  pdf.rect(14, y, pageWidth - 28, 16, 'S');

  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(34, 139, 34);
  const fullName = `${customerData.title || ''} ${customerData.full_name || 'N/A'}`.trim();
  pdf.text(fullName, 18, y + 7);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Registered: ${formatDateStr(customerData.created_at)} | NIC: ${customerData.nic_number || 'N/A'} | Email: ${customerData.email || 'N/A'}`, 18, y + 12);

  y += 22;

  // 1. Personal & Contact Details Grid
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('1. Personal & Contact Information', 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  const addressStr = [
    customerData.add_line_1,
    customerData.add_line_2,
    customerData.add_line_3,
    customerData.city,
    customerData.district,
    customerData.province
  ].filter(Boolean).join(', ') || 'N/A';

  const personalFields = [
    ['Full Name:', fullName],
    ['Name with Initials:', customerData.name_with_ini || 'N/A'],
    ['NIC Number:', customerData.nic_number || 'N/A'],
    ['Date of Birth:', formatDateStr(customerData.date_of_birth)],
    ['Email Address:', customerData.email || 'N/A'],
    ['Primary Phone:', customerData.phone_no_1 || 'N/A'],
    ['Secondary Phone:', customerData.phone_no_2 || 'N/A'],
    ['Full Address:', addressStr]
  ];

  pdf.setFontSize(9);
  personalFields.forEach(([label, val]) => {
    y = checkPageBreak(pdf, y, 7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 70, 70);
    pdf.text(label, 16, y);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(20, 20, 20);
    
    // Split long text if needed
    const splitVal = pdf.splitTextToSize(String(val), pageWidth - 70);
    pdf.text(splitVal, 55, y);
    y += (splitVal.length * 5);
  });

  y += 6;

  // 2. Registered Lands Section
  y = checkPageBreak(pdf, y, 30);
  const lands = customerData.lands || [];

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`2. Registered Lands (${lands.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (lands.length === 0) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(120, 120, 120);
    pdf.text('No registered lands recorded.', 16, y);
    y += 8;
  } else {
    // Lands Table Header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('ID', 16, y + 4);
    pdf.text('Location (City, District, Province)', 32, y + 4);
    pdf.text('Climate', 105, y + 4);
    pdf.text('Shape', 135, y + 4);
    pdf.text('Size (Perch)', 160, y + 4);
    pdf.text('Soil', 182, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    lands.forEach((land) => {
      y = checkPageBreak(pdf, y, 7);
      const loc = [land.city, land.district, land.province].filter(Boolean).join(', ') || 'N/A';
      pdf.text(String(land.customer_land_id || '-'), 16, y);
      pdf.text(pdf.splitTextToSize(loc, 70), 32, y);
      pdf.text(String(land.climate_zone || '-'), 105, y);
      pdf.text(String(land.land_shape || '-'), 135, y);
      pdf.text(String(land.land_size ? `${land.land_size}` : '-'), 160, y);
      pdf.text(String(land.soil_type || '-'), 182, y);
      y += 6;
    });
    y += 4;
  }

  // 3. Proposals History
  y = checkPageBreak(pdf, y, 30);
  const proposals = customerData.proposals || [];

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`3. Proposals (${proposals.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (proposals.length === 0) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(120, 120, 120);
    pdf.text('No proposals submitted.', 16, y);
    y += 8;
  } else {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('Proposal ID', 16, y + 4);
    pdf.text('Type', 40, y + 4);
    pdf.text('Duration', 70, y + 4);
    pdf.text('Project Value', 95, y + 4);
    pdf.text('Payment Mode', 135, y + 4);
    pdf.text('Status', 170, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    proposals.forEach((prop) => {
      y = checkPageBreak(pdf, y, 7);
      pdf.text(String(prop.proposal_id || '-'), 16, y);
      pdf.text(String(prop.project_type || '-'), 40, y);
      pdf.text(`${prop.project_duration || '-'} Yrs`, 70, y);
      pdf.text(formatLKR(prop.project_value), 95, y);
      pdf.text(String(prop.payment_mode || '-'), 135, y);

      // Status color text
      if (prop.status === 'Approved') pdf.setTextColor(34, 139, 34);
      else if (prop.status === 'Pending') pdf.setTextColor(180, 100, 0);
      else if (prop.status === 'Rejected') pdf.setTextColor(200, 0, 0);
      else pdf.setTextColor(0, 80, 180);

      pdf.text(String(prop.status || '-'), 170, y);
      pdf.setTextColor(30, 30, 30);
      y += 6;
    });
    y += 4;
  }

  // 4. Projects Overview
  y = checkPageBreak(pdf, y, 30);
  const projects = customerData.projects || [];

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`4. Projects Overview (${projects.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (projects.length === 0) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(120, 120, 120);
    pdf.text('No active or completed projects.', 16, y);
    y += 8;
  } else {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('Project ID', 16, y + 4);
    pdf.text('Proposal Ref', 40, y + 4);
    pdf.text('Status', 75, y + 4);
    pdf.text('Progress', 110, y + 4);
    pdf.text('Start Date', 140, y + 4);
    pdf.text('End Date', 170, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    projects.forEach((proj) => {
      y = checkPageBreak(pdf, y, 7);
      pdf.text(`PRJ-${proj.project_id}`, 16, y);
      pdf.text(String(proj.proposal_id || '-'), 40, y);
      pdf.text(String(proj.status || '-'), 75, y);
      pdf.text(`${proj.progress_percentage || 0}%`, 110, y);
      pdf.text(formatDateStr(proj.start_date), 140, y);
      pdf.text(formatDateStr(proj.end_date), 170, y);
      y += 6;
    });
    y += 4;
  }

  // 5. Financial Payments History
  y = checkPageBreak(pdf, y, 30);
  const payments = customerData.payments || [];

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`5. Financial Payments History (${payments.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (payments.length === 0) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(120, 120, 120);
    pdf.text('No payment transactions recorded.', 16, y);
    y += 8;
  } else {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('Payment ID', 16, y + 4);
    pdf.text('Proposal ID', 45, y + 4);
    pdf.text('Payment Date', 80, y + 4);
    pdf.text('Amount (LKR)', 125, y + 4);
    pdf.text('Details', 165, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    let totalPaid = 0;
    payments.forEach((pay) => {
      y = checkPageBreak(pdf, y, 7);
      const amt = Number(pay.amount) || 0;
      totalPaid += amt;

      pdf.text(`#PAY-${pay.payment_id}`, 16, y);
      pdf.text(String(pay.proposal_id || '-'), 45, y);
      pdf.text(formatDateStr(pay.payment_date), 80, y);
      pdf.text(formatLKR(amt), 125, y);
      pdf.text(String(pay.payment_detail || '-'), 165, y);
      y += 6;
    });

    // Total Row
    y = checkPageBreak(pdf, y, 8);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(245, 245, 245);
    pdf.rect(14, y - 2, pageWidth - 28, 7, 'F');
    pdf.text('Total Payments Received:', 80, y + 3);
    pdf.setTextColor(34, 139, 34);
    pdf.text(formatLKR(totalPaid), 125, y + 3);
    pdf.setTextColor(30, 30, 30);
    y += 10;
  }

  // Add header & footers across all pages
  addFooter(pdf);

  // Save the PDF
  const filename = `Customer_Report_${customerData.customer_id || 'Details'}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(filename);
  return true;
};

/**
 * Generate Master Summary PDF for All Customers
 */
export const generateAllCustomersPDF = async (customersList, filterOptions = {}, sortOptions = {}) => {
  if (!Array.isArray(customersList)) return false;

  const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for wide table
  const pageWidth = pdf.internal.pageSize.getWidth();

  const filterSummary = [];
  if (filterOptions.searchTerm) filterSummary.push(`Search: "${filterOptions.searchTerm}"`);
  if (filterOptions.province) filterSummary.push(`Province: ${filterOptions.province}`);
  if (filterOptions.district) filterSummary.push(`District: ${filterOptions.district}`);
  if (sortOptions.field) filterSummary.push(`Sorted by: ${sortOptions.field} (${sortOptions.direction || 'asc'})`);

  const subtitleText = filterSummary.length > 0 ? `Filters: ${filterSummary.join(' | ')}` : `Total Records: ${customersList.length}`;

  await addHeader(pdf, 'Master Customer Directory Report', subtitleText);

  let y = 43;

  // Overview Summary Box
  pdf.setFillColor(245, 247, 250);
  pdf.rect(14, y, pageWidth - 28, 14, 'F');
  pdf.setDrawColor(200, 210, 220);
  pdf.rect(14, y, pageWidth - 28, 14, 'S');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 40, 40);
  pdf.text('Summary Overview', 18, y + 5);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80, 80, 80);
  
  const totalCount = customersList.length;
  pdf.text(`Total Customers Listed: ${totalCount}`, 18, y + 10);
  pdf.text(`Report Generated On: ${format(new Date(), 'EEEE, MMMM dd, yyyy HH:mm')}`, 120, y + 10);

  y += 20;

  // Table Headers
  pdf.setFillColor(34, 139, 34);
  pdf.rect(14, y, pageWidth - 28, 7, 'F');

  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);

  pdf.text('Customer ID', 16, y + 4.5);
  pdf.text('Full Name', 40, y + 4.5);
  pdf.text('Email Address', 95, y + 4.5);
  pdf.text('Phone', 150, y + 4.5);
  pdf.text('NIC Number', 185, y + 4.5);
  pdf.text('Location (City, District, Province)', 220, y + 4.5);
  pdf.text('Registered Date', 270, y + 4.5);

  y += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(30, 30, 30);

  customersList.forEach((customer, index) => {
    y = checkPageBreak(pdf, y, 7);

    // Zebra striping
    if (index % 2 === 1) {
      pdf.setFillColor(248, 250, 248);
      pdf.rect(14, y - 4, pageWidth - 28, 6.5, 'F');
    }

    const name = (customer.f_name || customer.l_name ? `${customer.f_name || ''} ${customer.l_name || ''}`.trim() : customer.full_name) || 'N/A';
    const loc = [customer.city, customer.district, customer.province].filter(Boolean).join(', ') || 'N/A';

    pdf.setFont('helvetica', 'bold');
    pdf.text(String(customer.customer_id || '-'), 16, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(pdf.splitTextToSize(name, 50), 40, y);
    pdf.text(pdf.splitTextToSize(customer.email || 'N/A', 50), 95, y);
    pdf.text(String(customer.phone_no_1 || customer.phone_no_2 || 'N/A'), 150, y);
    pdf.text(String(customer.nic_number || 'N/A'), 185, y);
    pdf.text(pdf.splitTextToSize(loc, 48), 220, y);
    pdf.text(formatDateStr(customer.created_at), 270, y);

    y += 6.5;
  });

  addFooter(pdf);

  const filename = `Susaru_Master_Customer_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(filename);
  return true;
};

/**
 * Generate PDF for Screened Analytics Dashboard Data
 */
export const generateScreenedAnalyticsPDF = async ({
  screenedCustomers = [],
  screenedLands = [],
  screenedProposals = [],
  screenedProjects = [],
  screenedPayments = [],
  metrics = {},
  filterSummary = ''
}) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  await addHeader(pdf, 'Screened Analytics & Customer Intelligence Report', filterSummary || 'Custom Filtered Analytics Scope');

  let y = 43;

  // KPI Summary Banner
  pdf.setFillColor(240, 248, 240);
  pdf.rect(14, y, pageWidth - 28, 24, 'F');
  pdf.setDrawColor(34, 139, 34);
  pdf.rect(14, y, pageWidth - 28, 24, 'S');

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(34, 139, 34);
  pdf.text('Screened Key Performance Metrics', 18, y + 6);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);

  const col1 = `• Customers: ${metrics.customerCount || screenedCustomers.length} | • Lands: ${screenedLands.length} (${(metrics.totalLandSize || 0).toLocaleString()} perches)`;
  const col2 = `• Proposals: ${screenedProposals.length} (${formatLKR(metrics.totalProposalValue || 0)})`;
  const col3 = `• Projects: ${screenedProjects.length} (${metrics.ongoingProjects || 0} Ongoing, ${metrics.completedProjects || 0} Completed)`;
  const col4 = `• Payments Collected: ${formatLKR(metrics.totalPayments || 0)}`;

  pdf.text(col1, 18, y + 11);
  pdf.text(col2, 18, y + 16);
  pdf.text(`${col3} | ${col4}`, 18, y + 21);

  y += 30;

  // 1. Screened Customers Directory
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`1. Screened Customers Directory (${screenedCustomers.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (screenedCustomers.length > 0) {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('ID', 16, y + 4);
    pdf.text('Name', 35, y + 4);
    pdf.text('Email', 85, y + 4);
    pdf.text('Phone', 135, y + 4);
    pdf.text('Location', 165, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    screenedCustomers.slice(0, 25).forEach((c) => {
      y = checkPageBreak(pdf, y, 7);
      const name = (c.f_name || c.l_name ? `${c.f_name || ''} ${c.l_name || ''}`.trim() : c.full_name) || 'N/A';
      const loc = [c.city, c.district, c.province].filter(Boolean).join(', ') || 'N/A';
      pdf.text(String(c.customer_id || '-'), 16, y);
      pdf.text(pdf.splitTextToSize(name, 45), 35, y);
      pdf.text(pdf.splitTextToSize(c.email || 'N/A', 45), 85, y);
      pdf.text(String(c.phone_no_1 || 'N/A'), 135, y);
      pdf.text(pdf.splitTextToSize(loc, 35), 165, y);
      y += 6;
    });
    if (screenedCustomers.length > 25) {
      pdf.setFont('helvetica', 'italic');
      pdf.text(`... and ${screenedCustomers.length - 25} more customer records included in selection`, 16, y + 2);
      y += 6;
    }
    y += 4;
  }

  // 2. Screened Lands Specification Table
  y = checkPageBreak(pdf, y, 30);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`2. Registered Lands (${screenedLands.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (screenedLands.length > 0) {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('Land ID', 16, y + 4);
    pdf.text('Owner ID', 40, y + 4);
    pdf.text('Location', 65, y + 4);
    pdf.text('Climate', 115, y + 4);
    pdf.text('Size (Perch)', 150, y + 4);
    pdf.text('Soil', 178, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    screenedLands.slice(0, 25).forEach((l) => {
      y = checkPageBreak(pdf, y, 7);
      const loc = [l.city, l.district, l.province].filter(Boolean).join(', ') || 'N/A';
      pdf.text(String(l.customer_land_id || '-'), 16, y);
      pdf.text(String(l.customer_id || '-'), 40, y);
      pdf.text(pdf.splitTextToSize(loc, 45), 65, y);
      pdf.text(String(l.climate_zone || '-'), 115, y);
      pdf.text(String(l.land_size ? `${l.land_size}` : '-'), 150, y);
      pdf.text(String(l.soil_type || '-'), 178, y);
      y += 6;
    });
    y += 4;
  }

  // 3. Screened Proposals Table
  y = checkPageBreak(pdf, y, 30);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`3. Proposals Breakdown (${screenedProposals.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (screenedProposals.length > 0) {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('Proposal ID', 16, y + 4);
    pdf.text('Type', 40, y + 4);
    pdf.text('Duration', 70, y + 4);
    pdf.text('Contract Value', 95, y + 4);
    pdf.text('Payment Mode', 140, y + 4);
    pdf.text('Status', 172, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    screenedProposals.slice(0, 25).forEach((p) => {
      y = checkPageBreak(pdf, y, 7);
      pdf.text(String(p.proposal_id || '-'), 16, y);
      pdf.text(String(p.project_type || '-'), 40, y);
      pdf.text(`${p.project_duration || '-'} Yrs`, 70, y);
      pdf.text(formatLKR(p.project_value), 95, y);
      pdf.text(String(p.payment_mode || '-'), 140, y);
      pdf.text(String(p.status || '-'), 172, y);
      y += 6;
    });
    y += 4;
  }

  // 4. Projects Status Table
  y = checkPageBreak(pdf, y, 30);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`4. Projects Progress (${screenedProjects.length})`, 14, y);
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(14, y, pageWidth - 14, y);
  y += 5;

  if (screenedProjects.length > 0) {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(14, y, pageWidth - 28, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);

    pdf.text('Project ID', 16, y + 4);
    pdf.text('Proposal Ref', 40, y + 4);
    pdf.text('Status', 75, y + 4);
    pdf.text('Progress %', 115, y + 4);
    pdf.text('Start Date', 145, y + 4);
    pdf.text('End Date', 175, y + 4);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 30, 30);

    screenedProjects.slice(0, 25).forEach((prj) => {
      y = checkPageBreak(pdf, y, 7);
      pdf.text(`PRJ-${prj.project_id}`, 16, y);
      pdf.text(String(prj.proposal_id || '-'), 40, y);
      pdf.text(String(prj.status || '-'), 75, y);
      pdf.text(`${prj.progress_percentage || 0}%`, 115, y);
      pdf.text(formatDateStr(prj.start_date), 145, y);
      pdf.text(formatDateStr(prj.end_date), 175, y);
      y += 6;
    });
    y += 4;
  }

  addFooter(pdf);

  const filename = `Susaru_Analytics_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(filename);
  return true;
};

export default {
  generateIndividualCustomerPDF,
  generateAllCustomersPDF,
  generateScreenedAnalyticsPDF
};
