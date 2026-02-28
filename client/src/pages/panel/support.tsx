import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { panelApi } from '@/lib/api';
import {
  Loader2,
  Filter,
  ChevronDown,
  ChevronUp,
  Send,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const statusFilters = ['all', 'open', 'in_progress', 'resolved', 'closed'];
const priorityFilters = ['all', 'low', 'normal', 'high', 'urgent'];

const statusLabels: Record<string, string> = {
  all: 'All',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const priorityLabels: Record<string, string> = {
  all: 'All',
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

const statusColors: Record<string, string> = {
  open: 'bg-[#10B981] text-white',
  in_progress: 'bg-[#FFD700] text-[#09080E]',
  resolved: 'bg-blue-100 text-[#1844A6]',
  closed: 'bg-gray-200 text-[#4B5563]',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-[#4B5563]',
  normal: 'bg-blue-50 text-[#1844A6]',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-[#DC2626]',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function PanelSupportPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [isInternal, setIsInternal] = useState<Record<number, boolean>>({});
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['panel', 'tickets', statusFilter, priorityFilter, page],
    queryFn: () =>
      panelApi.getTickets({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        page,
        limit,
      }),
  });

  const tickets = data?.tickets || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const openCount = data?.openCount || 0;
  const inProgressCount = data?.inProgressCount || 0;

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
        Failed to load support tickets.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#09080E]">Support Tickets</h1>
          <p className="text-[#4B5563]">Manage customer support requests</p>
        </div>
        <div className="flex items-center gap-3">
          {openCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-[#10B981] text-white text-sm font-medium">
              {openCount} Open
            </span>
          )}
          {inProgressCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-[#FFD700] text-[#09080E] text-sm font-medium">
              {inProgressCount} In Progress
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[#4B5563]" />
          <span className="text-sm text-[#4B5563] mr-1">Status:</span>
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => { setStatusFilter(filter); setPage(1); }}
              className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-teal-50 text-[#064A6C]'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              {statusLabels[filter]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[#4B5563]" />
          <span className="text-sm text-[#4B5563] mr-1">Priority:</span>
          {priorityFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => { setPriorityFilter(filter); setPage(1); }}
              className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                priorityFilter === filter
                  ? 'bg-teal-50 text-[#064A6C]'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              {priorityLabels[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-4 py-3 font-medium w-8"></th>
                <th className="px-4 py-3 font-medium">Ticket #</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket: any) => (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    isExpanded={expandedRow === ticket.id}
                    onToggle={() => setExpandedRow(expandedRow === ticket.id ? null : ticket.id)}
                    replyText={replyText[ticket.id] || ''}
                    onReplyChange={(text: string) => setReplyText({ ...replyText, [ticket.id]: text })}
                    isInternalNote={isInternal[ticket.id] || false}
                    onInternalChange={(val: boolean) => setIsInternal({ ...isInternal, [ticket.id]: val })}
                    onReplySent={() => setReplyText({ ...replyText, [ticket.id]: '' })}
                    queryClient={queryClient}
                    filterKey={[statusFilter, priorityFilter, page]}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[#4B5563]">
                    No tickets found
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

function TicketRow({
  ticket,
  isExpanded,
  onToggle,
  replyText,
  onReplyChange,
  isInternalNote,
  onInternalChange,
  onReplySent,
  queryClient,
  filterKey,
}: {
  ticket: any;
  isExpanded: boolean;
  onToggle: () => void;
  replyText: string;
  onReplyChange: (text: string) => void;
  isInternalNote: boolean;
  onInternalChange: (val: boolean) => void;
  onReplySent: () => void;
  queryClient: any;
  filterKey: any[];
}) {
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['panel', 'tickets'] });
    queryClient.invalidateQueries({ queryKey: ['panel', 'ticket-detail', ticket.id] });
  };

  // Load ticket detail when expanded
  const { data: ticketDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['panel', 'ticket-detail', ticket.id],
    queryFn: () => panelApi.getTicket(ticket.id),
    enabled: isExpanded,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => panelApi.updateTicket(ticket.id, data),
    onSuccess: invalidateAll,
  });

  const addMessageMutation = useMutation({
    mutationFn: ({ body, isInternal }: { body: string; isInternal: boolean }) =>
      panelApi.addTicketMessage(ticket.id, body, isInternal),
    onSuccess: () => {
      invalidateAll();
      onReplySent();
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => panelApi.closeTicket(ticket.id),
    onSuccess: invalidateAll,
  });

  const messages = ticketDetail?.messages || [];

  return (
    <>
      <tr
        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          )}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-[#064A6C]">#{ticket.id}</td>
        <td className="px-4 py-3 text-sm text-[#09080E] max-w-[220px] truncate">{ticket.subject}</td>
        <td className="px-4 py-3">
          <div className="text-sm text-[#09080E]">{ticket.customerName || '--'}</div>
          {ticket.customerEmail && (
            <div className="text-xs text-[#4B5563]">{ticket.customerEmail}</div>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-[#4B5563] capitalize">{ticket.category || '--'}</td>
        <td className="px-4 py-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[ticket.priority] || 'bg-gray-100 text-[#4B5563]'}`}>
            {priorityLabels[ticket.priority] || ticket.priority}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status] || 'bg-gray-100 text-[#4B5563]'}`}>
            {statusLabels[ticket.status] || ticket.status}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-[#4B5563]">{formatDate(ticket.createdAt)}</td>
        <td className="px-4 py-3 text-sm text-[#4B5563]">{ticket.assignedTo || 'Unassigned'}</td>
      </tr>

      {isExpanded && (
        <tr className="bg-[#F9FAFB]">
          <td colSpan={9} className="px-6 py-4">
            {detailLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
              </div>
            ) : (
              <>
                {/* Controls */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <div>
                    <label className="block text-xs font-medium text-[#4B5563] mb-1">Assign To</label>
                    <input
                      type="text"
                      defaultValue={ticket.assignedTo || ''}
                      placeholder="Agent name"
                      onBlur={(e) => {
                        if (e.target.value !== (ticket.assignedTo || '')) {
                          updateMutation.mutate({ assignedTo: e.target.value });
                        }
                      }}
                      className="border border-[#E5E7EB] rounded-[7px] px-3 py-1.5 text-sm text-[#09080E] focus:outline-none focus:ring-2 focus:ring-[#064A6C] w-40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4B5563] mb-1">Status</label>
                    <select
                      defaultValue={ticket.status}
                      onChange={(e) => updateMutation.mutate({ status: e.target.value })}
                      className="border border-[#E5E7EB] rounded-[7px] px-3 py-1.5 text-sm text-[#09080E] focus:outline-none focus:ring-2 focus:ring-[#064A6C]"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4B5563] mb-1">Priority</label>
                    <select
                      defaultValue={ticket.priority}
                      onChange={(e) => updateMutation.mutate({ priority: e.target.value })}
                      className="border border-[#E5E7EB] rounded-[7px] px-3 py-1.5 text-sm text-[#09080E] focus:outline-none focus:ring-2 focus:ring-[#064A6C]"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="ml-auto self-end">
                    <button
                      onClick={() => closeMutation.mutate()}
                      disabled={closeMutation.isPending || ticket.status === 'closed'}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-[7px] border border-[#DC2626] text-[#DC2626] text-sm font-medium hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      {closeMutation.isPending ? 'Closing...' : 'Close Ticket'}
                    </button>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {messages.length > 0 ? (
                    messages.map((msg: any) => {
                      let bgClass = 'bg-white border border-[#E5E7EB]';
                      let roleLabel = '';
                      if (msg.isInternal) {
                        bgClass = 'bg-yellow-50 border border-yellow-200';
                        roleLabel = 'Internal Note';
                      } else if (msg.senderType === 'agent') {
                        bgClass = 'bg-teal-50 border border-teal-100';
                        roleLabel = 'Staff';
                      }

                      return (
                        <div key={msg.id} className={`rounded-[7px] p-3 ${bgClass}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#09080E]">
                              {msg.senderName || msg.senderEmail || 'Unknown'}
                              {roleLabel && (
                                <span className={`ml-2 text-xs font-normal px-1.5 py-0.5 rounded ${
                                  msg.isInternal
                                    ? 'text-yellow-800 bg-yellow-100'
                                    : 'text-[#064A6C] bg-teal-50'
                                }`}>
                                  {roleLabel}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-[#4B5563]">{formatTime(msg.createdAt)}</span>
                          </div>
                          <p className="text-sm text-[#4B5563] whitespace-pre-wrap">{msg.body}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {msg.attachments.map((att: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#064A6C] underline"
                                >
                                  {att.name || `Attachment ${idx + 1}`}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-[#4B5563] text-center py-4">No messages yet</div>
                  )}
                </div>

                {/* Reply Form */}
                <div className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => onReplyChange(e.target.value)}
                    placeholder={isInternalNote ? 'Write an internal note...' : 'Type your reply...'}
                    rows={3}
                    className="w-full border border-[#E5E7EB] rounded-[7px] p-3 text-sm text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => onInternalChange(e.target.checked)}
                        className="rounded border-[#E5E7EB] text-[#064A6C] focus:ring-[#064A6C]"
                      />
                      <span className="text-sm text-[#4B5563]">Internal note</span>
                    </label>
                    <button
                      onClick={() => {
                        if (replyText.trim()) {
                          addMessageMutation.mutate({ body: replyText.trim(), isInternal: isInternalNote });
                        }
                      }}
                      disabled={!replyText.trim() || addMessageMutation.isPending}
                      className="bg-[#064A6C] hover:bg-[#053C58] text-white font-medium px-4 py-2 rounded-[7px] transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      {addMessageMutation.isPending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
