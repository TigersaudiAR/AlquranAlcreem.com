import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from "@/hooks/use-toast";
import { LANGUAGES, RECITERS, APP_CONFIG } from '../lib/constants';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    language: 'ar',
    reciter: 'ar.alafasy',
    fontSize: 3,
    translation: true,
    notifications: true,
    autoPlayAudio: false,
    prayerMethod: 2,
    showNextPrayer: true,
    highlightCurrentVerse: true,
    autoSaveLastRead: true,
  });
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    country: '',
    city: '',
  });
  
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleProfileChange = (key: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to an API/database
    localStorage.setItem('quranAppSettings', JSON.stringify(settings));
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات بنجاح",
    });
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would save to an API/database
    localStorage.setItem('quranAppProfile', JSON.stringify(profile));
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الملف الشخصي بنجاح",
    });
  };
  
  const handleExportData = () => {
    const exportData = {
      settings,
      profile,
      lastRead: localStorage.getItem('quranLastRead'),
      bookmarks: localStorage.getItem('quranBookmark'),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quran-app-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير البيانات بنجاح",
    });
  };
  
  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط جميع الإعدادات؟ سيتم فقدان جميع التفضيلات المحفوظة.')) {
      localStorage.removeItem('quranAppSettings');
      localStorage.removeItem('quranAppProfile');
      
      setSettings({
        language: 'ar',
        reciter: 'ar.alafasy',
        fontSize: 3,
        translation: true,
        notifications: true,
        autoPlayAudio: false,
        prayerMethod: 2,
        showNextPrayer: true,
        highlightCurrentVerse: true,
        autoSaveLastRead: true,
      });
      
      setProfile({
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        country: '',
        city: '',
      });
      
      toast({
        title: "تم إعادة الضبط",
        description: "تم استعادة الإعدادات الافتراضية",
      });
    }
  };
  
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">الإعدادات</h2>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-4 pb-2">
            <button 
              className={`py-2 px-4 ${activeTab === 'general' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
              onClick={() => setActiveTab('general')}
            >
              إعدادات عامة
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'quran' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
              onClick={() => setActiveTab('quran')}
            >
              إعدادات القرآن
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'prayer' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
              onClick={() => setActiveTab('prayer')}
            >
              إعدادات الصلاة
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
              onClick={() => setActiveTab('profile')}
            >
              الملف الشخصي
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'data' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
              onClick={() => setActiveTab('data')}
            >
              البيانات والخصوصية
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'about' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
              onClick={() => setActiveTab('about')}
            >
              حول التطبيق
            </button>
          </div>
          
          {activeTab === 'general' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">الإعدادات العامة</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المظهر
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      className={`py-2 px-4 rounded-lg ${theme === 'light' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                      onClick={() => theme === 'dark' && toggleTheme()}
                    >
                      <i className="fas fa-sun mr-2"></i>
                      فاتح
                    </button>
                    <button
                      className={`py-2 px-4 rounded-lg ${theme === 'dark' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                      onClick={() => theme === 'light' && toggleTheme()}
                    >
                      <i className="fas fa-moon mr-2"></i>
                      داكن
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللغة
                  </label>
                  <select 
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                    <span className="mr-2 text-gray-700 dark:text-gray-300">تفعيل الإشعارات</span>
                  </label>
                </div>
                
                <button 
                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
                  onClick={handleSaveSettings}
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'quran' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">إعدادات القرآن</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    القارئ المفضل
                  </label>
                  <select 
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={settings.reciter}
                    onChange={(e) => handleSettingChange('reciter', e.target.value)}
                  >
                    {RECITERS.map((reciter) => (
                      <option key={reciter.id} value={reciter.id}>
                        {reciter.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    حجم الخط
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-gray-600 dark:text-gray-400">{settings.fontSize}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={settings.translation}
                      onChange={(e) => handleSettingChange('translation', e.target.checked)}
                    />
                    <span className="mr-2 text-gray-700 dark:text-gray-300">عرض الترجمة</span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={settings.autoPlayAudio}
                      onChange={(e) => handleSettingChange('autoPlayAudio', e.target.checked)}
                    />
                    <span className="mr-2 text-gray-700 dark:text-gray-300">تشغيل الصوت تلقائيًا</span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={settings.highlightCurrentVerse}
                      onChange={(e) => handleSettingChange('highlightCurrentVerse', e.target.checked)}
                    />
                    <span className="mr-2 text-gray-700 dark:text-gray-300">تمييز الآية الحالية</span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={settings.autoSaveLastRead}
                      onChange={(e) => handleSettingChange('autoSaveLastRead', e.target.checked)}
                    />
                    <span className="mr-2 text-gray-700 dark:text-gray-300">حفظ موضع القراءة تلقائيًا</span>
                  </label>
                </div>
                
                <button 
                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
                  onClick={handleSaveSettings}
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'prayer' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">إعدادات الصلاة</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    طريقة حساب مواقيت الصلاة
                  </label>
                  <select 
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={settings.prayerMethod}
                    onChange={(e) => handleSettingChange('prayerMethod', parseInt(e.target.value))}
                  >
                    <option value={1}>هيئة المساحة المصرية</option>
                    <option value={2}>جامعة أم القرى بمكة المكرمة</option>
                    <option value={3}>رابطة العالم الإسلامي</option>
                    <option value={4}>جامعة العلوم الإسلامية بكراتشي</option>
                    <option value={5}>اتحاد المنظمات الإسلامية في فرنسا</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={settings.showNextPrayer}
                      onChange={(e) => handleSettingChange('showNextPrayer', e.target.checked)}
                    />
                    <span className="mr-2 text-gray-700 dark:text-gray-300">عرض العد التنازلي للصلاة التالية</span>
                  </label>
                </div>
                
                <button 
                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
                  onClick={handleSaveSettings}
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">الملف الشخصي</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم
                  </label>
                  <input 
                    type="text" 
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input 
                    type="email" 
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الهاتف
                  </label>
                  <input 
                    type="tel" 
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الدولة
                    </label>
                    <input 
                      type="text" 
                      className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profile.country}
                      onChange={(e) => handleProfileChange('country', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      المدينة
                    </label>
                    <input 
                      type="text" 
                      className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={profile.city}
                      onChange={(e) => handleProfileChange('city', e.target.value)}
                    />
                  </div>
                </div>
                
                <button 
                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
                  onClick={handleSaveProfile}
                >
                  حفظ الملف الشخصي
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">البيانات والخصوصية</h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    يمكنك تصدير بياناتك واستيرادها أو إعادة ضبط جميع الإعدادات إلى الإعدادات الافتراضية.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <button 
                    className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
                    onClick={handleExportData}
                  >
                    <i className="fas fa-file-export mr-2"></i>
                    تصدير البيانات
                  </button>
                  
                  <button 
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => document.getElementById('import-file')?.click()}
                  >
                    <i className="fas fa-file-import mr-2"></i>
                    استيراد البيانات
                  </button>
                  <input 
                    id="import-file" 
                    type="file" 
                    accept=".json" 
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            
                            if (data.settings) {
                              setSettings(data.settings);
                              localStorage.setItem('quranAppSettings', JSON.stringify(data.settings));
                            }
                            
                            if (data.profile) {
                              setProfile(data.profile);
                              localStorage.setItem('quranAppProfile', JSON.stringify(data.profile));
                            }
                            
                            if (data.lastRead) {
                              localStorage.setItem('quranLastRead', data.lastRead);
                            }
                            
                            if (data.bookmarks) {
                              localStorage.setItem('quranBookmark', data.bookmarks);
                            }
                            
                            toast({
                              title: "تم الاستيراد",
                              description: "تم استيراد البيانات بنجاح",
                            });
                          } catch (error) {
                            toast({
                              title: "خطأ",
                              description: "حدث خطأ أثناء استيراد البيانات",
                              variant: "destructive",
                            });
                          }
                        };
                        reader.readAsText(e.target.files[0]);
                      }
                    }}
                  />
                  
                  <button 
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    onClick={handleReset}
                  >
                    <i className="fas fa-trash mr-2"></i>
                    إعادة ضبط
                  </button>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium mb-2">سياسة الخصوصية</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    يتم تخزين جميع بياناتك محلياً على جهازك ولا يتم إرسالها إلى أي خوادم خارجية. 
                    البيانات التي يتم جمعها هي فقط لتحسين تجربة المستخدم وتخصيص الإعدادات.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">حول التطبيق</h3>
                
                <div className="text-center py-4">
                  <div className="text-primary text-5xl mb-2">
                    <i className="fas fa-book-quran"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-1">{APP_CONFIG.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">الإصدار {APP_CONFIG.version}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    تطبيق تعليمي شامل للقرآن الكريم يوفر واجهة سهلة الاستخدام لقراءة القرآن واستماعه وحفظه، 
                    بالإضافة إلى مجموعة من الأدوات المساعدة كمواقيت الصلاة والأذكار والتفاسير.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="font-medium mb-2">التواصل والدعم الفني</h4>
                  <div className="flex flex-col space-y-2 text-gray-700 dark:text-gray-300">
                    <div>
                      <i className="fas fa-envelope mr-2"></i>
                      البريد الإلكتروني: {APP_CONFIG.copyright.email}
                    </div>
                    <div>
                      <i className="fas fa-phone mr-2"></i>
                      رقم الهاتف: {APP_CONFIG.copyright.phone}
                    </div>
                    <div>
                      <i className="fas fa-location-dot mr-2"></i>
                      العنوان: {APP_CONFIG.copyright.location}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="font-medium mb-2">حقوق الملكية</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    © {APP_CONFIG.copyright.year} {APP_CONFIG.copyright.owner}. 
                    {APP_CONFIG.copyright.rights}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Settings;
