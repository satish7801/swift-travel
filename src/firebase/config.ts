// It's crucial to use environment variables for your Firebase config
// and ensure they are prefixed with NEXT_PUBLIC_ to be available on the client.
// Example: NEXT_PUBLIC_FIREBASE_API_KEY
// You can find these values in your Firebase project settings.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseConfig() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    // This is a client-side check, so we can't throw a server error.
    // Instead, we log a warning and return an incomplete config.
    // The app should handle this gracefully (e.g., by showing an error message).
    console.warn("Firebase config is not set. Please add your Firebase project's configuration to your environment variables.");
  }
  return firebaseConfig;
}
