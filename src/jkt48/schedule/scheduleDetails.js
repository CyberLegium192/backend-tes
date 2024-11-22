import axios from 'axios';
import * as cheerio from 'cheerio';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export const getScheduleDetails = async(link, retries = 3) => {
    try {
        await delay(4000)
        const response = await axios.get(`https://jkt48.com${link}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const $ = cheerio.load(response.data);

        // Ambil HTML dari elemen yang diinginkan
        const fullHTMLContent = $('.col-lg-12.entry-contents__main-area').html();

        return fullHTMLContent
        

        
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying Detail Schedule... Attempts left: ${retries}`);
            return getScheduleDetails(link, retries - 1); 
        }
        console.error('Error fetching detail Schedule:', error);
        return null;
    }
}
