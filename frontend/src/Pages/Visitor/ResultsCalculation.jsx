// ResultsCalculation.jsx
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultsCalculation = ({ landSize, customerName = 'Investor' }) => {
  const targetRef = useRef(null);

  // Constants for calculations
  const PLANT_SPACING = 8; // feet
  const COMPOST_PER_PIT = 5; // kg
  const PLANT_COST = 1500; // LKR
  const COMPOST_COST = 50; // LKR per kg
  const YIELD_PER_PLANT = 35; // kg (average of 30-40kg)
  const MIN_PRICE_PER_KG = 100000; // USD
  const MAX_PRICE_PER_KG = 800000; // USD
  const USD_TO_LKR = 325; // Exchange rate (as of May 2025)

  // Calculate number of plants
  // 1 perch = 272.25 square feet
  const areaInSqFeet = landSize * 272.25;
  const plantsPerPerch = Math.floor(Math.sqrt(areaInSqFeet) / PLANT_SPACING);
  const totalPlants = plantsPerPerch * plantsPerPerch;

  // Calculate compost needed
  const totalCompost = totalPlants * COMPOST_PER_PIT;

  // Calculate investment cost
  const plantCost = totalPlants * PLANT_COST;
  const compostCost = totalCompost * COMPOST_COST;
  const totalInvestment = plantCost + compostCost;

  // Calculate ROI
  const totalYield = totalPlants * YIELD_PER_PLANT;
  const minReturnUSD = totalYield * MIN_PRICE_PER_KG;
  const maxReturnUSD = totalYield * MAX_PRICE_PER_KG;
  const minReturnLKR = minReturnUSD * USD_TO_LKR;
  const maxReturnLKR = maxReturnUSD * USD_TO_LKR;

  // Format numbers for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    if (!targetRef.current) return;

    html2canvas(targetRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Agarwood_Investment_Analysis_${customerName}.pdf`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">Your Agarwood Investment Analysis</h2>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Download PDF
        </button>
      </div>

      <div ref={targetRef} className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-700 mb-3">1. Suggested Quantity of Plants</h3>
          <p className="text-gray-700 mb-2">Based on your land size of <span className="font-semibold">{landSize} perches</span>:</p>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-2xl font-bold text-green-600">{formatNumber(totalPlants)} plants</p>
            <p className="text-sm text-gray-500 mt-1">Calculated with 8 feet spacing between plants</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-700 mb-3">2. Compost Requirements</h3>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-2xl font-bold text-green-600">{formatNumber(totalCompost)} kg</p>
            <p className="text-sm text-gray-500 mt-1">5kg of compost per planting pit</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-700 mb-3">3. Estimated Investment Cost</h3>
          <p className="text-gray-700 mb-2">Excluding transport, labor, and maintenance:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-lg font-semibold text-gray-700">Plants Cost</p>
              <p className="text-xl font-bold text-green-600">LKR {formatNumber(plantCost)}</p>
              <p className="text-sm text-gray-500 mt-1">{formatNumber(totalPlants)} plants × LKR 1,500</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-lg font-semibold text-gray-700">Compost Cost</p>
              <p className="text-xl font-bold text-green-600">LKR {formatNumber(compostCost)}</p>
              <p className="text-sm text-gray-500 mt-1">{formatNumber(totalCompost)} kg × LKR 50</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border-t-4 border-green-500">
            <p className="text-lg font-semibold text-gray-700">Total Investment</p>
            <p className="text-2xl font-bold text-green-600">LKR {formatNumber(totalInvestment)}</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-700 mb-3">4. Approximate ROI After 8 Years</h3>
          <p className="text-gray-700 mb-2">Based on current global market prices:</p>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-lg font-semibold text-gray-700">Total Yield</p>
            <p className="text-xl font-bold text-green-600">{formatNumber(totalYield)} kg</p>
            <p className="text-sm text-gray-500 mt-1">{formatNumber(totalPlants)} plants × 35kg per plant</p>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-lg font-semibold text-gray-700">Minimum Return</p>
              <p className="text-xl font-bold text-green-600">LKR {formatNumber(minReturnLKR)}</p>
              <p className="text-sm text-gray-500 mt-1">At USD 100,000 per kg</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-lg font-semibold text-gray-700">Maximum Return</p>
              <p className="text-xl font-bold text-green-600">LKR {formatNumber(maxReturnLKR)}</p>
              <p className="text-sm text-gray-500 mt-1">At USD 800,000 per kg</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-700 mb-3">5. Additional Benefits</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Free transport for orders of more than 100 plants</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>All plants provided are 6 months old, 2.5 feet tall</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Free observation by a technician</span>
            </li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <p className="text-xl font-bold text-green-700">Stay safe, we will contact you soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsCalculation;
