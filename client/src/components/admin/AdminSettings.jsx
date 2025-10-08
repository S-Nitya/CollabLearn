import React, { useState } from 'react';
import { Settings, Lock, Database, Globe, RefreshCw, AlertTriangle, Save } from 'lucide-react';
import AdminNavbar from '../../navbar/adminNavbar'; 

// --- Static Theme Classes (Light Mode) ---
const themeBg = 'bg-gray-50 text-gray-900';
const subtleText = 'text-gray-600';
const primaryText = 'text-indigo-600';

// --- Main Component: AdminSettings Page ---
export default function AdminSettings() {
    // State for form fields (simplified)
    const [siteName, setSiteName] = useState('CollabLearn');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [minPasswordLength, setMinPasswordLength] = useState(8);
    const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'

    const handleSave = (e) => {
        e.preventDefault();
        setSaveStatus('saving');
        console.log('Saving admin settings...');
        
        // Simulate API call delay
        setTimeout(() => {
            // In a real app, you would send: 
            // { siteName, maintenanceMode, minPasswordLength } to the backend
            console.log('Settings saved:', { siteName, maintenanceMode, minPasswordLength });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000); // Clear status after 3 seconds
        }, 1000); 
    };

    const handleDataAction = (actionName) => {
        if (window.confirm(`Are you sure you want to proceed with ${actionName}? This action is irreversible.`)) {
            console.log(`Executing data action: ${actionName}`);
            // Logic for DB backup/clear cache here
            alert(`${actionName} simulation complete.`);
        }
    };


    // --- Sub-Component: Settings Section Card ---
    const SettingsSection = ({ icon: Icon, title, description, children }) => (
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="flex items-center mb-4 border-b pb-3">
                <Icon size={24} className={`mr-3 ${primaryText}`} />
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <p className={`mb-6 text-sm ${subtleText}`}>{description}</p>
            {children}
        </div>
    );

    // --- Render ---
    return (
        <div className={`min-h-screen ${themeBg} font-sans transition-colors duration-500`}>
            <AdminNavbar /> 
            
            <div className="pt-24 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold flex items-center">
                        <Settings size={30} className={`mr-3 ${primaryText}`} />
                        Admin Settings
                    </h1>
                    <p className={`mt-2 ${subtleText}`}>Configure global platform parameters and management tools.</p>
                </header>

                <form onSubmit={handleSave}>

                    {/* General Settings */}
                    <SettingsSection 
                        icon={Globe} 
                        title="General Platform Settings" 
                        description="Control basic platform identity and operational status."
                    >
                        <div className="mb-4">
                            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                            <input
                                type="text"
                                id="siteName"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                            <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700 flex items-center">
                                <AlertTriangle size={16} className="text-red-500 mr-2" />
                                Enable Maintenance Mode
                            </label>
                            <input
                                type="checkbox"
                                id="maintenanceMode"
                                checked={maintenanceMode}
                                onChange={(e) => setMaintenanceMode(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        </div>
                    </SettingsSection>

                    {/* Security Settings */}
                    <SettingsSection 
                        icon={Lock} 
                        title="Security and Access" 
                        description="Configure parameters affecting user and admin account security."
                    >
                        <div className="mb-4">
                            <label htmlFor="minPasswordLength" className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                            <input
                                type="number"
                                id="minPasswordLength"
                                value={minPasswordLength}
                                onChange={(e) => setMinPasswordLength(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 max-w-sm"
                                min="6"
                                max="16"
                                required
                            />
                        </div>
                    </SettingsSection>

                    {/* Data Management Section */}
                    <SettingsSection 
                        icon={Database} 
                        title="Data Management Tools" 
                        description="Perform administrative actions related to system data and caching."
                    >
                         <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => handleDataAction('Full Database Backup')}
                                className="flex items-center px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                <Database size={18} className="mr-2" />
                                Backup DB
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDataAction('Clear Application Cache')}
                                className="flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                <RefreshCw size={16} className="mr-2" />
                                Clear Cache
                            </button>
                        </div>
                    </SettingsSection>
                    
                    {/* Submit Button & Status */}
                    <div className="flex items-center justify-end mt-8">
                        {saveStatus === 'saving' && (
                            <div className="flex items-center text-indigo-600 font-medium mr-4">
                                <Loader size={18} className="animate-spin mr-2" />
                                Saving...
                            </div>
                        )}
                        {saveStatus === 'success' && (
                            <div className="flex items-center text-green-600 font-medium mr-4">
                                <Save size={18} className="mr-2" />
                                Settings Saved!
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={saveStatus === 'saving'}
                            className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                        >
                            <Save size={20} className="mr-2" />
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}