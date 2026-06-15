// src/components/Address/AddressForm.jsx
import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, Save, Loader } from 'lucide-react';
import { validateAddress, ADDRESS_LABELS, TIME_PREFERENCES, US_STATES } from '../../utils/addressValidation';

const EMPTY_FORM = {
  fullName:        '',
  phone:           '',
  altPhone:        '',
  street:          '',
  aptNumber:       '',
  city:            '',
  state:           '',
  zipCode:         '',
  country:         'United States',
  label:           'home',
  isDefault:       false,
  deliveryNote:    '',
  landmark:        '',
  timePreference:  '',
};

const InputField = ({ label, name, value, onChange, error, required, type = 'text', placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const AddressForm = ({ initialData = null, onSave, onCancel, submitting = false, currentUser = null }) => {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({ ...EMPTY_FORM, ...initialData });
    } else if (currentUser) {
      setForm((prev) => ({
        ...prev,
        fullName: currentUser.displayName || '',
        phone:    currentUser.phoneNumber  || '',
      }));
    }
  }, [initialData, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateAddress(form);
    if (!isValid) {
      setErrors(validationErrors);
      // scroll to first error
      const firstErr = document.querySelector('.border-red-400');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              {initialData ? 'Edit Address' : 'Add New Address'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* — Address Type — */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Address Type <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {ADDRESS_LABELS.map((lbl) => (
                <label
                  key={lbl.value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${
                    form.label === lbl.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="label"
                    value={lbl.value}
                    checked={form.label === lbl.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <i className={`ti ${lbl.icon}`} aria-hidden="true" />
                  {lbl.label}
                </label>
              ))}
            </div>
            {errors.label && <p className="mt-1 text-xs text-red-600">{errors.label}</p>}
          </div>

          {/* — Contact — */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Contact</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Full Name" name="fullName" value={form.fullName}
                onChange={handleChange} error={errors.fullName}
                required placeholder="Jane Smith"
              />
              <InputField
                label="Phone Number" name="phone" value={form.phone}
                onChange={handleChange} error={errors.phone}
                required type="tel" placeholder="+1 (555) 000-0000"
              />
              <InputField
                label="Alternate Phone" name="altPhone" value={form.altPhone}
                onChange={handleChange} error={errors.altPhone}
                type="tel" placeholder="+1 (555) 000-0001"
              />
            </div>
          </div>

          {/* — Address — */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Address</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField
                  label="Street Address" name="street" value={form.street}
                  onChange={handleChange} error={errors.street}
                  required placeholder="123 Main Street"
                />
              </div>
              <InputField
                label="Apt / Suite / Unit" name="aptNumber" value={form.aptNumber}
                onChange={handleChange} placeholder="Apt 4B"
              />
              <InputField
                label="City" name="city" value={form.city}
                onChange={handleChange} error={errors.city}
                required placeholder="New York"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all ${
                    errors.state ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
              </div>
              <InputField
                label="ZIP Code" name="zipCode" value={form.zipCode}
                onChange={handleChange} error={errors.zipCode}
                required placeholder="10001"
              />
              <InputField
                label="Country" name="country" value={form.country}
                onChange={handleChange} error={errors.country}
                required placeholder="United States"
              />
            </div>
          </div>

          {/* — Delivery Details (optional) — */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
              Delivery Details <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </h3>
            <div className="space-y-4">
              <InputField
                label="Nearest Landmark" name="landmark" value={form.landmark}
                onChange={handleChange} placeholder="Near Central Park subway station"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Delivery Instructions
                </label>
                <textarea
                  name="deliveryNote"
                  value={form.deliveryNote}
                  onChange={handleChange}
                  maxLength={300}
                  rows={3}
                  placeholder="Leave at front door, ring bell twice..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-right text-xs text-gray-400 mt-1">
                  {form.deliveryNote.length}/300
                </p>
              </div>

              {/* Time preference */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preferred Delivery Time</p>
                <div className="flex gap-2 flex-wrap">
                  {TIME_PREFERENCES.map((t) => (
                    <label
                      key={t.value}
                      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 cursor-pointer text-xs font-medium transition-all min-w-[90px] ${
                        form.timePreference === t.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="timePreference"
                        value={t.value}
                        checked={form.timePreference === t.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-base">{t.value === 'morning' ? '🌅' : t.value === 'afternoon' ? '☀️' : '🌙'}</span>
                      <span>{t.label}</span>
                      <span className="text-gray-400 font-normal">{t.time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* — Default toggle — */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Set as Default Address</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Use this address as the default for future orders
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-sm ${
              submitting
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
            }`}
          >
            {submitting ? (
              <><Loader className="animate-spin" size={16} /> Saving...</>
            ) : (
              <><Save size={16} /> {initialData ? 'Update Address' : 'Save Address'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;