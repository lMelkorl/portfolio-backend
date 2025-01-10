import { db } from './firebase';

export const connectDB = async () => {
  try {
    // Firebase bağlantısını test et.
    await db.collection('test').doc('test').get();
    console.log('Firebase connected successfully.');
  } catch (error) {
    console.error('Firebase connection error:', error);
    process.exit(1);
  }
};

export default connectDB; 