import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { panelApi } from '@/lib/api';
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  active: 'bg-[#10B981] text-white',
  expired: 'bg-[#DC2626] text-white',
  pending: 'bg-[#FFD700] text-[#09080E]',
  revoked: 'bg-gray-200 text-[#4B5563]',
};

const typeColors: Record<string, string> = {
  DV: 'bg-blue-50 text-[#1844A6]',
  OV: 'bg-teal-50 text-[#064A6C]',
  EV: 'bg-green-50 text-[#10B981]',
  Wildcard: 'bg-purple-50 text-purple-700',
};

function getTypeFromSlug(productSlug: string): string {
  if (!productSlug) return 'DV';
  const slug = productSlug.toLowerCase();
  if (slug.includes('wildcard')) return 'Wildcard';
  if (slug.includes('ev') || slug.includes('extended')) return 'EV';
  if (slug.includes('ov') || slug.includes('organization')) return 'OV';
  return 'DV';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PanelSslPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['panel', 'ssl', page],
    queryFn: () => panelApi.getSsl({ page, limit }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-[#DC2626]">
        Failed to load SSL certificates.
      </div>
    );
  }

  const certificates = data?.certificates || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const expiringCount = data?.expiringCount || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">SSL Certificates</h1>
        <p className="text-[#4B5563]">Manage customer SSL certificates</p>
      </div>

      {/* Expiring Warning */}
      {expiringCount > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-[7px] px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <span className="text-sm text-orange-800 font-medium">
            {expiringCount} certificate{expiringCount !== 1 ? 's' : ''} expiring soon
          </span>
        </div>
      )}

      {/* Type Legend */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm text-[#4B5563] font-medium">Certificate Types:</span>
          {Object.entries(typeColors).map(([type, classes]) => (
            <span key={type} className={`px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}>
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* SSL Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Issued</th>
                <th className="px-6 py-3 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length > 0 ? (
                certificates.map((cert: any) => {
                  const certType = getTypeFromSlug(cert.productSlug);
                  return (
                    <tr key={cert.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">{cert.domain}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[certType] || typeColors.DV}`}>
                          {certType}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-[#09080E]">{cert.customerName || '--'}</div>
                        {cert.customerEmail && (
                          <div className="text-xs text-[#4B5563]">{cert.customerEmail}</div>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[cert.status] || 'bg-gray-100 text-[#4B5563]'}`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#4B5563]">{formatDate(cert.issuedAt)}</td>
                      <td className="px-6 py-3 text-sm text-[#4B5563]">{formatDate(cert.expiresAt)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#4B5563]">
                    No SSL certificates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
            <span className="text-sm text-[#4B5563]">
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-[7px] border border-[#E5E7EB] text-[#4B5563] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-[7px] border border-[#E5E7EB] text-[#4B5563] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
