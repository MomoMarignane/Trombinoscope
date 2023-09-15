import axios from 'axios';

const fetchRandomQuote = async () => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    const randomQuote = `"${content}" - ${author}`;
    return response.data;
  } catch (error) {
    console.error('Error fetching random quote', error);
    throw error; // Relevez l'erreur pour la gérer dans le composant FeedScreen
  }
};

export { fetchRandomQuote };
