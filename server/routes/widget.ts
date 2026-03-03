/**
 * Widget API Routes
 * Authenticated via widget token (Authorization: Bearer wt_xxx)
 * Used by the consoleblue embed widget on external sites.
 */

import { Express, Request, Response, NextFunction } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../shared/schema.js';

interface WidgetRequest extends Request {
  widgetCustomerId?: number;
  widgetTokenId?: number;
}

function widgetAuth(db: PostgresJsDatabase<typeof schema>) {
  return async (req: WidgetRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token || !token.startsWith('wt_')) {
      return res.status(401).json({ success: false, error: 'Widget token required' });
    }

    const widgetToken = await db.query.widgetTokens.findFirst({
      where: and(
        eq(schema.widgetTokens.token, token),
        eq(schema.widgetTokens.isActive, true),
      ),
    });

    if (!widgetToken) {
      return res.status(401).json({ success: false, error: 'Invalid widget token' });
    }

    if (widgetToken.expiresAt && widgetToken.expiresAt < new Date()) {
      return res.status(401).json({ success: false, error: 'Widget token expired' });
    }

    // Check origin if allowedOrigins is set
    const origins = (widgetToken.allowedOrigins as string[]) || [];
    if (origins.length > 0) {
      const requestOrigin = req.headers.origin;
      if (requestOrigin && !origins.includes(requestOrigin)) {
        return res.status(403).json({ success: false, error: 'Origin not allowed' });
      }
    }

    // Update last used
    db.update(schema.widgetTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(schema.widgetTokens.id, widgetToken.id))
      .catch(() => {});

    req.widgetCustomerId = widgetToken.customerId;
    req.widgetTokenId = widgetToken.id;
    next();
  };
}

const asyncHandler = (fn: (req: any, res: Response) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};

export function registerWidgetRoutes(app: Express, db: PostgresJsDatabase<typeof schema>) {
  const auth = widgetAuth(db);

  // Widget profile — minimal customer info
  app.get('/api/widget/profile', auth, asyncHandler(async (req: WidgetRequest, res) => {
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.id, req.widgetCustomerId!),
    });

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.json({
      success: true,
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
    });
  }));

  // Widget Coach Green chat
  app.post('/api/widget/coach-chat', auth, asyncHandler(async (req: WidgetRequest, res) => {
    const { message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    let session: any;
    if (sessionId) {
      session = await db.query.coachGreenSessions.findFirst({
        where: and(
          eq(schema.coachGreenSessions.id, sessionId),
          eq(schema.coachGreenSessions.customerId, req.widgetCustomerId!),
        ),
      });
    }

    if (!session) {
      [session] = await db.insert(schema.coachGreenSessions).values({
        customerId: req.widgetCustomerId!,
        widgetTokenId: req.widgetTokenId,
        context: 'widget',
        messages: [],
      }).returning();
    }

    const messages: any[] = (session.messages as any[]) || [];
    messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() });

    const aiResponse = `I'm Coach Green, your hostsblue assistant. How can I help you today?`;
    messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() });

    await db.update(schema.coachGreenSessions)
      .set({ messages, updatedAt: new Date() })
      .where(eq(schema.coachGreenSessions.id, session.id));

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        message: aiResponse,
      },
    });
  }));

  // Widget help request — creates a support ticket
  app.post('/api/widget/help-request', auth, asyncHandler(async (req: WidgetRequest, res) => {
    const { subject, message, category } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, error: 'Subject and message are required' });
    }

    const [ticket] = await db.insert(schema.supportTickets).values({
      customerId: req.widgetCustomerId!,
      subject,
      category: category || 'general',
      priority: 'medium',
      status: 'open',
    }).returning();

    await db.insert(schema.ticketMessages).values({
      ticketId: ticket.id,
      senderId: req.widgetCustomerId!,
      senderType: 'customer',
      body: message,
    });

    res.status(201).json({
      success: true,
      data: { ticketId: ticket.id },
      message: 'Support ticket created',
    });
  }));
}
