// ============================================
// pages/admin/Staff.jsx
// ============================================
import { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Mail, Phone, Calendar, X, Eye } from 'lucide-react';

const Staff = () => {
    const [staff, setStaff] = useState([
        {
            id: 1,
            name: 'John Smith',
            email: 'john@anisabaya.com',
            phone: '+1 (555) 111-2222',
            role: 'admin',
            department: 'Management',
            joinDate: '2022-01-15',
            status: 'active',
            permissions: ['all']
        },
        {
            id: 2,
            name: 'Alice Johnson',
            email: 'alice@anisabaya.com',
            phone: '+1 (555) 333-4444',
            role: 'manager',
            department: 'Operations',
            joinDate: '2022-06-20',
            status: 'active',
            permissions: ['products', 'orders', 'customers']
        },
        {
            id: 3,
            name: 'Bob Williams',
            email: 'bob@anisabaya.com',
            phone: '+1 (555) 555-6666',
            role: 'staff',
            department: 'Sales',
            joinDate: '2023-03-10',
            status: 'active',
            permissions: ['orders', 'customers']
        },
        {
            id: 4,
            name: 'Carol Davis',
            email: 'carol@anisabaya.com',
            phone: '+1 (555) 777-8888',
            role: 'staff',
            department: 'Marketing',
            joinDate: '2023-08-05',
            status: 'inactive',
            permissions: ['products', 'analytics']
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const roles = ['all', 'admin', 'manager', 'staff'];
    const departments = ['Management', 'Operations', 'Sales', 'Marketing', 'Support'];
    const allPermissions = ['products', 'orders', 'customers', 'analytics', 'categories', 'coupons', 'reviews', 'staff', 'settings'];

    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role) => {
        const colors = {
            admin: 'badge-error',
            manager: 'badge-warning',
            staff: 'badge-info',
        };
        return colors[role];
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'badge-success' : 'badge-ghost';
    };

    const deleteStaff = (id) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
            setStaff(staff.filter(s => s.id !== id));
        }
    };

    const StaffModal = ({ staffMember, onClose }) => {
        const [formData, setFormData] = useState(staffMember || {
            name: '',
            email: '',
            phone: '',
            role: 'staff',
            department: 'Sales',
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active',
            permissions: []
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (staffMember) {
                setStaff(staff.map(s => s.id === staffMember.id ? { ...formData, id: staffMember.id } : s));
            } else {
                setStaff([...staff, { ...formData, id: Date.now() }]);
            }
            onClose();
        };

        const togglePermission = (permission) => {
            if (formData.permissions.includes(permission)) {
                setFormData({
                    ...formData,
                    permissions: formData.permissions.filter(p => p !== permission)
                });
            } else {
                setFormData({
                    ...formData,
                    permissions: [...formData.permissions, permission]
                });
            }
        };

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">
                            {staffMember ? 'Edit Staff Member' : 'Add New Staff Member'}
                        </h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text font-medium">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Email</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Phone</span>
                                </label>
                                <input
                                    type="tel"
                                    className="input input-bordered"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Role</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    {roles.filter(r => r !== 'all').map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Department</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.department}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Join Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={formData.joinDate}
                                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Status</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Permissions</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {allPermissions.map(permission => (
                                    <label key={permission} className="label cursor-pointer justify-start gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={formData.permissions.includes(permission)}
                                            onChange={() => togglePermission(permission)}
                                        />
                                        <span className="label-text capitalize">{permission}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={onClose} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {staffMember ? 'Update' : 'Add'} Staff Member
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const StaffDetailsModal = ({ staffMember, onClose }) => {
        if (!staffMember) return null;

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl">Staff Details</h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {staffMember.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">{staffMember.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`badge ${getRoleColor(staffMember.role)}`}>
                                        {staffMember.role}
                                    </span>
                                    <span className={`badge ${getStatusColor(staffMember.status)}`}>
                                        {staffMember.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-900">{staffMember.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-900">{staffMember.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-900">{staffMember.department}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-900">Joined {staffMember.joinDate}</span>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold text-gray-900 mb-3">Permissions</h5>
                            <div className="flex flex-wrap gap-2">
                                {staffMember.permissions.includes('all') ? (
                                    <span className="badge badge-primary">All Permissions</span>
                                ) : (
                                    staffMember.permissions.map(permission => (
                                        <span key={permission} className="badge badge-ghost capitalize">
                                            {permission}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button onClick={onClose} className="btn">Close</button>
                        <button
                            onClick={() => {
                                onClose();
                                setEditingStaff(staffMember);
                                setShowModal(true);
                            }}
                            className="btn btn-primary"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-600 mt-1">Manage your team members and permissions</p>
                </div>
                <button
                    onClick={() => {
                        setEditingStaff(null);
                        setShowModal(true);
                    }}
                    className="btn btn-primary btn-sm gap-2"
                >
                    <Plus size={16} />
                    Add Staff Member
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{staff.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {staff.filter(s => s.role === 'admin').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Managers</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {staff.filter(s => s.role === 'manager').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {staff.filter(s => s.status === 'active').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search staff by name or email..."
                                className="input input-bordered w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="select select-bordered"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>
                                {role === 'all' ? 'All Roles' : role}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Staff Member</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map((member) => (
                                <tr key={member.id} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{member.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="text-gray-900">{member.email}</div>
                                            <div className="text-gray-500">{member.phone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${getRoleColor(member.role)} badge-sm`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="text-gray-600">{member.department}</td>
                                    <td className="text-gray-600 text-sm">{member.joinDate}</td>
                                    <td>
                                        <span className={`badge ${getStatusColor(member.status)} badge-sm`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedStaff(member)}
                                                className="btn btn-ghost btn-xs"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingStaff(member);
                                                    setShowModal(true);
                                                }}
                                                className="btn btn-ghost btn-xs"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteStaff(member.id)}
                                                className="btn btn-ghost btn-xs text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <StaffModal
                    staffMember={editingStaff}
                    onClose={() => {
                        setShowModal(false);
                        setEditingStaff(null);
                    }}
                />
            )}

            {/* Details Modal */}
            {selectedStaff && (
                <StaffDetailsModal
                    staffMember={selectedStaff}
                    onClose={() => setSelectedStaff(null)}
                />
            )}
        </div>
    );
};

export default Staff;