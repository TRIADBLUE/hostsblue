import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sitelockApi } from '@/lib/api';
import {
  Shield,
  Loader2,
  ScanSearch,
  ChevronDown,
  ShieldCheck,
  ShieldOff,
  Code,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function SitelockPage() {
  const queryClient = useQueryClient();
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['sitelock', 'accounts'],
    queryFn: sitelockApi.getAccounts,
  });

  const scanMutation = useMutation({
    mutationFn: (uuid: string) => sitelockApi.triggerScan(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitelock', 'accounts'] });
    },
  });

  const firewallMutation = useMutation({
    mutationFn: ({ uuid, enabled }: { uuid: string; enabled: boolean }) =>
      sitelockApi.toggleFirewall(uuid, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitelock', 'accounts'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SiteLock</h1>
          <p className="text-gray-500">Website security scanning and malware protection</p>
        </div>
        <Link to="/security" className="btn-primary flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Add Protection
        </Link>
      </div>

      {/* Accounts List */}
      {accounts && accounts.length > 0 ? (
        <div className="grid gap-4">
          {accounts.map((account: any) => {
            const isExpanded = expandedAccount === account.uuid;

            return (
              <ExpandableAccount
                key={account.uuid}
                account={account}
                isExpanded={isExpanded}
                onToggle={() => setExpandedAccount(isExpanded ? null : account.uuid)}
                onScan={() => scanMutation.mutate(account.uuid)}
                scanPending={scanMutation.isPending}
                onToggleFirewall={(enabled: boolean) =>
                  firewallMutation.mutate({ uuid: account.uuid, enabled })
                }
                firewallPending={firewallMutation.isPending}
                firewallSuccess={firewallMutation.isSuccess}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-[7px] text-center py-16 px-6">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No SiteLock accounts yet</h3>
          <p className="text-gray-500 mb-6">Protect your websites with automated security scanning</p>
          <Link to="/security" className="btn-primary">
            Get SiteLock Protection
          </Link>
        </div>
      )}
    </div>
  );
}

function ExpandableAccount({
  account,
  isExpanded,
  onToggle,
  onScan,
  scanPending,
  onToggleFirewall,
  firewallPending,
  firewallSuccess,
}: {
  account: any;
  isExpanded: boolean;
  onToggle: () => void;
  onScan: () => void;
  scanPending: boolean;
  onToggleFirewall: (enabled: boolean) => void;
  firewallPending: boolean;
  firewallSuccess: boolean;
}) {
  const { data: detail } = useQuery({
    queryKey: ['sitelock', 'account', account.uuid],
    queryFn: () => sitelockApi.getAccount(account.uuid),
    enabled: isExpanded,
  });

  const { data: seal } = useQuery({
    queryKey: ['sitelock', 'seal', account.uuid],
    queryFn: () => sitelockApi.getSeal(account.uuid),
    enabled: isExpanded,
  });

  const { data: firewallStatus } = useQuery({
    queryKey: ['sitelock', 'firewall', account.uuid],
    queryFn: () => sitelockApi.getFirewall(account.uuid),
    enabled: isExpanded,
  });

  return (
    <div className="bg-white border border-gray-200 rounded-[7px] overflow-hidden hover:shadow-md transition-shadow">
      {/* Main Row */}
      <div className="p-6 flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#064A6C]" />
          </div>
          <div>
            <h3 className="text-gray-900 font-medium">{account.domain}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className={`badge badge-${
                account.status === 'active' ? 'success' :
                account.status === 'suspended' ? 'error' : 'neutral'
              } text-xs`}>
                {account.status}
              </span>
              {account.plan && <span>{account.plan}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {account.lastScan && (
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Last scan</p>
              <p className="text-sm text-gray-900">
                {new Date(account.lastScan.date || account.lastScan).toLocaleDateString()}
              </p>
              {account.lastScan.threatsFound !== undefined && (
                <p className={`text-xs ${
                  account.lastScan.threatsFound === 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {account.lastScan.threatsFound === 0
                    ? 'No threats found'
                    : `${account.lastScan.threatsFound} threat(s)`}
                </p>
              )}
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onScan(); }}
            disabled={scanPending}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <ScanSearch className={`w-4 h-4 ${scanPending ? 'animate-spin' : ''}`} />
            Scan
          </button>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Detail */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Scan Results */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Scan Results</h4>
              {detail?.scanResults ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {detail.scanResults.threatsFound === 0 ? (
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={detail.scanResults.threatsFound === 0 ? 'text-green-700' : 'text-red-700'}>
                      {detail.scanResults.threatsFound === 0
                        ? 'Site is clean'
                        : `${detail.scanResults.threatsFound} threat(s) detected`}
                    </span>
                  </div>
                  {detail.scanResults.pagesScanned !== undefined && (
                    <p className="text-gray-500">Pages scanned: {detail.scanResults.pagesScanned}</p>
                  )}
                  {detail.scanResults.lastScanDate && (
                    <p className="text-gray-500">
                      Scanned: {new Date(detail.scanResults.lastScanDate).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No scan results available. Run a scan to check your site.</p>
              )}
              <button
                onClick={onScan}
                disabled={scanPending}
                className="btn-outline text-sm flex items-center gap-2 w-full justify-center"
              >
                <ScanSearch className={`w-4 h-4 ${scanPending ? 'animate-spin' : ''}`} />
                Run Full Scan
              </button>
            </div>

            {/* Firewall */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Web Application Firewall</h4>
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-[7px]">
                <div className="flex items-center gap-2">
                  {firewallStatus?.enabled ? (
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <ShieldOff className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-900">
                    {firewallStatus?.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <button
                  onClick={() => onToggleFirewall(!firewallStatus?.enabled)}
                  disabled={firewallPending}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    firewallStatus?.enabled ? 'bg-[#064A6C]' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    firewallStatus?.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              {firewallSuccess && (
                <p className="text-green-600 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3" /> Firewall updated
                </p>
              )}
              <p className="text-xs text-gray-500">
                The WAF protects against SQL injection, XSS, and other web attacks in real-time.
              </p>
            </div>

            {/* Trust Seal */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Trust Seal</h4>
              {seal ? (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-[7px]">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Trust seal available</span>
                    </div>
                  </div>
                  {seal.embedCode && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Embed Code</label>
                      <div className="relative">
                        <pre className="bg-white border border-gray-200 rounded-[7px] p-3 text-xs font-mono text-gray-600 overflow-x-auto max-h-24">
                          {seal.embedCode}
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(seal.embedCode)}
                          className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded text-gray-400 hover:text-[#064A6C] transition-colors"
                          title="Copy embed code"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Trust seal will be available after your first successful scan.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
