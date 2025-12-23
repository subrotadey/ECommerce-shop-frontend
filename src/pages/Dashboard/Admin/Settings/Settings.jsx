// ============================================
// pages/admin/Settings.jsx - Interactive Version
// ============================================
import { useState } from 'react';
import { Save, Globe, Mail, CreditCard, Truck, Bell, Shield, Eye, EyeOff, DollarSign, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
// import toast from 'react-hot-toast';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [logo, setLogo] = useState(null);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'Anis Abaya',
        siteUrl: 'https://anisabaya.com',
        supportEmail: 'support@anisabaya.com',
        phone: '+880 1XXX-XXXXXX',
        address: 'Chattogram, Bangladesh',
        timezone: 'Asia/Dhaka',
        currency: 'BDT',
        language: 'en'
    });

    // Email Settings
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'noreply@anisabaya.com',
        smtpPassword: '••••••••',
        fromEmail: 'noreply@anisabaya.com',
        fromName: 'Anis Abaya',
        testEmail: ''
    });

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState({
        stripeEnabled: true,
        stripePublicKey: 'pk_test_••••••••',
        stripeSecretKey: 'sk_test_••••••••',
        bkashEnabled: true,
        bkashAppKey: '••••••••',
        bkashAppSecret: '••••••••',
        nagadEnabled: true,
        nagadMerchantId: '••••••••',
        sslcommerzEnabled: false,
        sslcommerzStoreId: '',
        codEnabled: true
    });

    // Shipping Settings
    const [shippingSettings, setShippingSettings] = useState({
        freeShippingThreshold: 1000,
        insideDhaka: 60,
        outsideDhaka: 120,
        taxRate: 0,
        processingTime: '1-2 business days'
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        lowStockAlert: true,
        newReview: true,
        newCustomer: false,
        paymentReceived: true,
        orderCancelled: true
    });

    const handleSave = async () => {
        setIsSaving(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // toast.success('Settings saved successfully!', {
        //     duration: 3000,
        //     position: 'top-right',
        // });
        
        setIsSaving(false);
    };

    const handleTestEmail = async () => {
        if (!emailSettings.testEmail) {
            // toast.error('Please enter test email address');
            return;
        }
        
        // toast.loading('Sending test email...', { duration: 2000 });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // toast.success(`Test email sent to ${emailSettings.testEmail}!`);
        setEmailSettings({...emailSettings, testEmail: ''});
    };

    const togglePassword = (field) => {
        setShowPassword({...showPassword, [field]: !showPassword[field]});
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
                // toast.success('Logo uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-gray-content/60 mt-1">Manage your store configuration</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-primary text-primary-content'
                                            : 'hover:bg-gray-200'
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-300 p-6">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">General Settings</h2>
                                    
                                    {/* Logo Upload */}
                                    <div className="mb-6">
                                        <label className="label">
                                            <span className="label-text font-medium">Store Logo</span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                                                {logo ? (
                                                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={40} className="text-gray-content/40" />
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    type="file"
                                                    id="logo-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                />
                                                <label htmlFor="logo-upload" className="btn btn-sm btn-outline gap-2 cursor-pointer">
                                                    <Upload size={16} />
                                                    Upload Logo
                                                </label>
                                                <p className="text-xs text-gray-content/60 mt-2">
                                                    Recommended: 512x512px, PNG or JPG
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Site Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered bg-gray-200"
                                                    value={generalSettings.siteName}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Site URL</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    className="input input-bordered bg-gray-200"
                                                    value={generalSettings.siteUrl}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Support Email</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="input input-bordered bg-gray-200"
                                                    value={generalSettings.supportEmail}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Phone</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="input input-bordered bg-gray-200"
                                                    value={generalSettings.phone}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Address</span>
                                            </label>
                                            <textarea
                                                className="textarea textarea-bordered h-20 bg-gray-200"
                                                value={generalSettings.address}
                                                onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Timezone</span>
                                                </label>
                                                <select
                                                    className="select select-bordered bg-gray-200"
                                                    value={generalSettings.timezone}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                                                >
                                                    <option value="Asia/Dhaka">Asia/Dhaka (Bangladesh)</option>
                                                    <option value="Asia/Kolkata">Asia/Kolkata (India)</option>
                                                    <option value="Asia/Dubai">Asia/Dubai (UAE)</option>
                                                </select>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Currency</span>
                                                </label>
                                                <select
                                                    className="select select-bordered bg-gray-200"
                                                    value={generalSettings.currency}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                                                >
                                                    <option value="BDT">BDT (৳)</option>
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                </select>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Language</span>
                                                </label>
                                                <select
                                                    className="select select-bordered bg-gray-200"
                                                    value={generalSettings.language}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                                                >
                                                    <option value="en">English</option>
                                                    <option value="bn">বাংলা (Bangla)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Settings */}
                        {activeTab === 'email' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Email Configuration</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">SMTP Host</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered bg-gray-200"
                                                    value={emailSettings.smtpHost}
                                                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">SMTP Port</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="input input-bordered bg-gray-200"
                                                    value={emailSettings.smtpPort}
                                                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">SMTP Username</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="input input-bordered bg-gray-200"
                                                    value={emailSettings.smtpUsername}
                                                    onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">SMTP Password</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.smtp ? "text" : "password"}
                                                        className="input input-bordered w-full pr-10 bg-gray-200"
                                                        value={emailSettings.smtpPassword}
                                                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePassword('smtp')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                                    >
                                                        {showPassword.smtp ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">From Email</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="input input-bordered bg-gray-200"
                                                    value={emailSettings.fromEmail}
                                                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">From Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered bg-gray-200"
                                                    value={emailSettings.fromName}
                                                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="divider">Test Email Configuration</div>
                                        
                                        <div className="flex gap-3">
                                            <input
                                                type="email"
                                                className="input input-bordered flex-1 bg-gray-200"
                                                placeholder="Enter email address to test"
                                                value={emailSettings.testEmail}
                                                onChange={(e) => setEmailSettings({...emailSettings, testEmail: e.target.value})}
                                            />
                                            <button 
                                                className="btn btn-outline gap-2"
                                                onClick={handleTestEmail}
                                            >
                                                <Mail size={16} />
                                                Send Test Email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Settings */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
                                    
                                    {/* Stripe */}
                                    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Stripe</h3>
                                                    <p className="text-sm text-gray-content/60">International Cards</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={paymentSettings.stripeEnabled}
                                                onChange={(e) => setPaymentSettings({...paymentSettings, stripeEnabled: e.target.checked})}
                                            />
                                        </div>
                                                                                    {paymentSettings.stripeEnabled && (
                                            <div className="space-y-3 animate-in fade-in duration-300">
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full bg-gray-200"
                                                    placeholder="Publishable Key (pk_...)"
                                                    value={paymentSettings.stripePublicKey}
                                                    onChange={(e) => setPaymentSettings({...paymentSettings, stripePublicKey: e.target.value})}
                                                />
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.stripe ? "text" : "password"}
                                                        className="input input-bordered w-full pr-10 bg-gray-200"
                                                        placeholder="Secret Key (sk_...)"
                                                        value={paymentSettings.stripeSecretKey}
                                                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePassword('stripe')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                                    >
                                                        {showPassword.stripe ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* bKash */}
                                    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                    <span className="font-bold text-pink-600 text-lg">bKash</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">bKash</h3>
                                                    <p className="text-sm text-gray-content/60">Bangladesh Mobile Payment</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={paymentSettings.bkashEnabled}
                                                onChange={(e) => setPaymentSettings({...paymentSettings, bkashEnabled: e.target.checked})}
                                            />
                                        </div>
                                                                                    {paymentSettings.bkashEnabled && (
                                            <div className="space-y-3 animate-in fade-in duration-300">
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full bg-gray-200"
                                                    placeholder="App Key"
                                                    value={paymentSettings.bkashAppKey}
                                                    onChange={(e) => setPaymentSettings({...paymentSettings, bkashAppKey: e.target.value})}
                                                />
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.bkash ? "text" : "password"}
                                                        className="input input-bordered w-full pr-10 bg-gray-200"
                                                        placeholder="App Secret"
                                                        value={paymentSettings.bkashAppSecret}
                                                        onChange={(e) => setPaymentSettings({...paymentSettings, bkashAppSecret: e.target.value})}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePassword('bkash')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                                    >
                                                        {showPassword.bkash ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Nagad */}
                                    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <span className="font-bold text-orange-600 text-lg">Nagad</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Nagad</h3>
                                                    <p className="text-sm text-gray-content/60">Bangladesh Digital Payment</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={paymentSettings.nagadEnabled}
                                                onChange={(e) => setPaymentSettings({...paymentSettings, nagadEnabled: e.target.checked})}
                                            />
                                        </div>
                                                                                    {paymentSettings.nagadEnabled && (
                                            <div className="space-y-3 animate-in fade-in duration-300">
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full bg-gray-200"
                                                    placeholder="Merchant ID"
                                                    value={paymentSettings.nagadMerchantId}
                                                    onChange={(e) => setPaymentSettings({...paymentSettings, nagadMerchantId: e.target.value})}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Cash on Delivery */}
                                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                                                    <DollarSign className="w-6 h-6 text-success" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Cash on Delivery</h3>
                                                    <p className="text-sm text-gray-content/60">Pay when you receive</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={paymentSettings.codEnabled}
                                                onChange={(e) => setPaymentSettings({...paymentSettings, codEnabled: e.target.checked})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Settings */}
                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Shipping Configuration</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Free Shipping Threshold (৳)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="input input-bordered bg-gray-200"
                                                    value={shippingSettings.freeShippingThreshold}
                                                    onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseFloat(e.target.value)})}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt text-gray-content/60">
                                                        Orders above this amount get free shipping
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Processing Time</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered bg-gray-200"
                                                    value={shippingSettings.processingTime}
                                                    onChange={(e) => setShippingSettings({...shippingSettings, processingTime: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Inside Dhaka (৳)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="input input-bordered bg-gray-200"
                                                    value={shippingSettings.insideDhaka}
                                                    onChange={(e) => setShippingSettings({...shippingSettings, insideDhaka: parseFloat(e.target.value)})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Outside Dhaka (৳)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="input input-bordered bg-gray-200"
                                                    value={shippingSettings.outsideDhaka}
                                                    onChange={(e) => setShippingSettings({...shippingSettings, outsideDhaka: parseFloat(e.target.value)})}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Tax Rate (%)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className="input input-bordered bg-gray-200"
                                                    value={shippingSettings.taxRate}
                                                    onChange={(e) => setShippingSettings({...shippingSettings, taxRate: parseFloat(e.target.value)})}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt text-gray-content/60">
                                                        Set to 0 for no tax
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                                    <p className="text-gray-content/60 mb-4">
                                        Choose which notifications you want to receive
                                    </p>
                                    <div className="space-y-3">
                                        {Object.entries(notificationSettings).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                                                <div>
                                                    <p className="font-medium capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                    <p className="text-sm text-gray-content/60">
                                                        {key === 'orderConfirmation' && 'Email sent when order is placed'}
                                                        {key === 'orderShipped' && 'Email sent when order is shipped'}
                                                        {key === 'orderDelivered' && 'Email sent when order is delivered'}
                                                        {key === 'lowStockAlert' && 'Alert when product stock is low'}
                                                        {key === 'newReview' && 'Notification for new product reviews'}
                                                        {key === 'newCustomer' && 'Alert for new customer registration'}
                                                        {key === 'paymentReceived' && 'Notification when payment is received'}
                                                        {key === 'orderCancelled' && 'Alert when order is cancelled'}
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="toggle toggle-primary"
                                                    checked={value}
                                                    onChange={(e) => setNotificationSettings({...notificationSettings, [key]: e.target.checked})}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                                    
                                    {/* 2FA Section */}
                                    <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-100">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-content/60 mb-4">
                                                    Add an extra layer of security to your account by enabling two-factor authentication.
                                                </p>
                                                <button className="btn btn-primary btn-sm gap-2">
                                                    <Shield size={16} />
                                                    Enable 2FA
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Change Password */}
                                    <div className="border border-gray-300 rounded-lg p-6 bg-gray-100">
                                        <h3 className="font-semibold text-lg mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Current Password</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.current ? "text" : "password"}
                                                        className="input input-bordered w-full pr-10 bg-gray-200"
                                                        placeholder="Enter current password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePassword('current')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                                    >
                                                        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">New Password</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.new ? "text" : "password"}
                                                        className="input input-bordered w-full pr-10 bg-gray-200"
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePassword('new')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                                    >
                                                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Confirm New Password</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.confirm ? "text" : "password"}
                                                        className="input input-bordered w-full pr-10 bg-gray-200"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePassword('confirm')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                                    >
                                                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <button className="btn btn-outline gap-2">
                                                <Check size={16} />
                                                Update Password
                                            </button>
                                        </div>
                                    </div>

                                    {/* Session Management */}
                                    <div className="border border-gray-300 rounded-lg p-6 mt-6 bg-gray-100">
                                        <h3 className="font-semibold text-lg mb-4">Active Sessions</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-200 rounded-lg">
                                                <div>
                                                    <p className="font-medium">Current Session</p>
                                                    <p className="text-sm text-gray-content/60">Chrome on Windows • Chattogram, Bangladesh</p>
                                                </div>
                                                <span className="badge badge-success">Active</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-200 rounded-lg">
                                                <div>
                                                    <p className="font-medium">Mobile App</p>
                                                    <p className="text-sm text-gray-content/60">Android • Last active 2 hours ago</p>
                                                </div>
                                                <button className="btn btn-ghost btn-sm text-error gap-2">
                                                    <X size={16} />
                                                    Revoke
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-300 mt-6">
                            <button 
                                onClick={handleSave} 
                                className={`btn btn-primary gap-2 ${isSaving ? 'loading' : ''}`}
                                disabled={isSaving}
                            >
                                {!isSaving && <Save size={16} />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;