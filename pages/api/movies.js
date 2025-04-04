import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Movie query is required' });
    }

    // 1. Get movie details from TMDB API
    const movieDetails = await getMovieDetailsFromTMDB(query);
    
    if (!movieDetails) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // 2. Get download link based on language/type
    let downloadLink = null;
    
    // Determine language (simple logic - can be enhanced)
    const isEnglish = movieDetails.original_language === 'en';
    const isTamil = movieDetails.original_language === 'ta';
    
    if (isTamil) {
      downloadLink = await getDownloadLinkFrom1KuttyMovies(query);
    } else if (isEnglish) {
      downloadLink = await getDownloadLinkFromHDHub4U(query);
    }
    
    // Fallback to DuckDuckGo search if no download link found
    if (!downloadLink) {
      downloadLink = await getDownloadLinkFromDuckDuckGo(query);
    }

    // 3. Format and return the response
    res.status(200).json({
      movie: {
        title: movieDetails.title,
        description: movieDetails.overview,
        releaseDate: movieDetails.release_date,
        poster: movieDetails.poster_path ? 
          `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null
      },
      downloadLink
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch movie information' });
  }
}

// Function to get movie details from TMDB API
async function getMovieDetailsFromTMDB(query) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('TMDB API Error:', error);
    return null;
  }
}

// Function to get download link from 1KuttyMovies
async function getDownloadLinkFrom1KuttyMovies(query) {
  try {
    const searchUrl = `https://1kuttymovies.cc/search/${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Find the first search result and get its link
    // Note: This is a simplified version and might need adjustment based on actual site structure
    const firstResult = $('.search-result a').first().attr('href');
    
    if (firstResult) {
      return firstResult;
    }
    
    return null;
  } catch (error) {
    console.error('1KuttyMovies Scraping Error:', error);
    return null;
  }
}

// Function to get download link from HDHub4U
async function getDownloadLinkFromHDHub4U(query) {
  try {
    const formattedQuery = query.toLowerCase().replace(/\s+/g, '-');
    const downloadUrl = `https://hdhub4u.cricket/${formattedQuery}-download`;
    
    const response = await axios.get(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // If we reach here without an error, the page exists
    return downloadUrl;
    
  } catch (error) {
    console.error('HDHub4U Scraping Error:', error);
    return null;
  }
}

// Function to get download link from DuckDuckGo
async function getDownloadLinkFromDuckDuckGo(query) {
  try {
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}+movie+download`;
    
    // For the sake of this API, we're just returning the search URL
    // In a real implementation, you would want to parse the search results
    return searchUrl;
    
  } catch (error) {
    console.error('DuckDuckGo Search Error:', error);
    return null;
  }
}
