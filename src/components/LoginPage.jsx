import React, { useState } from 'react';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // In a real app, you would authenticate with a server here
    
    // For demo purposes, we'll just simulate successful login
    onLogin({ email, name: 'John Doe' });
  };
  
  return (
    <div className="min-h-screen bg-deep-plum flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-pure-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-deep-plum mb-2">ChatGPT</h1>
          <p className="text-muted-taupe">Sign in to continue</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-crimson-red/10 text-crimson-red rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-dark-espresso mb-2 text-sm font-medium" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-muted-taupe" />
              </div>
              <input
                type="email"
                id="email"
                className="block w-full pl-10 pr-3 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-deep-plum focus:border-deep-plum"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
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
              />
            </div>
          </div>
          
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
              <a href="#forgot-password" className="text-deep-plum hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-2 bg-deep-plum text-pure-white rounded-md hover:bg-deep-plum/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-plum"
          >
            <FiLogIn className="mr-2" />
            Sign in
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-taupe">
            Don't have an account?{' '}
            <a href="#signup" className="text-deep-plum hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 