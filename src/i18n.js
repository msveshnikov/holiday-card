import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false
        },
        supportedLngs: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'ru', 'sv'],
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        }
    });

export default i18n;
