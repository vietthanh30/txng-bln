import axios from 'axios';
import { BASE_URL } from '../commons';

const httpClient = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default httpClient;
