import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

interface ServiceAccount {
  type: string | undefined;
  project_id: string | undefined;
  private_key_id: string | undefined;
  private_key: string | undefined;
  client_email: string | undefined;
  client_id: string | undefined;
  auth_uri: string | undefined;
  token_uri: string | undefined;
  auth_provider_x509_cert_url: string | undefined;
  client_x509_cert_url: string | undefined;
  [key: string]: string | undefined; // İndeks imzası eklendi
}

const initializeFirebase = async () => {
  try {
    // Environment variables'dan Firebase yapılandırmasını oluştur
    const serviceAccount: ServiceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    // Gerekli alanların varlığını kontrol et
    const requiredFields = [
      'type',
      'project_id',
      'private_key',
      'client_email',
    ] as const;

    for (const field of requiredFields) {
      if (!serviceAccount[field]) {
        throw new Error(`Missing required Firebase configuration: ${field}`);
      }
    }

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