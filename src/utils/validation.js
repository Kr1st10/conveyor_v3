export const applicationValidation = {
    fio: (value) => {
        if (!value.trim()) return 'ФИО обязательно';
        if (value.trim().split(' ').length < 3) return 'Введите полное ФИО';
        return '';
    },

    passport: (value) => {
        if (!/^\d{10}$/.test(value.replace(/\s/g, ''))) {
            return 'Паспорт должен содержать 10 цифр';
        }
        return '';
    },

    inn: (value) => {
        if (!/^\d{12}$/.test(value)) return 'ИНН должен содержать 12 цифр';
        return '';
    },

    sum: (value) => {
        const num = parseInt(value);
        if (!num || num < 10000 || num > 5000000) {
            return 'Сумма кредита должна быть от 10,000 до 5,000,000 руб.';
        }
        return '';
    },

    term: (value) => {
        const num = parseInt(value);
        if (!num || num < 3 || num > 60) {
            return 'Срок кредита должен быть от 3 до 60 месяцев';
        }
        return '';
    }
};