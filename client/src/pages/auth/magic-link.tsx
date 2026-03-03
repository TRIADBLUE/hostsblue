import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, XCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { Brandsignature } from '@/components/ui/brandsignature';

export function MagicLinkPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No login token provided.');
      return;
    }

    authApi.verifyMagicLink(token)
      .then((result) => {
        if (result.customer.isAdmin) {
          navigate('/panel', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((err: any) => {
        setError(err.message || 'Invalid or expired login link.');
      });
  }, [token, navigate]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <Brandsignature brand="hostsblue" showTld={false} size={30} linkTo="/" />
          </div>
          <div className="bg-white border border-gray-200 rounded-[7px] p-8">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Link expired</h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <a href="/login" className="text-[#064A6C] hover:text-[#053C58] text-sm font-medium">
              Back to login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Signing you in...</p>
      </div>
    </div>
  );
}
