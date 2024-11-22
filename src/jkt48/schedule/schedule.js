// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { getScheduleDetails } from './scheduleDetails.js';
// import { database } from '../../../firebaseConfig.js';
// // import { ref, push } from 'firebase/database';
// const url = 'https://jkt48.com/calendar/list/y/2024/m/11/d/9?lang=id';

// // ========================================= SCHEDULE LIST ================================================
// export const getScheduleList = async () => {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
//             }
//         });
//         const html = response.data;
//         const $ = cheerio.load(html);
//         const rows = $(".table tbody tr"); // Select each row in the table
//         let scheduleDatas = [];
    

//         rows.each((i, row) => {
//             const dateText = $(row).find("td h3").text().split('(')[0].trim(); // Get date without day
//             const contentElements = $(row).find(".contents"); // Select all .contents elements

//             // Iterate over each .contents block to handle multiple events on the same day
//             contentElements.each(async(j, contentElement) => {
//                 const tema = $(contentElement).find('.badge img').attr('src') || '';
//                 const linkDetail = $(contentElement).find('p a').attr('href') || '';
//                 const text = $(contentElement).find('p a').text().trim();

//                 // Separate time and title
//                 const timeMatch = text.match(/^(\d{2}:\d{2})\s*(.*)$/);
//                 const time = timeMatch ? timeMatch[1] : "event";
//                 const title = timeMatch ? timeMatch[2].trim() : text;
//                 const details = await getScheduleDetails(linkDetail)


//                 const scheduleData = {
//                     date: dateText, // Display date without the day
//                     tema,
//                     time,
//                     title,
//                     linkDetail,
//                     details
//                 };

//                 const scheduleRef = database.ref('schedule');
//                 const snapshot = await scheduleRef.orderByChild('linkDetail').equalTo(linkDetail).once('value');

//                 if (!snapshot.exists()) {
//                     // Jika data belum ada, tambahkan ke database
//                     await scheduleRef.push(scheduleData);
//                     console.log("Data berhasil diunggah ke Firebase:", scheduleData);
//                     scheduleDatas.push(scheduleData);
//                 } else {
//                     console.log("Data sudah ada di Firebase, tidak menambahkan duplikat:", title);
//                 }
//             });
//         });

//         return scheduleDatas
//     } catch (error) {
//         console.error(error)
//     }
// }
// // getScheduleList()
// // setInterval(getScheduleList, 600000);


import axios from 'axios';
import * as cheerio from 'cheerio';
import { getScheduleDetails } from './scheduleDetails.js';
import { database } from '../../../firebaseConfig.js';

const url = 'https://jkt48.com/calendar/list/y/2024/m/11/d/9?lang=id';

export const getScheduleList = async () => {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const rows = $(".table tbody tr"); // Pilih semua baris jadwal
        
        let scheduleDatas = [];

        // Proses setiap baris
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const dateText = $(row).find("td h3").text().split('(')[0].trim();
            const contentElements = $(row).find(".contents");

            for (let j = 0; j < contentElements.length; j++) {
                const contentElement = contentElements[j];
                const tema = $(contentElement).find('.badge img').attr('src') || '';
                const linkDetail = $(contentElement).find('p a').attr('href') || '';
                const text = $(contentElement).find('p a').text().trim();

                // Pisahkan waktu dan judul
                const timeMatch = text.match(/^(\d{2}:\d{2})\s*(.*)$/);
                const time = timeMatch ? timeMatch[1] : "event";
                const title = timeMatch ? timeMatch[2].trim() : text;

                // Ambil detail jadwal
                const details = await getScheduleDetails(linkDetail);

                const scheduleData = {
                    date: dateText,
                    tema,
                    time,
                    title,
                    linkDetail,
                    details
                };

                const scheduleRef = database.ref('schedule');
                const snapshot = await scheduleRef.orderByChild('linkDetail').equalTo(linkDetail).once('value');

                if (!snapshot.exists()) {
                    await scheduleRef.push(scheduleData);
                    console.log("Data berhasil diunggah ke Firebase:", scheduleData);
                    scheduleDatas.push(scheduleData); // Tambahkan ke array jika baru
                } else {
                    console.log("Data sudah ada di Firebase, tidak menambahkan duplikat:", title);
                }
            }
        }

        return scheduleDatas; // Kembalikan data yang sudah diunggah
    } catch (error) {
        console.error("Terjadi kesalahan:", error.message);
        throw error;
    }
};
