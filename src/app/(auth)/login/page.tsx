'use client';
import { useState } from 'react';

import { FiUser } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      window.location.href = '/dashboard';
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Section - Image */}
      <div className="w-[70%] relative">
        <img
          src="/images/cochin-port1.jpg"
          alt="Login"
          className="w-full h-full object-cover"
        />
        {/* Logo Top Left */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <img
            src="https://indiashippingnews.com/wp-content/uploads/2021/09/cochin-port-trust-logo.jpg"
            alt="Kochin Port Logo"
            className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <span className="text-white text-2xl font-bold drop-shadow">PORTRAC</span>
        </div>
      </div>

      {/* Right Section - Login */}
      <div className="w-[30%] flex flex-col justify-center items-center px-6 py-10 bg-white shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">COCHIN PORT</h2>

        <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
          <FiUser className="text-blue-800 text-xl" />
          Admin
        </h3>
        <h6 className="text-red-600 mb-5">Login in to your Account</h6>

        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-5">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#056d81] text-white py-2.5 rounded-md font-semibold hover:bg-blue-900 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>



  );
}
