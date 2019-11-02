import {LOCAL_STORAGE_PREFIX} from '../constants';

export const getItem = (key) => {
    const itemAsString = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`)
    return itemAsString ? JSON.parse(itemAsString) : undefined;
}

export const setItem = (key, item) => {
    const value = typeof item !== 'string' ? JSON.stringify(item) : item;
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, value);
}