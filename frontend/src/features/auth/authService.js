import api from '../../services/api';

export const loginUser = (payload) => api.post('/auth/login', payload, { withCredentials: true });

const getResponseData = (response) => response?.data?.data ?? response?.data ?? {};

const extractPhotoUrl = (source) => {
  if (!source) {
    return '';
  }

  const candidate =
    source.photo_url ??
    source.photoURL ??
    source.photoUrl ??
    source.avatar ??
    source.url ??
    source.signedUrl ??
    source.photo?.url ??
    source.data?.photo_url ??
    source.data?.photoURL ??
    source.data?.photoUrl ??
    source.data?.avatar ??
    source.data?.url ??
    source.data?.signedUrl ??
    '';

  return typeof candidate === 'string' ? candidate.trim() : '';
};

export const getUserProfile = (accessToken) =>
  api.get(`/users/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getUserPhotoSignature = (accessToken, folderName = 'profile-photo') =>
  api.get(`/users/photo-signature`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      folderName,
    },
  });

export const mergeUserProfilePhoto = (profileData, photoSignatureData) => {
  const photoUrl = extractPhotoUrl(profileData) || extractPhotoUrl(photoSignatureData);

  return {
    ...profileData,
    photo_url: photoUrl,
    photoURL: photoUrl,
  };
};

export const getUserProfileWithPhoto = async (accessToken, folderName = 'profile-photo') => {
  const profileResponse = await getUserProfile(accessToken);
  const profileData = getResponseData(profileResponse);
  const existingPhotoUrl = extractPhotoUrl(profileData);

  if (existingPhotoUrl) {
    return mergeUserProfilePhoto(profileData, null);
  }

  try {
    const photoSignatureResponse = await getUserPhotoSignature(accessToken, folderName);
    const photoSignatureData = getResponseData(photoSignatureResponse);

    return mergeUserProfilePhoto(profileData, photoSignatureData);
  } catch {
    return mergeUserProfilePhoto(profileData, null);
  }
};

export const requestPasswordResetLink = (payload) => api.post('/auth/forget-password', payload);

export const resetPassword = (payload) => api.post('/auth/reset-password', payload);

export const logoutUser = () => api.post('/auth/logout');

export const refreshAccessToken = () => api.post('/auth/refresh-token', {}, { withCredentials: true });
