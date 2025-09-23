import api from './api';

export const humService = {
  async uploadHum(audioBlob, title) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'hum.wav');
      formData.append('title', title);
      
      const response = await api.post('/upload-hum', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Upload failed' };
    }
  },

  async matchHum(humId) {
    try {
      const response = await api.post('/match-hum', { hum_id: humId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Match failed' };
    }
  },

  async remixHum(humId, remixParams) {
    try {
      const response = await api.post('/remix-hum', {
        hum_id: humId,
        ...remixParams
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Remix failed' };
    }
  },

  async getFeed() {
    try {
      const response = await api.get('/get-feed');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load feed' };
    }
  },

  async likeHum(humId) {
    try {
      const response = await api.post('/like-hum', { hum_id: humId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Like failed' };
    }
  },

  async commentHum(humId, comment) {
    try {
      const response = await api.post('/comment-hum', {
        hum_id: humId,
        comment
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Comment failed' };
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load profile' };
    }
  }
};