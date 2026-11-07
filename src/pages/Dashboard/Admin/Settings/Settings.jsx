// pages/Admin/Settings/Settings.jsx
import { Image as ImageIcon } from 'lucide-react';
import SiteImagesManager from './SiteImagesManager';

const Settings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="mt-1 text-gray-600">Manage your store configuration</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="rounded-lg border border-gray-300 bg-gray-100 p-2 shadow-sm">
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg bg-primary px-4 py-3 text-primary-content"
                        >
                            <ImageIcon size={20} />
                            <span className="font-medium">Site Images</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-gray-300 bg-gray-100 p-6 shadow-sm">
                        <SiteImagesManager />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;