import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import ptTranslations from './locales/pt.json';
import ruTranslations from './locales/ru.json';
import deTranslations from './locales/de.json';
import frTranslations from './locales/fr.json';
import itTranslations from './locales/it.json';
const availableLanguages = ['en', 'es', 'pt', 'ru', 'nl', 'pl', 'sv', 'de', 'fr', 'it'];

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: { translation: enTranslations },
            es: { translation: esTranslations },
            pt: { translation: ptTranslations },
            ru: { translation: ruTranslations },
            de: { translation: deTranslations },
            fr: { translation: frTranslations },
            it: { translation: itTranslations }
        },
        lng: undefined,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        detection: {
            order: ['navigator'],
            caches: ['localStorage']
        },
        supportedLngs: availableLanguages
    });

export default i18n;
