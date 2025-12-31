'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginApi, registerApi } from '../services/allApi';
import { useRouter } from 'next/navigation';
interface LoginPageProps {
    register?: boolean;
}

export default function LoginPage({ register = false }: LoginPageProps) {
    const router = useRouter();
    const [hydrated, setHydrated] = useState(false);
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);



    const handleLogin = async () => {
        const { email, password } = userDetails;

        if (!email || !password) {
            toast.info('Please fill the form completely');
            return;
        }

        try {
            setLoading(true); // ⏳ start loader

            const result = await loginApi({ email, password });

            if (result.status === 200) {
                toast.success('Login successful');

                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('token', result.data.token); // ⚠️ never store password
                    sessionStorage.setItem(
                        'existingUser',
                        JSON.stringify(result.data.existingUser)
                    );
                    sessionStorage.setItem('isLoggedIn', 'true');
                }

                setUserDetails({ username: '', email: '', password: '' });

                setTimeout(() => {
                    router.replace('/statistical-dashboard');
                }, 300);
            } else {
                toast.error(result?.data?.message || 'Login failed');
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Server error, please try again';
            toast.error(message);
        } finally {
            setLoading(false); // ✅ stop loader
        }
    };



    const handleRegister = async () => {
        const { username, email, password } = userDetails;

        if (!username || !email || !password) {
            toast.info('Please fill the form completely');
        } else {
            try {
                const result = await registerApi(userDetails);
                console.log(result);

                if (result.status === 200) {
                    toast.success('Registration successful');
                    window.location.href = '/login';
                } else {
                    toast.error('Something went wrong, please try again later');
                }
            } catch (error) {
                toast.error('Server error, please try again');
            }
        }
    };

    if (!hydrated) return null;
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-900 via-cyan-800 to-sky-600 relative">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/loginbg.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-15"
                />
            </div>

            {/* Logo */}
            <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                <img
                    src="https://indiashippingnews.com/wp-content/uploads/2021/09/cochin-port-trust-logo.jpg"
                    alt="Kochin Port Logo"
                    className="h-14 w-14 rounded-full border-2 border-white shadow-lg object-cover"
                />
                <span className="text-white text-2xl font-extrabold drop-shadow tracking-wide">
                    PORTRAC
                </span>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold drop-shadow-sm">COCHIN PORT</h1>
                    <p className="text-blue-200 mt-1 text-sm font-medium flex justify-center items-center gap-2">
                        <FiUser className="text-lg" />
                        {register ? 'Sign up to your Account' : 'Sign in to your Account'}
                    </p>
                </div>

                {/*  {error && (
                    <div className="bg-red-100 text-red-700 text-sm py-2 px-4 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )} */}

                <form className="space-y-5">
                    {register && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={userDetails.username}
                            onChange={(e) =>
                                setUserDetails({ ...userDetails, username: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-white/70 border border-white/30 outline-none"
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={userDetails.email}
                        onChange={(e) =>
                            setUserDetails({ ...userDetails, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-white/70 border border-white/30 outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={userDetails.password}
                        onChange={(e) =>
                            setUserDetails({ ...userDetails, password: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-white/70 border border-white/30 outline-none"
                        required
                    />

                    <div className="mb-3">
                        {register ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    className="w-full py-3 font-bold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 transition"
                                >
                                    Register
                                </button>
                                <p className="mt-2 text-sm text-center">
                                    Already a user?{' '}
                                    <Link href="/login" className="text-cyan-300 hover:underline">
                                        Login
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className={`w-full py-3 font-bold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500 transitionflex items-center justify-center gap-2${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading && (
                                        <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    )}
                                    {loading ? 'Logging in…' : 'Login'}
                                </button>

                               
                            </>
                        )}
                    </div>
                </form>
            </div>

            <ToastContainer position="top-center" theme="colored" />
        </div>
    );
}
