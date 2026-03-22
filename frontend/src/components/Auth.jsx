import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL}`;


export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      
      if (res.data.user.isAdmin && isLogin) {
        setIsLoading(false);
        return setError('Administrators must log in via the /admin/login portal.');
      }
      
      onAuthSuccess(res.data.user, res.data.token);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50">
      {/* Background Decorative Animated Blobs */}
      <div className="absolute top-10 -left-20 w-96 h-96 bg-orange-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-[pulse_4s_infinite]"></div>
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-gray-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-[pulse_5s_infinite]" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[pulse_6s_infinite]" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 relative z-10 transform transition-all duration-500 hover:shadow-orange-900/10">
        <div>
          {/* Animated Interactive Logo */}
          <div className="flex justify-center group cursor-pointer mb-8">
            <Link to="/" className="flex items-center gap-2 relative">
              <div className="bg-orange-600 text-white p-3 rounded transform rotate-45 flex items-center justify-center w-14 h-14 shadow-lg group-hover:rotate-[225deg] transition-transform duration-[800ms] ease-in-out relative z-10">
                  <span className="font-extrabold text-2xl transform -rotate-45 block mt-0.5 group-hover:-rotate-[225deg] transition-transform duration-[800ms] ease-in-out">M</span>
              </div>
              <div className="flex flex-col ml-3 overflow-hidden relative">
                  <span className="font-bold text-sm leading-tight text-gray-500 uppercase tracking-widest transform -translate-x-[120%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0 relative">MERN</span>
                  <span className="font-extrabold text-3xl leading-none text-black tracking-tight group-hover:text-orange-600 transition-colors duration-500 relative z-10 bg-white/50 pr-2 rounded-r">STORE</span>
              </div>
            </Link>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black tracking-tight drop-shadow-sm">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={toggleMode} 
              className="font-bold text-orange-600 hover:text-orange-500 transition-colors focus:outline-none custom-underline relative"
            >
              {isLogin ? 'Sign up for free' : 'Sign in instead'}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-orange-600 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100"></span>
            </button>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-auth-fade">
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6 animate-auth-fade" key={isLogin ? 'login' : 'signup'} onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:z-10 sm:text-sm font-semibold transition-shadow bg-gray-50 hover:bg-white" placeholder="Full Name" />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:z-10 sm:text-sm font-semibold transition-shadow bg-gray-50 hover:bg-white" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required value={formData.password} onChange={handleChange} className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:z-10 sm:text-sm font-semibold transition-shadow bg-gray-50 hover:bg-white" placeholder="Password" />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={handleChange} className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:z-10 sm:text-sm font-semibold transition-shadow bg-gray-50 hover:bg-white" placeholder="Confirm Password" />
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center group/check cursor-pointer">
                <div className="relative flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="peer appearance-none h-5 w-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 cursor-pointer transition-colors checked:bg-orange-600 checked:border-orange-600" />
                  <svg className="absolute w-3 h-3 left-1 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 font-bold cursor-pointer group-hover/check:text-orange-600 transition-colors">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-gray-500 hover:text-orange-600 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>
          )}

          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all shadow-lg hover:shadow-2xl overflow-hidden mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              <div className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-orange-600 to-[#ff5100] transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
              
              <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase">
                {isLoading ? 'Processing...' : (isLogin ? 'Secure Sign In' : 'Create Account')}
                {!isLoading && <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
