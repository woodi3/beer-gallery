import axios from 'axios';
import { API_URL } from '../constants';

const getBeers = (query) => {
    if(query) {
        return axios.get(`${API_URL}/beers?${query}`);
    }
    return axios.get(`${API_URL}/beers`);
}

export default {
    getBeers
}