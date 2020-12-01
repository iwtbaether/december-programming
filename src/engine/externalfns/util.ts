
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}   

export function formatNumber(num:number): string {
    if (Math.abs(num) < 1e6) return num.toString();
    else return num.toExponential(2);
}
export function percentOf (num: number, base: number) {
    if (num === 0 || base === 0) return '-';
    else return Math.floor(100*num/base).toString() + '%';
}

export function msToFullHMS (msTime: number) {
    
    let hour = Math.floor(msTime/HOUR_MS).toString();

    let minute = Math.floor((msTime%HOUR_MS)/HOUR_MS * 60).toString();
    if (minute.length === 1) minute = '0' + minute;

    let second = Math.floor((msTime%MINUTE_MS)/MINUTE_MS * 60).toString();
    if (second.length === 1) second = '0' + second;
    
    
    return `${hour}:${minute}:${second}`
}

export const SECOND_MS = 1000
export const MINUTE_MS = SECOND_MS * 60
export const HOUR_MS = MINUTE_MS * 60



export const canCheat = window.location.href === 'http://localhost:3000/'
