import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { authService } from '../../services/authService';
import ChangePasswordForm from './ChangePasswordForm';

// US Spot Market Benchmark Prices & Yield Parameters (Converted at 1 USD = 305 LKR)
const USD_TO_LKR_RATE = 305.00;

const CROP_MARKET_DATA = {
  Agarwood: {
    unit: 'kg (Aromatic Resin/Oil)',
    usPriceUSD: 30000,
    yieldPerPerchPerYear: 0.03, // ~0.15 kg total yield per perch over 5 years
    isAnnual: false,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Ultra-high-value resin used in luxury perfumes & cosmetics worldwide.'
  },
  Sandalwood: {
    unit: 'kg (Heartwood)',
    usPriceUSD: 280,
    yieldPerPerchPerYear: 2.0, // ~24 kg per perch over 12 years
    isAnnual: false,
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    description: 'Prized fragrant heartwood exported for essential oils and pharmaceuticals.'
  },
  Vanilla: {
    unit: 'kg (Cured Beans)',
    usPriceUSD: 450,
    yieldPerPerchPerYear: 1.8,
    isAnnual: true,
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    description: 'World’s second most expensive spice, traded heavily in US & European markets.'
  },
  Rubber: {
    unit: 'kg (Dry Rubber RSS1)',
    usPriceUSD: 2.65,
    yieldPerPerchPerYear: 35,
    isAnnual: true,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Global industrial raw material traded on international commodity exchanges.'
  },
  Tea: {
    unit: 'kg (Pure Ceylon Black Tea)',
    usPriceUSD: 5.50,
    yieldPerPerchPerYear: 20,
    isAnnual: true,
    badgeColor: 'bg-green-100 text-green-900 border-green-300',
    description: 'World-famous Ceylon Orthodox tea exported to US, EU, and Middle East markets.'
  },
  Cinnamon: {
    unit: 'kg (Ceylon Alba Cinnamon)',
    usPriceUSD: 18.50,
    yieldPerPerchPerYear: 6.5,
    isAnnual: true,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'True Ceylon Cinnamon holds high global premium over cassia in Western markets.'
  },
  Teak: {
    unit: 'm³ (Grade-A Timber)',
    usPriceUSD: 850,
    yieldPerPerchPerYear: 0.06, // ~0.9 m³ per perch over 15 years
    isAnnual: false,
    badgeColor: 'bg-stone-100 text-stone-900 border-stone-300',
    description: 'High-grade hardwood timber in demand for luxury furniture and marine yachts.'
  },
  Coconut: {
    unit: 'nuts (Export Grade)',
    usPriceUSD: 0.75,
    yieldPerPerchPerYear: 120,
    isAnnual: true,
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    description: 'Driven by rising US demand for organic coconut water, virgin oil & desiccated powder.'
  },
  Cocoa: {
    unit: 'kg (Fermented Beans)',
    usPriceUSD: 8.20,
    yieldPerPerchPerYear: 8.0,
    isAnnual: true,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Global cocoa commodity reaching historic highs on international futures markets.'
  },
  Other: {
    unit: 'kg (Agricultural Produce)',
    usPriceUSD: 15.0,
    yieldPerPerchPerYear: 10.0,
    isAnnual: true,
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    description: 'Diversified high-value spice or timber crop.'
  }
};

const calculateProjectReturns = (proj) => {
  const cropType = proj.projectType || 'Agarwood';
  const cropInfo = CROP_MARKET_DATA[cropType] || CROP_MARKET_DATA['Other'];

  const landSize = parseFloat(proj.landSize) || 50;
  const duration = parseInt(proj.projectDuration) || 5;
  const initialInvestment = parseFloat(proj.projectValue) || 1500000;

  // Total estimated yield
  const totalYield = cropInfo.isAnnual
    ? (cropInfo.yieldPerPerchPerYear * landSize * duration)
    : (cropInfo.yieldPerPerchPerYear * landSize * (duration / 5));

  // Gross Revenue in USD and LKR
  const grossRevenueUSD = totalYield * cropInfo.usPriceUSD;
  const grossRevenueLKR = grossRevenueUSD * USD_TO_LKR_RATE;

  // Net Profit & ROI
  const netProfitLKR = grossRevenueLKR - initialInvestment;
  const totalROI = initialInvestment > 0 ? ((netProfitLKR / initialInvestment) * 100) : 0;
  const annualROI = duration > 0 ? (totalROI / duration) : totalROI;

  return {
    cropType,
    cropInfo,
    landSize,
    duration,
    initialInvestment,
    totalYield: parseFloat(totalYield.toFixed(2)),
    usPriceUSD: cropInfo.usPriceUSD,
    usPriceLKR: cropInfo.usPriceUSD * USD_TO_LKR_RATE,
    grossRevenueUSD: parseFloat(grossRevenueUSD.toFixed(2)),
    grossRevenueLKR: parseFloat(grossRevenueLKR.toFixed(2)),
    netProfitLKR: parseFloat(netProfitLKR.toFixed(2)),
    totalROI: parseFloat(totalROI.toFixed(1)),
    annualROI: parseFloat(annualROI.toFixed(1))
  };
};

const CustomerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [investmentSummary, setInvestmentSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState(null);
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
  const [fullProjectData, setFullProjectData] = useState(null);
  const [fullPaymentData, setFullPaymentData] = useState(null);

  // Document Management State
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docCaption, setDocCaption] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [docError, setDocError] = useState(null);
  const [docSuccess, setDocSuccess] = useState(null);

  const navigate = useNavigate();

  const loadDocuments = async () => {
    try {
      setDocsLoading(true);
      const res = await authService.getDocuments();
      if (res.data && res.data.success) {
        setDocuments(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'documents') {
      loadDocuments();
    }
  }, [activeTab]);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setDocError(null);
    setDocSuccess(null);

    if (!docCaption || !docCaption.trim()) {
      setDocError('Please enter a caption (e.g. Land deed, ID, Proof of Address) to identify the document.');
      return;
    }

    if (!docFile) {
      setDocError('Please select a file to upload (.jpg, .png, .pdf, .docx).');
      return;
    }

    const maxSizeMB = 10;
    if (docFile.size > maxSizeMB * 1024 * 1024) {
      setDocError(`File size exceeds the maximum allowed limit of ${maxSizeMB} MB.`);
      return;
    }

    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.doc'];
    const fileName = docFile.name.toLowerCase();
    const isAllowed = allowedTypes.some(ext => fileName.endsWith(ext));
    if (!isAllowed) {
      setDocError('Invalid file format. Allowed file types: JPG, PNG, PDF, DOCX.');
      return;
    }

    try {
      setUploadingDoc(true);
      const formData = new FormData();
      formData.append('caption', docCaption.trim());
      formData.append('document', docFile);

      const response = await authService.uploadDocument(formData);
      if (response.data && response.data.success) {
        setDocSuccess('Document uploaded successfully!');
        setDocCaption('');
        setDocFile(null);
        const fileInput = document.getElementById('customer-doc-file-input');
        if (fileInput) fileInput.value = '';
        loadDocuments();
      } else {
        setDocError(response.data?.message || 'Failed to upload document.');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setDocError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await authService.deleteDocument(docId);
      if (res.data && res.data.success) {
        loadDocuments();
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleOpenProjectDetails = async (proj) => {
    setSelectedProjectForDetails(proj);
    const projId = proj.projectId || proj.projectDetails?.projectId;
    if (!projId) return;

    setProjectDetailsLoading(true);
    try {
      const [detailsRes, paymentsRes] = await Promise.all([
        authService.getProjectDetails(projId).catch(() => ({ data: null })),
        authService.getProjectPayments(projId).catch(() => ({ data: null }))
      ]);

      if (detailsRes?.data?.success) {
        setFullProjectData(detailsRes.data.data);
      } else {
        setFullProjectData(null);
      }

      if (paymentsRes?.data?.success) {
        setFullPaymentData(paymentsRes.data.data);
      } else {
        setFullPaymentData(null);
      }
    } catch (err) {
      console.error("Error fetching project details for customer:", err);
    } finally {
      setProjectDetailsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'Yet To Start':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const calculateExpectedEndDate = (startDateStr, durationYears) => {
    if (!startDateStr || !durationYears) return null;
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return null;
    const expectedEnd = new Date(start);
    expectedEnd.setFullYear(expectedEnd.getFullYear() + parseInt(durationYears));
    return expectedEnd;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/customer/login');
          return;
        }

        const response = await authService.getCurrentUser();
        setUserData(response.data);

        // Fetch actual investment summary
        try {
          const summaryRes = await authService.getInvestmentSummary();
          if (summaryRes.data.success) {
            setInvestmentSummary(summaryRes.data.data);
          } else {
            setSummaryError('Failed to load investment details');
          }
        } catch (sumErr) {
          console.error('Error fetching investment summary:', sumErr);
          setSummaryError('Error loading investment details');
        } finally {
          setSummaryLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If there's an error (like invalid token), redirect to login
        localStorage.removeItem('token');
        navigate('/customer/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const projects = investmentSummary?.projects || [];
  const hasMultipleProjects = projects.length > 1;

  const displayedSummary = (() => {
    if (!investmentSummary) return null;
    if (selectedProjectId === 'all' || !hasMultipleProjects) {
      return {
        totalInvested: investmentSummary.totalInvested,
        totalPaid: investmentSummary.totalPaid,
        isInstallment: investmentSummary.isInstallment,
        nextPaymentDate: investmentSummary.nextPaymentDate,
        nextPaymentAmount: investmentSummary.nextPaymentAmount,
        recentActivity: investmentSummary.recentActivity,
        projectDetails: null
      };
    }
    const proj = projects.find(p => p.proposalId === selectedProjectId);
    if (!proj) return null;
    return {
      totalInvested: proj.totalInvested,
      totalPaid: proj.totalPaid,
      isInstallment: proj.isInstallment,
      nextPaymentDate: proj.nextPaymentDate,
      nextPaymentAmount: proj.nextPaymentAmount,
      recentActivity: proj.recentActivity,
      projectDetails: proj.projectDetails,
      projectType: proj.projectType
    };
  })();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-green-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-green-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-2xl font-bold">Welcome back, {userData?.firstName || userData?.data?.firstName || 'Valued Customer'}</h1>
            <p className="mt-2">Manage your plantation investments and track your returns</p>
          </div>

          {/* Dashboard Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'overview'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'investments'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                  }`}
              >
                My Investments
              </button>
              <button
                onClick={() => setActiveTab('returns')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'returns'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                  }`}
              >
                Returns & Profits
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'documents'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                  }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'profile'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                  }`}
              >
                Profile
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Investment Summary */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 border-b border-gray-100 pb-3 gap-2">
                      <h2 className="text-xl font-bold text-green-800">Investment Summary</h2>
                      {hasMultipleProjects && (
                        <div className="flex space-x-2 overflow-x-auto py-1">
                          <button
                            onClick={() => setSelectedProjectId('all')}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${selectedProjectId === 'all'
                                ? 'bg-green-700 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                          >
                            All Projects
                          </button>
                          {projects.map(proj => (
                            <button
                              key={proj.proposalId}
                              onClick={() => setSelectedProjectId(proj.proposalId)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${selectedProjectId === proj.proposalId
                                  ? 'bg-green-700 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              {proj.projectType} ({proj.proposalId})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {summaryLoading ? (
                      <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
                      </div>
                    ) : summaryError ? (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{summaryError}</div>
                    ) : (
                      <>
                        <div className={`grid ${displayedSummary?.isInstallment ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-4`}>
                          <div className="bg-green-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Actual Investment</p>
                            <p className="text-2xl font-bold text-green-800">
                              LKR {displayedSummary?.totalInvested?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Payments Done</p>
                            <p className="text-2xl font-bold text-green-800">
                              LKR {displayedSummary?.totalPaid?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          {displayedSummary?.isInstallment && (
                            <>
                              <div className="bg-green-50 p-4 rounded-md">
                                <p className="text-sm text-gray-500">Next Payment Day</p>
                                <p className="text-2xl font-bold text-green-800">
                                  {displayedSummary?.nextPaymentDate
                                    ? new Date(displayedSummary.nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'Completed'}
                                </p>
                              </div>
                              <div className="bg-green-50 p-4 rounded-md">
                                <p className="text-sm text-gray-500">Next Payment Amount</p>
                                <p className="text-2xl font-bold text-green-800">
                                  LKR {displayedSummary?.nextPaymentAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {displayedSummary?.projectDetails && (
                          <div className="mt-6 border-t border-gray-150 pt-4">
                            <h3 className="text-sm font-semibold text-green-800 mb-2">Project Progress Details</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-green-50/50 p-4 rounded-md">
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="text-sm font-semibold text-gray-800">{displayedSummary.projectDetails.status}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Start Date</p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {displayedSummary.projectDetails.startDate
                                    ? new Date(displayedSummary.projectDetails.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'Not Started'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Progress</p>
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-semibold text-gray-800">{displayedSummary.projectDetails.progressPercentage}%</p>
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${displayedSummary.projectDetails.progressPercentage}%` }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Pending Proposals Section */}
                  {investmentSummary?.pendingProposals && investmentSummary.pendingProposals.length > 0 && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                        <h2 className="text-lg font-bold text-amber-900">Pending Proposals ({investmentSummary.pendingProposals.length})</h2>
                      </div>
                      <p className="text-xs text-amber-800 mb-4">
                        Your investment proposal has been submitted and is currently being reviewed by our agricultural staff.
                      </p>
                      <div className="space-y-3">
                        {investmentSummary.pendingProposals.map(prop => (
                          <div key={prop.proposalId} className="bg-white p-4 rounded-lg border border-amber-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-800 text-sm">{prop.projectType} Proposal ({prop.proposalId})</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  {prop.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Location: <span className="font-medium text-gray-700">{prop.landLocation || 'N/A'}</span> ({prop.landSize || 'N/A'} perches) • Duration: <span className="font-medium text-gray-700">{prop.projectDuration} yrs</span>
                              </p>
                            </div>
                            <div className="sm:text-right">
                              <span className="text-xs text-gray-400 block">Estimated Investment</span>
                              <span className="text-base font-extrabold text-green-700">
                                LKR {parseFloat(prop.projectValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-green-800 mb-4">Recent Activity</h2>
                    {summaryLoading ? (
                      <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
                      </div>
                    ) : summaryError ? (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{summaryError}</div>
                    ) : !displayedSummary?.recentActivity || displayedSummary.recentActivity.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">No recent payment activity.</div>
                    ) : (
                      <div className="space-y-4 max-h-64 overflow-y-auto pr-2 bg-gray-50/30 p-3 rounded-lg border border-gray-100 shadow-inner">
                        {displayedSummary.recentActivity.map(act => (
                          <div key={act.payment_id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800">{act.payment_detail}</p>
                                <p className="text-xs text-gray-500">Payment Confirmation</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  + LKR {parseFloat(act.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(act.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'investments' && (
                selectedProjectForDetails ? (
                  <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    {/* Header & Back Button */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
                      <div>
                        <button
                          onClick={() => setSelectedProjectForDetails(null)}
                          className="text-green-600 hover:text-green-700 font-semibold mb-2 flex items-center transition-colors text-sm"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back to My Investments
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">
                          Project #{fullProjectData?.project_id || selectedProjectForDetails.projectId || selectedProjectForDetails.proposalId}
                        </h1>
                        <p className="text-gray-600 font-medium">{selectedProjectForDetails.projectType}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(fullProjectData?.status || selectedProjectForDetails.projectDetails?.status || 'Yet To Start')}`}>
                          {fullProjectData?.status || selectedProjectForDetails.projectDetails?.status || 'Yet To Start'}
                        </span>
                        <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200 text-xs font-semibold text-green-800">
                          {fullProjectData?.progress_percentage ?? selectedProjectForDetails.projectDetails?.progressPercentage ?? 0}% Complete
                        </div>
                      </div>
                    </div>

                    {projectDetailsLoading ? (
                      <div className="py-12 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-700"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Project Information & Progress Log */}
                        <div className="space-y-6">
                          {/* Project Information Card */}
                          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Project Information</h2>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusColor(fullProjectData?.status || selectedProjectForDetails.projectDetails?.status || 'Yet To Start')}`}>
                                  {fullProjectData?.status || selectedProjectForDetails.projectDetails?.status || 'Yet To Start'}
                                </span>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Customer</p>
                                <p className="font-medium text-gray-800">{userData?.data?.fullName || fullProjectData?.proposal?.customer?.full_name || 'Valued Customer'}</p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Location (District & Area)</p>
                                <p className="font-medium text-gray-800">
                                  {selectedProjectForDetails.landLocation ||
                                    (fullProjectData?.proposal?.customer_land?.district && fullProjectData?.proposal?.customer_land?.city
                                      ? `${fullProjectData.proposal.customer_land.district}, ${fullProjectData.proposal.customer_land.city}`
                                      : fullProjectData?.proposal?.customer_land?.city || 'N/A')}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Land Size</p>
                                <p className="font-medium text-gray-800">
                                  {selectedProjectForDetails.landSize || fullProjectData?.proposal?.customer_land?.land_size || 'N/A'} perches
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Project Duration</p>
                                <p className="font-medium text-gray-800">
                                  {(selectedProjectForDetails.projectDuration || fullProjectData?.proposal?.project_duration) ? `${selectedProjectForDetails.projectDuration || fullProjectData?.proposal?.project_duration} years` : 'N/A'}
                                </p>
                              </div>

                              {/* Total Project Value - HIGHLIGHTED */}
                              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm my-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Total Project Value</p>
                                <p className="text-2xl font-extrabold text-emerald-700">
                                  LKR {parseFloat(fullProjectData?.proposal?.project_value || selectedProjectForDetails.projectValue || selectedProjectForDetails.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </div>

                              {(fullProjectData?.start_date || selectedProjectForDetails.projectDetails?.startDate) && (
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Start Date</p>
                                  <p className="font-medium text-gray-800">
                                    {new Date(fullProjectData?.start_date || selectedProjectForDetails.projectDetails?.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                </div>
                              )}

                              {(fullProjectData?.end_date || selectedProjectForDetails.projectDetails?.endDate) && (
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">End Date</p>
                                  <p className="font-medium text-gray-800">
                                    {new Date(fullProjectData?.end_date || selectedProjectForDetails.projectDetails?.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                </div>
                              )}

                              {/* Project Timeline Visualization */}
                              {(fullProjectData?.start_date || selectedProjectForDetails.projectDetails?.startDate) && (
                                <div className="pt-2">
                                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Project Timeline</p>
                                  {(() => {
                                    const startDate = new Date(fullProjectData?.start_date || selectedProjectForDetails.projectDetails?.startDate);
                                    const durationYears = selectedProjectForDetails.projectDuration || fullProjectData?.proposal?.project_duration || 1;
                                    const expectedEnd = calculateExpectedEndDate(startDate, durationYears);
                                    const endDate = (fullProjectData?.end_date || selectedProjectForDetails.projectDetails?.endDate)
                                      ? new Date(fullProjectData?.end_date || selectedProjectForDetails.projectDetails?.endDate)
                                      : expectedEnd;

                                    if (!endDate) return null;
                                    const currentDate = new Date();
                                    const totalDuration = endDate.getTime() - startDate.getTime();
                                    const elapsedTime = Math.min(currentDate.getTime() - startDate.getTime(), totalDuration);
                                    const timelineProgress = totalDuration > 0 ? Math.max(0, Math.min(100, (elapsedTime / totalDuration) * 100)) : 0;

                                    return (
                                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                                            style={{ width: `${timelineProgress}%` }}
                                          ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                          <div>
                                            <span className="font-semibold text-blue-600 block">Start</span>
                                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </div>
                                          <div className="text-right">
                                            <span className="font-semibold text-green-600 block">Target Completion</span>
                                            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Field Progress & Updates Log */}
                          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Field Progress & Staff Updates</h2>
                            {fullProjectData?.project_progresses && fullProjectData.project_progresses.length > 0 ? (
                              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                {fullProjectData.project_progresses.map((prog, idx) => (
                                  <div key={prog.progress_id || idx} className="bg-green-50/40 p-3.5 rounded-lg border border-green-100 text-xs space-y-2">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-1.5">
                                      <span className="font-semibold text-green-800">
                                        {prog.date ? new Date(prog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Progress Update'}
                                      </span>
                                      {prog.labor_hours && (
                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                                          {prog.labor_hours} hrs
                                        </span>
                                      )}
                                    </div>
                                    {prog.work_completed && (
                                      <div>
                                        <span className="font-semibold text-gray-700">Work Completed: </span>
                                        <span className="text-gray-600">{prog.work_completed}</span>
                                      </div>
                                    )}
                                    {prog.next_steps && (
                                      <div>
                                        <span className="font-semibold text-gray-700">Next Steps: </span>
                                        <span className="text-gray-600">{prog.next_steps}</span>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-2 text-gray-500 pt-1 border-t border-gray-100">
                                      {prog.weather_conditions && <div><span className="font-medium">Weather:</span> {prog.weather_conditions}</div>}
                                      {prog.soil_conditions && <div><span className="font-medium">Soil:</span> {prog.soil_conditions}</div>}
                                      {prog.irrigation_status && <div><span className="font-medium">Irrigation:</span> {prog.irrigation_status}</div>}
                                      {prog.pest_disease_status && <div><span className="font-medium">Pest/Disease:</span> {prog.pest_disease_status}</div>}
                                    </div>
                                    {prog.notes && (
                                      <div className="text-gray-500 italic pt-1 border-t border-gray-100">
                                        Notes: {prog.notes}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 text-center py-6 bg-gray-50 rounded-lg">
                                No field progress updates recorded for this project yet.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Column: Financial & Payment Overview */}
                        <div className="space-y-6">
                          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Financial & Payment Details</h2>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Payment Plan</span>
                                <span className="text-xs font-bold text-gray-800 uppercase">
                                  {fullPaymentData?.payment_mode || selectedProjectForDetails.paymentMode || 'N/A'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                  <p className="text-xs text-gray-500 font-medium">Total Paid</p>
                                  <p className="text-base font-bold text-green-700">
                                    LKR {parseFloat(fullPaymentData?.total_paid ?? selectedProjectForDetails.totalPaid ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                </div>

                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                  <p className="text-xs text-gray-500 font-medium">Total Remaining</p>
                                  <p className="text-base font-bold text-amber-700">
                                    LKR {parseFloat(fullPaymentData?.total_due ?? (selectedProjectForDetails.totalInvested - selectedProjectForDetails.totalPaid) ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </div>

                              {(fullPaymentData?.payment_mode === 'installments' || selectedProjectForDetails.isInstallment) && (
                                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 space-y-2.5">
                                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Installment Breakdown</h3>
                                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                                      <span className="text-gray-400 block text-[10px]">Total</span>
                                      <span className="font-bold text-gray-800">{fullPaymentData?.installment_count || 'N/A'}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                                      <span className="text-gray-400 block text-[10px]">Paid</span>
                                      <span className="font-bold text-green-600">{fullPaymentData?.installments_paid ?? 0}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                                      <span className="text-gray-400 block text-[10px]">Remaining</span>
                                      <span className="font-bold text-amber-600">{fullPaymentData?.installments_remaining ?? 0}</span>
                                    </div>
                                  </div>

                                  {(fullPaymentData?.next_payment_date || selectedProjectForDetails.nextPaymentDate) && (
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-xs">
                                      <span className="text-gray-600 font-medium">Next Installment Date:</span>
                                      <span className="font-bold text-green-700">
                                        {new Date(fullPaymentData?.next_payment_date || selectedProjectForDetails.nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Payment History List */}
                              <div className="pt-2">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Payment History</h3>
                                {(fullPaymentData?.payments || selectedProjectForDetails.recentActivity) && (fullPaymentData?.payments || selectedProjectForDetails.recentActivity).length > 0 ? (
                                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {(fullPaymentData?.payments || selectedProjectForDetails.recentActivity).map((p, pIdx) => (
                                      <div key={p.payment_id || pIdx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-md border border-gray-100 text-xs">
                                        <div>
                                          <p className="font-semibold text-gray-800">{p.payment_detail}</p>
                                          <p className="text-gray-400">
                                            {p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                          </p>
                                        </div>
                                        <span className="font-bold text-green-600">
                                          + LKR {parseFloat(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded">
                                    No payment history recorded.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-green-800 mb-4">My Investments</h2>
                    {summaryLoading ? (
                      <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
                      </div>
                    ) : summaryError ? (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{summaryError}</div>
                    ) : projects.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                        No investments or approved projects found.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {projects.map((proj) => (
                              <tr
                                key={proj.proposalId}
                                onClick={() => handleOpenProjectDetails(proj)}
                                className="cursor-pointer hover:bg-green-50/70 transition-colors group"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{proj.projectType}</div>
                                  <div className="text-xs text-gray-500">{proj.landLocation || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {proj.projectDetails?.startDate
                                    ? new Date(proj.projectDetails.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'Not Started'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                                  LKR {parseFloat(proj.totalInvested || proj.projectValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(proj.projectDetails?.status || 'Yet To Start')}`}>
                                    {proj.projectDetails?.status || 'Yet To Start'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              )}

              {activeTab === 'returns' && (() => {
                const projectCalculations = projects.map(proj => ({
                  ...proj,
                  calc: calculateProjectReturns(proj)
                }));

                const totalPortfolioInvestment = projectCalculations.reduce((sum, p) => sum + p.calc.initialInvestment, 0);
                const totalGrossRevenueUSD = projectCalculations.reduce((sum, p) => sum + p.calc.grossRevenueUSD, 0);
                const totalGrossRevenueLKR = projectCalculations.reduce((sum, p) => sum + p.calc.grossRevenueLKR, 0);
                const totalNetProfitLKR = projectCalculations.reduce((sum, p) => sum + p.calc.netProfitLKR, 0);

                const avgROI = projectCalculations.length > 0
                  ? (projectCalculations.reduce((sum, p) => sum + p.calc.totalROI, 0) / projectCalculations.length).toFixed(1)
                  : '0.0';

                return (
                  <div className="space-y-6">
                    {/* Header Banner & US Market Spot Indicator */}
                    <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 text-white p-6 rounded-xl shadow-lg border border-emerald-700 space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 rounded text-xs font-bold uppercase tracking-wider">
                              US Commodity Index Live Valuation
                            </span>
                            <span className="text-xs text-emerald-200 font-medium">1 USD = LKR 305.00</span>
                          </div>
                          <h2 className="text-2xl font-extrabold mt-1 text-white">Returns & Estimated Profits</h2>
                          <p className="text-xs text-emerald-100 mt-1 max-w-2xl">
                            Projections are dynamically computed based on benchmark agricultural commodity prices in US spot markets, land yield potential, and crop duration.
                          </p>
                        </div>
                      </div>

                      {/* Portfolio Financial Metric Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-lg border border-white/15">
                          <span className="text-[11px] text-emerald-200 uppercase font-semibold block">Total Investment</span>
                          <span className="text-lg font-bold text-white">
                            LKR {totalPortfolioInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-lg border border-white/15">
                          <span className="text-[11px] text-emerald-200 uppercase font-semibold block">Projected USD Revenue</span>
                          <span className="text-lg font-bold text-amber-300">
                            ${totalGrossRevenueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-lg border border-white/15">
                          <span className="text-[11px] text-emerald-200 uppercase font-semibold block">Estimated Net Profit</span>
                          <span className="text-lg font-bold text-emerald-300">
                            LKR {totalNetProfitLKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-lg border border-white/15">
                          <span className="text-[11px] text-emerald-200 uppercase font-semibold block">Average Est. ROI</span>
                          <span className="text-lg font-extrabold text-emerald-300">
                            +{avgROI}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* US Market Commodity Price Spot Benchmarks Ticker */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2 animate-pulse"></span>
                          US Spot Market Price Benchmarks
                        </h3>
                        <span className="text-[11px] text-gray-400">Updated: Today</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {Object.entries(CROP_MARKET_DATA).slice(0, 5).map(([crop, data]) => (
                          <div key={crop} className="bg-gray-50 p-2.5 rounded-lg border border-gray-150 text-xs">
                            <span className="font-bold text-gray-800 block truncate">{crop}</span>
                            <span className="text-emerald-700 font-extrabold text-sm block">
                              ${data.usPriceUSD.toLocaleString('en-US')} <span className="text-[10px] font-normal text-gray-500">/ unit</span>
                            </span>
                            <span className="text-[10px] text-gray-400 block truncate mt-0.5">
                              LKR {(data.usPriceUSD * USD_TO_LKR_RATE).toLocaleString('en-US')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Per-Project Profitability Cards */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                      <div className="border-b border-gray-150 pb-3 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Per-Project Profitability & Returns</h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
                        </span>
                      </div>

                      {projectCalculations.length === 0 ? (
                        /* Sample Crop Calculator Benchmarks if Customer has no active projects */
                        <div className="space-y-4">
                          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-xs font-medium">
                            💡 You currently have no active investments. Below are sample project return benchmarks based on US market crop valuations for a standard 50-perch parcel:
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Agarwood', 'Sandalwood', 'Vanilla', 'Tea'].map(cropName => {
                              const sampleCalc = calculateProjectReturns({
                                projectType: cropName,
                                landSize: 50,
                                projectDuration: cropName === 'Sandalwood' ? 12 : 5,
                                projectValue: 1500000
                              });

                              return (
                                <div key={cropName} className="border border-gray-200 rounded-xl p-4 bg-gray-50/60 hover:bg-white hover:shadow-md transition-all space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="font-extrabold text-gray-800 text-base">{cropName} Plantation Benchmark</span>
                                      <p className="text-xs text-gray-500 mt-0.5">50 Perch Parcel • {sampleCalc.duration} Years</p>
                                    </div>
                                    <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full border border-green-200">
                                      +{(sampleCalc.totalROI).toLocaleString()}% Total ROI
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-gray-150">
                                    <div>
                                      <span className="text-gray-400 block">US Spot Price:</span>
                                      <span className="font-semibold text-gray-800">${sampleCalc.usPriceUSD.toLocaleString()} / unit</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Est. Harvest Yield:</span>
                                      <span className="font-semibold text-gray-800">{sampleCalc.totalYield} {sampleCalc.cropInfo.unit.split(' ')[0]}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Initial Value:</span>
                                      <span className="font-semibold text-gray-800">LKR {sampleCalc.initialInvestment.toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Projected Revenue:</span>
                                      <span className="font-bold text-green-700">LKR {sampleCalc.grossRevenueLKR.toLocaleString()}</span>
                                    </div>
                                  </div>

                                  <div className="text-xs text-gray-500 italic">
                                    {sampleCalc.cropInfo.description}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Real Customer Project Profitability List */
                        <div className="space-y-6">
                          {projectCalculations.map((item, idx) => {
                            const c = item.calc;
                            return (
                              <div key={item.proposalId || idx} className="border border-emerald-200 rounded-xl p-5 bg-gradient-to-br from-white via-emerald-50/20 to-green-50/40 shadow-xs hover:shadow-md transition-all space-y-4">
                                {/* Project Card Header */}
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-150 pb-3 gap-2">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg font-black text-emerald-950">{item.projectType} Project</span>
                                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${c.cropInfo.badgeColor}`}>
                                        {c.cropType}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Location: <span className="font-semibold text-gray-700">{item.landLocation || 'N/A'}</span> • Parcel Size: <span className="font-semibold text-gray-700">{c.landSize} perches</span> • Duration: <span className="font-semibold text-gray-700">{c.duration} Years</span>
                                    </p>
                                  </div>

                                  <div className="sm:text-right">
                                    <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Estimated Total ROI</span>
                                    <span className="text-xl font-extrabold text-emerald-700">
                                      +{c.totalROI.toLocaleString()}% <span className="text-xs font-semibold text-emerald-600">({c.annualROI}% / yr)</span>
                                    </span>
                                  </div>
                                </div>

                                {/* Detailed US Market & Profit Breakdown Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                                  <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider block text-[10px]">US Spot Market Price</span>
                                    <span className="text-sm font-bold text-gray-800 block">${c.usPriceUSD.toLocaleString('en-US')} / {c.cropInfo.unit.split(' ')[0]}</span>
                                    <span className="text-[11px] text-gray-500 block">≈ LKR {c.usPriceLKR.toLocaleString('en-US')} / unit</span>
                                  </div>

                                  <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider block text-[10px]">Projected Harvest Yield</span>
                                    <span className="text-sm font-bold text-gray-800 block">{c.totalYield} {c.cropInfo.unit.split(' ')[0]}</span>
                                    <span className="text-[11px] text-gray-500 block">Across {c.landSize} perches over {c.duration} yrs</span>
                                  </div>

                                  <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider block text-[10px]">Projected Gross Revenue</span>
                                    <span className="text-sm font-bold text-emerald-700 block">${c.grossRevenueUSD.toLocaleString('en-US')} USD</span>
                                    <span className="text-[11px] font-semibold text-emerald-800 block">LKR {c.grossRevenueLKR.toLocaleString('en-US')}</span>
                                  </div>

                                  <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 space-y-1">
                                    <span className="text-emerald-800 font-bold uppercase tracking-wider block text-[10px]">Net Projected Profit</span>
                                    <span className="text-base font-black text-emerald-700 block">LKR {c.netProfitLKR.toLocaleString('en-US')}</span>
                                    <span className="text-[11px] text-emerald-700 block font-medium">After initial LKR {c.initialInvestment.toLocaleString()} investment</span>
                                  </div>
                                </div>

                                {/* Crop Market Context Note */}
                                <div className="text-[11px] text-gray-500 bg-white/80 p-2.5 rounded-md border border-gray-150 flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span><strong>Market Intelligence:</strong> {c.cropInfo.description}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Payment & Dividend History Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-2">Payment & Dividend Transaction History</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Transaction Type</th>
                              <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider">Project / Description</th>
                              <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {displayedSummary?.recentActivity && displayedSummary.recentActivity.length > 0 ? (
                              displayedSummary.recentActivity.map((act) => (
                                <tr key={act.payment_id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                    {new Date(act.payment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap font-medium text-green-700">
                                    Investment Payment
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                    {act.payment_detail || 'Quarterly Installment / Settlement'}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-green-700">
                                    LKR {parseFloat(act.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="px-4 py-6 text-center text-gray-400 font-medium">
                                  No transaction history recorded yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  {/* Document Upload Form Card */}
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-150">
                    <h2 className="text-xl font-bold text-green-800 mb-1">Upload New Document</h2>
                    <p className="text-xs text-gray-500 mb-5">
                      Upload supporting documents for your land or investment profile. Accepted file types: <strong>.JPG, .PNG, .PDF, .DOCX</strong> (Max size: <strong>10MB</strong>).
                    </p>

                    {docError && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-md">
                        {docError}
                      </div>
                    )}

                    {docSuccess && (
                      <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-md font-semibold">
                        {docSuccess}
                      </div>
                    )}

                    <form onSubmit={handleUploadDocument} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                            Document Caption / Name *
                          </label>
                          <input
                            type="text"
                            value={docCaption}
                            onChange={(e) => setDocCaption(e.target.value)}
                            placeholder="e.g. Land deed, ID, Proof of Address"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <p className="text-[11px] text-gray-400 mt-1">Short descriptive title to identify this document.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                            Select File *
                          </label>
                          <input
                            id="customer-doc-file-input"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,.docx,.doc"
                            onChange={(e) => setDocFile(e.target.files[0] || null)}
                            className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                          />
                          <p className="text-[11px] text-gray-400 mt-1">Allowed: JPG, PNG, PDF, DOCX (Max 10MB)</p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={uploadingDoc}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-md shadow transition duration-200 flex items-center disabled:opacity-50"
                        >
                          {uploadingDoc ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Uploading Document...
                            </>
                          ) : (
                            'Upload Document'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Uploaded Documents List */}
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-150">
                    <h2 className="text-xl font-bold text-green-800 mb-4">My Uploaded Documents ({documents.length})</h2>

                    {docsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">No documents uploaded yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Use the form above to upload your land deeds, ID proof, or agreements.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((doc) => {
                          const ext = (doc.file_name || doc.file_path || '').split('.').pop().toUpperCase();
                          const fullUrl = doc.file_path.startsWith('http') ? doc.file_path : `http://localhost:5001${doc.file_path}`;

                          return (
                            <div key={doc.document_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between space-y-3">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 font-extrabold text-xs rounded border border-green-200">
                                    {ext}
                                  </span>
                                  <h3 className="font-bold text-gray-800 text-sm truncate" title={doc.caption}>
                                    {doc.caption}
                                  </h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 truncate" title={doc.file_name}>
                                  File: {doc.file_name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Uploaded: {new Date(doc.created_at || doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                                <a
                                  href={fullUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 inline-flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded text-xs font-semibold transition"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  <span>View File</span>
                                </a>
                                <button
                                  onClick={() => handleDeleteDocument(doc.document_id)}
                                  className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200 transition"
                                  title="Delete Document"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-green-800 mb-4">Profile Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.title || 'Mr/Ms'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.fullName || 'John Doe'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name with Initials</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.nameWithInitials || 'J. Doe'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">NIC Number</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.nicNumber || 'XXXXXXXXXX'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email Address</label>
                          <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.email || 'john.doe@example.com'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input type="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.phoneNumber1 || '+94 71 234 5678'} readOnly />
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">Edit Profile</button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Address & Security</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.addressLine1 || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.addressLine2 || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.city || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">District</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.district || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Province</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.province || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value="********" readOnly />
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                      >
                        {showPasswordForm ? 'Hide Form' : 'Change Password'}
                      </button>
                      {showPasswordForm && <ChangePasswordForm />}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-green-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <a href="/customer/new-investment" className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">New Investment</a>
                  <a href="/customer/make-request" className="block w-full text-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition duration-300">Make a Request</a>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300 font-medium text-sm"
                  >
                    Upload Document
                  </button>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-green-800 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">Our customer support team is available to assist you with any questions.</p>
                <div className="space-y-3">
                  <a href="tel:+94812345678" className="flex items-center text-gray-700 hover:text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +94 81 234 5678
                  </a>
                  <a href="mailto:support@susaruagro.com" className="flex items-center text-gray-700 hover:text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@susaruagro.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
