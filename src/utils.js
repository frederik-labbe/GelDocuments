function addToZip(zipObject, folderName, fileName, fileData) {
    zipObject.folder(folderName).file(fileName, fileData);
}

function createShortcut(zipObject, fileUrl, fileName, folderName) {
    var shortcutData = '[InternetShortcut]\nURL=' + fileUrl;
    var shortcutName = fileName;

    // change extension to '.url'
    var lastDotPos = shortcutName.lastIndexOf('.');
    if (lastDotPos != -1) {
        shortcutName = shortcutName.substring(0, lastDotPos) + '.url';
    } else {
        shortcutName += '.url';
    }
    addToZip(zipObject, folderName, shortcutName, shortcutData);
}

function downloadZip(zipObject, zipName) {
    var saveHack = document.createElement('a');
    saveHack.download = zipName;
    var url = window.URL.createObjectURL(zipObject.generate({type:'blob'}));
    saveHack.href = url;
    saveHack.click();
    window.URL.revokeObjectURL(url);
}
