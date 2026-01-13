import { apiService } from '../config/api';

// Admin Dashboard API functions
export const getAdminDashboardStats = async () => {
    const res = await apiService.get(`/admin/dashboard/stats`);
    return res.data.data;
};

// Saree API functions
export const getSarees = async (category, search, page = 1, limit = 12, collectionId) => {
    // Build query parameters
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    if (collectionId && collectionId !== 'all') params.append('collectionId', collectionId);

    const queryString = params.toString();
    const url = `/admin/sarees${queryString ? '?' : ''}${queryString}`;

    const res = await apiService.get(url);
    return res.data;
};

export const getSareeById = async (id) => {
    const res = await apiService.get(`/admin/sarees/${id}`);
    return res.data;
};

export const createSaree = async (sareeData) => {
    const formData = new FormData();

    // Add all saree data to FormData
    Object.keys(sareeData).forEach(key => {
        if (sareeData[key] !== undefined && sareeData[key] !== null) {
            formData.append(key, sareeData[key]);
        }
    });

    const res = await apiService.post(`/admin/sarees`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        showSuccess: true,
    });
    return res.data;
};

export const updateSaree = async (id, sareeData) => {
    const formData = new FormData();

    // Add all saree data to FormData
    Object.keys(sareeData).forEach(key => {
        if (sareeData[key] !== undefined && sareeData[key] !== null) {
            formData.append(key, sareeData[key]);
        }
    });

    const res = await apiService.put(`/admin/sarees/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        showSuccess: true,
    });
    return res.data;
};

export const deleteSaree = async (id) => {
    const res = await apiService.delete(`/admin/sarees/${id}`, {
        showSuccess: true,
    });
    return res.data;
};



// Category API functions
export const getCategories = async () => {
    const res = await apiService.get(`/admin/saree-categories`);
    return res.data;
};

// Collection API functions
export const getCollections = async () => {
    const res = await apiService.get(`/admin/collections`);
    return res.data;
};

export const getCollectionById = async (id) => {
    const res = await apiService.get(`/admin/collections/${id}`);
    return res.data;
};

export const createCollection = async (collectionData) => {
    const formData = new FormData();

    // Add all collection data to FormData
    Object.keys(collectionData).forEach(key => {
        if (collectionData[key] !== undefined && collectionData[key] !== null) {
            formData.append(key, collectionData[key]);
        }
    });

    const res = await apiService.post(`/admin/collections`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        showSuccess: true,
    });
    return res.data;
};

export const updateCollection = async (id, collectionData) => {
    const formData = new FormData();

    // Add all collection data to FormData
    Object.keys(collectionData).forEach(key => {
        if (collectionData[key] !== undefined && collectionData[key] !== null) {
            formData.append(key, collectionData[key]);
        }
    });

    const res = await apiService.put(`/admin/collections/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        showSuccess: true,
    });
    return res.data;
};

export const deleteCollection = async (id) => {
    const res = await apiService.delete(`/admin/collections/${id}`, {
        showSuccess: true,
    });
    return res.data;
};

// Testimonial API functions
export const getTestimonials = async () => {
    const res = await apiService.get(`/admin/testimonials`);
    return res.data;
};

export const createTestimonial = async (testimonialData) => {
    const res = await apiService.post(`/admin/testimonials`, testimonialData, {
        showSuccess: true,
    });
    return res.data;
};

export const updateTestimonial = async (id, testimonialData) => {
    const res = await apiService.put(`/admin/testimonials/${id}`, testimonialData, {
        showSuccess: true,
    });
    return res.data;
};

export const deleteTestimonial = async (id) => {
    const res = await apiService.delete(`/admin/testimonials/${id}`, {
        showSuccess: true,
    });
    return res.data;
};

// Contact API functions
export const getContacts = async (status, search, page = 1, limit = 10) => {
    // Build query parameters
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const queryString = params.toString();
    const url = `/admin/contacts${queryString ? '?' : ''}${queryString}`;

    const res = await apiService.get(url);
    return res.data;
};

export const getContactById = async (id) => {
    const res = await apiService.get(`/admin/contacts/${id}`);
    return res.data;
};

export const updateContact = async (id, contactData) => {
    const res = await apiService.put(`/admin/contacts/${id}`, contactData, {
        showSuccess: true,
    });
    return res.data;
};