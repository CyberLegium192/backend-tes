import express from "express";
import {getNewsList} from '../src/jkt48/news/news.js'
import {getScheduleList} from '../src/jkt48/schedule/schedule.js'
const app = express();
app.get("/", (req, res) => res.send("Express on Vercel"));
app.get('/news', async (req, res) => {
    try {
        const newData = await getNewsList();
        res.json({
            success: true,
            message: "Data berhasil diperbarui",
            data: newData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data",
            error: error.message
        });
    }
});

// Endpoint untuk schedule
app.get('/schedule', async (req, res) => {
    try {
        const scheduleData = await getScheduleList();
        res.json({
            success: true,
            message: "Data berhasil diperbarui",
            data: scheduleData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data",
            error: error.message
        });
    }
});

// Ekspor default
export default app;
