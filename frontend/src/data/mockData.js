// Mock data for the MATIKAI Enterprise platform

export const dashboardStats = {
  activeLeads: {
    value: 47,
    change: '+23.4% from last month',
    trend: 'up'
  },
  quantumRevenue: {
    value: '$847K',
    change: '+45.2% from last month',
    trend: 'up'
  },
  aiPredictions: {
    value: 342,
    change: '+87.1% from last month',
    trend: 'up'
  },
  installProjects: {
    value: 89,
    change: '+34.2% from last month',
    trend: 'up'
  }
};

export const revenueData = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 48000 },
  { month: 'Mar', value: 52000 },
  { month: 'Apr', value: 49000 },
  { month: 'May', value: 46000 },
  { month: 'Jun', value: 60000 }
];

export const marketSegments = [
  { label: 'Residential', value: 45, color: '#3b82f6' },
  { label: 'Commercial', value: 30, color: '#10b981' },
  { label: 'Industrial', value: 15, color: '#f59e0b' },
  { label: 'Public', value: 10, color: '#8b5cf6' }
];

export const aiAgents = [
  { name: 'Lead Scoring Agent', status: 'Active', accuracy: '94.2%' },
  { name: 'Quote Generator', status: 'Active', accuracy: '98.7%' },
  { name: 'Customer Service Bot', status: 'Active', accuracy: '91.3%' },
  { name: 'Market Analyzer', status: 'Standby', accuracy: '96.1%' }
];

export const systemStatus = {
  quantumAccuracy: '99.8%',
  activeAgents: 12,
  securityStatus: 'Enterprise Security',
  uptime: '99.9%'
};

export const leads = [
  {
    id: 1,
    name: 'Tesla Supercharger Network',
    company: 'Tesla Inc.',
    status: 'Hot Lead',
    value: '$2.4M',
    probability: '85%',
    nextAction: 'Site Survey Scheduled'
  },
  {
    id: 2,
    name: 'EV Charging Hub',
    company: 'ChargePoint',
    status: 'Qualified',
    value: '$890K',
    probability: '65%',
    nextAction: 'Proposal Preparation'
  },
  {
    id: 3,
    name: 'Fleet Charging Solution',
    company: 'Amazon Logistics',
    status: 'Discovery',
    value: '$1.8M',
    probability: '45%',
    nextAction: 'Technical Assessment'
  }
];

export const tasks = [
  {
    id: 1,
    title: 'Complete site assessment for Tesla project',
    priority: 'High',
    dueDate: '2025-09-25',
    assignee: 'John Smith',
    status: 'In Progress'
  },
  {
    id: 2,
    title: 'Prepare quantum quote for ChargePoint',
    priority: 'Medium',
    dueDate: '2025-09-27',
    assignee: 'Sarah Johnson',
    status: 'Pending'
  },
  {
    id: 3,
    title: 'Review Amazon fleet requirements',
    priority: 'High',
    dueDate: '2025-09-24',
    assignee: 'Mike Wilson',
    status: 'Review'
  }
];