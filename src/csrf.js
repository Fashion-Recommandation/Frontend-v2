import axios from './axiosConfig';

export const getCsrfToken = async () => {
    const response = await axios.get('/api/csrf/');  // Ensure the URL matches your Django URL patterns
    axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
};
