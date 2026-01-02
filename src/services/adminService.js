import { apiService } from '../config/api';

// Admin Dashboard API functions
export const getAdminDashboardStats = async () => {
    const res = await apiService.get(`/admin/dashboard/stats`);
    return res.data;
};

// Saree API functions
export const getSarees = async () => {
    const res = await apiService.get(`/admin/sarees`);
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

// Catalog API functions
export const getSareeCategories = async () => {
    const res = await apiService.get(`/admin/saree-categories`);
    return res.data;
};

// getCatalogsNameId
export const getCatalogsNameId = async () => {
    const res = await apiService.get(`/admin/catalogs/name-id`);
    return res.data;
};

export const getAllSareeCategories = async () => {
    const res = await apiService.get(`/admin/saree-categories`);
    return res.data;
};
export const getCatalogs = async () => {
    const res = await apiService.get(`/admin/catalogs`);
    return res.data;
};

export const getCatalogById = async (id) => {
    const res = await apiService.get(`/admin/catalogs/${id}`);
    return res.data;
};

export const createCatalog = async (catalogData) => {
    const formData = new FormData();

    // Add all catalog data to FormData
    Object.keys(catalogData).forEach(key => {
        if (catalogData[key] !== undefined && catalogData[key] !== null) {
            formData.append(key, catalogData[key]);
        }
    });

    const res = await apiService.post(`/admin/catalogs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        showSuccess: true,
    });
    return res.data;
};

export const updateCatalog = async (id, catalogData) => {
    const formData = new FormData();

    // Add all catalog data to FormData
    Object.keys(catalogData).forEach(key => {
        if (catalogData[key] !== undefined && catalogData[key] !== null) {
            formData.append(key, catalogData[key]);
        }
    });

    const res = await apiService.put(`/admin/catalogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        showSuccess: true,
    });
    return res.data;
};

export const deleteCatalog = async (id) => {
    const res = await apiService.delete(`/admin/catalogs/${id}`, {
        showSuccess: true,
    });
    return res.data;
};

export const addSareeToCatalog = async (catalogId, sareeId) => {
    const res = await apiService.post(`/admin/catalogs/add-saree`, {
        catalogId,
        sareeId
    }, {
        headers: {
            "Content-Type": "application/json",
        },
        showSuccess: true,
    });
    return res.data;
};

export const removeSareeFromCatalog = async (catalogId, sareeId) => {
    const res = await apiService.post(`/admin/catalogs/remove-saree`, {
        catalogId,
        sareeId
    }, {
        headers: {
            "Content-Type": "application/json",
        },
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

