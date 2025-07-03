// PdfPreview.jsx - Component to show PDF generation status
import React, { useState } from 'react';
import { generateInvestmentAnalysisPDF } from '../../utils/pdfService';

const PdfPreview = ({ analysisData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const success = await generateInvestmentAnalysisPDF(analysisData);
      if (success) {
        setLastGenerated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Official PDF Report</h4>
          <p className="text-sm text-gray-600">
            Professional document with Susaru logo and company branding
          </p>
          {lastGenerated && (
            <p className="text-xs text-green-600 mt-1">
              Last generated: {lastGenerated}
            </p>
          )}
        </div>
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
          } text-white`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Download Report</span>
            </>
          )}
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          <span className="text-gray-600">Susaru logo included</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          <span className="text-gray-600">Professional layout</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          <span className="text-gray-600">Date stamped</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          <span className="text-gray-600">Legal disclaimers</span>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
