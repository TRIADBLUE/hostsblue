import { useQuery } from '@tanstack/react-query';
import { Loader2, Server, MapPin, Globe } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';
async function adminFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${endpoint}`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data.data;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  provisioning: 'bg-yellow-100 text-yellow-700',
  stopped: 'bg-red-100 text-red-700',
  terminated: 'bg-gray-100 text-gray-500',
  failed: 'bg-red-100 text-red-700',
};

export function PanelCloudPage() {
  const { data: servers, isLoading } = useQuery({
    queryKey: ['panel', 'cloud-servers'],
    queryFn: () => adminFetch<any[]>('/admin/cloud/servers'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  const activeCount = servers?.filter((s: any) => s.status === 'active').length || 0;
  const provisioningCount = servers?.filter((s: any) => s.status === 'provisioning').length || 0;
  const totalMRR = servers?.filter((s: any) => s.status === 'active').reduce((sum: number, s: any) => sum + (s.monthlyPrice || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cloud Servers</h1>
        <p className="text-gray-500">All customer cloud servers across the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Servers', value: servers?.length || 0 },
          { label: 'Active', value: activeCount },
          { label: 'Provisioning', value: provisioningCount },
          { label: 'Cloud MRR', value: `$${(totalMRR / 100).toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-[7px] p-4">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
          </div>
        ))}
      </div>

      {/* Server list */}
      <div className="bg-white border border-gray-200 rounded-[7px] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Server</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Datacenter</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Monthly</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Created</th>
            </tr>
          </thead>
          <tbody>
            {servers && servers.length > 0 ? servers.map((s: any) => (
              <tr key={s.uuid} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{s.name}</div>
                      {s.ipv4 && <div className="text-xs text-gray-500 flex items-center gap-1"><Globe className="w-3 h-3" />{s.ipv4}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{s.customerEmail || `#${s.customerId}`}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{s.planSlug?.replace('cloud-', '')}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-gray-500"><MapPin className="w-3 h-3" />{s.datacenter}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[s.status] || 'bg-gray-100'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">${((s.monthlyPrice || 0) / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">No cloud servers provisioned yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
