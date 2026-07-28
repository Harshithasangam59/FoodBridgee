import { getDb } from '../config/database.js';

export const getNotifications = async (req, res) => {
  try {
    const db = await getDb();
    const notifications = await db.all(
      `SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC`,
      [req.user.id]
    );

    const unreadCount = notifications.filter(n => n.isRead === 0).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    await db.run(
      `UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?`,
      [id, req.user.id]
    );

    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification status' });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const db = await getDb();
    await db.run(
      `UPDATE notifications SET isRead = 1 WHERE userId = ?`,
      [req.user.id]
    );

    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
};
