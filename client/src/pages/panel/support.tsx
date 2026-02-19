import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Send } from 'lucide-react';

const statusFilters = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
const priorityFilters = ['All', 'Low', 'Normal', 'High', 'Urgent'];

interface TicketMessage {
  sender: string;
  role: 'customer' | 'agent';
  message: string;
  time: string;
}

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  email: string;
  category: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  created: string;
  assignedTo: string;
  messages: TicketMessage[];
}

const tickets: Ticket[] = [
  {
    id: 'TKT-1089', subject: 'Cannot access cPanel after hosting upgrade', customer: 'Sarah Mitchell', email: 'sarah@mitchelldesign.com', category: 'Hosting', priority: 'High', status: 'Open', created: 'Feb 19, 2026', assignedTo: 'Alex Turner',
    messages: [
      { sender: 'Sarah Mitchell', role: 'customer', message: 'I upgraded my hosting plan to Business yesterday, but now I cannot access my cPanel. It shows a 403 Forbidden error. Can you please help?', time: 'Feb 19, 10:23 AM' },
      { sender: 'Alex Turner', role: 'agent', message: 'Hi Sarah, I can see your account was migrated to the new server. Let me check the permissions on your cPanel directory. This should be a quick fix.', time: 'Feb 19, 10:45 AM' },
      { sender: 'Sarah Mitchell', role: 'customer', message: 'Thank you! Please let me know when it is fixed. I have a client deadline today.', time: 'Feb 19, 10:52 AM' },
    ],
  },
  {
    id: 'TKT-1088', subject: 'Domain transfer stuck in pending status', customer: 'Laura Bennett', email: 'laura@bennettlaw.com', category: 'Domains', priority: 'Normal', status: 'In Progress', created: 'Feb 18, 2026', assignedTo: 'Maria Santos',
    messages: [
      { sender: 'Laura Bennett', role: 'customer', message: 'I initiated a domain transfer for bennettlaw.com three days ago and it is still showing Pending Transfer. The authorization code was confirmed by my previous registrar.', time: 'Feb 18, 2:15 PM' },
      { sender: 'Maria Santos', role: 'agent', message: 'Hi Laura, domain transfers can take up to 5-7 days. I have checked and your transfer is progressing normally. The previous registrar needs to release the domain. I will monitor this for you.', time: 'Feb 18, 3:00 PM' },
    ],
  },
  {
    id: 'TKT-1087', subject: 'SSL certificate not auto-renewing', customer: 'James Chen', email: 'james@chentech.io', category: 'SSL', priority: 'Urgent', status: 'Open', created: 'Feb 18, 2026', assignedTo: 'Unassigned',
    messages: [
      { sender: 'James Chen', role: 'customer', message: 'My wildcard SSL certificate for *.chentech.io was supposed to auto-renew on Feb 15, but it did not. My subdomains are now showing security warnings and it is affecting production traffic. This is critical!', time: 'Feb 18, 8:30 AM' },
      { sender: 'James Chen', role: 'customer', message: 'Update: I am getting reports from clients about the security warnings. Please prioritize this.', time: 'Feb 18, 9:15 AM' },
    ],
  },
  {
    id: 'TKT-1086', subject: 'Email deliverability issues - messages going to spam', customer: 'Carlos Mendez', email: 'carlos@mendezgroup.mx', category: 'Email', priority: 'High', status: 'In Progress', created: 'Feb 17, 2026', assignedTo: 'Alex Turner',
    messages: [
      { sender: 'Carlos Mendez', role: 'customer', message: 'Emails sent from carlos@mendezgroup.mx are consistently landing in recipients spam folders. We have verified our SPF and DKIM records are correct. This started about a week ago.', time: 'Feb 17, 11:00 AM' },
      { sender: 'Alex Turner', role: 'agent', message: 'Hi Carlos, I have checked your email server IP reputation and it appears the IP was listed on two RBLs. I have submitted delisting requests and adjusted your DMARC policy. It may take 24-48 hours to fully resolve.', time: 'Feb 17, 2:30 PM' },
      { sender: 'Carlos Mendez', role: 'customer', message: 'Thanks Alex. I will monitor and let you know if it improves.', time: 'Feb 17, 3:10 PM' },
    ],
  },
  {
    id: 'TKT-1085', subject: 'Website builder pages loading slowly', customer: 'Priya Sharma', email: 'priya@greenleafstudio.com', category: 'Website Builder', priority: 'Normal', status: 'Resolved', created: 'Feb 16, 2026', assignedTo: 'Maria Santos',
    messages: [
      { sender: 'Priya Sharma', role: 'customer', message: 'My website built with the website builder at ecofriendly.shop is loading very slowly. Page load times are around 8-10 seconds. It used to load in under 2 seconds.', time: 'Feb 16, 9:00 AM' },
      { sender: 'Maria Santos', role: 'agent', message: 'Hi Priya, I investigated and found that several large unoptimized images were recently added to your product pages. I have enabled our CDN image optimization for your site and the load times should be back to normal.', time: 'Feb 16, 11:30 AM' },
      { sender: 'Priya Sharma', role: 'customer', message: 'It is loading much faster now. Thank you for the quick fix!', time: 'Feb 16, 12:45 PM' },
    ],
  },
  {
    id: 'TKT-1084', subject: 'Requesting invoice for tax purposes', customer: 'Robert Tanaka', email: 'robert@tanakamedia.jp', category: 'Billing', priority: 'Low', status: 'Closed', created: 'Feb 15, 2026', assignedTo: 'Alex Turner',
    messages: [
      { sender: 'Robert Tanaka', role: 'customer', message: 'I need consolidated invoices for all my services for the 2025 fiscal year for my tax filing. Can you generate these?', time: 'Feb 15, 4:00 PM' },
      { sender: 'Alex Turner', role: 'agent', message: 'Hi Robert, I have generated your consolidated invoices for January through December 2025. They have been sent to your email address. Please let us know if you need anything else.', time: 'Feb 15, 5:15 PM' },
    ],
  },
  {
    id: 'TKT-1083', subject: 'How to set up email forwarding?', customer: 'Michael Okonkwo', email: 'michael@lagosdigital.ng', category: 'Email', priority: 'Low', status: 'Resolved', created: 'Feb 14, 2026', assignedTo: 'Maria Santos',
    messages: [
      { sender: 'Michael Okonkwo', role: 'customer', message: 'I want to set up email forwarding from info@lagosdigital.ng to my personal Gmail. How do I configure this?', time: 'Feb 14, 1:00 PM' },
      { sender: 'Maria Santos', role: 'agent', message: 'Hi Michael, you can set this up from your email control panel. Go to Email > Forwarding > Add Forwarder. Enter info@lagosdigital.ng as the source and your Gmail as the destination. I have attached a step-by-step guide.', time: 'Feb 14, 1:45 PM' },
      { sender: 'Michael Okonkwo', role: 'customer', message: 'Got it working, thank you very much!', time: 'Feb 14, 2:30 PM' },
    ],
  },
  {
    id: 'TKT-1082', subject: 'Need to increase PHP memory limit', customer: 'Emily Rodriguez', email: 'emily@brightpixel.co', category: 'Hosting', priority: 'Normal', status: 'In Progress', created: 'Feb 13, 2026', assignedTo: 'Alex Turner',
    messages: [
      { sender: 'Emily Rodriguez', role: 'customer', message: 'I am getting PHP fatal error: Allowed memory size exhausted on my WordPress site. Can you increase the PHP memory limit to 512MB?', time: 'Feb 13, 3:00 PM' },
      { sender: 'Alex Turner', role: 'agent', message: 'Hi Emily, I can increase this for you. However, your current Business plan allows up to 256MB. For 512MB you would need the Enterprise plan. Alternatively, I can help optimize your site to work within the 256MB limit. What would you prefer?', time: 'Feb 13, 4:00 PM' },
    ],
  },
  {
    id: 'TKT-1081', subject: 'Account suspended incorrectly', customer: 'David Kim', email: 'david@kimstartups.com', category: 'Billing', priority: 'High', status: 'Open', created: 'Feb 12, 2026', assignedTo: 'Unassigned',
    messages: [
      { sender: 'David Kim', role: 'customer', message: 'My account was suspended for non-payment, but I have auto-pay enabled with a valid credit card. The card has not expired and has sufficient funds. Please reactivate my account immediately.', time: 'Feb 12, 10:00 AM' },
      { sender: 'David Kim', role: 'customer', message: 'This is my business website and it has been down for 2 days now. I am losing clients. Please respond urgently.', time: 'Feb 13, 9:00 AM' },
    ],
  },
  {
    id: 'TKT-1080', subject: 'Bulk domain renewal pricing question', customer: 'Carlos Mendez', email: 'carlos@mendezgroup.mx', category: 'Domains', priority: 'Low', status: 'Closed', created: 'Feb 10, 2026', assignedTo: 'Maria Santos',
    messages: [
      { sender: 'Carlos Mendez', role: 'customer', message: 'I have 8 domains with you and they are all coming up for renewal in the next few months. Do you offer any bulk renewal discounts?', time: 'Feb 10, 11:00 AM' },
      { sender: 'Maria Santos', role: 'agent', message: 'Hi Carlos, great question! For customers with 5+ domains, we offer a 15% discount on bulk renewals when done at the same time. I have applied this discount to your account. When you are ready to renew, just proceed and the discount will be applied automatically.', time: 'Feb 10, 12:30 PM' },
    ],
  },
];

