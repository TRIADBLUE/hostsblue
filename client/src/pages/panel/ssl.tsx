import { useState } from 'react';
import { MoreHorizontal, RefreshCw, XCircle, RotateCcw } from 'lucide-react';

interface SslCertificate {
  id: number;
  domain: string;
  type: 'DV' | 'OV' | 'EV' | 'Wildcard';
  customer: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Revoked';
  issued: string;
  expires: string;
}

const certificates: SslCertificate[] = [
  { id: 1, domain: 'mitchelldesign.com', type: 'DV', customer: 'Sarah Mitchell', status: 'Active', issued: 'Jan 20, 2026', expires: 'Jan 20, 2027' },
  { id: 2, domain: '*.chentech.io', type: 'Wildcard', customer: 'James Chen', status: 'Active', issued: 'Feb 19, 2026', expires: 'Feb 19, 2027' },
  { id: 3, domain: 'brightpixel.co', type: 'OV', customer: 'Emily Rodriguez', status: 'Active', issued: 'Sep 10, 2025', expires: 'Sep 10, 2026' },
  { id: 4, domain: 'bennettlaw.com', type: 'EV', customer: 'Laura Bennett', status: 'Active', issued: 'Aug 5, 2025', expires: 'Aug 5, 2026' },
  { id: 5, domain: 'mendezgroup.mx', type: 'OV', customer: 'Carlos Mendez', status: 'Active', issued: 'Nov 15, 2025', expires: 'Nov 15, 2026' },
  { id: 6, domain: 'greenleafstudio.com', type: 'DV', customer: 'Priya Sharma', status: 'Active', issued: 'Dec 1, 2025', expires: 'Dec 1, 2026' },
  { id: 7, domain: 'creativeflow.design', type: 'DV', customer: 'Aisha Patel', status: 'Expired', issued: 'Oct 5, 2024', expires: 'Oct 5, 2025' },
  { id: 8, domain: 'wrightphoto.com', type: 'DV', customer: 'Thomas Wright', status: 'Active', issued: 'Oct 12, 2025', expires: 'Oct 12, 2026' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-[#10B981] text-white',
  Expired: 'bg-[#DC2626] text-white',
  Pending: 'bg-[#FFD700] text-[#09080E]',
  Revoked: 'bg-gray-200 text-[#4B5563]',
};

const typeColors: Record<string, string> = {
  DV: 'bg-blue-50 text-[#1844A6]',
  OV: 'bg-teal-50 text-[#064A6C]',
  EV: 'bg-green-50 text-[#10B981]',
  Wildcard: 'bg-purple-50 text-purple-700',
};

export function PanelSslPage() {
  const [openActions, setOpenActions] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">SSL Certificates</h1>
        <p className="text-[#4B5563]">Manage customer SSL certificates</p>
      </div>

      {/* Type Legend */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
        <div className="flex items-center gap-4">
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
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">{cert.domain}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[cert.type]}`}>
                      {cert.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#09080E]">{cert.customer}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[cert.status]}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#4B5563]">{cert.issued}</td>
                  <td className="px-6 py-3 text-sm text-[#4B5563]">{cert.expires}</td>
                  <td className="px-6 py-3 relative">
                    <button
                      onClick={() => setOpenActions(openActions === cert.id ? null : cert.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                    </button>
                    {openActions === cert.id && (
                      <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-40">
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" /> Renew
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> Revoke
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" /> Reissue
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
