// pdfService.js - Professional PDF generation for Susaru Agro reports
import jsPDF from 'jspdf';
import susaruLogo from '../assets/susaruLogo.png';

export const generateInvestmentAnalysisPDF = async (data) => {
  const {
    customerName,
    landSize,
    totalPlants,
    areaInSqFeet,
    totalCompost,
    plantCost,
    compostCost,
    totalInvestment,
    totalYield,
    minReturnLKR,
    maxReturnLKR,
    formatNumber
  } = data;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  try {
    // Add Susaru logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = susaruLogo;
    
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });
    
    // Create canvas for logo
    const logoCanvas = document.createElement('canvas');
    const logoCtx = logoCanvas.getContext('2d');
    logoCanvas.width = logoImg.width;
    logoCanvas.height = logoImg.height;
    logoCtx.drawImage(logoImg, 0, 0);
    const logoDataUrl = logoCanvas.toDataURL('image/png');
    
    // Add logo to PDF (top left)
    pdf.addImage(logoDataUrl, 'PNG', 15, 15, 40, 20);
    
    // Add company header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34); // Green color
    pdf.text('SUSARU AGRO (PVT) LTD', pageWidth - 15, 25, { align: 'right' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Agarwood Investment Analysis Report', pageWidth - 15, 32, { align: 'right' });
    
    // Add current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Generated on: ${currentDate}`, pageWidth - 15, 38, { align: 'right' });
    
    // Add horizontal line separator
    pdf.setDrawColor(34, 139, 34);
    pdf.setLineWidth(0.5);
    pdf.line(15, 45, pageWidth - 15, 45);
    
    // Add title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Agarwood Investment Analysis', pageWidth / 2, 60, { align: 'center' });
    
    // Add customer name
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Prepared for: ${customerName}`, pageWidth / 2, 70, { align: 'center' });
    
    let yPosition = 85;
    
    // Land size info
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('Land Information', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Land Size: ${landSize} perches`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Area: ${formatNumber(areaInSqFeet)} square feet`, 15, yPosition);
    yPosition += 15;
    
    // Plants calculation
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('1. Suggested Quantity of Plants', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Number of plants: ${formatNumber(totalPlants)}`, 15, yPosition);
    yPosition += 5;
    pdf.text('Calculated with 8 feet spacing between plants', 15, yPosition);
    yPosition += 15;
    
    // Compost requirements
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('2. Compost Requirements', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Compost needed: ${formatNumber(totalCompost)} kg`, 15, yPosition);
    yPosition += 5;
    pdf.text('5kg of compost per planting pit', 15, yPosition);
    yPosition += 15;
    
    // Investment cost
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('3. Estimated Investment Cost', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Excluding transport, labor, and maintenance:', 15, yPosition);
    yPosition += 8;
    pdf.text(`Plants Cost: LKR ${formatNumber(plantCost)} (${formatNumber(totalPlants)} plants × LKR 1,500)`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Compost Cost: LKR ${formatNumber(compostCost)} (${formatNumber(totalCompost)} kg × LKR 50)`, 20, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total Investment: LKR ${formatNumber(totalInvestment)}`, 20, yPosition);
    yPosition += 15;
    
    // ROI calculation
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('4. Approximate ROI After 8 Years', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Based on current global market prices:', 15, yPosition);
    yPosition += 8;
    pdf.text(`Total Yield: ${formatNumber(totalYield)} kg (${formatNumber(totalPlants)} plants × 35kg per plant)`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Minimum Return: LKR ${formatNumber(minReturnLKR)} (At USD 100,000 per kg)`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Maximum Return: LKR ${formatNumber(maxReturnLKR)} (At USD 800,000 per kg)`, 20, yPosition);
    yPosition += 15;
    
    // Additional benefits
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('5. Additional Benefits', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('• Free transport for orders of more than 100 plants', 20, yPosition);
    yPosition += 5;
    pdf.text('• All plants provided are 6 months old, 2.5 feet tall', 20, yPosition);
    yPosition += 5;
    pdf.text('• Free observation by a technician', 20, yPosition);
    yPosition += 15;
    
    // Check if we need a new page for disclaimer
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Add disclaimer section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    pdf.text('Stay safe, we will contact you soon!', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Important Disclaimer:', 15, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const disclaimerText = [
      '• This analysis is based on current market conditions and historical data.',
      '• Actual returns may vary depending on market fluctuations, quality of agarwood, and global demand.',
      '• Investment in agriculture carries inherent risks including weather, pests, and market volatility.',
      '• This document is for informational purposes only and should not be considered as financial advice.',
      '• Susaru Agro (Pvt) Ltd provides ongoing support but cannot guarantee specific returns.'
    ];
    
    disclaimerText.forEach(line => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 4;
    });
    
    // Add footer with company info
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const footerY = pageHeight - 20;
    
    // Add horizontal line above footer
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(15, footerY - 8, pageWidth - 15, footerY - 8);
    
    pdf.text('SUSARU AGRO (PVT) LTD', pageWidth / 2, footerY, { align: 'center' });
    pdf.text('Professional Agarwood Cultivation Solutions', pageWidth / 2, footerY + 4, { align: 'center' });
    pdf.text('Contact: info@susaruagro.com | www.susaruagro.com', pageWidth / 2, footerY + 8, { align: 'center' });
    
    // Save the PDF
    const fileName = `Susaru_Agarwood_Investment_Analysis_${customerName}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return true;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export default { generateInvestmentAnalysisPDF };
