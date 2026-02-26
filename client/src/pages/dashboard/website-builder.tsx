import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteBuilderApi } from '@/lib/api';
import { Palette, Plus, Loader2, ExternalLink, Edit, Upload, Trash2, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function WebsiteBuilderPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['website-builder', 'projects'],
    queryFn: websiteBuilderApi.getProjects,
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
          <p className="text-gray-500">Build and manage your website projects</p>
        </div>
        <button
          onClick={() => window.location.href = '/website-builder'}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

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
            onClick={() => window.location.href = '/website-builder'}
            className="btn-primary"
          >
            Create a Website
          </button>
        </div>
      )}
    </div>
  );
}
