import axios from 'axios';

export const fetchNewsData = async () => {
  try {
    const response = await axios.get(
      'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=4abab7a5e796456691534ea45f1ae8ea'
    );

    // Remplacez 'YOUR_API_KEY' par votre véritable clé d'API News
    const data = response.data.articles;

    return data;
  } catch (error) {
    console.error('Error fetching news data', error);
    throw error; // Laissez l'erreur être gérée par l'appelant
  }
};
