import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sslApi } from '@/lib/api';
import {
  ShieldCheck,
  Plus,
  Loader2,
  RefreshCw,
  ChevronDown,
  Mail,
  AlertTriangle,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function SslPage() {
  const queryClient = useQueryClient();
  const [expandedCert, setExpandedCert] = useState<string | null>(null);
  const [reissueCsr, setReissueCsr] = useState('');

  const { data: certificates, isLoading } = useQuery({
    queryKey: ['ssl', 'certificates'],
    queryFn: sslApi.getCertificates,
  });

  const resendDcv = useMutation({
    mutationFn: (uuid: string) => sslApi.resendDcv(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ssl', 'certificates'] });
    },
  });

  const generateCsr = useMutation({
    mutationFn: (uuid: string) => sslApi.generateCsr(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ssl', 'certificates'] });
    },
  });

  const reissueCert = useMutation({
    mutationFn: ({ uuid, csr }: { uuid: string; csr: string }) => sslApi.reissueCertificate(uuid, csr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ssl', 'certificates'] });
      setReissueCsr('');
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
          <h1 className="text-2xl font-bold text-gray-900">SSL Certificates</h1>
          <p className="text-gray-500">Manage your SSL certificates and website security</p>
        </div>
        <Link to="/security" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Certificate
        </Link>
      </div>

      {/* Certificates List */}
      {certificates && certificates.length > 0 ? (
        <div className="grid gap-4">
          {certificates.map((cert: any) => {
            const isExpiring = cert.expiresAt && new Date(cert.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const isExpanded = expandedCert === cert.uuid;
            const isPending = cert.status === 'pending';
            const isIssued = cert.status === 'issued' || cert.status === 'active';

            return (
              <div key={cert.id} className="bg-white border border-gray-200 rounded-[7px] overflow-hidden hover:shadow-md transition-shadow">
                {/* Main Row */}
                <div
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedCert(isExpanded ? null : cert.uuid)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[#064A6C]" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium">{cert.domain || cert.domainName}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className={`badge badge-${
                          isIssued ? 'success' :
                          isPending ? 'warning' :
                          cert.status === 'expired' ? 'error' : 'neutral'
                        } text-xs`}>
                          {cert.status}
                        </span>
                        <span>{cert.productType || cert.type || 'DV SSL'}</span>
                        {cert.expiresAt && (
                          <span className={isExpiring ? 'text-red-500 font-medium' : ''}>
                            {isExpiring && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                            Expires {new Date(cert.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isPending && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resendDcv.mutate(cert.uuid);
                        }}
                        disabled={resendDcv.isPending}
                        className="btn-outline text-sm flex items-center gap-2"
                      >
                        <Mail className={`w-4 h-4 ${resendDcv.isPending ? 'animate-spin' : ''}`} />
                        Resend DCV
                      </button>
                    )}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Certificate Info */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900">Certificate Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Domain</span>
                            <span className="text-gray-900">{cert.domain || cert.domainName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type</span>
                            <span className="text-gray-900">{cert.productType || cert.type || 'DV'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Provider</span>
                            <span className="text-gray-900">{cert.provider || 'Sectigo'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className={`font-medium ${isIssued ? 'text-green-600' : isPending ? 'text-yellow-600' : 'text-gray-500'}`}>
                              {cert.status}
                            </span>
                          </div>
                          {cert.issuedAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Issued</span>
                              <span className="text-gray-900">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          {cert.expiresAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expires</span>
                              <span className={isExpiring ? 'text-red-500 font-medium' : 'text-gray-900'}>
                                {new Date(cert.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900">Actions</h4>

                        {/* Pending: show DCV info and resend button */}
                        {isPending && (
                          <div className="space-y-3">
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-[7px]">
                              <div className="flex items-start gap-2 text-yellow-700 text-sm">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">Domain validation required</p>
                                  <p className="mt-1">Complete the DCV email verification to activate your certificate.</p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => resendDcv.mutate(cert.uuid)}
                              disabled={resendDcv.isPending}
                              className="btn-outline text-sm flex items-center gap-2 w-full justify-center"
                            >
                              <Mail className={`w-4 h-4 ${resendDcv.isPending ? 'animate-spin' : ''}`} />
                              Resend DCV Email
                            </button>
                            {resendDcv.isSuccess && (
                              <p className="text-green-600 text-xs flex items-center gap-1">
                                <Check className="w-3 h-3" /> DCV email sent
                              </p>
                            )}
                            <button
                              onClick={() => generateCsr.mutate(cert.uuid)}
                              disabled={generateCsr.isPending}
                              className="btn-outline text-sm flex items-center gap-2 w-full justify-center"
                            >
                              <FileText className={`w-4 h-4 ${generateCsr.isPending ? 'animate-spin' : ''}`} />
                              Generate CSR
                            </button>
                          </div>
                        )}

                        {/* Issued: show reissue option */}
                        {isIssued && (
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 border border-green-200 rounded-[7px]">
                              <div className="flex items-center gap-2 text-green-700 text-sm">
                                <Check className="w-4 h-4" />
                                <span>Certificate is active and valid</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Reissue with new CSR
                              </label>
                              <textarea
                                value={reissueCsr}
                                onChange={(e) => setReissueCsr(e.target.value)}
                                placeholder="Paste new CSR here..."
                                rows={3}
                                className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#064A6C]"
                              />
                              <button
                                onClick={() => reissueCert.mutate({ uuid: cert.uuid, csr: reissueCsr })}
                                disabled={reissueCert.isPending || !reissueCsr.trim()}
                                className="mt-2 btn-outline text-sm flex items-center gap-2 w-full justify-center disabled:opacity-50"
                              >
                                <RefreshCw className={`w-4 h-4 ${reissueCert.isPending ? 'animate-spin' : ''}`} />
                                Reissue Certificate
                              </button>
                              {reissueCert.isSuccess && (
                                <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Reissue initiated
                                </p>
                              )}
                              {reissueCert.isError && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <X className="w-3 h-3" /> Reissue failed
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expired */}
                        {cert.status === 'expired' && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-[7px]">
                            <div className="flex items-start gap-2 text-red-700 text-sm">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">Certificate expired</p>
                                <p className="mt-1">Purchase a new certificate to restore HTTPS protection.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-[7px] text-center py-16 px-6">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No SSL certificates yet</h3>
          <p className="text-gray-500 mb-6">Secure your websites with SSL encryption</p>
          <Link to="/security" className="btn-primary">
            Get SSL Certificate
          </Link>
        </div>
      )}
    </div>
  );
}
