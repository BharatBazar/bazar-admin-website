export function getMenuItemInMenuListByProperty(menuList, key, value) {
    let stack = [];
    stack = stack.concat(menuList);
    let res;
    while (stack.length) {
        let cur = stack.shift();
        if (cur.children && cur.children.length > 0) {
            stack = cur.children.concat(stack);
        }
        if (value === cur[key]) {
            res = cur;
        }
    }
    return res;
}

export function timestampToTime(timestamp) {
    const date = new Date(timestamp);
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
    const h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
    const m = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:`;
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    const strDate = Y + M + D + h + m + s;
    return strDate;
}
