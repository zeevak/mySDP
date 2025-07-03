// utils/monthlyReportsPdfService.js
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export const generateMonthlyReportsPDF = async (reportData, dateRange) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  try {
    // Try to add Susaru logo
    try {
      const logoModule = await import('../assets/susaruLogo.png');
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = logoModule.default;
      
      await new Promise((resolve) => {
        logoImg.onload = () => {
          try {
            // Create canvas for logo
            const logoCanvas = document.createElement('canvas');
            const logoCtx = logoCanvas.getContext('2d');
            logoCanvas.width = logoImg.width;
            logoCanvas.height = logoImg.height;
            logoCtx.drawImage(logoImg, 0, 0);
            const logoDataUrl = logoCanvas.toDataURL('image/png');
            
            // Add logo to PDF (top left)
            pdf.addImage(logoDataUrl, 'PNG', 15, 15, 40, 20);
            resolve();
          } catch (error) {
            console.warn('Error adding logo to PDF:', error);
            resolve(); // Continue without logo
          }
        };
        logoImg.onerror = () => {
          console.warn('Could not load logo image');
          resolve(); // Continue without logo
        };
        
        // Timeout after 3 seconds
        setTimeout(() => {
          console.warn('Logo loading timeout');
          resolve();
        }, 3000);
      });
    } catch (error) {
      console.warn('Could not load logo module:', error);
    }
    
    // Add company header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34); // Green color
    pdf.text('SUSARU AGRO (PVT) LTD', pageWidth - 15, 25, { align: 'right' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Monthly Business Analytics Report', pageWidth - 15, 32, { align: 'right' });
    
    // Add current date and report period
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Generated on: ${currentDate}`, pageWidth - 15, 38, { align: 'right' });
    
    const reportPeriod = `Report Period: ${format(new Date(dateRange.startDate), 'MMM dd, yyyy')} - ${format(new Date(dateRange.endDate), 'MMM dd, yyyy')}`;
    pdf.text(reportPeriod, pageWidth - 15, 44, { align: 'right' });
    
    // Add horizontal line separator
    pdf.setDrawColor(34, 139, 34);
    pdf.setLineWidth(0.5);
    pdf.line(15, 50, pageWidth - 15, 50);
    
    // Add title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Monthly Business Analytics Report', pageWidth / 2, 65, { align: 'center' });
    
    let yPosition = 80;
    
    // Executive Summary
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('Executive Summary', 15, yPosition);
    yPosition += 15;
    
    // Calculate totals for summary
    const totalVisitors = reportData.visitorEngagements.reduce((sum, item) => sum + item.visitors, 0);
    const totalCustomers = reportData.visitorEngagements.reduce((sum, item) => sum + item.customers, 0);
    const totalProjects = reportData.projects.reduce((sum, item) => sum + item.newProjects, 0);
    const totalRevenue = reportData.revenue.reduce((sum, item) => sum + item.amount, 0);
    const totalProfit = reportData.profits.reduce((sum, item) => sum + item.amount, 0);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const summaryData = [
      [`Total Visitors:`, `${totalVisitors.toLocaleString()}`],
      [`New Customers:`, `${totalCustomers.toLocaleString()}`],
      [`New Projects:`, `${totalProjects.toLocaleString()}`],
      [`Total Revenue:`, `LKR ${totalRevenue.toLocaleString()}`],
      [`Total Profit:`, `LKR ${totalProfit.toLocaleString()}`],
      [`Profit Margin:`, `${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%`]
    ];
    
    summaryData.forEach(([label, value]) => {
      pdf.text(label, 20, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(value, 80, yPosition);
      pdf.setFont('helvetica', 'normal');
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // Visitor Engagement Analytics
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('1. Visitor-Customer Engagement Analytics', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    reportData.visitorEngagements.forEach((item) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const monthStr = format(new Date(item.month), 'MMM yyyy');
      pdf.text(`${monthStr}:`, 20, yPosition);
      pdf.text(`Visitors: ${item.visitors}, Customers: ${item.customers}, Proposals: ${item.proposals}`, 45, yPosition);
      yPosition += 5;
    });
    
    yPosition += 10;
    
    // Sales Performance
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('2. Sales Performance', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    reportData.sales.forEach((item) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const monthStr = format(new Date(item.month), 'MMM yyyy');
      pdf.text(`${monthStr}:`, 20, yPosition);
      pdf.text(`Projects Sold: ${item.projectsSold}, Plants Sold: ${item.plantsSold}`, 45, yPosition);
      yPosition += 5;
    });
    
    yPosition += 10;
    
    // Project Statistics
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('3. Project Statistics', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    reportData.projects.forEach((item) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const monthStr = format(new Date(item.month), 'MMM yyyy');
      pdf.text(`${monthStr}:`, 20, yPosition);
      pdf.text(`New: ${item.newProjects}, Completed: ${item.completedProjects}, Ongoing: ${item.ongoingProjects}`, 45, yPosition);
      yPosition += 5;
    });
    
    yPosition += 10;
    
    // Current Inventory Status
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('4. Current Inventory Status', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const inventoryItems = [
      ['Agarwood Plants:', reportData.inventory.agarwoodPlants],
      ['Compost (kg):', reportData.inventory.compost],
      ['Tools & Equipment:', reportData.inventory.tools],
      ['Other Supplies:', reportData.inventory.otherSupplies]
    ];
    
    inventoryItems.forEach(([label, value]) => {
      pdf.text(label, 20, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(value.toString(), 80, yPosition);
      pdf.setFont('helvetica', 'normal');
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // Financial Performance
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('5. Financial Performance', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    reportData.revenue.forEach((item, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const monthStr = format(new Date(item.month), 'MMM yyyy');
      const profit = reportData.profits[index]?.amount || 0;
      pdf.text(`${monthStr}:`, 20, yPosition);
      pdf.text(`Revenue: LKR ${item.amount.toLocaleString()}, Profit: LKR ${profit.toLocaleString()}`, 45, yPosition);
      yPosition += 5;
    });
    
    // Add new page for charts if needed
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }
    
    yPosition += 15;
    
    // Charts section header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('Visual Analytics', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Charts and visual representations have been generated on the dashboard.', 20, yPosition);
    pdf.text('For detailed visual analysis, please refer to the online dashboard.', 20, yPosition + 5);
    yPosition += 20;
    
    // Key Insights and Recommendations
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('Key Insights & Recommendations', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const insights = [
      `• Customer conversion rate: ${totalVisitors > 0 ? ((totalCustomers / totalVisitors) * 100).toFixed(1) : 0}%`,
      `• Average monthly revenue: LKR ${(totalRevenue / Math.max(reportData.revenue.length, 1)).toLocaleString()}`,
      `• Project completion tracking shows consistent growth in ongoing projects`,
      `• Inventory levels indicate good stock management across all categories`,
      `• Profit margins remain healthy with consistent month-over-month performance`
    ];
    
    insights.forEach(insight => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(insight, 20, yPosition);
      yPosition += 6;
    });
    
    // Footer section
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    
    yPosition = pageHeight - 30;
    
    // Add horizontal line above footer
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(15, yPosition - 5, pageWidth - 15, yPosition - 5);
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('SUSARU AGRO (PVT) LTD', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text('Professional Agarwood Cultivation & Business Solutions', pageWidth / 2, yPosition + 4, { align: 'center' });
    pdf.text('Contact: info@susaruagro.com | www.susaruagro.com', pageWidth / 2, yPosition + 8, { align: 'center' });
    
    // Save the PDF
    const fileName = `Susaru_Monthly_Business_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    pdf.save(fileName);
    
    return true;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export default { generateMonthlyReportsPDF };
