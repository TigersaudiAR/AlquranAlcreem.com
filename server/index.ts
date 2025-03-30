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

// نقطة نهاية بسيطة جدًا لمساعدة Replit في اكتشاف أن المخدم جاهز
app.get('/ready', (req, res) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  res.status(200).send('ready');
});

// إعداد الوسائط
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// إنشاء المخدم
const server = http.createServer(app);
const port = parseInt(process.env.PORT || '3000', 10);

// بدء الاستماع فورًا للتوافق مع Replit Workflows
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`المنفذ ${port} قيد الاستخدام. جاري محاولة تنظيف الخدمات...`);
    // انتظر قليلاً ثم أعد المحاولة
    setTimeout(() => {
      server.close();
      server.listen(port, '0.0.0.0');
    }, 1000);
  }
});

// تمييز الخادم كجاهز قبل استدعاء listen
// إعداد رأس الطلب لإخبار Replit أن التطبيق جاهز
app.use((req, res, next) => {
  // إعلام Replit أن الخادم جاهز للعمل
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// بدء التشغيل في وظيفة غير متزامنة لاستخدام await
async function startServer() {
  // تسجيل المسارات قبل بدء الخادم
  try {
    await routesModule.registerRoutes(app);
    console.log('تم تسجيل المسارات بنجاح');
  } catch (error) {
    console.error('خطأ في تسجيل المسارات:', error);
  }

  // إعداد Vite قبل بدء الخادم
  if (process.env.NODE_ENV !== "production") {
    try {
      await setupVite(app, server);
      console.log('تم إعداد Vite بنجاح');
    } catch (error) {
      console.error('خطأ في إعداد Vite:', error);
    }
  } else {
    try {
      serveStatic(app);
      console.log('تم إعداد الملفات الثابتة بنجاح');
    } catch (error) {
      console.error('خطأ في إعداد الملفات الثابتة:', error);
    }
  }

  server.listen(port, '0.0.0.0', () => {
    log(`بدأ المخدم الاستماع على المنفذ ${port}`);
    console.log('تم إعداد التطبيق بنجاح، الخادم جاهز على المنفذ', port);
  });
}

// بدء المخدم
startServer();
