import { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuthService } from '../services/firebaseAuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChange(async (user) => {
      if (user) {
        // Get additional user data from Firestore
        try {
          const userProfile = await firebaseAuthService.getUserProfile(user.uid);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            username: userProfile?.username || user.displayName,
            ...userProfile
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            username: user.displayName
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (userData) => {
    const result = await firebaseAuthService.signup(userData);
    return result;
  };

  const login = async (credentials) => {
    const result = await firebaseAuthService.login(credentials);
    return result;
  };

  const logout = async () => {
    await firebaseAuthService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};