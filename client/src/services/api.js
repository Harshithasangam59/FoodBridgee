const API_BASE_URL = '/api';

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
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getMe: () => fetchAPI('/auth/me', {
    method: 'GET',
  }),
};

export const donationAPI = {
  createDonation: (donationData) => fetchAPI('/donations', {
    method: 'POST',
    body: JSON.stringify(donationData),
  }),

  getAvailableDonations: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.foodType) params.append('foodType', filters.foodType);
    if (filters.location) params.append('location', filters.location);

    const queryString = params.toString();
    return fetchAPI(`/donations/available${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  getMyDonations: () => fetchAPI('/donations/my-donations', {
    method: 'GET',
  }),

  getNgoDashboard: () => fetchAPI('/donations/ngo-dashboard', {
    method: 'GET',
  }),

  reserveDonation: (id) => fetchAPI(`/donations/${id}/reserve`, {
    method: 'POST',
  }),

  markCollected: (id) => fetchAPI(`/donations/${id}/collect`, {
    method: 'POST',
  }),

  getCsrReport: (timeframe = 'all_time') => fetchAPI(`/donations/csr-report?timeframe=${timeframe}`, {
    method: 'GET',
  }),
};

export const impactAPI = {
  getMetrics: () => fetchAPI('/impact/metrics', {
    method: 'GET',
  }),
};

export const aiAPI = {
  getFreshnessEstimate: (data) => fetchAPI('/ai/freshness', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const notificationAPI = {
  getNotifications: () => fetchAPI('/notifications', {
    method: 'GET',
  }),

  markRead: (id) => fetchAPI(`/notifications/${id}/read`, {
    method: 'PUT',
  }),

  markAllRead: () => fetchAPI('/notifications/read-all', {
    method: 'PUT',
  }),
};
