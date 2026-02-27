import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Users, Mail, X, Trash2, Clock, Check, AlertCircle } from 'lucide-react';

// Using direct fetchApi since agencyApi isn't in the main api.ts
const API_URL = import.meta.env.VITE_API_URL || '';
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}/api/v1${endpoint}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  const response = await fetch(url, { ...options, headers, credentials: 'include' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'An error occurred');
  return data.data;
}

const agencyApi = {
  getClients: () => fetchApi<any[]>('/website-builder/clients'),
  invite: (email: string) => fetchApi<any>('/website-builder/clients/invite', { method: 'POST', body: JSON.stringify({ email }) }),
  remove: (id: number) => fetchApi<void>(`/website-builder/clients/${id}`, { method: 'DELETE' }),
};

export function AgencyClientsPage() {
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['agency', 'clients'],
    queryFn: agencyApi.getClients,
  });

  const inviteMutation = useMutation({
    mutationFn: (email: string) => agencyApi.invite(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', 'clients'] });
      setInviteEmail('');
      setShowInvite(false);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => agencyApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agency', 'clients'] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <Check className="w-3.5 h-3.5 text-green-500" />;
      case 'pending': return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
      default: return <AlertCircle className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-500">Invite and manage client access to your projects</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Invite Client
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[7px] p-4 text-sm text-red-700">
          {(error as Error).message.includes('feature') ? (
            <>Client management is available on the Agency plan. <span className="font-medium text-[#064A6C] cursor-pointer hover:underline">Upgrade now</span></>
          ) : (error as Error).message}
        </div>
      )}

      {/* Clients List */}
      {clients && clients.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-[7px] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Added</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c: any) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{c.clientEmail}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-medium capitalize">
                      {statusIcon(c.inviteStatus)}
                      {c.inviteStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { if (confirm('Remove this client?')) removeMutation.mutate(c.id); }}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <div className="bg-white border border-gray-200 rounded-[7px] text-center py-16 px-6">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
          <p className="text-gray-500 mb-6">Invite clients to give them access to manage their websites</p>
          <button onClick={() => setShowInvite(true)} className="btn-primary">
            Invite Your First Client
          </button>
        </div>
      ) : null}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-[7px] max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Invite Client</h2>
              <button onClick={() => setShowInvite(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); inviteMutation.mutate(inviteEmail); }} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  placeholder="client@example.com"
                  className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
                />
              </div>
              {inviteMutation.isError && (
                <p className="text-sm text-red-600">{(inviteMutation.error as Error).message}</p>
              )}
              <button type="submit" disabled={inviteMutation.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {inviteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
