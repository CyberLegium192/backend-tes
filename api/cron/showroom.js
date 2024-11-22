import { scrapeYouTubeVideos } from '../../src/youtube/showroom_replay.js';

export default async function handler(req, res) {
  try {
    const videos = await scrapeYouTubeVideos();
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
