// Mock API layer for demo – returns static data instead of calling a real backend.
const USE_MOCK = true;

// Helper to simulate async delay (optional)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Fake data objects
const mockUser = {
  id: 1,
  name: "Demo User",
  email: "demo@example.com",
  role: "DONOR",
  token: "demo-token",
};

const mockMetrics = {
  mealsSaved: 500,
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

if (USE_MOCK) {
  export const authAPI = {
    register: async (userData) => ({ ...mockUser, ...userData }),
    login: async (creds) => ({ token: mockUser.token, user: mockUser }),
    getMe: async () => mockUser,
  };

  export const donationAPI = {
    uploadImage: async (formData) => ({ url: "/uploads/placeholder.png" }),
    createDonation: async (donation) => ({
      ...donation,
      id: Date.now(),
      status: "PENDING",
      created_at: new Date().toISOString(),
    }),
    getAvailableDonations: async (filters = {}) => mockDonations,
    getMyDonations: async () => mockDonations.filter((d) => d.donor_id === mockUser.id),
    getNgoDashboard: async () => ({ totalReceived: 200, pending: 15 }),
    reserveDonation: async (id) => ({ success: true, id }),
    markCollected: async (id) => ({ success: true, id }),
    getCsrReport: async (timeframe) => mockCsrReport,
  };

  export const impactAPI = {
    getMetrics: async () => mockMetrics,
  };

  export const aiAPI = {
    getFreshnessEstimate: async (data) => ({ freshnessScore: 85, message: "Food looks fresh" }),
  };

  export const notificationAPI = {
    getNotifications: async () => mockNotifications,
    markRead: async (id) => ({ success: true, id }),
    markAllRead: async () => ({ success: true }),
  };
} else {
  // Real implementation
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
    register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => fetchAPI('/auth/me', { method: 'GET' }),
  };

  export const donationAPI = {
    uploadImage: async (formData) => {
      const token = localStorage.getItem('foodbridge_token');
      const response = await fetch(`${API_BASE_URL}/donations/upload`, {
        method: 'POST',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }
      return data;
    },
    createDonation: (donationData) => fetchAPI('/donations', { method: 'POST', body: JSON.stringify(donationData) }),
    getAvailableDonations: (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.foodType) params.append('foodType', filters.foodType);
      if (filters.location) params.append('location', filters.location);
      const queryString = params.toString();
      return fetchAPI(`/donations/available${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
    },
    getMyDonations: () => fetchAPI('/donations/my-donations', { method: 'GET' }),
    getNgoDashboard: () => fetchAPI('/donations/ngo-dashboard', { method: 'GET' }),
    reserveDonation: (id) => fetchAPI(`/donations/${id}/reserve`, { method: 'POST' }),
    markCollected: (id) => fetchAPI(`/donations/${id}/collect`, { method: 'POST' }),
    getCsrReport: (timeframe = 'all_time') => fetchAPI(`/donations/csr-report?timeframe=${timeframe}`, { method: 'GET' }),
  };

  export const impactAPI = {
    getMetrics: () => fetchAPI('/impact/metrics', { method: 'GET' }),
  };

  export const aiAPI = {
    getFreshnessEstimate: (data) => fetchAPI('/ai/freshness', { method: 'POST', body: JSON.stringify(data) }),
  };

  export const notificationAPI = {
    getNotifications: () => fetchAPI('/notifications', { method: 'GET' }),
    markRead: (id) => fetchAPI(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => fetchAPI('/notifications/read-all', { method: 'PUT' }),
  };
}
