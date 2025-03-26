import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const API_PREFIX = '/api';
  
  // Health check endpoint
  app.get(`${API_PREFIX}/health`, (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // User preferences API - for storing user preferences server-side
  // Get user preferences
  app.get(`${API_PREFIX}/preferences/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // In a real app, we would retrieve user preferences from a database
      // For now, just return a mock response
      res.status(200).json({
        preferences: {
          theme: 'light',
          fontSize: 3,
          reciterId: 'ar.alafasy',
          translationId: 'ar.asad',
          showTranslation: true
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user preferences', error: (error as Error).message });
    }
  });
  
  // Update user preferences
  app.post(`${API_PREFIX}/preferences/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = req.body;
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // In a real app, we would update the user preferences in a database
      // For now, just return a success response
      res.status(200).json({
        message: 'Preferences updated successfully',
        preferences
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user preferences', error: (error as Error).message });
    }
  });
  
  // Proxy for Quran API to avoid CORS issues
  app.get(`${API_PREFIX}/quran/:endpoint(**)`, async (req, res) => {
    try {
      const endpoint = req.params.endpoint;
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `https://api.alquran.cloud/v1/${endpoint}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to proxy Quran API', error: (error as Error).message });
    }
  });
  
  // Get unique surahs without duplication
  app.get(`${API_PREFIX}/quran/unique-surahs`, async (req, res) => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        // إزالة التكرار من السور باستخدام رقم السورة كمعرف فريد
        const uniqueSurahs = Array.from(
          new Map(data.data.map(surah => [surah.number, surah])).values()
        );
        
        res.status(200).json({ 
          code: 200, 
          status: 'OK', 
          data: uniqueSurahs 
        });
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to get unique surahs', error: (error as Error).message });
    }
  });
  
  // Proxy for Prayer API to avoid CORS issues
  app.get(`${API_PREFIX}/prayer/:endpoint(**)`, async (req, res) => {
    try {
      const endpoint = req.params.endpoint;
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `https://api.aladhan.com/v1/${endpoint}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to proxy Prayer API', error: (error as Error).message });
    }
  });
  
  // Proxy for Hadith API to avoid CORS issues
  app.get(`${API_PREFIX}/hadith/:endpoint(**)`, async (req, res) => {
    try {
      const endpoint = req.params.endpoint;
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `https://api.hadith.gading.dev/books/${endpoint}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to proxy Hadith API', error: (error as Error).message });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
