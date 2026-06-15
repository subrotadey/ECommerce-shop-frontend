// src/components/Address/AddressCard.jsx
import React from 'react';
import { MapPin, Phone, Edit2, Trash2, Star, CheckCircle } from 'lucide-react';

const LABEL_META = {
  home:      { color: 'bg-blue-50 text-blue-700 border-blue-200',  icon: '🏠' },
  work:      { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '💼' },
  warehouse: { color: 'bg-amber-50 text-amber-700 border-amber-200',   icon: '🏭' },
  other:     { color: 'bg-gray-50 text-gray-700 border-gray-200',   icon: '📍' },
};

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  const meta = LABEL_META[address.label] || LABEL_META.other;

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 p-5 transition-all hover:shadow-md ${
        address.isDefault
          ? 'border-green-400 shadow-sm shadow-green-100'
          : 'border-gray-100'
      }`}
    >
      {/* Default badge */}
      {address.isDefault && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
          <CheckCircle size={11} />
          Default
        </div>
      )}

      {/* Label */}
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${meta.color}`}>
        <span>{meta.icon}</span>
        <span className="capitalize">{address.label}</span>
      </div>

      {/* Name */}
      <p className="font-semibold text-gray-900 text-base mb-1">{address.fullName}</p>

      {/* Address lines */}
      <div className="flex items-start gap-2 text-sm text-gray-600 mb-1">
        <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
        <span>
          {address.street}
          {address.aptNumber && `, Apt ${address.aptNumber}`}
        </span>
      </div>
      <p className="text-sm text-gray-600 pl-5">
        {address.city}, {address.state} {address.zipCode}
      </p>
      <p className="text-sm text-gray-600 pl-5">{address.country}</p>

      {/* Phone */}
      {address.phone && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <Phone size={14} className="text-gray-400 flex-shrink-0" />
          <span>{address.phone}</span>
        </div>
      )}

      {/* Delivery note */}
      {address.deliveryNote && (
        <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded-lg">
          📝 {address.deliveryNote}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
          >
            <Star size={13} />
            Set Default
          </button>
        )}
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
        >
          <Edit2 size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors ml-auto"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;