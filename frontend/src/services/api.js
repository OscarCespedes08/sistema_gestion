import axios from 'axios';

// URL base para la API - usa URL relativa en producción
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Cliente API
export const getClients = () => axios.get(`${API_URL}/clients`);
export const getClientById = (id) => axios.get(`${API_URL}/clients/${id}`);
export const createClient = (clientData) => axios.post(`${API_URL}/clients`, clientData);
export const updateClient = (id, clientData) => axios.put(`${API_URL}/clients/${id}`, clientData);
export const deleteClient = (id) => axios.delete(`${API_URL}/clients/${id}`);

// Producto API
export const getProducts = () => axios.get(`${API_URL}/products`);
export const getProductById = (id) => axios.get(`${API_URL}/products/${id}`);
export const createProduct = (productData) => axios.post(`${API_URL}/products`, productData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateProduct = (id, productData) => axios.put(`${API_URL}/products/${id}`, productData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);
export const updateStock = (id, quantity) => axios.put(`${API_URL}/products/${id}/stock`, { quantity });

// Venta API
export const getSales = () => axios.get(`${API_URL}/sales`);
export const getSaleById = (id) => axios.get(`${API_URL}/sales/${id}`);
export const createSale = (saleData) => axios.post(`${API_URL}/sales`, saleData);
export const downloadInvoice = (id) => axios.get(`${API_URL}/sales/${id}/invoice`, { responseType: 'blob' });