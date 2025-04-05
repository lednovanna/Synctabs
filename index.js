/*
const STORAGE_KEY = 'userState';

// Функция для шифрования (Base64)
const encrypt = (data) => btoa(JSON.stringify(data));

// Функция для дешифров
const decrypt = (data) => JSON.parse(atob(data));

// Начальное состояние
const defaultState = {
    theme: 'light',
    language: 'uk',
    lastUpdated: Date.now(),
};

// Получение данных из LocalStorage
function getState() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            return decrypt(storedData);
        }
    } catch (error) {
        console.error('Error retrieving data', error);
    }
    return { ...defaultState };
}

// Сохранение данных в LocalStorage
function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, encrypt(state));
    } catch (error) {
        alert('Error: LocalStorage is full!');
        console.error('Error saving data', error);
    }
}


function updateUI(state) {
    document.body.className = state.theme;
    document.getElementById('themeSelect').value = state.theme;
    document.getElementById('languageSelect').value = state.language;

    // Изменение заголовка 
    const title = document.getElementById('mainTitle');
    title.textContent = state.language === 'en' ? 'Multi-Tab Synchronization' : 'Multi-tab synchronization';
}


function init() {
    let currentState = getState();

    // Применение сохраненного состояния
    updateUI(currentState);

    
    document.getElementById('themeSelect').addEventListener('change', (e) => {
        currentState.theme = e.target.value;
        currentState.lastUpdated = Date.now();
        saveState(currentState);
        updateUI(currentState);
    });

    document.getElementById('languageSelect').addEventListener('change', (e) => {
        currentState.language = e.target.value;
        currentState.lastUpdated = Date.now();
        saveState(currentState);
        updateUI(currentState);
    });

    // Очистка хранилища
    document.getElementById('clearStorage').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            const newState = getState();
            if (newState.lastUpdated > currentState.lastUpdated) {
                currentState = newState;
                updateUI(currentState);
            }
        }
    });

    // Автоматическая очистка старых данных
    const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - currentState.lastUpdated > weekInMilliseconds) {
        localStorage.removeItem(STORAGE_KEY);
    }
}

document.addEventListener('DOMContentLoaded', init);
*/

const STORAGE_KEY = 'userState';

const encrypt = (data) => btoa(JSON.stringify(data));
const decrypt = (data) => JSON.parse(atob(data));

const defaultState = {
    theme: 'light',
    language: 'uk',
    lastUpdated: Date.now(),
};

function getState() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? decrypt(storedData) : { ...defaultState };
    } catch (error) {
        console.error('шибка получения данных:О', error);
        return { ...defaultState };
    }
}

function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, encrypt(state));
    } catch (error) {
        alert('Ошибка: LocalStorage переполнено!');
        console.error('Ошибка при сохранении данных:', error);
    }
}

function updateUI({ theme, language }) {
    document.body.className = theme;
    document.getElementById('themeSelect').value = theme;
    document.getElementById('languageSelect').value = language;
    
    const title = document.getElementById('mainTitle');
    title.textContent = language === 'en' ? 'Multi-Tab Synchronization' : 'Мульти-табова синхронізація';
}

function setupEventListeners(state) {
    const updateStateAndUI = (key, value) => {
        state[key] = value;
        state.lastUpdated = Date.now();
        saveState(state);
        updateUI(state);
    };

    document.getElementById('themeSelect').addEventListener('change', (e) => {
        updateStateAndUI('theme', e.target.value);
    });
    
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        updateStateAndUI('language', e.target.value);
    });
    
    document.getElementById('clearStorage').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });
    
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            const newState = getState();
            if (newState.lastUpdated > state.lastUpdated) {
                Object.assign(state, newState);
                updateUI(state);
            }
        }
    });
}

function cleanupOldData(state) {
    const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - state.lastUpdated > weekInMilliseconds) {
        localStorage.removeItem(STORAGE_KEY);
        return { ...defaultState };
    }
    return state;
}

function init() {
    let currentState = cleanupOldData(getState());
    updateUI(currentState);
    setupEventListeners(currentState);
}

document.addEventListener('DOMContentLoaded', init);