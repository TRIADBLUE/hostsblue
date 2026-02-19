import { useState } from 'react';
import { MoreHorizontal, Eye, Ban, Trash2 } from 'lucide-react';

interface BuilderProject {
  id: number;
  name: string;
  domain: string;
  customer: string;
  template: string;
  status: 'Published' | 'Draft';
  lastEdited: string;
}

const projects: BuilderProject[] = [
  { id: 1, name: 'Mitchell Design Portfolio', domain: 'mitchelldesign.com', customer: 'Sarah Mitchell', template: 'Creative Portfolio', status: 'Published', lastEdited: 'Feb 18, 2026' },
  { id: 2, name: 'GreenLeaf Online Store', domain: 'ecofriendly.shop', customer: 'Priya Sharma', template: 'E-commerce Standard', status: 'Published', lastEdited: 'Feb 17, 2026' },
  { id: 3, name: 'Bennett Law Firm Site', domain: 'bennettlaw.com', customer: 'Laura Bennett', template: 'Professional Services', status: 'Published', lastEdited: 'Feb 15, 2026' },
  { id: 4, name: 'Wright Photography', domain: 'wrightphoto.com', customer: 'Thomas Wright', template: 'Photography Gallery', status: 'Draft', lastEdited: 'Feb 14, 2026' },
  { id: 5, name: 'Lagos Digital Agency', domain: 'lagosdigital.ng', customer: 'Michael Okonkwo', template: 'Agency Landing', status: 'Published', lastEdited: 'Feb 12, 2026' },
  { id: 6, name: 'Tokyo Creative Hub', domain: 'tokyocreative.co', customer: 'Robert Tanaka', template: 'Creative Portfolio', status: 'Draft', lastEdited: 'Feb 10, 2026' },
];

const statusColors: Record<string, string> = {
  Published: 'bg-[#10B981] text-white',
  Draft: 'bg-[#FFD700] text-[#09080E]',
};

export function PanelBuilderPage() {
  const [openActions, setOpenActions] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Website Builder</h1>
        <p className="text-[#4B5563]">Manage customer website builder projects</p>
      </div>

      {/* Builder Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 font-medium">Project Name</th>
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Template</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Edited</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-[#09080E]">{project.name}</td>
                  <td className="px-6 py-3 text-sm text-[#064A6C]">{project.domain}</td>
                  <td className="px-6 py-3 text-sm text-[#09080E]">{project.customer}</td>
                  <td className="px-6 py-3 text-sm text-[#4B5563]">{project.template}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#4B5563]">{project.lastEdited}</td>
                  <td className="px-6 py-3 relative">
                    <button
                      onClick={() => setOpenActions(openActions === project.id ? null : project.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                    </button>
                    {openActions === project.id && (
                      <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-40">
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2">
                          <Ban className="w-4 h-4" /> Suspend
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete
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
