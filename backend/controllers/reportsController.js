// controllers/reportsController.js
/**
 * Reports Controller
 * Handles real monthly reports and analytics from the database
 */

const db = require('../config/db');

/**
 * Get monthly reports data
 */
const getMonthlyReports = async (req, res) => {
  try {
    const { startDate: startDateReq, endDate: endDateReq } = req.query;

    const now = new Date();
    const defaultEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const defaultStart = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`;

    const startDateParam = startDateReq || defaultStart;
    const endDateParam = endDateReq || defaultEnd;

    const [startYear, startMonth] = startDateParam.split('-').map(Number);
    const [endYear, endMonth] = endDateParam.split('-').map(Number);

    const monthList = [];
    let y = startYear;
    let m = startMonth;

    while (y < endYear || (y === endYear && m <= endMonth)) {
      const monthStr = `${y}-${String(m).padStart(2, '0')}`;
      const isoString = `${monthStr}-01T00:00:00.000Z`;
      monthList.push({ monthKey: monthStr, isoString });

      m++;
      if (m > 12) {
        m = 1;
        y++;
      }
    }

    const startDateISO = `${startDateParam}T00:00:00.000Z`;
    const endDateISO = `${endDateParam}T23:59:59.999Z`;

    // 1. Overall Summary statistics
    const summaryRes = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM visitor) + (SELECT COUNT(*) FROM message) as total_visitors,
        (SELECT COUNT(*) FROM customer) as total_customers,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COALESCE(SUM(amount), 0) FROM payment WHERE payment_date >= :startDate AND payment_date <= :endDate) as total_revenue
    `, {
      replacements: { startDate: startDateISO, endDate: endDateISO },
      type: db.QueryTypes.SELECT
    });

    const summary = {
      totalVisitors: parseInt(summaryRes[0]?.total_visitors) || 0,
      totalCustomers: parseInt(summaryRes[0]?.total_customers) || 0,
      totalProjects: parseInt(summaryRes[0]?.total_projects) || 0,
      totalRevenue: parseFloat(summaryRes[0]?.total_revenue) || 0
    };

    // 2. Visitor-Customer Engagements
    const messagesRes = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
      FROM message
      WHERE created_at >= :startDate AND created_at <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    const visitorsRes = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
      FROM visitor
      WHERE created_at >= :startDate AND created_at <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    const customersRes = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
      FROM customer
      WHERE created_at >= :startDate AND created_at <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    const proposalsRes = await db.query(`
      SELECT TO_CHAR(proposal_date, 'YYYY-MM') as month, COUNT(*) as count
      FROM proposal
      WHERE proposal_date >= :startDate AND proposal_date <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    // 3. Sales performance
    const approvedProposalsRes = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
      FROM proposal
      WHERE status = 'Approved' AND created_at >= :startDate AND created_at <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    const shipmentsRes = await db.query(`
      SELECT TO_CHAR(shipment_date, 'YYYY-MM') as month, COALESCE(SUM(quantity), 0) as count
      FROM plant_shipment
      WHERE shipment_date >= :startDate AND shipment_date <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    // 4. Projects stats
    const newProjectsRes = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
      FROM projects
      WHERE created_at >= :startDate AND created_at <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    const completedProjectsRes = await db.query(`
      SELECT TO_CHAR(COALESCE(end_date, updated_at), 'YYYY-MM') as month, COUNT(*) as count
      FROM projects
      WHERE status = 'Completed' AND COALESCE(end_date, updated_at) >= :startDate AND COALESCE(end_date, updated_at) <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    const ongoingProjectsRes = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
      FROM projects
      WHERE status = 'Ongoing' AND created_at >= :startDate AND created_at <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    // 5. Inventory distribution
    const inventoryRes = await db.query(`
      SELECT inventory_id as id, item_name as name, quantity
      FROM inventory
      ORDER BY item_name ASC
    `, { type: db.QueryTypes.SELECT });

    // 6. Revenue & Profit
    const revenueRes = await db.query(`
      SELECT TO_CHAR(payment_date, 'YYYY-MM') as month, COALESCE(SUM(amount), 0) as amount
      FROM payment
      WHERE payment_date >= :startDate AND payment_date <= :endDate
      GROUP BY 1
    `, { replacements: { startDate: startDateISO, endDate: endDateISO }, type: db.QueryTypes.SELECT });

    // Build lookup maps for fast access
    const msgMap = {}; (messagesRes || []).forEach(r => msgMap[r.month] = parseInt(r.count) || 0);
    const visMap = {}; (visitorsRes || []).forEach(r => visMap[r.month] = parseInt(r.count) || 0);
    const cusMap = {}; (customersRes || []).forEach(r => cusMap[r.month] = parseInt(r.count) || 0);
    const propMap = {}; (proposalsRes || []).forEach(r => propMap[r.month] = parseInt(r.count) || 0);

    const appPropMap = {}; (approvedProposalsRes || []).forEach(r => appPropMap[r.month] = parseInt(r.count) || 0);
    const shipMap = {}; (shipmentsRes || []).forEach(r => shipMap[r.month] = parseInt(r.count) || 0);

    const newProjMap = {}; (newProjectsRes || []).forEach(r => newProjMap[r.month] = parseInt(r.count) || 0);
    const compProjMap = {}; (completedProjectsRes || []).forEach(r => compProjMap[r.month] = parseInt(r.count) || 0);
    const ongProjMap = {}; (ongoingProjectsRes || []).forEach(r => ongProjMap[r.month] = parseInt(r.count) || 0);

    const revMap = {}; (revenueRes || []).forEach(r => revMap[r.month] = parseFloat(r.amount) || 0);

    const visitorEngagements = monthList.map(m => ({
      month: m.isoString,
      visitors: (msgMap[m.monthKey] || 0) + (visMap[m.monthKey] || 0),
      customers: cusMap[m.monthKey] || 0,
      proposals: propMap[m.monthKey] || 0
    }));

    const sales = monthList.map(m => ({
      month: m.isoString,
      projectsSold: appPropMap[m.monthKey] || 0,
      plantsSold: shipMap[m.monthKey] || 0
    }));

    const projects = monthList.map(m => ({
      month: m.isoString,
      newProjects: newProjMap[m.monthKey] || 0,
      completedProjects: compProjMap[m.monthKey] || 0,
      ongoingProjects: ongProjMap[m.monthKey] || 0
    }));

    const revenue = monthList.map(m => ({
      month: m.isoString,
      amount: revMap[m.monthKey] || 0
    }));

    const profits = revenue.map(r => ({
      month: r.month,
      amount: Math.round(r.amount * 0.3 * 100) / 100
    }));

    const inventoryItems = (inventoryRes || []).map(row => ({
      id: row.id,
      name: row.name,
      quantity: parseFloat(row.quantity) || 0
    }));

    const reportData = {
      visitorEngagements,
      sales,
      projects,
      inventoryItems,
      revenue,
      profits,
      summary
    };

    res.json(reportData);
  } catch (error) {
    console.error('Error generating monthly reports:', error);
    res.status(500).json({
      error: 'Failed to generate monthly reports. Please try again later.'
    });
  }
};

module.exports = {
  getMonthlyReports
};

