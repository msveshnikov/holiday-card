import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getUnsplashImages = async (prompt) => {
    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${prompt}&client_id=${process.env.UNSPLASH_API_KEY}&w=800`
    );
    if (!response.ok) {
        throw new Error('Unsplash API error:' + response.status);
    }
    const data = await response.json();
    return data.results.map((r) => r.urls.regular);
};
