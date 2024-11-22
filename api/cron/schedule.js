import { getScheduleList } from '../../src/jkt48/schedule/schedule.js';

export default async function handler(req, res) {
  try {
    const scheduleData = await getScheduleList();
    res.status(200).json({ success: true, data: scheduleData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
