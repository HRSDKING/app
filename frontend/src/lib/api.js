import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = {
  // Properties
  getProperties: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.is_new_launch !== undefined) params.append('is_new_launch', filters.is_new_launch);
    if (filters.status) params.append('status', filters.status);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    
    const response = await axios.get(`${API}/properties?${params.toString()}`);
    return response.data;
  },

  getNewLaunches: async () => {
    const response = await axios.get(`${API}/properties/new-launches`);
    return response.data;
  },

  getFeaturedProperties: async () => {
    const response = await axios.get(`${API}/properties/featured`);
    return response.data;
  },

  getProperty: async (slug) => {
    const response = await axios.get(`${API}/properties/${slug}`);
    return response.data;
  },

  // Contact
  submitContact: async (data) => {
    const response = await axios.post(`${API}/contact`, data);
    return response.data;
  },

  // Company Info
  getCompanyInfo: async () => {
    const response = await axios.get(`${API}/company-info`);
    return response.data;
  },
};
