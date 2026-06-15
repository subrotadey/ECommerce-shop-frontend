// src/components/Address/AddressList.jsx
import React, { useState } from 'react';
import { Plus, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import useAddresses from '../../hooks/useAddresses';

const AddressList = ({ currentUser }) => {
  const {
    addresses, loading, error, submitting,
    reload, addAddress, updateAddress, deleteAddress, setDefault,
  } = useAddresses();

  const [showForm, setShowForm]       = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [toast, setToast]             = useState(null);
  const [deleting, setDeleting]       = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (formData) => {
    const result = editingAddr
      ? await updateAddress(editingAddr.id, formData)
      : await addAddress(formData);

    if (result.success) {
      showToast(editingAddr ? 'Address updated successfully!' : 'Address added successfully!');
      setShowForm(false);
      setEditingAddr(null);
    } else {
      showToast(result.error || 'Something went wrong', 'error');
    }
  };

  const handleEdit = (address) => {
    setEditingAddr(address);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    setDeleting(id);
    const result = await deleteAddress(id);
    setDeleting(null);
    if (result.success) {
      showToast('Address deleted');
    } else {
      showToast(result.error || 'Failed to delete', 'error');
    }
  };

  const handleSetDefault = async (id) => {
    const result = await setDefault(id);
    if (result.success) {
      showToast('Default address updated!');
    } else {
      showToast(result.error || 'Failed to update', 'error');
    }
  };

  const openAddForm = () => {
    setEditingAddr(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-blue-600" size={22} />
            My Addresses
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your saved delivery addresses
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={17} />
          Add Address
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-green-600 text-white'
          }`}
        >
          {toast.type === 'error' ? '✗' : '✓'} {toast.message}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading addresses…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle size={18} />
          <p className="text-sm flex-1">{error}</p>
          <button
            onClick={reload}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <MapPin className="text-blue-400" size={28} />
          </div>
          <div>
            <p className="text-gray-800 font-semibold">No saved addresses</p>
            <p className="text-gray-500 text-sm mt-1">
              Add a delivery address to speed up your checkout.
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Your First Address
          </button>
        </div>
      )}

      {/* Address grid */}
      {!loading && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className={deleting === address.id ? 'opacity-50 pointer-events-none' : ''}>
              <AddressCard
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            </div>
          ))}
        </div>
      )}

      {/* Limit hint */}
      {addresses.length >= 5 && (
        <p className="text-center text-xs text-gray-400">
          Maximum 5 addresses saved. Delete one to add a new address.
        </p>
      )}

      {/* Form modal */}
      {showForm && (
        <AddressForm
          initialData={editingAddr}
          currentUser={currentUser}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingAddr(null); }}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default AddressList;