var Docs = (function() {
    var docArray = null;
    var docsContainer = document.getElementById('divdocuments');
    
    if (docsContainer) {
        docArray = [];
        
        // sections and links can only be into <ul> and <p>
        var listing = document.querySelectorAll('#divdocuments ul, #divdocuments p');
        var currentSection = null;

        var sectionMap = {};

        Array.from(listing).forEach(function(item){
            var links = item.getElementsByTagName('a');
            if (links.length == 0) {
                currentSection = item.innerText.trim();
            } else {
                Array.from(links).forEach(function(link, index){
                    if (!link.dataset.visited) {
                        link.dataset.visited = true;
                        
                        var linkURL = link.href;
                        var lastDot = linkURL.lastIndexOf('.');
                        var hrefExt = lastDot != -1 ? linkURL.substring(lastDot) : null;
                        
                        var currentFile = (index + 1 < 10 ? '0' : '') + (index + 1) + '_' + link.innerText.trim() + hrefExt;
                        currentFile = currentFile.replace(/\//g, '_');
                        
                        var isShortcut = lastDot < linkURL.length - 4;
                        if (!isShortcut) {
                            var extFilter = ['.htm', '.html', '.php', '.asp', '.aspx'];
                            extFilter.forEach(function(ext){
                                if (!isShortcut && hrefExt == ext) {
                                    isShortcut = true;
                                }
                            });
                        }
                        
                        docArray.push({
                            folder: currentSection,
                            filename: currentFile,
                            url: linkURL,
                            shortcut: isShortcut
                        });
                        
                        sectionMap[currentSection] = 1; // map the current section
                    }
                });
            }
        });
        
        // Retrieve mapped section indexes and adjust sections in correct order
        var sectionIndex = 0;
        for (var section in sectionMap) {
            if (sectionMap.hasOwnProperty(section)) {
                sectionMap[section] = (sectionIndex < 9 ? '0' : '') + (sectionIndex + 1);
                sectionIndex++;
            }
        }
        
        docArray.forEach(function(doc){
            doc.folder = sectionMap[doc.folder] + '_' + doc.folder;
        });
    }
    return docArray;
})();
