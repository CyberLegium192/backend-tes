import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Membaca variabel lingkungan
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/\\t/g, '\t'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Inisialisasi Firebase Admin dengan kredensial dari variabel lingkungan
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jkt48-c9e60-default-rtdb.firebaseio.com/" // URL database bisa juga didefinisikan di .env
});

const database = admin.database();

export { database };
