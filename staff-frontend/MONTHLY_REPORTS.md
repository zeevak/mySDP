# Monthly Reports Dashboard

## Overview
The Monthly Reports feature provides comprehensive analytics and insights for Susaru Agro operations. It includes interactive charts and date filtering capabilities to help administrators track business performance over time.

## Features

### 📊 **Chart Types**
- **Line Charts**: Visitor-customer engagements, Revenue & Profit trends
- **Bar Charts**: Sales performance, Project statistics
- **Pie Chart**: Current inventory distribution

### 📈 **Analytics Categories**

1. **Visitor-Customer Engagements**
   - Visitor visits over time
   - Customer registrations
   - Proposal requests

2. **Sales Performance**
   - Projects sold
   - Plants sold

3. **Project Statistics**
   - New projects
   - Completed projects
   - Ongoing projects

4. **Inventory Distribution**
   - Agarwood plants
   - Compost
   - Tools & equipment
   - Other supplies

5. **Financial Metrics**
   - Revenue trends (LKR)
   - Profit margins (LKR)

### 🔍 **Date Range Filtering**
- Select custom start and end dates
- Default view shows last 6 months
- Real-time chart updates when date range changes

### 📋 **Summary Statistics**
- Total visitors count
- New customers registered
- Total projects initiated
- Total revenue generated

## Technical Implementation

### Frontend Components
- **MonthlyReports.jsx**: Main component with charts and filtering
- **Chart.js + react-chartjs-2**: Chart rendering library
- **date-fns**: Date manipulation utilities

### Backend API
- **Endpoint**: `GET /api/admin/reports/monthly`
- **Parameters**: 
  - `startDate` (optional): Filter start date
  - `endDate` (optional): Filter end date
- **Authentication**: Admin role required

### Database Integration
- Queries multiple tables for comprehensive data
- Fallback sample data if tables don't exist
- Error handling for database connectivity issues

## Usage

### Access Requirements
- Admin role authentication required
- Access via: Admin Dashboard → Monthly Reports

### Navigation
1. Login as Admin
2. Go to Admin Dashboard
3. Click "Monthly Reports" button
4. Use date filters to customize view
5. Export reports (feature to be implemented)

### Chart Interactions
- Hover over data points for detailed tooltips
- Toggle legend items to show/hide data series
- Responsive design adapts to screen size

## Data Sources

The reports aggregate data from:
- Customer registrations
- Visitor logs
- Project records
- Inventory management
- Proposal submissions
- Sales transactions

## Export Functionality
- PDF export button available (to be implemented)
- Will generate formatted reports with company branding

## Error Handling
- Graceful fallback to sample data if database issues occur
- Loading states during data fetching
- Error messages for failed requests

## Future Enhancements
- PDF/Excel export functionality
- More granular filtering options
- Additional chart types
- Real-time data updates
- Comparison views (year-over-year, etc.)
