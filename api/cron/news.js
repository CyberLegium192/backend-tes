import { getNewsList } from '../../src/jkt48/news/news.js';

export default async function handler(req, res) {
  try {
    const newsData = await getNewsList();
    res.status(200).json({ success: true, data: newsData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
