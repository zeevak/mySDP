import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import { provinces } from '../../utils/locationData';
import { generateScreenedAnalyticsPDF } from '../../utils/customerReportPdfService';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CustomerReportsAnalytics = () => {
  const [masterData, setMasterData] = useState({
    customers: [],
    lands: [],
    proposals: [],
    projects: [],
    payments: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Global filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [proposalStatusFilter, setProposalStatusFilter] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('');

  // Cascading Selected IDs Sets
  const [selectedCustomerIds, setSelectedCustomerIds] = useState(new Set());
  const [selectedLandIds, setSelectedLandIds] = useState(new Set());
  const [selectedProposalIds, setSelectedProposalIds] = useState(new Set());

  // Active Inspector Tab ('customers' | 'lands' | 'proposals' | 'projects' | 'payments')
  const [activeTab, setActiveTab] = useState('customers');

  // Helper to normalize province strings
  const normalizeProvince = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\bprovince\b/gi, '').trim();
  };

  // Fetch Master Data
  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/staff/customers/analytics/master', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.success) {
        const d = res.data.data;
        setMasterData(d);

        // By default select all customer IDs, land IDs, proposal IDs
        const custIds = new Set((d.customers || []).map(c => c.customer_id));
        const landIds = new Set((d.lands || []).map(l => l.customer_land_id));
        const propIds = new Set((d.proposals || []).map(p => p.proposal_id));

        setSelectedCustomerIds(custIds);
        setSelectedLandIds(landIds);
        setSelectedProposalIds(propIds);
      } else {
        setError('Failed to load analytics master data');
      }
    } catch (err) {
      console.error('Error fetching analytics master data:', err);
      setError('Failed to fetch analytics dataset. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Filter Customers based on search and province
  const screenedCustomers = useMemo(() => {
    return (masterData.customers || []).filter(c => {
      const kw = searchKeyword.toLowerCase().trim();
      const matchesKeyword = !kw ||
        c.full_name?.toLowerCase().includes(kw) ||
        c.email?.toLowerCase().includes(kw) ||
        c.customer_id?.toLowerCase().includes(kw) ||
        c.nic_number?.includes(kw) ||
        c.phone_no_1?.includes(kw);

      const targetProv = normalizeProvince(selectedProvince);
      const custProv = normalizeProvince(c.province);

      // Also check if any land of customer matches province
      const custLands = (masterData.lands || []).filter(l => l.customer_id === c.customer_id);
      const landMatch = custLands.some(l => normalizeProvince(l.province) === targetProv);

      const matchesProvince = !selectedProvince || custProv === targetProv || landMatch;

      return matchesKeyword && matchesProvince;
    });
  }, [masterData.customers, masterData.lands, searchKeyword, selectedProvince]);

  const screenedCustomerIds = useMemo(() => {
    return new Set(screenedCustomers.map(c => c.customer_id));
  }, [screenedCustomers]);

  // Step 2: Filter Lands based on Selected Customers and Customer IDs
  const availableLands = useMemo(() => {
    return (masterData.lands || []).filter(l => {
      const belongsToScreenedCustomer = screenedCustomerIds.has(l.customer_id);
      const isCustomerSelected = selectedCustomerIds.has(l.customer_id);
      return belongsToScreenedCustomer && isCustomerSelected;
    });
  }, [masterData.lands, screenedCustomerIds, selectedCustomerIds]);

  const availableLandIds = useMemo(() => {
    return new Set(availableLands.map(l => l.customer_land_id));
  }, [availableLands]);

  // Step 3: Filter Proposals based on Selected Lands/Customers & Status Filter
  const availableProposals = useMemo(() => {
    return (masterData.proposals || []).filter(p => {
      const belongsToCustomer = selectedCustomerIds.has(p.customer_id);
      const belongsToLand = !p.customer_land_id || selectedLandIds.has(p.customer_land_id);

      const matchesStatus = !proposalStatusFilter || p.status === proposalStatusFilter;

      return belongsToCustomer && belongsToLand && matchesStatus;
    });
  }, [masterData.proposals, selectedCustomerIds, selectedLandIds, proposalStatusFilter]);

  const availableProposalIds = useMemo(() => {
    return new Set(availableProposals.map(p => p.proposal_id));
  }, [availableProposals]);

  // Step 4: Filter Projects (1:1 with selected proposals) & Status Filter
  const screenedProjects = useMemo(() => {
    return (masterData.projects || []).filter(prj => {
      const linkedToSelectedProposal = selectedProposalIds.has(prj.proposal_id);
      const matchesStatus = !projectStatusFilter || prj.status === projectStatusFilter;
      return linkedToSelectedProposal && matchesStatus;
    });
  }, [masterData.projects, selectedProposalIds, projectStatusFilter]);

  // Filter Payments linked to selected proposals
  const screenedPayments = useMemo(() => {
    return (masterData.payments || []).filter(pay => {
      return selectedProposalIds.has(pay.proposal_id);
    });
  }, [masterData.payments, selectedProposalIds]);

  // Actually Screened Lands (only those checked in selection)
  const screenedLands = useMemo(() => {
    return availableLands.filter(l => selectedLandIds.has(l.customer_land_id));
  }, [availableLands, selectedLandIds]);

  // Actually Screened Proposals
  const screenedProposals = useMemo(() => {
    return availableProposals.filter(p => selectedProposalIds.has(p.proposal_id));
  }, [availableProposals, selectedProposalIds]);

  // KPI Metrics Calculations
  const metrics = useMemo(() => {
    const customerCount = screenedCustomers.filter(c => selectedCustomerIds.has(c.customer_id)).length;
    const totalLandSize = screenedLands.reduce((acc, l) => acc + (Number(l.land_size) || 0), 0);
    const totalProposalValue = screenedProposals.reduce((acc, p) => acc + (Number(p.project_value) || 0), 0);
    const totalPayments = screenedPayments.reduce((acc, pay) => acc + (Number(pay.amount) || 0), 0);

    const ongoingProjects = screenedProjects.filter(p => p.status === 'Ongoing').length;
    const completedProjects = screenedProjects.filter(p => p.status === 'Completed').length;
    const yetToStartProjects = screenedProjects.filter(p => p.status === 'Yet To Start').length;

    return {
      customerCount,
      totalLandSize,
      totalProposalValue,
      totalPayments,
      ongoingProjects,
      completedProjects,
      yetToStartProjects
    };
  }, [screenedCustomers, selectedCustomerIds, screenedLands, screenedProposals, screenedPayments, screenedProjects]);

  // Toggle Handlers
  const toggleCustomer = (id) => {
    const next = new Set(selectedCustomerIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedCustomerIds(next);
  };

  const selectAllCustomers = () => {
    setSelectedCustomerIds(new Set(screenedCustomers.map(c => c.customer_id)));
  };

  const deselectAllCustomers = () => {
    setSelectedCustomerIds(new Set());
  };

  const toggleLand = (id) => {
    const next = new Set(selectedLandIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLandIds(next);
  };

  const selectAllLands = () => {
    setSelectedLandIds(new Set(availableLands.map(l => l.customer_land_id)));
  };

  const deselectAllLands = () => {
    setSelectedLandIds(new Set());
  };

  const toggleProposal = (id) => {
    const next = new Set(selectedProposalIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedProposalIds(next);
  };

  const selectAllProposals = () => {
    setSelectedProposalIds(new Set(availableProposals.map(p => p.proposal_id)));
  };

  const deselectAllProposals = () => {
    setSelectedProposalIds(new Set());
  };

  const handleResetAll = () => {
    setSearchKeyword('');
    setSelectedProvince('');
    setProposalStatusFilter('');
    setProjectStatusFilter('');
    setSelectedCustomerIds(new Set((masterData.customers || []).map(c => c.customer_id)));
    setSelectedLandIds(new Set((masterData.lands || []).map(l => l.customer_land_id)));
    setSelectedProposalIds(new Set((masterData.proposals || []).map(p => p.proposal_id)));
  };

  // PDF Export
  const handleExportScreenedPDF = async () => {
    try {
      setIsExportingPDF(true);
      const activeCustomers = screenedCustomers.filter(c => selectedCustomerIds.has(c.customer_id));
      await generateScreenedAnalyticsPDF({
        screenedCustomers: activeCustomers,
        screenedLands,
        screenedProposals,
        screenedProjects,
        screenedPayments,
        metrics,
        filterSummary: `Screened Customers: ${metrics.customerCount} | Province: ${selectedProvince || 'All'}`
      });
    } catch (err) {
      console.error('Error generating analytics PDF:', err);
      alert('Failed to generate PDF report.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Chart Configurations
  const proposalStatusChartData = {
    labels: ['Approved', 'Pending', 'Under Review', 'Rejected'],
    datasets: [
      {
        label: 'Proposals Count',
        data: [
          screenedProposals.filter(p => p.status === 'Approved').length,
          screenedProposals.filter(p => p.status === 'Pending').length,
          screenedProposals.filter(p => p.status === 'Under Review').length,
          screenedProposals.filter(p => p.status === 'Rejected').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const projectStatusChartData = {
    labels: ['Yet To Start', 'Ongoing', 'Completed'],
    datasets: [
      {
        label: 'Projects Count',
        data: [
          metrics.yetToStartProjects,
          metrics.ongoingProjects,
          metrics.completedProjects
        ],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  const formatLKR = (amount) => `LKR ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      <StaffHeader />

      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
              <Link to="/staff/customers" className="hover:underline flex items-center">
                <span>← Back to Customers</span>
              </Link>
              <span>/</span>
              <span className="text-gray-400">Master Analytics & Reports</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Customer Intelligence & Analytics</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                LIVE SCREENER
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Cascading relational dataset screener, visual charts & customized PDF report generator
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button
              onClick={handleResetAll}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition border border-gray-700 shadow-sm"
            >
              Reset Selection
            </button>
            <button
              onClick={handleExportScreenedPDF}
              disabled={isExportingPDF || loading}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition shadow-lg ${
                isExportingPDF || loading
                  ? 'bg-emerald-950 text-emerald-700 cursor-not-allowed border border-emerald-900'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-emerald-900/40'
              }`}
            >
              {isExportingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Generating PDF Report...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>Download Analytics Report (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 space-y-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-emerald-400"></div>
            <p className="text-gray-400 font-semibold text-sm">Loading relational analytics database...</p>
          </div>
        ) : (
          <>
            {/* KPI Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-850 p-5 rounded-2xl border border-gray-750 shadow-md">
                <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Screened Customers</span>
                  <span className="text-emerald-400 text-base">👥</span>
                </div>
                <div className="text-2xl font-black text-white">{metrics.customerCount}</div>
                <div className="text-xs text-gray-500 mt-1">out of {masterData.customers.length} total</div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-850 p-5 rounded-2xl border border-gray-750 shadow-md">
                <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Land Acreage</span>
                  <span className="text-emerald-400 text-base">🏞️</span>
                </div>
                <div className="text-2xl font-black text-emerald-400">{metrics.totalLandSize.toLocaleString()} <span className="text-xs font-normal text-gray-400">perches</span></div>
                <div className="text-xs text-gray-500 mt-1">{screenedLands.length} land parcels</div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-850 p-5 rounded-2xl border border-gray-750 shadow-md">
                <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Contract Value</span>
                  <span className="text-emerald-400 text-base">📜</span>
                </div>
                <div className="text-xl font-black text-amber-400 truncate" title={formatLKR(metrics.totalProposalValue)}>
                  {formatLKR(metrics.totalProposalValue)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{screenedProposals.length} proposals</div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-850 p-5 rounded-2xl border border-gray-750 shadow-md">
                <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Projects Active</span>
                  <span className="text-emerald-400 text-base">🚜</span>
                </div>
                <div className="text-2xl font-black text-blue-400">{metrics.ongoingProjects} <span className="text-xs font-semibold text-gray-400">/ {screenedProjects.length} total</span></div>
                <div className="text-xs text-gray-500 mt-1">{metrics.completedProjects} completed</div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-850 p-5 rounded-2xl border border-gray-750 shadow-md">
                <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Payments Collected</span>
                  <span className="text-emerald-400 text-base">💰</span>
                </div>
                <div className="text-xl font-black text-emerald-400 truncate" title={formatLKR(metrics.totalPayments)}>
                  {formatLKR(metrics.totalPayments)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{screenedPayments.length} transactions</div>
              </div>
            </div>

            {/* Cascading Multi-tier Selection Drawer */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl mb-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Cascading Hierarchical Screener</span>
                </span>
                <span className="text-xs font-normal text-gray-400">Selections propagate down 1:1 automatically</span>
              </h2>

              {/* Global Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-700">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Search Keyword</label>
                  <input
                    type="text"
                    placeholder="Search name, ID, email, phone..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Province Scope</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">All Provinces</option>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Proposal Status</label>
                  <select
                    value={proposalStatusFilter}
                    onChange={(e) => setProposalStatusFilter(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">All Proposal Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Project Status</label>
                  <select
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">All Project Statuses</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Yet To Start">Yet To Start</option>
                  </select>
                </div>
              </div>

              {/* 3 Tier Selection Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tier 1: Customers */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-750 flex flex-col h-72">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase text-emerald-400">1. Customers ({screenedCustomers.length})</span>
                    <div className="space-x-2 text-xs">
                      <button onClick={selectAllCustomers} className="text-emerald-400 hover:underline">All</button>
                      <span className="text-gray-600">|</span>
                      <button onClick={deselectAllCustomers} className="text-gray-400 hover:underline">None</button>
                    </div>
                  </div>
                  <div className="overflow-y-auto space-y-1.5 flex-grow pr-1 custom-scrollbar">
                    {screenedCustomers.map(c => {
                      const isChecked = selectedCustomerIds.has(c.customer_id);
                      return (
                        <label key={c.customer_id} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer text-xs transition ${isChecked ? 'bg-emerald-950/70 border border-emerald-800 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCustomer(c.customer_id)}
                            className="rounded accent-emerald-500"
                          />
                          <span className="font-semibold text-emerald-400">{c.customer_id}</span>
                          <span className="truncate">{c.full_name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Tier 2: Lands */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-750 flex flex-col h-72">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase text-emerald-400">2. Lands ({availableLands.length})</span>
                    <div className="space-x-2 text-xs">
                      <button onClick={selectAllLands} className="text-emerald-400 hover:underline">All</button>
                      <span className="text-gray-600">|</span>
                      <button onClick={deselectAllLands} className="text-gray-400 hover:underline">None</button>
                    </div>
                  </div>
                  <div className="overflow-y-auto space-y-1.5 flex-grow pr-1 custom-scrollbar">
                    {availableLands.length === 0 ? (
                      <div className="text-xs text-gray-500 italic p-4 text-center">No lands match selected customers</div>
                    ) : (
                      availableLands.map(l => {
                        const isChecked = selectedLandIds.has(l.customer_land_id);
                        return (
                          <label key={l.customer_land_id} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer text-xs transition ${isChecked ? 'bg-emerald-950/70 border border-emerald-800 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleLand(l.customer_land_id)}
                              className="rounded accent-emerald-500"
                            />
                            <span className="font-semibold text-emerald-400">{l.customer_land_id}</span>
                            <span className="truncate">{l.city || l.district} ({l.land_size}p)</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Tier 3: Proposals */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-750 flex flex-col h-72">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase text-emerald-400">3. Proposals & 1:1 Projects ({availableProposals.length})</span>
                    <div className="space-x-2 text-xs">
                      <button onClick={selectAllProposals} className="text-emerald-400 hover:underline">All</button>
                      <span className="text-gray-600">|</span>
                      <button onClick={deselectAllProposals} className="text-gray-400 hover:underline">None</button>
                    </div>
                  </div>
                  <div className="overflow-y-auto space-y-1.5 flex-grow pr-1 custom-scrollbar">
                    {availableProposals.length === 0 ? (
                      <div className="text-xs text-gray-500 italic p-4 text-center">No proposals match selected scope</div>
                    ) : (
                      availableProposals.map(p => {
                        const isChecked = selectedProposalIds.has(p.proposal_id);
                        return (
                          <label key={p.proposal_id} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer text-xs transition ${isChecked ? 'bg-emerald-950/70 border border-emerald-800 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProposal(p.proposal_id)}
                              className="rounded accent-emerald-500"
                            />
                            <span className="font-semibold text-emerald-400">{p.proposal_id}</span>
                            <span className="truncate">{p.project_type} ({p.status})</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-750 shadow-md">
                <h3 className="text-base font-bold text-white mb-4">Proposal Status Distribution</h3>
                <div className="h-64 flex justify-center">
                  <Pie data={proposalStatusChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-750 shadow-md">
                <h3 className="text-base font-bold text-white mb-4">Project Status Overview</h3>
                <div className="h-64">
                  <Bar data={projectStatusChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            {/* Screened Data Inspector Tabs */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-750 overflow-hidden shadow-xl mb-8">
              <div className="flex border-b border-gray-700 bg-gray-900/60 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`px-6 py-3 text-sm font-bold transition border-b-2 whitespace-nowrap ${
                    activeTab === 'customers'
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-950/40'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Screened Customers ({metrics.customerCount})
                </button>
                <button
                  onClick={() => setActiveTab('lands')}
                  className={`px-6 py-3 text-sm font-bold transition border-b-2 whitespace-nowrap ${
                    activeTab === 'lands'
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-950/40'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Registered Lands ({screenedLands.length})
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`px-6 py-3 text-sm font-bold transition border-b-2 whitespace-nowrap ${
                    activeTab === 'proposals'
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-950/40'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Proposals ({screenedProposals.length})
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-6 py-3 text-sm font-bold transition border-b-2 whitespace-nowrap ${
                    activeTab === 'projects'
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-950/40'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Projects ({screenedProjects.length})
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-6 py-3 text-sm font-bold transition border-b-2 whitespace-nowrap ${
                    activeTab === 'payments'
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-950/40'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Payments ({screenedPayments.length})
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                {/* CUSTOMERS TAB */}
                {activeTab === 'customers' && (
                  <table className="min-w-full divide-y divide-gray-700 text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold text-left">
                        <th className="py-3 px-4">Customer ID</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">NIC</th>
                        <th className="py-3 px-4">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {screenedCustomers
                        .filter(c => selectedCustomerIds.has(c.customer_id))
                        .map(c => (
                          <tr key={c.customer_id} className="hover:bg-gray-800/50">
                            <td className="py-3 px-4 font-bold text-emerald-400">{c.customer_id}</td>
                            <td className="py-3 px-4 font-semibold text-white">{c.full_name}</td>
                            <td className="py-3 px-4">{c.email}</td>
                            <td className="py-3 px-4">{c.phone_no_1 || 'N/A'}</td>
                            <td className="py-3 px-4">{c.nic_number || 'N/A'}</td>
                            <td className="py-3 px-4">{[c.city, c.district, c.province].filter(Boolean).join(', ') || 'N/A'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {/* LANDS TAB */}
                {activeTab === 'lands' && (
                  <table className="min-w-full divide-y divide-gray-700 text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold text-left">
                        <th className="py-3 px-4">Land ID</th>
                        <th className="py-3 px-4">Owner ID</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Climate Zone</th>
                        <th className="py-3 px-4">Shape</th>
                        <th className="py-3 px-4">Size (Perches)</th>
                        <th className="py-3 px-4">Soil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {screenedLands.map(l => (
                        <tr key={l.customer_land_id} className="hover:bg-gray-800/50">
                          <td className="py-3 px-4 font-bold text-emerald-400">{l.customer_land_id}</td>
                          <td className="py-3 px-4">{l.customer_id}</td>
                          <td className="py-3 px-4">{[l.city, l.district, l.province].filter(Boolean).join(', ')}</td>
                          <td className="py-3 px-4">{l.climate_zone || 'N/A'}</td>
                          <td className="py-3 px-4">{l.land_shape || 'N/A'}</td>
                          <td className="py-3 px-4 font-bold text-white">{l.land_size}</td>
                          <td className="py-3 px-4">{l.soil_type || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* PROPOSALS TAB */}
                {activeTab === 'proposals' && (
                  <table className="min-w-full divide-y divide-gray-700 text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold text-left">
                        <th className="py-3 px-4">Proposal ID</th>
                        <th className="py-3 px-4">Customer ID</th>
                        <th className="py-3 px-4">Project Type</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Contract Value</th>
                        <th className="py-3 px-4">Payment Mode</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {screenedProposals.map(p => (
                        <tr key={p.proposal_id} className="hover:bg-gray-800/50">
                          <td className="py-3 px-4 font-bold text-emerald-400">{p.proposal_id}</td>
                          <td className="py-3 px-4">{p.customer_id}</td>
                          <td className="py-3 px-4">{p.project_type}</td>
                          <td className="py-3 px-4">{p.project_duration} Yrs</td>
                          <td className="py-3 px-4 font-bold text-amber-400">{formatLKR(p.project_value)}</td>
                          <td className="py-3 px-4">{p.payment_mode}</td>
                          <td className="py-3 px-4 font-bold">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <table className="min-w-full divide-y divide-gray-700 text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold text-left">
                        <th className="py-3 px-4">Project ID</th>
                        <th className="py-3 px-4">Proposal Ref</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Progress %</th>
                        <th className="py-3 px-4">Start Date</th>
                        <th className="py-3 px-4">End Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {screenedProjects.map(prj => (
                        <tr key={prj.project_id} className="hover:bg-gray-800/50">
                          <td className="py-3 px-4 font-bold text-emerald-400">PRJ-{prj.project_id}</td>
                          <td className="py-3 px-4">{prj.proposal_id || 'N/A'}</td>
                          <td className="py-3 px-4 font-bold">{prj.status}</td>
                          <td className="py-3 px-4 font-bold text-blue-400">{prj.progress_percentage || 0}%</td>
                          <td className="py-3 px-4">{prj.start_date ? new Date(prj.start_date).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3 px-4">{prj.end_date ? new Date(prj.end_date).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* PAYMENTS TAB */}
                {activeTab === 'payments' && (
                  <table className="min-w-full divide-y divide-gray-700 text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase font-bold text-left">
                        <th className="py-3 px-4">Payment ID</th>
                        <th className="py-3 px-4">Proposal ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {screenedPayments.map(pay => (
                        <tr key={pay.payment_id} className="hover:bg-gray-800/50">
                          <td className="py-3 px-4 font-bold text-emerald-400">#PAY-{pay.payment_id}</td>
                          <td className="py-3 px-4">{pay.proposal_id}</td>
                          <td className="py-3 px-4">{pay.payment_date ? new Date(pay.payment_date).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">{formatLKR(pay.amount)}</td>
                          <td className="py-3 px-4">{pay.payment_detail || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <StaffFooter />
    </div>
  );
};

export default CustomerReportsAnalytics;
