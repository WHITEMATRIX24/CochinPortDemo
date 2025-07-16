'use client';
import { useState } from 'react';
// import Image from 'next/image';
import { FiUser } from 'react-icons/fi'; // ✅ Replaced FontAwesomeIcon

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
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-7xl bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
    {/* Left Image */}
    <div className="hidden md:flex w-full md:w-1/2">
    <div className="hidden md:flex md:min-w-[500px] md:w-[100%] max-h-[600px]">
  <img
    src="https://www.sino-shipping.com/wp-content/uploads/2024/12/Cochin-Port.jpg"
    alt="Login"
    className="w-full h-full object-cover rounded-l-lg"
  />
</div>

    </div>

    {/* Right Login Form */}
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 text-center">
  <h2 className="text-xl font-semibold mb-2 text-gray-700">KOCHIN PORT</h2>

  <h3 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
    <FiUser className="text-blue-800 text-2xl" />
    Admin
  </h3>
  <h6 className="text-red-600 mb-5">Login in to your Account</h6>

  <form onSubmit={handleLogin} className="w-full max-w-md space-y-5">
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

    {/* Remember Me and Forgot Password Row */}
    <div className="flex justify-between items-center text-sm text-gray-600">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-blue-600" />
        Remember me
      </label>
      <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-900 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition"
    >
      Login
    </button>
  </form>
</div>

  </div>
</div>

  );
}
