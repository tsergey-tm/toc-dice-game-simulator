import i18n from 'i18next'
import Backend, {HttpBackendOptions} from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'
import {FC} from "react";
import "./i18n.css"

const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
};


const languages = [
    'en',
    'ru'
].sort();


i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
        load: 'languageOnly',
        fallbackLng: 'en',
        debug: true,
        supportedLngs: languages,
        preload: ['en', 'ru'],
        detection: {
            order: ['localStorage', 'sessionStorage', 'navigator'],
            cache: ['localStorage']
        },
        backend: {
            loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
        },
        interpolation: {
            escapeValue: false
        }
    })

export default i18n;


export const LanguageSwitcher: FC = () => {
    return (
        <div className="LanguageSwitcher">
            <span>{i18n.resolvedLanguage}</span>
            {languages.map(value => (
                <div className="LanguageSwitcher_lng" key={"LanguageSwitcher_lng_" + value}
                     onClick={event => changeLanguage(value)}
                >{value}</div>))}
        </div>
    );
}

