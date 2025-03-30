// أبسط إعداد ممكن
import express from "express";
import http from "http";
import { log } from "./vite";

// إنشاء التطبيق
const app = express();

// تسجيل نقطة نهاية صحة بسيطة فقط
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// إنشاء المخدم وبدء الاستماع فورًا
const server = http.createServer(app);
const port = 5000;

server.listen(port, '0.0.0.0', () => {
  log(`بدأ المخدم الاستماع على المنفذ ${port}`);
  
  // إكمال الإعداد بعد بدء الاستماع
  setTimeout(() => {
    // استيراد الوحدات الإضافية لتجنب التأخير في وقت البدء
    import('./routes').then((routesModule) => {
      // إعداد الوسائط
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      
      // تسجيل المسارات
      routesModule.registerRoutes(app).then(() => {
        console.log('تم تسجيل المسارات بنجاح');
        
        // إعداد Vite
        import('./vite').then(({ setupVite, serveStatic }) => {
          if (process.env.NODE_ENV !== "production") {
            setupVite(app, server).catch(err => console.error('خطأ في إعداد Vite:', err));
          } else {
            serveStatic(app);
          }
        }).catch(err => console.error('خطأ في استيراد وحدة vite:', err));
      }).catch(err => console.error('خطأ في تسجيل المسارات:', err));
    }).catch(err => console.error('خطأ في استيراد وحدة routes:', err));
  }, 100); // تأخير قصير بعد فتح المنفذ
});
