// In frontend/src/services/backendHumService.js

import api from './api';

export const backendHumService = {
    /**
     * Uploads an audio blob and title to the backend for song identification.
     */
    async uploadAndMatchHum(audioBlob, title) {
        try {
            const formData = new FormData();
            formData.append('audio_file', audioBlob, 'hum.wav');
            formData.append('title', title);
            const response = await api.post('/hums/upload-and-match', formData);
            return response.data;
        } catch (err) {
            console.error("Error in uploadAndMatchHum service:", err);
            if (err.response && err.response.data && err.response.data.detail) {
                throw new Error(err.response.data.detail);
            }
            throw new Error('A network or server error occurred.');
        }
    },

    /**
     * Sends an audio file and remix parameters to the backend for processing.
     */
    async remixHum(audioFile, params) {
        try {
            const formData = new FormData();
            formData.append('audio_file', audioFile);

            for (const key in params) {
                formData.append(key, params[key]);
            }

            const response = await api.post('/hums/remix', formData);
            return response.data;

        } catch (err) {
            console.error("Error in remixHum service:", err);
            if (err.response && err.response.data && err.response.data.detail) {
                throw new Error(err.response.data.detail);
            }
            throw new Error('An error occurred during the remix process.');
        }
    },
};