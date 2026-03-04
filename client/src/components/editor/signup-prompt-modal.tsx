import { Link } from 'react-router-dom';
import { X, Check, Globe, Sparkles, Search, BarChart3, Cloud } from 'lucide-react';

interface SignUpPromptModalProps {
  onClose: () => void;
}

const features = [
  { icon: Cloud, label: 'Save to cloud' },
  { icon: Globe, label: 'Publish to custom domain' },
  { icon: Sparkles, label: 'AI content generation' },
  { icon: Search, label: 'SEO tools' },
  { icon: BarChart3, label: 'Analytics' },
];

export function SignUpPromptModal({ onClose }: SignUpPromptModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[7px] w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-xl font-[800] text-gray-900">Ready to Go Live?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 mb-5">
            Create a free account to unlock the full power of the website builder.
          </p>

          <ul className="space-y-3 mb-6">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/register?redirect=/try/editor&restore=guest"
            className="block w-full text-center bg-[#064A6C] hover:bg-[#053C58] text-white font-medium py-3 rounded-[7px] transition-colors mb-3"
          >
            Create Free Account
          </Link>

          <Link
            to="/login?redirect=/try/editor&restore=guest"
            className="block w-full text-center border border-gray-300 text-gray-700 hover:border-[#064A6C] hover:text-[#064A6C] font-medium py-3 rounded-[7px] transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
