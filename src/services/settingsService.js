import { ADMIN_API_BASE_URL } from '../config/api';

// Get store settings
const getStoreSettings = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${ADMIN_API_BASE_URL}/settings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch settings');
        }

        return result.data;
    } catch (error) {
        console.error('Error fetching settings:', error);
        throw error;
    }
};

// Update store settings
const updateStoreSettings = async (settingsData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${ADMIN_API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(settingsData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to update settings');
        }

        return result.data;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
};

export {
    getStoreSettings,
    updateStoreSettings
};