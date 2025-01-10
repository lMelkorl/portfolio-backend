import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { db } from '../config/firebase';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Visitor logs route is working' });
});

// Yeni ziyaret kaydı (public)
router.post('/', async (req, res) => {
  console.log('POST /visitor-logs hit');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  try {
    console.log('Received visit data:', req.body); // Debug için log

    const {
      url,
      referrer = 'direct',
      ipInfo,
      browserInfo,
      osInfo,
      deviceInfo,
      screenInfo
    } = req.body;

    if (!url || !ipInfo || !ipInfo.ip) {
      return res.status(400).json({ 
        message: 'Required fields are missing',
        received: { url, ipInfo }
      });
    }

    // Admin analytics sayfası için gelen istekleri kaydetme
    if (url.includes('/admin/analytics')) {
      return res.status(201).json({ message: 'Admin page visit ignored' });
    }

    const visitorLogsRef = db.collection('visitor-logs');
    const existingLogQuery = await visitorLogsRef.where('ipInfo.ip', '==', ipInfo.ip).get();

    const timestamp = new Date();

    if (!existingLogQuery.empty) {
      const existingLog = existingLogQuery.docs[0];
      const data = existingLog.data();
      
      // Son ziyareti kontrol et
      const lastVisit = data.visits[data.visits.length - 1];
      if (lastVisit && lastVisit.url === url) {
        return res.json({ message: 'Duplicate visit ignored' });
      }

      await existingLog.ref.update({
        visits: [...(data.visits || []), { url, timestamp, referrer }],
        totalVisits: (data.totalVisits || 0) + 1,
        lastVisit: timestamp,
        browserInfo,
        osInfo,
        deviceInfo,
        screenInfo
      });

      return res.json({ message: 'Visit added to existing log' });
    }

    // Yeni ziyaretçi kaydı oluştur
    const newVisitorLog = {
      ipInfo,
      visits: [{ url, timestamp, referrer }],
      totalVisits: 1,
      firstVisit: timestamp,
      lastVisit: timestamp,
      browserInfo,
      osInfo,
      deviceInfo,
      screenInfo
    };

    await visitorLogsRef.add(newVisitorLog);
    return res.status(201).json({ message: 'Visit logged successfully' });
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({ 
      message: 'Error logging visit',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Tüm logları getir (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection('visitor-logs')
      .orderBy('lastVisit', 'desc')
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json(logs);
  } catch (error) {
    console.error('Error getting visitor logs:', error);
    return res.status(500).json({ message: 'Error getting visitor logs' });
  }
});

// Tüm logları temizle (admin only)
router.post('/clear', authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection('visitor-logs').get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return res.json({ message: 'All visitor logs cleared successfully' });
  } catch (error) {
    console.error('Error clearing visitor logs:', error);
    return res.status(500).json({ message: 'Error clearing visitor logs' });
  }
});

export default router; 