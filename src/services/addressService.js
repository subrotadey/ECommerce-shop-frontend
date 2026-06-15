// src/services/addressService.js
// All API calls for address management — uses axiosInstance (Firebase token auto-attached)

import axiosInstance from '../utils/axios';

const BASE = '/api/addresses';

// ── Get all addresses for logged-in user ────────────────────────────────────
export const fetchUserAddresses = async () => {
  const { data } = await axiosInstance.get(BASE);
  return data; // { success: true, addresses: [...] }
};

// ── Add a new address ────────────────────────────────────────────────────────
export const addAddress = async (addressData) => {
  const { data } = await axiosInstance.post(BASE, addressData);
  return data; // { success: true, address: {...} }
};

// ── Update an existing address ───────────────────────────────────────────────
export const updateAddress = async (addressId, addressData) => {
  const { data } = await axiosInstance.put(`${BASE}/${addressId}`, addressData);
  return data; // { success: true, address: {...} }
};

// ── Delete an address ────────────────────────────────────────────────────────
export const deleteAddress = async (addressId) => {
  const { data } = await axiosInstance.delete(`${BASE}/${addressId}`);
  return data; // { success: true, message: '...' }
};

// ── Set an address as default ────────────────────────────────────────────────
export const setDefaultAddress = async (addressId) => {
  const { data } = await axiosInstance.patch(`${BASE}/${addressId}/default`);
  return data; // { success: true, message: '...' }
};

export default {
  fetchUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};