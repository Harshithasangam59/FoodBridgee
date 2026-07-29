// Mock API layer for demo – returns static data instead of calling a real backend.
const USE_MOCK = true;

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Fake data objects
const mockUser = {
  id: 1,
  name: "Demo User",
  email: "demo@example.com",
  role: "DONOR",
  token: "demo-token",
};

const mockMetrics = {
  totalMealsDonated: 1250,
  estimatedPeopleFed: 1250,
  co2SavedKg: 3125,
  ngosConnected: 50,
  totalDonations: 120,
  activeDonors: 35,
};

const mockDonations = [
  {
    id: 1,
    donor_id: 1,
    food_name: "Fresh Bread",
    quantity: "10 loaves",
    category: "veg",
    description: "Unsold bakery items",
    image: "/uploads/placeholder.png",
    pickup_deadline: "2026-08-01T12:00:00Z",
    location: "City Center",
    freshness_message: "Good for 2 days",
    status: "PENDING",
    created_at: "2026-07-20T09:00:00Z",
  },
];

const mockCsrReport = {
  totalMeals: 5000,
  totalValue: "$12,000",
  period: "All time",
};

const mockNotifications = [
  { id: 1, message: "Your donation was reserved", read: false },
];

const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('foodbridge_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
};

export const authAPI = {
  register: async (userData) => USE_MOCK ? ({ ...mockUser, ...userData }) : fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: async (creds) => USE_MOCK ? ({ token: mockUser.token, user: mockUser }) : fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  getMe: async () => USE_MOCK ? mockUser : fetchAPI('/auth/me', { method: 'GET' }),
};

export const donationAPI = {
  uploadImage: async (formData) => {
    if (USE_MOCK) return { url: "/uploads/placeholder.png" };
    const token = localStorage.getItem('foodbridge_token');
    const response = await fetch(`${API_BASE_URL}/donations/upload`, {
      method: 'POST',
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Image upload failed');
    return data;
  },
  createDonation: async (donationData) => USE_MOCK ? ({ ...donationData, id: Date.now(), status: "PENDING", created_at: new Date().toISOString() }) : fetchAPI('/donations', { method: 'POST', body: JSON.stringify(donationData) }),
  getAvailableDonations: async (filters = {}) => USE_MOCK ? mockDonations : fetchAPI('/donations/available', { method: 'GET' }),
  getMyDonations: async () => USE_MOCK ? mockDonations.filter((d) => d.donor_id === mockUser.id) : fetchAPI('/donations/my-donations', { method: 'GET' }),
  getNgoDashboard: async () => USE_MOCK ? ({ totalReceived: 200, pending: 15 }) : fetchAPI('/donations/ngo-dashboard', { method: 'GET' }),
  reserveDonation: async (id) => USE_MOCK ? ({ success: true, id }) : fetchAPI(`/donations/${id}/reserve`, { method: 'POST' }),
  markCollected: async (id) => USE_MOCK ? ({ success: true, id }) : fetchAPI(`/donations/${id}/collect`, { method: 'POST' }),
  getCsrReport: async (timeframe = 'all_time') => USE_MOCK ? mockCsrReport : fetchAPI(`/donations/csr-report?timeframe=${timeframe}`, { method: 'GET' }),
};

export const impactAPI = {
  getMetrics: async () => USE_MOCK
    ? { metrics: mockMetrics }
    : fetchAPI('/impact/metrics', { method: 'GET' }),
};

export const aiAPI = {
  getFreshnessEstimate: async (data) => USE_MOCK ? ({ freshnessScore: 85, message: "Food looks fresh" }) : fetchAPI('/ai/freshness', { method: 'POST', body: JSON.stringify(data) }),
};

export const notificationAPI = {
  getNotifications: async () => USE_MOCK ? mockNotifications : fetchAPI('/notifications', { method: 'GET' }),
  markRead: async (id) => USE_MOCK ? ({ success: true, id }) : fetchAPI(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: async () => USE_MOCK ? ({ success: true }) : fetchAPI('/notifications/read-all', { method: 'PUT' }),
};

