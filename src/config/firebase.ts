import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// .env dosyasını yükle
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

const initializeFirebase = async () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      });
      console.log('✅ Firebase Admin initialized successfully');
      
      try {
        await admin.firestore().collection('test').doc('test').get();
        console.log('🔥 Firebase Firestore connected successfully');
      } catch (error) {
        console.error('❌ Firebase Firestore connection error:', error);
      }

      try {
        // Test Auth connection
        await admin.auth().listUsers(1);
        console.log('🔑 Firebase Auth connected successfully');
      } catch (error) {
        if (error.code === 'auth/configuration-not-found') {
          console.warn('⚠️  Firebase Auth not configured');
        } else {
          console.error('❌ Firebase Auth connection error:', error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    process.exit(1);
  }
};

initializeFirebase();

export const db = admin.firestore();
export const auth = admin.auth(); 