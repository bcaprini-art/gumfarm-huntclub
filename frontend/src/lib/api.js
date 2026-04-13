const BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('gumfarm_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (data) => request('/api/auth/register', { method: 'POST', body: data }),
  me: () => request('/api/auth/me'),
  signWaiver: () => request('/api/auth/waiver', { method: 'POST' }),

  // Bookings
  getBookings: () => request('/api/bookings'),
  getAvailability: (date, fieldId) => request(`/api/bookings/availability?date=${date}${fieldId ? `&fieldId=${fieldId}` : ''}`),
  createBooking: (data) => request('/api/bookings', { method: 'POST', body: data }),
  getBooking: (id) => request(`/api/bookings/${id}`),
  cancelBooking: (id) => request(`/api/bookings/${id}/cancel`, { method: 'PATCH' }),

  // Birds/Fields/Guides
  getInventory: () => request('/api/birds/inventory'),
  updateInventory: (species, qty) => request(`/api/birds/inventory/${species}`, { method: 'PATCH', body: { quantityOnHand: qty } }),
  getGuides: () => request('/api/birds/guides'),
  getFields: () => request('/api/birds/fields'),

  // Members
  getMembers: () => request('/api/members'),
  getMember: (id) => request(`/api/members/${id}`),
  updateMember: (id, data) => request(`/api/members/${id}`, { method: 'PATCH', body: data }),
  updateMemberBirds: (id, balance) => request(`/api/members/${id}/birds`, { method: 'PATCH', body: { seasonBirdBalance: balance } }),

  // Billing
  getMyPayments: () => request('/api/billing/my-payments'),
  getAllPayments: () => request('/api/billing/all'),
  recordCashPayment: (data) => request('/api/billing/pay-cash', { method: 'POST', body: data }),

  // Admin
  getAdminDashboard: () => request('/api/admin/dashboard'),
  updateBooking: (id, data) => request(`/api/admin/bookings/${id}`, { method: 'PATCH', body: data }),
  getAdminGuides: () => request('/api/admin/guides'),
  createGuide: (data) => request('/api/admin/guides', { method: 'POST', body: data }),
}
