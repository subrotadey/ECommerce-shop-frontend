import { Calendar, Mail, Phone, UserCircle } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import avatar from "../../../assets/icons/user.svg"
import useCart from '../../../hooks/useCart';

const AccountInfo = () => {
    const { user } = useAuth();
    const { email, displayName } = user || {};

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
            <div className="card shadow-md">
                <div className="card-body">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="avatar placeholder">
                            <div className="avatar bg-transparent text-primary-content rounded-full w-24 ">
                                <img src={user?.photoURL || avatar} alt="profile" />
                            </div>
                        </div>
                        <button className="btn btn-outline btn-sm">Change Photo</button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <UserCircle className="w-5 h-5 text-gray-500" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-semibold">{displayName}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Edit</button>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">{email}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Edit</button>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-semibold">+880 1234-567890</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Edit</button>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Member Since</p>
                                <p className="font-semibold">January 2024</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-6">
                        <button className="btn btn-outline">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;