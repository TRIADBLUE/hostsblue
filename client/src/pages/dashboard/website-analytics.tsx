import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { websiteBuilderApi } from '@/lib/api';
import { ArrowLeft, Loader2, Eye, Users, FileText, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';

export function WebsiteAnalyticsPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [days, setDays] = useState(30);

  const { data: project } = useQuery({
    queryKey: ['website-builder', 'project', uuid],
    queryFn: () => websiteBuilderApi.getProject(uuid!),
    enabled: !!uuid,
  });

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['website-builder', 'analytics', uuid, days],
    queryFn: () => websiteBuilderApi.getAnalytics(uuid!, days),
    enabled: !!uuid,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  const maxPageviews = analytics?.daily ? Math.max(...analytics.daily.map((d: any) => d.pageviews), 1) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/website-builder" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500">{project?.name || 'Loading...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-sm rounded-[7px] transition-colors ${days === d ? 'bg-[#064A6C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-[7px] p-5">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-[#064A6C]" />
            <span className="text-sm text-gray-500">Pageviews</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(analytics?.totalPageviews || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[7px] p-5">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#064A6C]" />
            <span className="text-sm text-gray-500">Unique Visitors</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(analytics?.totalVisitors || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[7px] p-5">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-[#064A6C]" />
            <span className="text-sm text-gray-500">Top Page</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 truncate">
            {analytics?.topPages?.[0]?.slug || '—'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Pageviews Over Time</h3>
        <div className="flex items-end gap-[2px] h-40">
          {(analytics?.daily || []).map((d: any, i: number) => (
            <div
              key={i}
              className="flex-1 bg-[#064A6C]/20 hover:bg-[#064A6C]/40 transition-colors rounded-t relative group"
              style={{ height: `${Math.max((d.pageviews / maxPageviews) * 100, 2)}%` }}
              title={`${d.date}: ${d.pageviews} views`}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {d.date}: {d.pageviews} views
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{analytics?.daily?.[0]?.date || ''}</span>
          <span>{analytics?.daily?.[analytics.daily.length - 1]?.date || ''}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Top Pages */}
        <div className="bg-white border border-gray-200 rounded-[7px] p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Pages</h3>
          {analytics?.topPages?.length > 0 ? (
            <div className="space-y-2">
              {analytics.topPages.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate">/{p.slug}</span>
                  <span className="text-gray-500 font-medium">{p.views}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No data yet</p>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-white border border-gray-200 rounded-[7px] p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Referrers</h3>
          {analytics?.topReferrers?.length > 0 ? (
            <div className="space-y-2">
              {analytics.topReferrers.map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    {r.referrer}
                  </span>
                  <span className="text-gray-500 font-medium">{r.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No referrer data</p>
          )}
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-white border border-gray-200 rounded-[7px] p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Devices</h3>
        {analytics?.devices && Object.keys(analytics.devices).length > 0 ? (
          <div className="flex items-center gap-6">
            {Object.entries(analytics.devices).map(([device, count]) => {
              const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;
              const total = Object.values(analytics.devices as Record<string, number>).reduce((s: number, v: number) => s + v, 0);
              const pct = total > 0 ? Math.round(((count as number) / total) * 100) : 0;
              return (
                <div key={device} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 capitalize">{device}</span>
                  <span className="text-sm font-medium text-[#064A6C]">{pct}%</span>
                  <span className="text-xs text-gray-400">({count as number})</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No device data yet</p>
        )}
      </div>
    </div>
  );
}
