function onLogReceived() {
    const log = JSON.parse(this.responseText);
    const mainDiv = document.getElementById('main-content');

    removeAllChildren(mainDiv);

    const divTextAreaEl = document.createElement('div');
    divTextAreaEl.setAttribute('class', 'textarealike');


    for (let i = 0; i < log.logText.length; i++) {
        const line = log.logText[i];
        
        divTextAreaEl.innerHTML = divTextAreaEl.innerHTML + line + "<br>";
    }

    const buttonEmptyLog = document.createElement('button');

    const leftFilterDiv = document.createElement('div');
    leftFilterDiv.setAttribute('class', 'filterdivleft');

    const buttonFilter = document.createElement('button');
    buttonFilter.setAttribute('style', 'margin-left: 80px');
    buttonFilter.textContent = "Filter";

    const formServletFilter = document.createElement('form');
    formServletFilter.setAttribute('id', 'servlet-filter');
    formServletFilter.setAttribute('class', 'log-small-margin');

    const formLogLevelFilter = document.createElement('form');
    formLogLevelFilter.setAttribute('id', 'level-filter');
    formLogLevelFilter.setAttribute('class', 'log-small-margin');

    for (let i = 0; i < log.logLevels.length; i++) {
        const level = log.logLevels[i];

        const inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'radio');
        inputEl.setAttribute('name', 'level');
        inputEl.value = level;

        formLogLevelFilter.appendChild(inputEl);
        formLogLevelFilter.innerHTML = formLogLevelFilter.innerHTML + level + "<br>";
    }

    for (let i = 0; i < log.logServlets.length; i++) {
        const servlet = log.logServlets[i];

        const inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'radio');
        inputEl.setAttribute('name', 'servlet');
        inputEl.value = servlet;

        formServletFilter.appendChild(inputEl);
        formServletFilter.innerHTML = formServletFilter.innerHTML + servlet + "<br>";
    }

    leftFilterDiv.appendChild(formLogLevelFilter);
    leftFilterDiv.appendChild(formServletFilter);
    leftFilterDiv.appendChild(buttonFilter);

    mainDiv.appendChild(leftFilterDiv);
    mainDiv.appendChild(divTextAreaEl);
}

function onMenuLogClick() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLogReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/logview');
    xhr.send();
}