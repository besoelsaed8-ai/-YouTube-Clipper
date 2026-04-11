import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const getVideoInfo = async (url) => {
    const response = await api.post('/info', { url });
    return response.data;
};

export const processVideo = async (url, duration, crop, outputDir, shortsOnly) => {
    const response = await api.post('/process', { url, duration, crop, outputDir, shortsOnly });
    return response.data;
};

export const getJobStatus = async (jobId) => {
    const response = await api.get(`/status/${jobId}`);
    return response.data;
};

export default api;
