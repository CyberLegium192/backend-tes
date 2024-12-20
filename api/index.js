import express from "express";
import { getNewsList } from '../src/jkt48/news/news.js';
import { getScheduleList } from '../src/jkt48/schedule/schedule.js';

const app = express();

// Tambahkan middleware default untuk mendukung JSON parsing
app.use(express.json());

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
app.listen(3000, () => console.log("Server ready on port 3000."));
// Ekspor sebagai handler untuk Vercel
export default app;
