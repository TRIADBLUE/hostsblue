import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { panelApi } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MoreHorizontal,
  UserX,
  UserCheck,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Deleted', value: 'deleted' },
];

const statusColors: Record<string, string> = {
  active: 'bg-[#10B981] text-white',
  suspended: 'bg-[#FFD700] text-[#09080E]',
  deleted: 'bg-[#DC2626] text-white',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PanelCustomersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [openActions, setOpenActions] = useState<number | null>(null);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['panel-customers', searchQuery, activeFilter, page],
    queryFn: () =>
      panelApi.getCustomers({
        search: searchQuery || undefined,
        status: activeFilter || undefined,
        page,
        limit,
      }),
  });

  const customers = data?.customers || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const suspendMutation = useMutation({
    mutationFn: (id: number) => panelApi.suspendCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panel-customers'] });
      setOpenActions(null);
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => panelApi.activateCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panel-customers'] });
      setOpenActions(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Customers</h1>
        <p className="text-[#4B5563]">
          Manage customer accounts{total > 0 && ` \u2014 ${total} total`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search customers by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-[7px] text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#4B5563]" />
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-teal-50 text-[#064A6C]'
                    : 'text-[#4B5563] hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
        </div>
      )}

      {/* Customers Table */}
      {!isLoading && (
        <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#4B5563]">
                      No customers found.
                    </td>
                  </tr>
                )}
                {customers.map((customer: any) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/panel/customers/${customer.id}`)}
                  >
                    <td className="px-6 py-3 text-sm font-medium text-[#09080E]">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{customer.email}</td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{customer.company || '--'}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusColors[customer.status] || 'bg-gray-200 text-[#4B5563]'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-3 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActions(openActions === customer.id ? null : customer.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-[#4B5563]" />
                      </button>
                      {openActions === customer.id && (
                        <div className="absolute right-6 top-10 bg-white border border-[#E5E7EB] rounded-[7px] shadow-lg py-1 z-10 w-48">
                          <Link
                            to={`/panel/customers/${customer.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" /> View Detail
                          </Link>
                          {customer.status === 'active' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                suspendMutation.mutate(customer.id);
                              }}
                              disabled={suspendMutation.isPending}
                              className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2"
                            >
                              <UserX className="w-4 h-4" /> Suspend
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                activateMutation.mutate(customer.id);
                              }}
                              disabled={activateMutation.isPending}
                              className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-50 flex items-center gap-2"
                            >
                              <UserCheck className="w-4 h-4" /> Activate
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
              <p className="text-sm text-[#4B5563]">
                Page {page} of {totalPages} ({total} customers)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-[7px] border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-[7px] border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
