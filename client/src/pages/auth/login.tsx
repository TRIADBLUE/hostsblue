import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { authApi } from '@/lib/api';
import { Mail, Lock, Loader2, Eye, EyeOff, Send } from 'lucide-react';
import { Brandsignature } from '@/components/ui/brandsignature';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [magicLinkMode, setMagicLinkMode] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState('');
  const { login, isLoginLoading, loginError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (magicLinkMode) {
      setMagicLinkLoading(true);
      setMagicLinkError('');
      try {
        await authApi.requestMagicLink(email);
        setMagicLinkSent(true);
      } catch (err: any) {
        setMagicLinkError(err.message || 'Failed to send login link');
      } finally {
        setMagicLinkLoading(false);
      }
    } else {
      login({ email, password });
    }
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <Brandsignature brand="hostsblue" showTld={false} size={30} linkTo="/" />
          </div>
          <div className="bg-white border border-gray-200 rounded-[7px] p-8">
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-[#064A6C]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm mb-6">
              We sent a login link to <strong>{email}</strong>. Click the link in the email to sign in.
            </p>
            <button
              onClick={() => { setMagicLinkSent(false); setMagicLinkMode(false); }}
              className="text-[#064A6C] hover:text-[#053C58] text-sm font-medium"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = magicLinkMode ? magicLinkLoading : isLoginLoading;
  const error = magicLinkMode ? magicLinkError : (loginError as Error)?.message;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <Brandsignature brand="hostsblue" showTld={false} size={30} linkTo="/" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500">Sign in to manage your domains and hosting</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-[7px] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[7px] text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[7px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {!magicLinkMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-[7px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#064A6C] focus:ring-[#064A6C]" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-[#064A6C] hover:text-[#053A55] font-medium">
                    Forgot password?
                  </Link>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#064A6C] hover:bg-[#053A55] text-white font-medium py-3 rounded-[7px] transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {magicLinkMode ? 'Sending link...' : 'Signing in...'}
                </>
              ) : (
                magicLinkMode ? 'Send Login Link' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setMagicLinkMode(!magicLinkMode); setMagicLinkError(''); }}
              className="text-[#064A6C] hover:text-[#053C58] text-sm font-medium"
            >
              {magicLinkMode ? 'Sign in with password' : 'Email me a login link'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#064A6C] hover:text-[#053A55] font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
