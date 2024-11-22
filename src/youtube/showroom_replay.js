// import dayjs from "dayjs";
// import puppeteer from "puppeteer";

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: true, // Set ke false untuk debugging
//     timeout: 60000,
//     executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
//   });

//   const page = await browser.newPage();
//   const channelURL = 'https://www.youtube.com/@ShowroomJKT48/videos';

//   // Navigasi ke halaman dengan retry
//   async function safeGoto(page, url, options, retries = 3) {
//     while (retries > 0) {
//       try {
//         await page.goto(url, options);
//         console.log(`Berhasil membuka ${url}`);
//         return; // Sukses
//       } catch (error) {
//         console.error(`Gagal memuat ${url}. Retry tersisa: ${retries - 1}`);
//         retries--;
//         if (retries === 0) throw error; // Jika gagal semua retry, lempar error
//       }
//     }
//   }

//   try {
//     await safeGoto(page, channelURL, { waitUntil: 'networkidle2', timeout: 60000 });
//   } catch (error) {
//     console.error('Error during navigation:', error);
//     await browser.close();
//     process.exit(1);
//   }

//   // Tunggu elemen tersedia
//   await page.waitForSelector('.ytd-rich-grid-media', { timeout: 30000 });
//   console.log("Elemen video ditemukan!");

//   const videos = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll('ytd-rich-item-renderer')).map(video => {
//       const titleElement = video.querySelector('#video-title');
//       const metadataLine = video.querySelector('#metadata-line');
//       const dateElement = metadataLine ? metadataLine.querySelectorAll('span')[1] : null; // Ambil elemen <span> kedua
//       const linkElement = video.querySelector("#video-title-link").getAttribute("href");

//       return {
//         title: titleElement?.textContent.trim() || 'not found',
//         date: dateElement?.textContent.trim() || 'not found',
//         link: "https://youtube.com"+linkElement || 'not found'
//       };
//     }).filter(video => video.title && video.date && video.link);
//   });

//   console.log("Jumlah video ditemukan:", videos.length);
//   console.log("Data video:", videos);

//   const oneMonthAgo = dayjs().subtract(1, 'month');
//   const recentVideos = videos.filter(video => {
//     const uploadDate = parseDate(video.date);
//     return dayjs(uploadDate).isAfter(oneMonthAgo);
//   });

//   console.log("Video dalam 1 bulan terakhir:", recentVideos);

//   await browser.close();

//   function parseDate(dateText) {
//     const now = dayjs();
//     if (dateText.includes('day')) {
//       const days = parseInt(dateText.replace(/\D/g, ''), 10);
//       return now.subtract(days, 'day').toDate();
//     } else if (dateText.includes('week')) {
//       const weeks = parseInt(dateText.replace(/\D/g, ''), 10);
//       return now.subtract(weeks, 'week').toDate();
//     } else if (dateText.includes('month')) {
//       const months = parseInt(dateText.replace(/\D/g, ''), 10);
//       return now.subtract(months, 'month').toDate();
//     }
//     return now.toDate();
//   }
// })();

// src/jkt48/showroom/showroom.js
import dayjs from 'dayjs';
import puppeteer from 'puppeteer';

export const scrapeYouTubeVideos = async () => {
    const browser = await puppeteer.launch({
        headless: true, // Set to false for debugging
        timeout: 60000,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    });

    const page = await browser.newPage();
    const channelURL = 'https://www.youtube.com/@ShowroomJKT48/videos';

    // Retry logic for page navigation
    async function safeGoto(page, url, options, retries = 3) {
        while (retries > 0) {
            try {
                await page.goto(url, options);
                console.log(`Successfully opened ${url}`);
                return;
            } catch (error) {
                console.error(`Failed to load ${url}. Retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) throw error; // Throw error if all retries fail
            }
        }
    }

    try {
        await safeGoto(page, channelURL, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (error) {
        console.error('Error during navigation:', error);
        await browser.close();
        return [];
    }

    // Wait for elements to load
    await page.waitForSelector('.ytd-rich-grid-media', { timeout: 30000 });
    console.log("Video elements found!");

    const videos = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('ytd-rich-item-renderer')).map(video => {
            const titleElement = video.querySelector('#video-title');
            const metadataLine = video.querySelector('#metadata-line');
            const dateElement = metadataLine ? metadataLine.querySelectorAll('span')[1] : null;
            const linkElement = video.querySelector("#video-title-link").getAttribute("href");

            return {
                title: titleElement?.textContent.trim() || 'not found',
                date: dateElement?.textContent.trim() || 'not found',
                link: "https://youtube.com" + linkElement || 'not found'
            };
        }).filter(video => video.title && video.date && video.link);
    });

    console.log("Number of videos found:", videos.length);

    const oneMonthAgo = dayjs().subtract(1, 'month');
    const recentVideos = videos.filter(video => {
        const uploadDate = parseDate(video.date);
        return dayjs(uploadDate).isAfter(oneMonthAgo);
    });

    console.log("Videos in the last month:", recentVideos);

    await browser.close();
    return recentVideos;
};

// Helper function to parse the date text from YouTube
function parseDate(dateText) {
    const now = dayjs();
    if (dateText.includes('day')) {
        const days = parseInt(dateText.replace(/\D/g, ''), 10);
        return now.subtract(days, 'day').toDate();
    } else if (dateText.includes('week')) {
        const weeks = parseInt(dateText.replace(/\D/g, ''), 10);
        return now.subtract(weeks, 'week').toDate();
    } else if (dateText.includes('month')) {
        const months = parseInt(dateText.replace(/\D/g, ''), 10);
        return now.subtract(months, 'month').toDate();
    }
    return now.toDate();
}
