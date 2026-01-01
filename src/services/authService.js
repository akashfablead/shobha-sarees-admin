import API, { apiService } from "../config/api";

// Login API
export const login = async (credentials) => {
  const res = await apiService.post(`/admin/login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
    showSuccess: true,
  });
  return res.data;
};

// Get profile
export const getProfile = async () => {
  const res = await apiService.get(`/admin/profile`);
  return res.data.data.user;
};

// Update profile
export const updateUserProfile = async (profileData) => {
  const formData = new FormData();
  const allowed = [
    "mobileNumber",
    "gender",
    "address",
    "city",
    "state",
    "country",
    "pincode",
    "fullName"
  ];
  for (const key of allowed) {
    if (profileData[key] !== undefined && profileData[key] !== null) {
      formData.append(key, String(profileData[key]));
    }
  }
  if (profileData.profileImage instanceof File || profileData.profileImage instanceof Blob) {
    formData.append("profileImage", profileData.profileImage);
  }
  const res = await apiService.put(`/admin/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    showSuccess: true,
  });
  return res.data.data.user;
};

// Change password - not implemented in backend yet
// export const changePassword = async (passwordData) => {
//   const res = await apiService.post(`/admin/profile/change-password`, passwordData, {
//     showSuccess: true,
//   });
//   return res.data;
// };