import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteBuilderApi } from '@/lib/api';
import { Palette, Plus, Loader2, ExternalLink, Edit, Upload, Trash2, Globe, MessageSquare, X, Mail, Clock, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CoachGreenWizard } from '@/components/onboarding/coach-green-wizard';

function SubmissionsModal({ projectUuid, projectName, onClose }: { projectUuid: string; projectName: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions', projectUuid],
    queryFn: () => websiteBuilderApi.getSubmissions(projectUuid),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => websiteBuilderApi.deleteSubmission(projectUuid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', projectUuid] });
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[7px] max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Form Submissions</h2>
            <p className="text-sm text-gray-500">{projectName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
            </div>
          ) : !submissions || submissions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No form submissions yet</p>
              <p className="text-sm text-gray-400 mt-1">Submissions from your published site will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub: any) => (
                <div key={sub.id} className="border border-gray-200 rounded-[7px] p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {sub.name && <span className="font-medium text-gray-900">{sub.name}</span>}
                      {sub.email && (
                        <a href={`mailto:${sub.email}`} className="text-sm text-[#064A6C] flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {sub.email}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteMutation.mutate(sub.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete submission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {sub.message && <p className="text-sm text-gray-600 whitespace-pre-wrap">{sub.message}</p>}
                  {sub.pageSlug && <span className="text-xs text-gray-400 mt-2 inline-block">Page: {sub.pageSlug}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WebsiteBuilderPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [submissionsProject, setSubmissionsProject] = useState<{ uuid: string; name: string } | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['website-builder', 'projects'],
    queryFn: websiteBuilderApi.getProjects,
  });

  const { data: planData } = useQuery({
    queryKey: ['website-builder', 'plan'],
    queryFn: websiteBuilderApi.getPlan,
  });

  const publishMutation = useMutation({
    mutationFn: (uuid: string) => websiteBuilderApi.publishProject(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-builder', 'projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => websiteBuilderApi.deleteProject(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-builder', 'projects'] });
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
          <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-500">Build and manage your website projects</p>
            {planData && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-[7px] bg-[#064A6C]/10 text-[#064A6C] capitalize">
                {planData.plan} Plan
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Plan Usage */}
      {planData && planData.limits && (
        <div className="bg-white border border-gray-200 rounded-[7px] p-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500">
              Sites: <strong className="text-gray-900">{planData.usage?.sites || 0}</strong> / {planData.limits.maxSites}
            </span>
            <span className="text-gray-500">
              Pages per site: <strong className="text-gray-900">{planData.limits.maxPagesPerSite}</strong>
            </span>
          </div>
          {planData.plan === 'starter' && (
            <span className="text-xs text-[#064A6C] font-medium cursor-pointer hover:underline">Upgrade Plan</span>
          )}
        </div>
      )}

      {/* Projects List */}
      {projects && projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-[7px] p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-[#064A6C]" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium">{project.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className={`badge badge-${
                        project.status === 'published' ? 'success' :
                        project.status === 'draft' ? 'warning' : 'neutral'
                      } text-xs`}>
                        {project.status}
                      </span>
                      {project.pagesCount !== undefined && (
                        <span>{project.pagesCount} page{project.pagesCount !== 1 ? 's' : ''}</span>
                      )}
                      {project.aiGenerated && (
                        <span className="text-[#064A6C] text-xs font-medium">AI Generated</span>
                      )}
                      {project.updatedAt && (
                        <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSubmissionsProject({ uuid: project.uuid, name: project.name })}
                    className="p-2 text-gray-400 hover:text-[#064A6C] transition-colors"
                    title="Form submissions"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/website-builder/${project.uuid}/edit`)}
                    className="btn-outline text-sm flex items-center gap-2"
                    title="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  {project.publishedUrl && project.status === 'published' && (
                    <a
                      href={`/sites/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm flex items-center gap-2"
                      title="View published site"
                    >
                      <Globe className="w-4 h-4" />
                      View Site
                    </a>
                  )}
                  {project.status === 'draft' && (
                    <button
                      onClick={() => publishMutation.mutate(project.uuid)}
                      disabled={publishMutation.isPending}
                      className="btn-primary text-sm flex items-center gap-2"
                    >
                      <Upload className={`w-4 h-4 ${publishMutation.isPending ? 'animate-spin' : ''}`} />
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Delete this project? This cannot be undone.')) {
                        deleteMutation.mutate(project.uuid);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-[7px] text-center py-16 px-6">
          <Palette className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No website projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first website with our AI-powered builder</p>
          <button
            onClick={() => setShowWizard(true)}
            className="btn-primary"
          >
            Create a Website
          </button>
        </div>
      )}

      {/* Submissions Modal */}
      {submissionsProject && (
        <SubmissionsModal
          projectUuid={submissionsProject.uuid}
          projectName={submissionsProject.name}
          onClose={() => setSubmissionsProject(null)}
        />
      )}

      {/* Coach Green Wizard */}
      {showWizard && (
        <CoachGreenWizard onClose={() => setShowWizard(false)} />
      )}
    </div>
  );
}
