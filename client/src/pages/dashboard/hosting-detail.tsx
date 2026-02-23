import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hostingApi } from '@/lib/api';
import {
  Server,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Database,
  Trash2,
  RefreshCw,
  HardDrive,
  Activity,
  Copy,
  Check,
} from 'lucide-react';

export function HostingDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const queryClient = useQueryClient();
  const [showBackups, setShowBackups] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: account, isLoading } = useQuery({
    queryKey: ['hosting', uuid],
    queryFn: () => hostingApi.getAccount(uuid!),
    enabled: !!uuid,
  });

  const { data: backups, isLoading: backupsLoading } = useQuery({
    queryKey: ['hosting', uuid, 'backups'],
    queryFn: () => hostingApi.getBackups(uuid!),
    enabled: !!uuid && showBackups,
  });

  const { data: stats } = useQuery({
    queryKey: ['hosting', uuid, 'stats'],
    queryFn: () => hostingApi.getStats(uuid!),
    enabled: !!uuid,
  });

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const createBackup = useMutation({
    mutationFn: () => hostingApi.createBackup(uuid!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting', uuid, 'backups'] });
      showFeedback('success', 'Backup initiated successfully.');
    },
    onError: () => showFeedback('error', 'Failed to create backup.'),
  });

  const restoreBackup = useMutation({
    mutationFn: (backupId: string) => hostingApi.restoreBackup(uuid!, backupId),
    onSuccess: () => {
      showFeedback('success', 'Backup restore initiated.');
    },
    onError: () => showFeedback('error', 'Failed to restore backup.'),
  });

  const clearCache = useMutation({
    mutationFn: () => hostingApi.clearCache(uuid!),
    onSuccess: () => showFeedback('success', 'Cache cleared successfully.'),
    onError: () => showFeedback('error', 'Failed to clear cache.'),
  });

  const toggleStaging = useMutation({
    mutationFn: (enabled: boolean) => hostingApi.createStaging(uuid!, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting', uuid] });
      showFeedback('success', 'Staging environment updated.');
    },
    onError: () => showFeedback('error', 'Failed to update staging.'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-white border border-gray-200 rounded-[7px] text-center py-16 px-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Hosting account not found</h3>
        <Link to="/dashboard/hosting" className="text-[#064A6C] hover:text-[#053A55]">
          Back to hosting
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/dashboard/hosting" className="hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Hosting
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
            <Server className="w-6 h-6 text-[#064A6C]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{account.siteName}</h1>
            <div className="flex items-center gap-3">
              <span className={`badge badge-${
                account.status === 'active' ? 'success' :
                account.status === 'provisioning' ? 'warning' :
                account.status === 'suspended' ? 'error' : 'neutral'
              }`}>
                {account.status}
              </span>
              {account.plan && (
                <span className="badge badge-neutral">{account.plan.name}</span>
              )}
            </div>
          </div>
        </div>
        {account.primaryDomain && (
          <a
            href={`https://${account.primaryDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Site
          </a>
        )}
      </div>

      {/* Feedback */}
      {feedbackMsg && (
        <div className={`p-3 rounded-[7px] text-sm ${
          feedbackMsg.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {feedbackMsg.text}
        </div>
      )}

      {/* Usage Stats */}
      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-[7px] p-5">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="w-5 h-5 text-[#064A6C]" />
              <span className="text-sm font-medium text-gray-900">Storage</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.storageUsedMB || 0} MB</p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#064A6C] rounded-full transition-all"
                style={{ width: `${Math.min(((stats.storageUsedMB || 0) / (stats.plan?.storageMB || 10000)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              of {stats.plan?.storageMB ? `${stats.plan.storageMB} MB` : 'plan limit'}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-[7px] p-5">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-[#064A6C]" />
              <span className="text-sm font-medium text-gray-900">Bandwidth</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.bandwidthUsedMB || 0} MB</p>
            <p className="text-xs text-gray-500 mt-1">this billing period</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-[7px] p-5">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-5 h-5 text-[#064A6C]" />
              <span className="text-sm font-medium text-gray-900">Last Stats Update</span>
            </div>
            <p className="text-sm text-gray-900">
              {stats.lastStatsUpdate
                ? new Date(stats.lastStatsUpdate).toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Site Info + Access */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-[7px] p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500">Primary Domain</span>
              <span className="text-gray-900">{account.primaryDomain || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-900">
                {account.createdAt
                  ? new Date(account.createdAt).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500">Billing Cycle</span>
              <span className="text-gray-900 capitalize">{account.billingCycle}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500">Auto-Renew</span>
              <span className={account.autoRenew ? 'text-green-600' : 'text-gray-500'}>
                {account.autoRenew ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">SSL Status</span>
              <span className={account.sslStatus === 'active' ? 'text-green-600' : 'text-gray-500'}>
                {account.sslStatus === 'active' ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[7px] p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Access Details</h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">WordPress Admin</p>
              {account.primaryDomain ? (
                <a
                  href={`https://${account.primaryDomain}/wp-admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#064A6C] flex items-center gap-1 hover:text-[#053A55]"
                >
                  Open WP Admin
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-gray-400">Not available</p>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">SFTP Access</p>
              <div className="text-sm text-gray-600">
                <p>Host: {account.sftpHost || 'N/A'}</p>
                <p>Username: {account.sftpUsername || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => createBackup.mutate()}
            disabled={createBackup.isPending}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <Database className={`w-4 h-4 ${createBackup.isPending ? 'animate-spin' : ''}`} />
            Create Backup
          </button>
          <button
            onClick={() => setShowBackups(!showBackups)}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            {showBackups ? 'Hide Backups' : 'View Backups'}
          </button>
          <button
            onClick={() => clearCache.mutate()}
            disabled={clearCache.isPending}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <Trash2 className={`w-4 h-4 ${clearCache.isPending ? 'animate-spin' : ''}`} />
            Clear Cache
          </button>
          <button
            onClick={() => toggleStaging.mutate(true)}
            disabled={toggleStaging.isPending}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <Copy className={`w-4 h-4 ${toggleStaging.isPending ? 'animate-spin' : ''}`} />
            Enable Staging
          </button>
          {account.primaryDomain && (
            <a
              href={`https://${account.primaryDomain}/wp-admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              WP Admin
            </a>
          )}
        </div>
      </div>

      {/* Backups List */}
      {showBackups && (
        <div className="bg-white border border-gray-200 rounded-[7px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Backups</h2>
            <button
              onClick={() => createBackup.mutate()}
              disabled={createBackup.isPending}
              className="bg-[#064A6C] hover:bg-[#053A55] text-white text-sm font-medium px-4 py-2 rounded-[7px] flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {createBackup.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              New Backup
            </button>
          </div>

          {backupsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
            </div>
          ) : backups && backups.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {backups.map((backup: any) => (
                    <tr key={backup.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">
                        {new Date(backup.createdAt || backup.date).toLocaleString()}
                      </td>
                      <td className="py-3 text-gray-500">
                        {backup.size ? `${(backup.size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
                      </td>
                      <td className="py-3">
                        <span className={`badge badge-${
                          backup.status === 'completed' ? 'success' :
                          backup.status === 'in_progress' ? 'warning' : 'neutral'
                        } text-xs`}>
                          {backup.status || 'available'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm('Restore this backup? This will overwrite current site data.')) {
                              restoreBackup.mutate(String(backup.id));
                            }
                          }}
                          disabled={restoreBackup.isPending}
                          className="text-[#064A6C] hover:text-[#053A55] text-sm font-medium"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No backups yet. Create your first backup above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
