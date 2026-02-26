import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, aiSettingsApi } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Save, User, Lock, Bell, Bot, CheckCircle, XCircle } from 'lucide-react';

const NOTIF_STORAGE_KEY = 'hostsblue_notification_prefs';

function loadNotifPrefs() {
  try {
    const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { emailNotifications: true, renewalReminders: true, securityAlerts: true, marketingEmails: false };
}

export function SettingsPage() {
  const { customer } = useAuth();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [companyName, setCompanyName] = useState(customer?.companyName || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address1, setAddress1] = useState(customer?.address1 || '');
  const [address2, setAddress2] = useState(customer?.address2 || '');
  const [city, setCity] = useState(customer?.city || '');
  const [state, setState] = useState(customer?.state || '');
  const [postalCode, setPostalCode] = useState(customer?.postalCode || '');
  const [countryCode, setCountryCode] = useState(customer?.countryCode || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [notifPrefs, setNotifPrefs] = useState(loadNotifPrefs);

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Sync form when customer data loads/changes
  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName || '');
      setLastName(customer.lastName || '');
      setCompanyName(customer.companyName || '');
      setPhone(customer.phone || '');
      setAddress1(customer.address1 || '');
      setAddress2(customer.address2 || '');
      setCity(customer.city || '');
      setState(customer.state || '');
      setPostalCode(customer.postalCode || '');
      setCountryCode(customer.countryCode || '');
    }
  }, [customer]);

  const profileMutation = useMutation({
    mutationFn: (data: any) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 3000);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({
      firstName,
      lastName,
      companyName,
      phone,
      address1,
      address2,
      city,
      state,
      postalCode,
      countryCode,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  const updateNotifPref = (key: string, value: boolean) => {
    const updated = { ...notifPrefs, [key]: value };
    setNotifPrefs(updated);
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <form onSubmit={handleProfileSubmit} className="bg-white border border-gray-200 rounded-[7px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[#064A6C]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            {customer?.email && (
              <p className="text-sm text-gray-500">{customer.email}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Optional"
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input
                type="text"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="US, CA, GB, etc."
                maxLength={2}
                className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm uppercase"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            type="submit"
            disabled={profileMutation.isPending}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {profileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {profileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </button>
          {profileSaved && (
            <span className="text-green-600 text-sm">Profile saved successfully!</span>
          )}
          {profileMutation.error && (
            <span className="text-red-500 text-sm">Failed to save profile. Please try again.</span>
          )}
        </div>
      </form>

      {/* Password Section */}
      <form onSubmit={handlePasswordSubmit} className="bg-white border border-gray-200 rounded-[7px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#064A6C]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-lg">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {passwordError && (
          <p className="text-red-500 text-sm mt-3">{passwordError}</p>
        )}

        <div className="flex items-center gap-3 mt-6">
          <button
            type="submit"
            disabled={passwordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {passwordMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {passwordMutation.isPending ? 'Changing...' : 'Change Password'}
          </button>
          {passwordChanged && (
            <span className="text-green-600 text-sm">Password changed successfully!</span>
          )}
          {passwordMutation.error && (
            <span className="text-red-500 text-sm">Failed to change password. Please check your current password.</span>
          )}
        </div>
      </form>

      {/* Notification Preferences */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#064A6C]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          {notifSaved && (
            <span className="text-green-600 text-sm">Saved</span>
          )}
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications about your account via email' },
            { key: 'renewalReminders', label: 'Renewal Reminders', desc: 'Get reminded before domains and services expire' },
            { key: 'securityAlerts', label: 'Security Alerts', desc: 'Be notified about security events and login activity' },
            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotions, tips, and product updates' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button
                onClick={() => updateNotifPref(key, !notifPrefs[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifPrefs[key] ? 'bg-[#064A6C]' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  notifPrefs[key] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Provider Configuration */}
      <AIProviderSettings />
    </div>
  );
}

// ============================================================================
// AI Provider Settings Sub-Component
// ============================================================================

const AI_PROVIDERS = [
  { value: 'deepseek', label: 'DeepSeek', defaultModel: 'deepseek-chat', defaultUrl: 'https://api.deepseek.com' },
  { value: 'openai', label: 'OpenAI', defaultModel: 'gpt-4o', defaultUrl: 'https://api.openai.com/v1' },
  { value: 'anthropic', label: 'Anthropic (Claude)', defaultModel: 'claude-sonnet-4-20250514', defaultUrl: '' },
  { value: 'groq', label: 'Groq', defaultModel: 'llama-3.3-70b-versatile', defaultUrl: 'https://api.groq.com/openai/v1' },
  { value: 'custom', label: 'Custom (OpenAI-compatible)', defaultModel: '', defaultUrl: '' },
];

function AIProviderSettings() {
  const [provider, setProvider] = useState('deepseek');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['ai-settings'],
    queryFn: aiSettingsApi.get,
  });

  useEffect(() => {
    if (settings) {
      setProvider(settings.provider || 'deepseek');
      setApiKey(settings.apiKey || '');
      setModelName(settings.modelName || '');
      setBaseUrl(settings.baseUrl || '');
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => aiSettingsApi.save(data),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleProviderChange = (value: string) => {
    setProvider(value);
    const p = AI_PROVIDERS.find(p => p.value === value);
    if (p) {
      setModelName(p.defaultModel);
      setBaseUrl(p.defaultUrl);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ provider, apiKey, modelName, baseUrl });
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await aiSettingsApi.test({ provider, apiKey, modelName, baseUrl });
      setTestResult(result);
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Test failed' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-[7px] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-[#064A6C]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Provider</h2>
          <p className="text-sm text-gray-500">Configure the AI provider for your website builder</p>
        </div>
      </div>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
          <select
            value={provider}
            onChange={e => handleProviderChange(e.target.value)}
            className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
          >
            {AI_PROVIDERS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Your API key is encrypted and stored securely</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
          <input
            type="text"
            value={modelName}
            onChange={e => setModelName(e.target.value)}
            placeholder="e.g., deepseek-chat, gpt-4o, claude-sonnet-4-20250514"
            className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
          />
        </div>

        {(provider === 'custom' || provider === 'groq') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="w-full border border-gray-200 rounded-[7px] p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
        )}

        {testResult && (
          <div className={`flex items-center gap-2 p-3 rounded-[7px] text-sm ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {testResult.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          type="button"
          onClick={handleTest}
          disabled={testing || !apiKey}
          className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-[7px] hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        {saved && <span className="text-green-600 text-sm">Settings saved!</span>}
      </div>
    </form>
  );
}
