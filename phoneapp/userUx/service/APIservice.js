import axios from 'axios';

export const callAPI = async (apiURL) => {
  try {
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    console.error('Error calling API', error);
    throw error;
  }
};