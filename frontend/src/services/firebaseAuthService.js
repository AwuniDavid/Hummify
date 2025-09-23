import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const firebaseAuthService = {
  // Sign up with email and password
  async signup({ email, password, username }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: username
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        displayName: username,
        createdAt: new Date().toISOString(),
        bio: '',
        totalHums: 0,
        totalLikes: 0,
        totalComments: 0,
        songsIdentified: 0
      });

      return {
        user: {
          uid: user.uid,
          email: user.email,
          username: username,
          displayName: username
        }
      };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Sign in with email and password
  async login({ email, password }) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      return {
        user: {
          uid: user.uid,
          email: user.email,
          username: userData.username || user.displayName,
          displayName: user.displayName || userData.username
        }
      };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Sign out
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get user profile from Firestore
  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw { message: error.message };
    }
  }
};