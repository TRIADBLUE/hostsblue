/**
 * Analytics Aggregation — rolls up raw site_analytics into daily summaries
 */

import { eq, and, sql, gte, lte } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../shared/schema.js';

export class AnalyticsAggregation {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  async aggregateDaily(projectId: number, date: string): Promise<void> {
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    // Get raw analytics for the day
    const rows = await this.db.query.siteAnalytics.findMany({
      where: and(
        eq(schema.siteAnalytics.projectId, projectId),
        gte(schema.siteAnalytics.visitedAt, new Date(startOfDay)),
        lte(schema.siteAnalytics.visitedAt, new Date(endOfDay)),
      ),
    });

    if (rows.length === 0) return;

    const uniqueSessions = new Set(rows.map(r => r.sessionId).filter(Boolean));
    const pageCount: Record<string, number> = {};
    const referrerCount: Record<string, number> = {};
    const deviceCount: Record<string, number> = {};

    for (const r of rows) {
      const pg = r.pageSlug || 'home';
      pageCount[pg] = (pageCount[pg] || 0) + 1;
      if (r.referrer) referrerCount[r.referrer] = (referrerCount[r.referrer] || 0) + 1;
      if (r.device) deviceCount[r.device] = (deviceCount[r.device] || 0) + 1;
    }

    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([slug, views]) => ({ slug, views }));

    const topReferrers = Object.entries(referrerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Upsert daily record
    const existing = await this.db.query.siteAnalyticsDaily.findFirst({
      where: and(
        eq(schema.siteAnalyticsDaily.projectId, projectId),
        eq(schema.siteAnalyticsDaily.date, date),
      ),
    });

    const data = {
      projectId,
      date,
      pageviews: rows.length,
      uniqueVisitors: uniqueSessions.size,
      topPages,
      topReferrers,
      devices: deviceCount,
    };

    if (existing) {
      await this.db.update(schema.siteAnalyticsDaily)
        .set(data)
        .where(eq(schema.siteAnalyticsDaily.id, existing.id));
    } else {
      await this.db.insert(schema.siteAnalyticsDaily).values(data);
    }
  }

  async getDailySummary(projectId: number, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().slice(0, 10);

    const dailyData = await this.db.query.siteAnalyticsDaily.findMany({
      where: and(
        eq(schema.siteAnalyticsDaily.projectId, projectId),
        gte(schema.siteAnalyticsDaily.date, sinceStr),
      ),
      orderBy: schema.siteAnalyticsDaily.date,
    });

    // Fill in missing days with zeros
    const result: Array<{ date: string; pageviews: number; uniqueVisitors: number }> = [];
    const dataMap = new Map(dailyData.map(d => [d.date, d]));
    const cursor = new Date(since);
    const today = new Date();
    while (cursor <= today) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const entry = dataMap.get(dateStr);
      result.push({
        date: dateStr,
        pageviews: entry?.pageviews || 0,
        uniqueVisitors: entry?.uniqueVisitors || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    // Aggregate totals
    const totalPageviews = result.reduce((s, d) => s + d.pageviews, 0);
    const totalVisitors = result.reduce((s, d) => s + d.uniqueVisitors, 0);

    // Aggregate top pages and referrers from daily data
    const allTopPages: Record<string, number> = {};
    const allTopReferrers: Record<string, number> = {};
    const allDevices: Record<string, number> = {};
    for (const d of dailyData) {
      for (const p of (d.topPages as any[] || [])) {
        allTopPages[p.slug] = (allTopPages[p.slug] || 0) + (p.views || 0);
      }
      for (const r of (d.topReferrers as any[] || [])) {
        allTopReferrers[r.referrer] = (allTopReferrers[r.referrer] || 0) + (r.count || 0);
      }
      for (const [device, count] of Object.entries((d.devices as Record<string, number>) || {})) {
        allDevices[device] = (allDevices[device] || 0) + (count as number);
      }
    }

    return {
      daily: result,
      totalPageviews,
      totalVisitors,
      topPages: Object.entries(allTopPages).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([slug, views]) => ({ slug, views })),
      topReferrers: Object.entries(allTopReferrers).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([referrer, count]) => ({ referrer, count })),
      devices: allDevices,
    };
  }
}
