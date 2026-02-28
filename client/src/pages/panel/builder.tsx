import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { panelApi } from '@/lib/api';
import {
  Loader2,
  MoreHorizontal,
  ExternalLink,
  Ban,
  CheckCircle,
  Palette,
  Globe,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  published: 'bg-[#10B981] text-white',
  draft: 'bg-[#FFD700] text-[#09080E]',
  suspended: 'bg-[#DC2626] text-white',
};

export function PanelBuilderPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [openActions, setOpenActions] = useState<number | null>(null);
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['panel', 'builder', page],
    queryFn: () => panelApi.getBuilder({ page, limit }),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: number) => panelApi.suspendProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panel', 'builder'] });
      setOpenActions(null);
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => panelApi.activateProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panel', 'builder'] });
      setOpenActions(null);
    },
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
        Failed to load builder projects.
      </div>
    );
  }

  const projects = data?.projects || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const publishedCount = projects.filter((p: any) => p.status === 'published').length;
  const draftCount = projects.filter((p: any) => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Website Builder</h1>
        <p className="text-[#4B5563]">All customer website builder projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Projects', value: total },
          { label: 'Published', value: publishedCount },
          { label: 'Drafts', value: draftCount },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
            <div className="text-xs text-[#4B5563]">{label}</div>
            <div className="text-2xl font-bold text-[#09080E] mt-1">{value}</div>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Business Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">AI Generated</th>
                <th className="px-6 py-3 font-medium">Updated</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#4B5563] flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-[#09080E]">{project.name}</div>
                          {project.slug && (
                            <div className="text-xs text-[#4B5563] flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {project.slug}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-sm text-[#09080E]">{project.customerName || '--'}</div>
                      {project.customerEmail && (
                        <div className="text-xs text-[#4B5563]">{project.customerEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-[#4B5563] capitalize">{project.businessType || '--'}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[project.status] || 'bg-gray-100 text-[#4B5563]'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {project.aiGenerated ? (
                        <Sparkles className="w-4 h-4 text-[#064A6C] inline-block" />
                      ) : (
                        <span className="text-[#4B5563] text-sm">--</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">
                      {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}
                    </td>
                    <td className="px-6 py-3 relative">
                      <button
                        onClick={() => setOpenActions(openActions === project.id ? null : project.id)}
                        className="p-1 hover:bg-gray-100 rounded-[7px] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                      </button>
                      {openActions === project.id && (
                        <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-44">
                          {project.status === 'published' && project.slug && (
                            <a
                              href={`/sites/${project.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" /> View Live
                            </a>
                          )}
                          {project.status !== 'suspended' && (
                            <button
                              onClick={() => suspendMutation.mutate(project.id)}
                              disabled={suspendMutation.isPending}
                              className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <Ban className="w-4 h-4" />
                              {suspendMutation.isPending ? 'Suspending...' : 'Suspend'}
                            </button>
                          )}
                          {project.status === 'suspended' && (
                            <button
                              onClick={() => activateMutation.mutate(project.id)}
                              disabled={activateMutation.isPending}
                              className="w-full text-left px-4 py-2 text-sm text-[#10B981] hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {activateMutation.isPending ? 'Activating...' : 'Activate'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#4B5563]">
                    No builder projects yet
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
