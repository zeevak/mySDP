import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import { generateMonthlyReportsPDF } from '../../utils/monthlyReportsPdfService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyReports = () => {
  const [reportData, setReportData] = useState({
    visitorEngagements: [],
    sales: [],
    projects: [],
    inventoryItems: [],
    revenue: [],
    profits: [],
    summary: {
      totalVisitors: 0,
      totalCustomers: 0,
      totalProjects: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5001/api/admin/reports/monthly', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          }
        });

        setReportData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load report data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  };

  // Visitor-Customer Engagements Chart (Line Chart)
  const engagementChartData = {
    labels: reportData.visitorEngagements.map(item => format(new Date(item.month), 'MMM yyyy')),
    datasets: [
      {
        label: 'Visitor Visits',
        data: reportData.visitorEngagements.map(item => item.visitors),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Customer Registrations',
        data: reportData.visitorEngagements.map(item => item.customers),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Proposal Requests',
        data: reportData.visitorEngagements.map(item => item.proposals),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.1,
      }
    ],
  };

  // Sales Chart (Bar Chart)
  const salesChartData = {
    labels: reportData.sales.map(item => format(new Date(item.month), 'MMM yyyy')),
    datasets: [
      {
        label: 'Projects Sold',
        data: reportData.sales.map(item => item.projectsSold),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Plants Sold',
        data: reportData.sales.map(item => item.plantsSold),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Projects Chart (Bar Chart)
  const projectsChartData = {
    labels: reportData.projects.map(item => format(new Date(item.month), 'MMM yyyy')),
    datasets: [
      {
        label: 'New Projects',
        data: reportData.projects.map(item => item.newProjects),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
      },
      {
        label: 'Completed Projects',
        data: reportData.projects.map(item => item.completedProjects),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Ongoing Projects',
        data: reportData.projects.map(item => item.ongoingProjects),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Inventory Distribution (Pie Chart)
  const inventoryLabels = reportData.inventoryItems.map(item => item.name);
  const inventoryValues = reportData.inventoryItems.map(item => item.quantity);
  const inventoryChartData = {
    labels: inventoryLabels.length > 0 ? inventoryLabels : ['No Inventory Data'],
    datasets: [
      {
        data: inventoryValues.length > 0 ? inventoryValues : [1],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(14, 165, 233, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Revenue & Profits Chart (Line Chart)
  const financialChartData = {
    labels: reportData.revenue.map(item => format(new Date(item.month), 'MMM yyyy')),
    datasets: [
      {
        label: 'Revenue (LKR)',
        data: reportData.revenue.map(item => item.amount),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Profit (LKR)',
        data: reportData.profits.map(item => item.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        yAxisID: 'y',
      }
    ],
  };

  const financialChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: LKR ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Amount (LKR)'
        },
        ticks: {
          callback: function(value) {
            return 'LKR ' + value.toLocaleString();
          }
        }
      },
    },
  };

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const exportReport = async () => {
    try {
      setIsExporting(true);
      setError(null);
      setSuccessMessage(null);
      
      const success = await generateMonthlyReportsPDF(reportData, dateRange);
      
      if (!success) {
        throw new Error('PDF generation failed');
      }
      
      // Show success message
      setSuccessMessage('Monthly report exported successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <StaffHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Monthly Reports</h1>
          <p className="text-gray-600">Comprehensive analytics and insights for Susaru Agro operations</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter by Date Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={exportReport}
                disabled={isExporting}
                className={`w-full py-2 px-4 rounded-md transition-colors flex items-center justify-center ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Export PDF Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Visitor-Customer Engagements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Visitor-Customer Engagements</h2>
              <div className="h-96">
                <Line data={engagementChartData} options={chartOptions} />
              </div>
            </div>

            {/* Sales Analytics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Performance</h2>
              <div className="h-96">
                <Bar data={salesChartData} options={chartOptions} />
              </div>
            </div>

            {/* Projects Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Statistics</h2>
              <div className="h-96">
                <Bar data={projectsChartData} options={chartOptions} />
              </div>
            </div>

            {/* Two column layout for Inventory and Financial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventory Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Inventory Distribution</h2>
                <div className="h-80">
                  <Pie data={inventoryChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            if (!total) {
                              return `${context.label}: 0`;
                            }
                            const percentage = ((context.parsed * 100) / total).toFixed(1);
                            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
                          }
                        }
                      },
                    },
                  }} />
                </div>
              </div>

              {/* Revenue & Profits */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue & Profit Trends</h2>
                <div className="h-80">
                  <Line data={financialChartData} options={financialChartOptions} />
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-600">Total Visitors</h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {reportData.summary?.totalVisitors || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-600">Total Customers</h3>
                  <p className="text-2xl font-bold text-green-900">
                    {reportData.summary?.totalCustomers || 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-600">Total Projects</h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {reportData.summary?.totalProjects || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-600">Total Revenue</h3>
                  <p className="text-2xl font-bold text-yellow-900">
                    LKR {reportData.revenue.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <StaffFooter />
    </div>
  );
};

export default MonthlyReports;
