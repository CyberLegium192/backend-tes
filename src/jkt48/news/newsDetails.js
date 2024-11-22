import axios from 'axios';
import * as cheerio from 'cheerio';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
// ========================================= NEWS DETAILS ================================================
export const getNewsDetails = async(link, retries = 3) => {
    try {
        await delay(4000)
        const response = await axios.get(`https://jkt48.com${link}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const $ = cheerio.load(response.data);
        let details = []
        const detail = $('.entry-news__detail .MsoNormal');
        detail.each((i, item) => {
            const paragraph = $(item).text().trim();
            if(paragraph){
                details.push(paragraph)
            }
        })
        return details;


    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying Detail News... Attempts left: ${retries}`);
            return getNewsDetails(link, retries - 1); // Coba ulangi jika gagal
        }
        console.error('Error fetching detail news:', error);
        return null;
    }
}