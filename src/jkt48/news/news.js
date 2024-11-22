import axios from 'axios';
import * as cheerio from 'cheerio';
import { getNewsDetails } from './newsDetails.js';
import { database } from '../../../firebaseConfig.js';
const url = 'https://jkt48.com/news/list?lang=id';

// ========================================= NEWS LIST ================================================
export const getNewsList = async () => {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const container = $(".entry-news .entry-news__list");
        let newData = [];

        for (let i = 0; i < container.length; i++) {
            const tema = $(container[i]).find('.entry-news__list--label img').attr('src');
            const title = $(container[i]).find(".entry-news__list--item h3 a").text().trim();
            const time = $(container[i]).find(".entry-news__list--item time").text().trim();
            const linkDetail = $(container[i]).find(".entry-news__list--item h3 a").attr('href');
            const details = await getNewsDetails(linkDetail)


            const newsData = {
                title,
                time,
                linkDetail,
                tema,
                details
            }
            const newsRef = database.ref('news');
            const snapshot = await newsRef.orderByChild('linkDetail').equalTo(linkDetail).once('value');

            if (!snapshot.exists()) {
                // Jika data belum ada, tambahkan ke database
                await newsRef.push(newsData);
                console.log("Data berhasil diunggah ke Firebase:", newsData);
                newData.push(newsData);
            } else {
                console.log("Data sudah ada di Firebase, tidak menambahkan duplikat:", title);
            }
        }
        return newData;
    } catch (error) {
        console.error(error)
    }
}
// getNewsList()
// setInterval(getNewsList, 600000);