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
  
  // تسجيل مستخدم جديد
  app.post(`${API_PREFIX}/register`, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // التحقق مما إذا كان اسم المستخدم موجودًا بالفعل
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // إنشاء مستخدم جديد
      const newUser = await storage.createUser({ username, password });
      
      // إنشاء إعدادات افتراضية للمستخدم
      await storage.createUserSettings({
        userId: newUser.id,
        reciter: 'ar.alafasy',
        translation: 'ar.asad',
        fontSize: 3,
        showTranslation: true,
        autoPlayAudio: false,
        prayerMethod: 2,
        showNextPrayer: true,
        highlightCurrentVerse: true,
        autoSaveLastRead: true
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser.id, username: newUser.username }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to register user', error: (error as Error).message });
    }
  });
  
  // تسجيل الدخول
  app.post(`${API_PREFIX}/login`, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // البحث عن المستخدم بواسطة اسم المستخدم
      const user = await storage.getUserByUsername(username);
      
      // التحقق من وجود المستخدم وصحة كلمة المرور
      // ملاحظة: في تطبيق حقيقي، يجب استخدام طريقة آمنة لتخزين ومقارنة كلمات المرور
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // إرجاع معلومات المستخدم بدون كلمة المرور
      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to login', error: (error as Error).message });
    }
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
      
      const userSettings = await storage.getUserSettings(userId);
      
      if (!userSettings) {
        // إذا لم تكن الإعدادات موجودة، قم بإنشاء إعدادات افتراضية
        const defaultSettings = await storage.createUserSettings({
          userId,
          reciter: 'ar.alafasy',
          translation: 'ar.asad',
          fontSize: 3,
          showTranslation: true,
          autoPlayAudio: false,
          prayerMethod: 2,
          showNextPrayer: true,
          highlightCurrentVerse: true,
          autoSaveLastRead: true
        });
        
        return res.status(200).json({ preferences: defaultSettings });
      }
      
      res.status(200).json({ preferences: userSettings });
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
      
      // تحقق مما إذا كانت الإعدادات موجودة مسبقًا
      const existingSettings = await storage.getUserSettings(userId);
      
      let updatedSettings;
      if (existingSettings) {
        // تحديث الإعدادات الموجودة
        updatedSettings = await storage.updateUserSettings(userId, preferences);
      } else {
        // إنشاء إعدادات جديدة
        updatedSettings = await storage.createUserSettings({
          userId,
          ...preferences
        });
      }
      
      res.status(200).json({
        message: 'Preferences updated successfully',
        preferences: updatedSettings
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
  
  // API الإشارات المرجعية
  // الحصول على الإشارات المرجعية للمستخدم
  app.get(`${API_PREFIX}/bookmarks/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const userBookmarks = await storage.getBookmarks(userId);
      res.status(200).json({ bookmarks: userBookmarks });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get bookmarks', error: (error as Error).message });
    }
  });
  
  // إضافة إشارة مرجعية جديدة
  app.post(`${API_PREFIX}/bookmarks/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { surahNumber, ayahNumber, pageNumber, note } = req.body;
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const newBookmark = await storage.createBookmark({
        userId,
        surahNumber,
        ayahNumber,
        pageNumber,
        note: note || null
      });
      
      res.status(201).json({
        message: 'Bookmark added successfully',
        bookmark: newBookmark
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add bookmark', error: (error as Error).message });
    }
  });
  
  // حذف إشارة مرجعية
  app.delete(`${API_PREFIX}/bookmarks/:userId/:bookmarkId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookmarkId = parseInt(req.params.bookmarkId);
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const deleted = await storage.deleteBookmark(bookmarkId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Bookmark not found or not owned by user' });
      }
      
      res.status(200).json({
        message: 'Bookmark deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete bookmark', error: (error as Error).message });
    }
  });
  
  // آخر قراءة API
  // الحصول على آخر قراءة للمستخدم
  app.get(`${API_PREFIX}/last-read/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const lastReadData = await storage.getLastRead(userId);
      
      if (!lastReadData) {
        return res.status(404).json({ message: 'No last read data found' });
      }
      
      res.status(200).json({ lastRead: lastReadData });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get last read data', error: (error as Error).message });
    }
  });
  
  // تحديث آخر قراءة للمستخدم
  app.post(`${API_PREFIX}/last-read/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { surahNumber, ayahNumber, pageNumber } = req.body;
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const updatedLastRead = await storage.updateLastRead({
        userId,
        surahNumber,
        ayahNumber,
        pageNumber
      });
      
      res.status(200).json({
        message: 'Last read updated successfully',
        lastRead: updatedLastRead
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update last read', error: (error as Error).message });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
