function saveToLocalStorage(key, obj) {
    var objJson = JSON.stringify(obj)
    localStorage.setItem(key, objJson);
}

function loadFromLocalStorage(key) {
    var objJson = localStorage.getItem(key);
    var obj = JSON.parse(objJson);
    return obj;
}