function onLogReceived() {
    const log = JSON.parse(this.responseText);
    const mainDiv = document.getElementById('main-content');

    removeAllChildren(mainDiv);

    const divTextAreaEl = document.createElement('div');
    divTextAreaEl.setAttribute('class', 'textarealike');


    for (let i = 0; i < log.logData.length; i++) {
        const line = log.logData[i];
        
        divTextAreaEl.innerHTML = divTextAreaEl.innerHTML + line + "<br>";
    }
    
    mainDiv.appendChild(divTextAreaEl);
}

function onMenuLogClick() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLogReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/logview');
    xhr.send();
}