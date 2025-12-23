// ============================================
// components/admin/SearchBar.jsx
// ============================================
import { Search } from 'lucide-react';

export const SearchBar = ({ 
    value, 
    onChange, 
    placeholder = 'Search...',
    className = '' 
}) => {
    return (
        <div className={`bg-white relative ${className}`}>
            <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={20} 
            />
            <input
                type="text"
                placeholder={placeholder}
                className="input input-bordered w-full pl-10"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};
