import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const userCredential = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(true);

      // Optional: Delay navigation to show success
      setTimeout(() => {
        navigate('/record');
      }, 1500);
    } catch (err) {
      const firebaseError = err?.code || '';
      let friendlyMessage = 'Signup failed. Please try again.';

      switch (firebaseError) {
        case 'auth/email-already-in-use':
          friendlyMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          friendlyMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          friendlyMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/network-request-failed':
          friendlyMessage = 'Network error. Please check your connection.';
          break;
        default:
          if (err?.message) {
            friendlyMessage = err.message;
          }
          break;
      }

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          loading={loading}
          error={error}
        />

        {success && (
          <div className="text-green-600 text-sm text-center">
            🎉 Account created successfully! Redirecting...
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
