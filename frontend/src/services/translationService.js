// Translation service for regional languages
// Using Google Translate API integration

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
];

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.isGoogleTranslateLoaded = false;
    this.loadGoogleTranslate();
  }

  loadGoogleTranslate() {
    if (window.google && window.google.translate) {
      this.isGoogleTranslateLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.onerror = () => {
      console.warn('Google Translate failed to load, using fallback translation');
    };
    document.head.appendChild(script);

    window.googleTranslateElementInit = () => {
      this.isGoogleTranslateLoaded = true;
    };
  }

  getCacheKey(text, targetLang) {
    return `${targetLang}:${text.substring(0, 100)}`;
  }

  async translateText(text, targetLanguage = 'hi', sourceLanguage = 'en') {
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    const cacheKey = this.getCacheKey(text, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Use free Google Translate API
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
      );
      
      if (!response.ok) {
        throw new Error('Translation API failed');
      }

      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        const translatedText = data.responseData.translatedText;
        this.cache.set(cacheKey, translatedText);
        return translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback: return original text with language indicator
      return `${text} [${targetLanguage.toUpperCase()} translation unavailable]`;
    }
  }

  async translateMultipleTexts(texts, targetLanguage = 'hi', sourceLanguage = 'en') {
    const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
    return Promise.all(promises);
  }

  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  getLanguageByCode(code) {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }

  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
const translationService = new TranslationService();

export { translationService, SUPPORTED_LANGUAGES };
export default translationService;