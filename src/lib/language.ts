export enum Language {
    English = 'english',
    French = 'french'
}

export function isValidLanguage(language: Language) {
    return language === Language.French || language === Language.English;
}