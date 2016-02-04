(function(docArray){
    if (!docArray) {
        return;
    }

    var docsContainer = document.getElementById('divdocuments');
    if (docsContainer) {
        var TIMEOUT_MS = 10000;
        var REQUEST_READY_STATE_COMPLETE = 4;
        var ZIP_NAME = 'Documents.zip';

        // create link button
        var lnk = document.createElement('a');
        var lnkText = 'Télécharger tout';
        var lnkLoading = 'Veuillez patienter...';

        lnk.innerText = lnkText;
        lnk.href = '#';

        lnk.onclick = function() {
            this.innerText = lnkLoading;

            var nDocsFinish = 0;
            var nDocs = docArray.length;    

            var zip = new JSZip();
            var oReq = [];
            var aborted = [];
            var timeout = [];

            for (var i = 0;i < nDocs; i++) {
                (function(x){
                    lnk.innerText = lnkLoading + ' (0/' + nDocs + ')';

                    var currentDoc = docArray[x];
                    if (currentDoc.shortcut === true) {
                        createShortcut(zip, currentDoc.url, currentDoc.filename, currentDoc.folder);
                        nDocsFinish++;

                        lnk.innerText = lnkLoading + '(' + nDocsFinish + '/' + nDocs + ')';

                        if (nDocsFinish == nDocs) {
                            lnk.innerText = lnkText;
                            downloadZip(zip, ZIP_NAME);
                        }
                    } else { // get the file
                        oReq[x] = new XMLHttpRequest();
                        aborted[x] = false;

                        timeout[x] = setTimeout(function(){ // if timeout, create a shortcut instead
                            oReq[x].abort();
                            aborted[x] = true;

                            createShortcut(zip, currentDoc.url, currentDoc.filename, currentDoc.folder);
                            nDocsFinish++;

                            lnk.innerText = lnkLoading + '(' + nDocsFinish + '/' + nDocs + ')';

                            if (nDocsFinish == nDocs) {
                                lnk.innerText = lnkText;
                                downloadZip(zip, ZIP_NAME);
                            }
                        }, TIMEOUT_MS);

                        oReq[x].responseType = 'arraybuffer';
                        oReq[x].onreadystatechange = function() {
                            if (oReq[x].readyState == REQUEST_READY_STATE_COMPLETE) {
                                clearTimeout(timeout[x]);

                                if (oReq[x].status == 200) {
                                    if (this.response != null && !aborted[x] && oReq[x].readyState == REQUEST_READY_STATE_COMPLETE) {
                                        addToZip(zip, currentDoc.folder, currentDoc.filename, this.response);
                                    }
                                } else {
                                    createShortcut(zip, currentDoc.url, currentDoc.filename, currentDoc.folder);
                                }

                                nDocsFinish++;

                                lnk.innerText = lnkLoading + '(' + nDocsFinish + '/' + nDocs + ')';

                                if (nDocsFinish == nDocs) {
                                    lnk.innerText = lnkText;
                                    downloadZip(zip, ZIP_NAME);
                                }
                            }
                        }

                        oReq[x].open('get', currentDoc.url, true);
                        oReq[x].send();
                    }
                })(i);
            }
        }
        docsContainer.insertBefore(lnk, docsContainer.firstChild);
    }
})(Docs);
