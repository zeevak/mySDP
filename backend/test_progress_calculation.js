// Test script to verify progress calculation logic

console.log('Testing progress calculation logic...\n');

// Since calculateProgressPercentage is not exported, we'll copy it here
const calculateProgressPercentage = (startDate, endDate, status) => {
  if (status === 'Yet To Start') {
    return 0;
  }
  
  if (status === 'Completed') {
    return 100;
  }
  
  if (status === 'Ongoing' && startDate) {
    const start = new Date(startDate);
    const now = new Date();
    
    // If there's an end date, use it, otherwise estimate based on project duration
    if (endDate) {
      const end = new Date(endDate);
      const totalDuration = end.getTime() - start.getTime();
      const elapsedDuration = now.getTime() - start.getTime();
      
      if (elapsedDuration <= 0) return 0;
      if (elapsedDuration >= totalDuration) return 100;
      
      return Math.min(100, Math.max(0, Math.round((elapsedDuration / totalDuration) * 100)));
    } else {
      // For projects without end date, estimate based on elapsed time
      // Assume a typical agricultural project duration of 120 days (4 months)
      const estimatedDurationMs = 120 * 24 * 60 * 60 * 1000; // 120 days in milliseconds
      const elapsedDuration = now.getTime() - start.getTime();
      
      if (elapsedDuration <= 0) return 0;
      
      const percentage = Math.round((elapsedDuration / estimatedDurationMs) * 100);
      return Math.min(95, Math.max(0, percentage)); // Cap at 95% until completion
    }
  }
  
  return 0;
};

// Test cases
const testCases = [
  {
    name: 'Yet To Start project',
    startDate: null,
    endDate: null,
    status: 'Yet To Start',
    expected: 0
  },
  {
    name: 'Completed project',
    startDate: '2025-01-01',
    endDate: '2025-03-01',
    status: 'Completed',
    expected: 100
  },
  {
    name: 'Ongoing project - 50% through defined timeline',
    startDate: '2025-06-01', // 1 month ago
    endDate: '2025-08-01',   // 1 month from now
    status: 'Ongoing',
    expected: 50 // approximately
  },
  {
    name: 'Ongoing project - no end date, just started',
    startDate: '2025-06-20', // about 2 weeks ago
    endDate: null,
    status: 'Ongoing',
    expected: 12 // approximately (13 days / 120 days * 100 ≈ 11%)
  }
];

// Run tests
testCases.forEach((testCase, index) => {
  const result = calculateProgressPercentage(testCase.startDate, testCase.endDate, testCase.status);
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`  Start: ${testCase.startDate || 'N/A'}`);
  console.log(`  End: ${testCase.endDate || 'N/A'}`);
  console.log(`  Status: ${testCase.status}`);
  console.log(`  Result: ${result}%`);
  console.log(`  Expected: ${testCase.expected}%`);
  console.log(`  ✓ ${result >= testCase.expected - 5 && result <= testCase.expected + 5 ? 'PASS' : 'FAIL'}\n`);
});

console.log('Tests completed!');
