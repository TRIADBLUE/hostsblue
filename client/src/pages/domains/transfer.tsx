import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { domainApi } from '@/lib/api';
import {
  ArrowRight, Loader2, Globe, Eye, EyeOff, CheckCircle,
  Clock, Mail, XCircle, RefreshCw, ArrowRightLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DOMAIN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

const TRANSFER_STAGES = [
  { key: 'initiated', label: 'Initiated' },
  { key: 'pending_registrar', label: 'Pending Registrar' },
  { key: 'approval_email_sent', label: 'Approval Email Sent' },
  { key: 'approved', label: 'Approved' },
  { key: 'transferring', label: 'Transferring' },
  { key: 'completed', label: 'Complete' },
];

export function DomainTransferPage() {
  const queryClient = useQueryClient();
  const [domain, setDomain] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [authCodeError, setAuthCodeError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: transfers, isLoading: transfersLoading } = useQuery({
    queryKey: ['active-transfers'],
    queryFn: domainApi.getActiveTransfers,
  });

  const initiateMutation = useMutation({
    mutationFn: () => domainApi.initiateTransfer(domain.trim(), authCode.trim()),
    onSuccess: (data: any) => {
      setSuccessMessage(data?.message || 'Transfer initiated successfully. Check your email for approval.');
      setDomain('');
      setAuthCode('');
      setDomainError('');
      setAuthCodeError('');
      queryClient.invalidateQueries({ queryKey: ['active-transfers'] });
    },
    onError: (err: any) => {
      setDomainError(err.message || 'Unable to initiate transfer. Please check the domain and auth code.');
    },
  });

  const resendMutation = useMutation({
    mutationFn: (domainName: string) => domainApi.resendTransferApproval(domainName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-transfers'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (domainName: string) => domainApi.cancelTransfer(domainName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-transfers'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError('');
    setAuthCodeError('');
    setSuccessMessage('');

    const trimmedDomain = domain.trim().toLowerCase();
    const trimmedAuth = authCode.trim();

    if (!trimmedDomain) {
      setDomainError('Please enter a domain name.');
      return;
    }
    if (!DOMAIN_REGEX.test(trimmedDomain)) {
      setDomainError('Please enter a valid domain name (e.g. example.com).');
      return;
    }
    if (!trimmedAuth) {
      setAuthCodeError('Please enter the authorization/EPP code from your current registrar.');
      return;
    }
    if (trimmedAuth.length < 3) {
      setAuthCodeError('The authorization code appears to be too short.');
      return;
    }

    initiateMutation.mutate();
  };

  const activeTransfers = (transfers || []) as any[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ArrowRightLeft className="w-7 h-7 text-[#064A6C]" />
        </div>
        <h1 className="text-3xl font-bold text-[#09080E] mb-2">Transfer Your Domain</h1>
        <p className="text-[#4B5563] max-w-lg mx-auto">
          Move your domain to hostsblue. You'll need the authorization (EPP) code from your current registrar.
        </p>
      </div>

      {/* Transfer Form */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-8 mb-8">
        <h2 className="text-lg font-semibold text-[#09080E] mb-6">Start a Transfer</h2>

        {successMessage && (
          <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-[7px] p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <p className="text-sm text-[#09080E]">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Domain input */}
          <div>
            <label className="block text-sm font-medium text-[#09080E] mb-1.5">Domain name</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
              <input
                type="text"
                value={domain}
                onChange={(e) => { setDomain(e.target.value); setDomainError(''); }}
                placeholder="example.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-[7px] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064A6C]/20 focus:border-[#064A6C] transition-colors ${
                  domainError ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>
            {domainError && <p className="text-red-600 text-xs mt-1.5">{domainError}</p>}
          </div>

          {/* Auth code input */}
          <div>
            <label className="block text-sm font-medium text-[#09080E] mb-1.5">Authorization / EPP code</label>
            <div className="relative">
              <input
                type={showAuthCode ? 'text' : 'password'}
                value={authCode}
                onChange={(e) => { setAuthCode(e.target.value); setAuthCodeError(''); }}
                placeholder="Enter the code from your current registrar"
                className={`w-full pl-4 pr-10 py-2.5 text-sm border rounded-[7px] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064A6C]/20 focus:border-[#064A6C] transition-colors ${
                  authCodeError ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowAuthCode(!showAuthCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#09080E]"
              >
                {showAuthCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authCodeError && <p className="text-red-600 text-xs mt-1.5">{authCodeError}</p>}
          </div>

          <button
            type="submit"
            disabled={initiateMutation.isPending}
            className="bg-[#064A6C] hover:bg-[#053C58] text-white font-medium px-6 py-2.5 rounded-[7px] transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {initiateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {initiateMutation.isPending ? 'Initiating...' : 'Start Transfer'}
          </button>
        </form>
      </div>

      {/* How It Works */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-8 mb-8">
        <h2 className="text-lg font-semibold text-[#09080E] mb-6">How Domain Transfers Work</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-sm font-bold text-[#064A6C]">1</span>
            </div>
            <h3 className="font-medium text-[#09080E] mb-1 text-sm">Unlock your domain</h3>
            <p className="text-xs text-[#4B5563]">Log into your current registrar, disable transfer lock, and get your EPP/authorization code.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-sm font-bold text-[#064A6C]">2</span>
            </div>
            <h3 className="font-medium text-[#09080E] mb-1 text-sm">Enter details above</h3>
            <p className="text-xs text-[#4B5563]">Enter your domain name and authorization code, then click Start Transfer.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-sm font-bold text-[#064A6C]">3</span>
            </div>
            <h3 className="font-medium text-[#09080E] mb-1 text-sm">Approve the transfer</h3>
            <p className="text-xs text-[#4B5563]">You'll receive an email to approve the transfer. Once approved, the transfer completes within 5-7 days.</p>
          </div>
        </div>
      </div>

      {/* Active Transfers */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-8">
        <h2 className="text-lg font-semibold text-[#09080E] mb-6">Active Transfers</h2>

        {transfersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
          </div>
        ) : activeTransfers.length === 0 ? (
          <p className="text-[#4B5563] text-sm text-center py-8">
            No active transfers. Start one above to move your domain to hostsblue.
          </p>
        ) : (
          <div className="space-y-6">
            {activeTransfers.map((transfer: any) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                onResend={() => resendMutation.mutate(transfer.domainName)}
                onCancel={() => cancelMutation.mutate(transfer.domainName)}
                resendPending={resendMutation.isPending}
                cancelPending={cancelMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransferCard({
  transfer,
  onResend,
  onCancel,
  resendPending,
  cancelPending,
}: {
  transfer: any;
  onResend: () => void;
  onCancel: () => void;
  resendPending: boolean;
  cancelPending: boolean;
}) {
  const stage = transfer.transferStatus || 'initiated';
  const currentIndex = TRANSFER_STAGES.findIndex((s) => s.key === stage);
  const isCompleted = stage === 'completed';
  const isCancelled = transfer.transferStatus === 'cancelled';
  const canResend = stage === 'approval_email_sent';
  const canCancel = !isCompleted && !isCancelled && currentIndex < 4; // Before "transferring"

  return (
    <div className="border border-gray-100 rounded-[7px] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#09080E]">{transfer.domainName}</h3>
          <p className="text-xs text-[#4B5563]">
            Started {new Date(transfer.createdAt).toLocaleDateString()}
            {transfer.updatedAt && (
              <> &middot; Last updated {new Date(transfer.updatedAt).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {canResend && (
            <button
              onClick={onResend}
              disabled={resendPending}
              className="text-xs bg-white border border-gray-200 hover:bg-gray-50 text-[#064A6C] font-medium px-3 py-1.5 rounded-[7px] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3" />
              {resendPending ? 'Sending...' : 'Resend Email'}
            </button>
          )}
          {canCancel && (
            <button
              onClick={onCancel}
              disabled={cancelPending}
              className="text-xs bg-white border border-gray-200 hover:bg-gray-50 text-red-600 font-medium px-3 py-1.5 rounded-[7px] transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-3 h-3" />
              {cancelPending ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1">
        {TRANSFER_STAGES.map((s, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={s.key} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full mb-1.5">
                <div
                  className={`w-full h-1 rounded-full ${
                    isPast || isActive ? 'bg-[#064A6C]' : 'bg-gray-200'
                  }`}
                />
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 ${
                    isPast ? 'bg-[#10B981]' :
                    isActive ? 'bg-[#064A6C]' :
                    'bg-gray-200'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle className="w-3 h-3 text-white" />
                  ) : isActive ? (
                    <Clock className="w-3 h-3 text-white" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  )}
                </div>
                <span className={`text-[10px] text-center leading-tight ${
                  isActive ? 'font-semibold text-[#064A6C]' :
                  isPast ? 'text-[#10B981] font-medium' :
                  'text-[#4B5563]'
                }`}>
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
