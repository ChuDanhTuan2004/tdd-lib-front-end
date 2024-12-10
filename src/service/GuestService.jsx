import axios from 'axios';

export const searchBooks = async (params) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/books`, {
            params: {
                keyword: params.title || '',
                subcategoryId: params.subcategoryId || '',
                publicationYear: params.publicationYear || '',
                page: params.page || 0,
                size: params.size || 10,
                sortBy: params.sortBy || 'publicationYear',
                sortDirection: params.sortDirection || 'DESC'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching books:', error);
        throw error;
    }
};

export const getLatestEvents = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/news-events/latest');
        return response.data;
    } catch (error) {
        console.error('Error fetching latest events:', error);
        throw error;
    }
};