const statusColors: Record<string, string> = {
  Open: 'bg-[#10B981] text-white',
  'In Progress': 'bg-[#FFD700] text-[#09080E]',
  Resolved: 'bg-blue-100 text-[#1844A6]',
  Closed: 'bg-gray-200 text-[#4B5563]',
};

const priorityColors: Record<string, string> = {
  Low: 'bg-gray-100 text-[#4B5563]',
  Normal: 'bg-blue-50 text-[#1844A6]',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-[#DC2626]',
};

export function PanelSupportPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const filtered = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#09080E]">Support Tickets</h1>
        <p className="text-[#4B5563]">Manage customer support requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-[7px] p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4B5563]" />
          <span className="text-sm text-[#4B5563] mr-1">Status:</span>
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-teal-50 text-[#064A6C]'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4B5563]" />
          <span className="text-sm text-[#4B5563] mr-1">Priority:</span>
          {priorityFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setPriorityFilter(filter)}
              className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                priorityFilter === filter
                  ? 'bg-teal-50 text-[#064A6C]'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              {filter}
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
                <th className="px-6 py-3 font-medium w-8"></th>
                <th className="px-6 py-3 font-medium">Ticket #</th>
                <th className="px-6 py-3 font-medium">Subject</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => (
                <>
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === ticket.id ? null : ticket.id)}
                  >
                    <td className="px-6 py-3">
                      {expandedRow === ticket.id ? (
                        <ChevronUp className="w-4 h-4 text-[#4B5563]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#4B5563]" />
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-[#064A6C]">{ticket.id}</td>
                    <td className="px-6 py-3 text-sm text-[#09080E] max-w-[220px] truncate">{ticket.subject}</td>
                    <td className="px-6 py-3 text-sm text-[#09080E]">{ticket.customer}</td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{ticket.category}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{ticket.created}</td>
                    <td className="px-6 py-3 text-sm text-[#4B5563]">{ticket.assignedTo}</td>
                  </tr>
                  {expandedRow === ticket.id && (
                    <tr key={`${ticket.id}-detail`} className="bg-[#F9FAFB]">
                      <td colSpan={9} className="px-6 py-4">
                        {/* Controls */}
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-[#4B5563] mb-1">Assign To</label>
                            <select className="border border-[#E5E7EB] rounded-[7px] px-3 py-1.5 text-sm text-[#09080E] focus:outline-none focus:ring-2 focus:ring-[#064A6C]">
                              <option>Unassigned</option>
                              <option>Alex Turner</option>
                              <option>Maria Santos</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#4B5563] mb-1">Status</label>
                            <select className="border border-[#E5E7EB] rounded-[7px] px-3 py-1.5 text-sm text-[#09080E] focus:outline-none focus:ring-2 focus:ring-[#064A6C]">
                              <option>Open</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                              <option>Closed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#4B5563] mb-1">Priority</label>
                            <select className="border border-[#E5E7EB] rounded-[7px] px-3 py-1.5 text-sm text-[#09080E] focus:outline-none focus:ring-2 focus:ring-[#064A6C]">
                              <option>Low</option>
                              <option>Normal</option>
                              <option>High</option>
                              <option>Urgent</option>
                            </select>
                          </div>
                        </div>

                        {/* Conversation Thread */}
                        <div className="space-y-3 mb-4">
                          {ticket.messages.map((msg, i) => (
                            <div
                              key={i}
                              className={`rounded-[7px] p-3 ${
                                msg.role === 'customer'
                                  ? 'bg-white border border-[#E5E7EB]'
                                  : 'bg-teal-50 border border-teal-100'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-[#09080E]">
                                  {msg.sender}
                                  {msg.role === 'agent' && (
                                    <span className="ml-2 text-xs font-normal text-[#064A6C] bg-teal-50 px-1.5 py-0.5 rounded">
                                      Staff
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-[#4B5563]">{msg.time}</span>
                              </div>
                              <p className="text-sm text-[#4B5563]">{msg.message}</p>
                            </div>
                          ))}
                        </div>

                        {/* Reply Form */}
                        <div className="flex gap-2">
                          <textarea
                            value={replyText[ticket.id] || ''}
                            onChange={(e) => setReplyText({ ...replyText, [ticket.id]: e.target.value })}
                            placeholder="Type your reply..."
                            rows={3}
                            className="flex-1 border border-[#E5E7EB] rounded-[7px] p-3 text-sm text-[#09080E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064A6C] focus:border-transparent resize-none"
                          />
                          <button className="self-end bg-[#064A6C] hover:bg-[#053A55] text-white font-medium px-4 py-2.5 rounded-[7px] transition-colors flex items-center gap-2 text-sm">
                            <Send className="w-4 h-4" />
                            Send
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
