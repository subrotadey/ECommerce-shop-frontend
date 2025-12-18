import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { ShoppingCart, Home, User, LogOut } from 'lucide-react';
import bgImg from "../../../assets/images/bgImg.png";
import useAuth from '../../../hooks/useAuth';
import AccountInfo from '../DashboardComponent/AccountInfo';
import Addresses from '../DashboardComponent/Addresses';
import Orders from '../DashboardComponent/Orders';
import useCart from '../../../hooks/useCart';

export default function UserDashboard() {
    const [activeSection, setActiveSection] = useState('orders');
    const navigate = useNavigate(); // Add this hook

    const { clearCart } = useCart();
    const { logOut } = useAuth();

    const menuItems = [
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'addresses', label: 'Addresses', icon: Home },
        { id: 'account', label: 'Account Info', icon: User },
        { id: 'logout', label: 'Log Out', icon: LogOut }
    ];

    const handleLogOut = async () => {
        try {
            clearCart();
            await logOut();
            navigate('/');
            
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'orders':
                return <Orders />;

            case 'addresses':
                return <Addresses />;

            case 'account':
                return <AccountInfo />;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Title */}
            <div className="relative bg-linear-to-r from-gray-800 to-gray-900 text-white py-16">
                <div className="absolute inset-0 opacity-50">
                    <div
                        className="bg-cover bg-center h-full w-full"
                        style={{ backgroundImage: `url(${bgImg})` }}
                    ></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-center">MY ACCOUNT</h1>
                </div>
            </div>

            {/* Fixed Menu Section */}
            <div className="sticky top-0 z-40 bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.id === 'logout') {
                                            handleLogOut();
                                        } else {
                                            setActiveSection(item.id);
                                        }
                                    }}
                                    className={`btn btn-lg h-auto py-6 flex-col gap-2 ${
                                        activeSection === item.id && item.id !== 'logout'
                                            ? 'btn-primary'
                                            : 'btn-ghost hover:bg-gray-100 text-gray-700'
                                    } ${item.id === 'logout' ? 'hover:text-error' : ''}`}
                                >
                                    <Icon className="w-8 h-8" />
                                    <span className="text-sm font-semibold">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Dynamic Content Section */}
            <div className="container mx-auto px-4 py-8">
                {renderContent()}
            </div>
        </div>
    );
}