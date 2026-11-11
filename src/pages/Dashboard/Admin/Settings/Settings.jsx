// Settings/Settings.jsx
import { useState } from 'react';
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import SiteImagesManager from './SiteImagesManager';
import SiteVideosManager from './SiteVideosManager';

const TABS = [
    { key: 'images', label: 'Site Images', icon: ImageIcon, Panel: SiteImagesManager },
    // { key: 'videos', label: 'Site Videos', icon: VideoIcon, Panel: SiteVideosManager },
];

const Settings = () => {
    const [activeKey, setActiveKey] = useState('images');
    const active = TABS.find((t) => t.key === activeKey) || TABS[0];
    const Panel = active.Panel;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="mt-1 text-gray-600">Manage your store configuration</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-1 rounded-lg border border-gray-300 bg-gray-100 p-2 shadow-sm">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveKey(key)}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 ${
                                    key === active.key
                                        ? 'bg-primary text-primary-content'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-gray-300 bg-gray-100 p-6 shadow-sm">
                        <Panel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;