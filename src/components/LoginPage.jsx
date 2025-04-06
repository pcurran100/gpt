import React, { useState, useRef } from 'react';
import { FiUser, FiLock, FiLogIn, FiAlertCircle, FiMail } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { login, signup, resetPassword } = useAuth();
  
  const emailRef = useRef();
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!forgotPassword && !password) {
      setError('Please enter your password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      if (forgotPassword) {
        // Password reset flow
        await resetPassword(email);
        setError('Password reset link sent to your email!');
        setTimeout(() => {
          setForgotPassword(false);
        }, 3000);
      } else if (isSignup) {
        // Sign up flow
        await signup(email, password);
      } else {
        // Login flow
        await login(email, password);
      }
    } catch (err) {
      console.error(err);
      
      // Handle specific Firebase errors with user-friendly messages
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Failed to sign in: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle mode toggle (login/signup/forgot password)
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
  };
  
  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    setError('');
    setTimeout(() => {
      if (emailRef.current) emailRef.current.focus();
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-deep-plum flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-pure-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-deep-plum mb-2">ChatGPT</h1>
          <p className="text-muted-taupe">
            {forgotPassword 
              ? 'Reset your password' 
              : isSignup 
                ? 'Create your account'
                : 'Sign in to continue'}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-crimson-red/10 text-crimson-red rounded-md text-sm flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-dark-espresso mb-2 text-sm font-medium" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-muted-taupe" />
              </div>
              <input
                type="email"
                id="email"
                ref={emailRef}
                className="block w-full pl-10 pr-3 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-deep-plum focus:border-deep-plum"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {!forgotPassword && (
            <div className="mb-6">
              <label className="block text-dark-espresso mb-2 text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-muted-taupe" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="block w-full pl-10 pr-3 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-deep-plum focus:border-deep-plum"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          
          {!forgotPassword && !isSignup && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-deep-plum focus:ring-deep-plum border-soft-gray rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-taupe">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <button 
                  type="button" 
                  onClick={toggleForgotPassword}
                  className="text-deep-plum hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center px-4 py-2 bg-deep-plum text-pure-white rounded-md hover:bg-deep-plum/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-plum ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <FiLogIn className="mr-2" />
            {loading 
              ? 'Processing...' 
              : forgotPassword 
                ? 'Send Reset Link' 
                : isSignup 
                  ? 'Sign Up' 
                  : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          {forgotPassword ? (
            <p className="text-sm text-muted-taupe">
              <button 
                type="button" 
                onClick={toggleForgotPassword}
                className="text-deep-plum hover:underline focus:outline-none"
              >
                Back to sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-taupe">
              {isSignup 
                ? 'Already have an account? ' 
                : 'Don\'t have an account? '}
              <button 
                type="button" 
                onClick={toggleMode}
                className="text-deep-plum hover:underline focus:outline-none"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 