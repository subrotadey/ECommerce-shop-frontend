import { AlertCircle, Loader } from "lucide-react";
import AccountOverview from "../../../components/UserDashboard/AccountOverview";
import ActivityTimeline from "../../../components/UserDashboard/ActivityTimeline";
import DashboardStats from "../../../components/UserDashboard/DashboardStats";
import QuickActions from "../../../components/UserDashboard/QuickActions";
import RecentOrdersWidget from "../../../components/UserDashboard/RecentOrdersWidget";
import RewardsCard from "../../../components/UserDashboard/RewardsCard";
import SupportCard from "../../../components/UserDashboard/SupportCard";
import WishlistWidget from "../../../components/UserDashboard/WishlistWidget";
import Settings from "../../Settings/Settings";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useDashboard from "../../../hooks/useDashboard";
import { Link } from "react-router";

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const { role } = useRole(currentUser?.email);
    const { userData, loading, error, refreshDashboard } = useDashboard();

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md">
                    <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Oops!</h2>
                    <p className="text-gray-600 mb-8">{error || 'Unable to load dashboard.'}</p>
                    <button
                        onClick={refreshDashboard}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Header */}
                <div className="mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Welcome back, {userData.displayName?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-gray-600">Here's what's happening with your account today.</p>
                        </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* <div className="flex gap-3">
                            {(role === 'admin' || role === 'staff') && (
                                <Link
                                    to="/admin"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <Settings size={20} />
                                    Admin Panel
                                </Link>
                            )}
                        </div> */}
                    </div>
                </div>

                {/* Stats */}
                <DashboardStats userData={userData} />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <QuickActions />
                        <RecentOrdersWidget orders={userData.recentOrders || []} />
                        <ActivityTimeline userData={userData} />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <AccountOverview userData={userData} />
                        <WishlistWidget />
                        <RewardsCard points={1250} progress={62} />
                        <SupportCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;