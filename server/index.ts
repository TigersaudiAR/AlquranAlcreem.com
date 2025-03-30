// أبسط إعداد ممكن
import express from "express";
import http from "http";
import { log, setupVite, serveStatic } from "./vite";
import * as routesModule from "./routes";

// إنشاء التطبيق
const app = express();

// تسجيل نقطة نهاية صحة بسيطة
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// إعداد الوسائط
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// إنشاء المخدم
const server = http.createServer(app);
const port = 5000;

// بدء الاستماع فورًا للتوافق مع Replit Workflows
server.listen(port, '0.0.0.0', async () => {
  log(`بدأ المخدم الاستماع على المنفذ ${port}`);
  
  try {
    // تسجيل المسارات
    await routesModule.registerRoutes(app);
    console.log('تم تسجيل المسارات بنجاح');

    // إعداد Vite
    if (process.env.NODE_ENV !== "production") {
      setupVite(app, server);
    } else {
      serveStatic(app);
    }
  } catch (error) {
    console.error('خطأ في إعداد التطبيق:', error);
  }
});
