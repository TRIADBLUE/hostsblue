import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { panelApi } from '@/lib/api';
import {
  ArrowLeft, Loader2, Globe, Server, Mail, ShieldCheck, Palette, Headphones,
  UserX, UserCheck, Trash2, Plus, Send,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  active: 'bg-[#10B981] text-white',
  suspended: 'bg-[#FFD700] text-[#09080E]',
  deleted: 'bg-[#DC2626] text-white',
};

const tabs = ['overview', 'domains', 'hosting', 'email', 'ssl', 'projects', 'tickets', 'notes'] as const;
type Tab = (typeof tabs)[number];

const tabIcons: Record<Tab, any> = {
  overview: null,
  domains: Globe,
  hosting: Server,
  email: Mail,
  ssl: ShieldCheck,
  projects: Palette,
  tickets: Headphones,
  notes: Send,
};

export function PanelCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [noteText, setNoteText] = useState('');

  const { data: customer, isLoading } = useQuery({
    queryKey: ['panel', 'customer', customerId],
    queryFn: () => panelApi.getCustomer(customerId),
    enabled: !!customerId,
  });

  const suspendMutation = useMutation({
    mutationFn: () => panelApi.suspendCustomer(customerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['panel', 'customer', customerId] }),
  });

  const activateMutation = useMutation({
    mutationFn: () => panelApi.activateCustomer(customerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['panel', 'customer', customerId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => panelApi.deleteCustomer(customerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['panel', 'customer', customerId] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <p className="text-[#4B5563]">Customer not found</p>
        <Link to="/panel/customers" className="text-[#064A6C] hover:underline text-sm mt-2 inline-block">Back to Customers</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/panel/customers" className="p-2 hover:bg-gray-100 rounded-[7px] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#4B5563]" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#09080E]">
                {customer.firstName} {customer.lastName}
              </h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[customer.status] || 'bg-gray-100'}`}>
                {customer.status}
              </span>
              {customer.isAdmin && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Admin</span>
              )}
            </div>
            <p className="text-[#4B5563] text-sm">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {customer.status === 'active' ? (
            <button
              onClick={() => suspendMutation.mutate()}
              disabled={suspendMutation.isPending}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-[#E5E7EB] rounded-[7px] hover:bg-gray-50 text-[#4B5563]"
            >
              <UserX className="w-4 h-4" /> Suspend
            </button>
          ) : customer.status === 'suspended' ? (
            <button
              onClick={() => activateMutation.mutate()}
              disabled={activateMutation.isPending}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#064A6C] text-white rounded-[7px] hover:bg-[#053C58]"
            >
              <UserCheck className="w-4 h-4" /> Activate
            </button>
          ) : null}
          <button
            onClick={() => { if (confirm('Delete this customer?')) deleteMutation.mutate(); }}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-red-200 rounded-[7px] hover:bg-red-50 text-[#DC2626]"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: 'Domains', value: customer.services?.domains || 0, icon: Globe },
          { label: 'Hosting', value: customer.services?.hosting || 0, icon: Server },
          { label: 'Email', value: customer.services?.email || 0, icon: Mail },
          { label: 'SSL', value: customer.services?.ssl || 0, icon: ShieldCheck },
          { label: 'Projects', value: customer.services?.projects || 0, icon: Palette },
          { label: 'Total Spent', value: `$${((customer.totalSpent || 0) / 100).toFixed(2)}`, icon: null },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="w-4 h-4 text-[#4B5563]" />}
              <span className="text-xs text-[#4B5563]">{label}</span>
            </div>
            <div className="text-xl font-bold text-[#09080E]">{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-[7px] p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-[7px] transition-colors whitespace-nowrap flex items-center gap-2 capitalize ${
                activeTab === tab ? 'bg-white text-[#064A6C] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab customer={customer} />}
      {activeTab === 'domains' && <ServiceTab customerId={customerId} service="domains" />}
      {activeTab === 'hosting' && <ServiceTab customerId={customerId} service="hosting" />}
      {activeTab === 'email' && <ServiceTab customerId={customerId} service="email" />}
      {activeTab === 'ssl' && <ServiceTab customerId={customerId} service="ssl" />}
      {activeTab === 'projects' && <ServiceTab customerId={customerId} service="projects" />}
      {activeTab === 'tickets' && <ServiceTab customerId={customerId} service="tickets" />}
      {activeTab === 'notes' && <NotesTab customerId={customerId} noteText={noteText} setNoteText={setNoteText} />}
    </div>
  );
}

function OverviewTab({ customer }: { customer: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
        <h3 className="text-sm font-semibold text-[#09080E] mb-4">Customer Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#4B5563]">Name</span>
            <span className="text-[#09080E] font-medium">{customer.firstName} {customer.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#4B5563]">Email</span>
            <span className="text-[#09080E]">{customer.email}</span>
          </div>
          {customer.company && (
            <div className="flex justify-between">
              <span className="text-[#4B5563]">Company</span>
              <span className="text-[#09080E]">{customer.company}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex justify-between">
              <span className="text-[#4B5563]">Phone</span>
              <span className="text-[#09080E]">{customer.phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#4B5563]">Joined</span>
            <span className="text-[#09080E]">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#4B5563]">Last Login</span>
            <span className="text-[#09080E]">{customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-6">
        <h3 className="text-sm font-semibold text-[#09080E] mb-4">Recent Orders</h3>
        {customer.orders && customer.orders.length > 0 ? (
          <div className="space-y-2">
            {customer.orders.slice(0, 10).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <div>
                  <span className="font-medium text-[#064A6C]">{order.orderNumber}</span>
                  <span className="text-xs text-[#4B5563] ml-2">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#09080E]">${((order.total || 0) / 100).toFixed(2)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-[#10B981] text-white' :
                    order.status === 'pending_payment' ? 'bg-[#FFD700] text-[#09080E]' :
                    order.status === 'failed' ? 'bg-[#DC2626] text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#4B5563]">No orders yet</p>
        )}
      </div>
    </div>
  );
}

function ServiceTab({ customerId, service }: { customerId: number; service: string }) {
  const fetchFn = {
    domains: () => panelApi.getCustomerDomains(customerId),
    hosting: () => panelApi.getCustomerHosting(customerId),
    email: () => panelApi.getCustomerEmail(customerId),
    ssl: () => panelApi.getCustomerSsl(customerId),
    projects: () => panelApi.getCustomerProjects(customerId),
    tickets: () => panelApi.getCustomerTickets(customerId),
  }[service];

  const { data: items, isLoading } = useQuery({
    queryKey: ['panel', 'customer', customerId, service],
    queryFn: fetchFn,
    enabled: !!customerId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-8 text-center">
        <p className="text-[#4B5563] text-sm">No {service} found for this customer</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#4B5563] border-b border-[#E5E7EB] bg-[#F9FAFB]">
            {service === 'domains' && <><th className="px-4 py-3 font-medium">Domain</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Expires</th></>}
            {service === 'hosting' && <><th className="px-4 py-3 font-medium">Domain</th><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Status</th></>}
            {service === 'email' && <><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Status</th></>}
            {service === 'ssl' && <><th className="px-4 py-3 font-medium">Domain</th><th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Expires</th></>}
            {service === 'projects' && <><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Slug</th><th className="px-4 py-3 font-medium">Status</th></>}
            {service === 'tickets' && <><th className="px-4 py-3 font-medium">Subject</th><th className="px-4 py-3 font-medium">Priority</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Created</th></>}
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
              {service === 'domains' && (
                <>
                  <td className="px-4 py-3 font-medium text-[#064A6C]">{item.domainName}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-[#4B5563]">{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '—'}</td>
                </>
              )}
              {service === 'hosting' && (
                <>
                  <td className="px-4 py-3 font-medium text-[#064A6C]">{item.domain}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{item.planSlug}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                </>
              )}
              {service === 'email' && (
                <>
                  <td className="px-4 py-3 font-medium text-[#064A6C]">{item.emailAddress}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{item.plan}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                </>
              )}
              {service === 'ssl' && (
                <>
                  <td className="px-4 py-3 font-medium text-[#064A6C]">{item.domain}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{item.productSlug}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-[#4B5563]">{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '—'}</td>
                </>
              )}
              {service === 'projects' && (
                <>
                  <td className="px-4 py-3 font-medium text-[#09080E]">{item.name}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{item.slug || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                </>
              )}
              {service === 'tickets' && (
                <>
                  <td className="px-4 py-3 font-medium text-[#09080E]">{item.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.priority === 'urgent' ? 'bg-red-100 text-[#DC2626]' :
                      item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      item.priority === 'normal' ? 'bg-blue-50 text-[#1844A6]' :
                      'bg-gray-100 text-[#4B5563]'
                    }`}>{item.priority}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-[#4B5563]">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotesTab({ customerId, noteText, setNoteText }: { customerId: number; noteText: string; setNoteText: (v: string) => void }) {
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['panel', 'customer', customerId, 'notes'],
    queryFn: () => panelApi.getCustomerNotes(customerId),
  });

  const addNoteMutation = useMutation({
    mutationFn: (content: string) => panelApi.addCustomerNote(customerId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panel', 'customer', customerId, 'notes'] });
      setNoteText('');
    },
  });

  return (
    <div className="space-y-4">
      {/* Add Note */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
        <div className="flex gap-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add an internal note about this customer..."
            rows={3}
            className="flex-1 border border-[#E5E7EB] rounded-[7px] p-3 text-sm text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] resize-none"
          />
          <button
            onClick={() => noteText.trim() && addNoteMutation.mutate(noteText.trim())}
            disabled={!noteText.trim() || addNoteMutation.isPending}
            className="self-end bg-[#064A6C] hover:bg-[#053C58] text-white px-4 py-2.5 rounded-[7px] text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {addNoteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" /></div>
      ) : notes && notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note: any) => (
            <div key={note.id} className="bg-white border border-[#E5E7EB] rounded-[7px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#09080E]">{note.adminName || 'Admin'}</span>
                <span className="text-xs text-[#4B5563]">{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-[#4B5563] whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-8 text-center">
          <p className="text-sm text-[#4B5563]">No notes yet</p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-[#10B981] text-white',
    published: 'bg-[#10B981] text-white',
    open: 'bg-[#10B981] text-white',
    suspended: 'bg-[#FFD700] text-[#09080E]',
    pending: 'bg-[#FFD700] text-[#09080E]',
    in_progress: 'bg-[#FFD700] text-[#09080E]',
    draft: 'bg-[#FFD700] text-[#09080E]',
    expired: 'bg-[#DC2626] text-white',
    cancelled: 'bg-[#DC2626] text-white',
    deleted: 'bg-[#DC2626] text-white',
    closed: 'bg-gray-200 text-[#4B5563]',
    resolved: 'bg-blue-100 text-[#1844A6]',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || 'bg-gray-100 text-gray-500'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}
