// src/hooks/useAddresses.js
import { useState, useEffect, useCallback } from 'react';
import {
  fetchUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/addressService';

const useAddresses = () => {
  const [addresses, setAddresses]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserAddresses();
      setAddresses(data.addresses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAddresses(); }, [loadAddresses]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAdd = async (addressData) => {
    try {
      setSubmitting(true);
      const result = await addAddress(addressData);
      setAddresses((prev) => [...prev, result.address]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async (id, addressData) => {
    try {
      setSubmitting(true);
      const result = await updateAddress(id, addressData);
      setAddresses((prev) =>
        prev.map((a) => (a.id === id ? result.address : a))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ── Set default ───────────────────────────────────────────────────────────
  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    addresses,
    loading,
    error,
    submitting,
    reload: loadAddresses,
    addAddress:    handleAdd,
    updateAddress: handleUpdate,
    deleteAddress: handleDelete,
    setDefault:    handleSetDefault,
  };
};

export default useAddresses;