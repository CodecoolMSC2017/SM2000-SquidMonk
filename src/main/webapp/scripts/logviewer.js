function sendFilterData() {
    const formServletFilter = document.getElementById('servlet-filter');
    const formLogLevelFilter = document.getElementById('level-filter');

    const servletElements = formServletFilter.elements;
    const logLevelElements = formLogLevelFilter.elements;

    let servletToFilter;
    let logLevelToFilter;

    for (let i = 0; i<servletElements.length; i++) {
        const element = servletElements[i];

        if (element.checked === true) {
            servletToFilter = element.value;
            break;
        }
    }

    for (let i = 0; i<logLevelElements.length; i++) {
        const element = logLevelElements[i];

        if (element.checked === true) {
            logLevelToFilter = element.value;
            break;
        }
    }

    const params = new URLSearchParams();
    params.append('servlet', servletToFilter);
    params.append('loglevel', logLevelToFilter);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLogReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/logview/' + "filter" + "?" + params.toString());
    xhr.send();
}

function onLogReceived() {
    const log = JSON.parse(this.responseText);
    const mainDiv = document.getElementById('main-content');

    removeAllChildren(mainDiv);

    const logViewDiv = document.createElement('div');
    logViewDiv.setAttribute('class', 'logviewer');

    const divTextAreaEl = document.createElement('div');
    divTextAreaEl.setAttribute('class', 'textarealike');

    for (let i = log.logText.length-1; i >= 0; i--) {
        const line = log.logText[i];
        
        divTextAreaEl.innerHTML = divTextAreaEl.innerHTML + line + "<br>";
    }

    const buttonEmptyLog = document.createElement('button');

    const leftFilterDiv = document.createElement('div');
    leftFilterDiv.setAttribute('class', 'filterdivleft');

    const buttonFilter = document.createElement('button');
    buttonFilter.setAttribute('style', 'margin-left: 80px');
    buttonFilter.textContent = "Filter";
    buttonFilter.addEventListener('click', sendFilterData);

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

    logViewDiv.appendChild(leftFilterDiv);
    logViewDiv.appendChild(divTextAreaEl);

    mainDiv.appendChild(logViewDiv);
}

function onMenuLogClick() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLogReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/logview/' + "pageload");
    xhr.send();
}