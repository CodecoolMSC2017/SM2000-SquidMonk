function sendFilterData() {
    const formServletFilter = document.getElementById('servlet-filter');
    const formLogLevelFilter = document.getElementById('level-filter');

    const servletElements = formServletFilter.elements;
    const logLevelElements = formLogLevelFilter.elements;

    let servletToFilter = [];
    let logLevelToFilter = [];

    for (let i = 0; i<servletElements.length; i++) {
        const element = servletElements[i];

        if (element.checked === true) {
            servletToFilter.push(element.value);
        }
    }

    for (let i = 0; i<logLevelElements.length; i++) {
        const element = logLevelElements[i];

        if (element.checked === true) {
            logLevelToFilter.push(element.value);
        }
    }

    const params = new URLSearchParams();
    params.append('servlets', servletToFilter);
    params.append('loglevels', logLevelToFilter);
    
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

    // Processing logtext
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

    // Processing the levels part of left side filter
    for (let i = 0; i < log.logLevels.length; i++) {
        const level = log.logLevels[i];

        const inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'checkbox');
        inputEl.setAttribute('name', 'level');
        inputEl.value = level;

        //If this is an unfiltered page load then everything is checked
        if (log.checkedLogLevels.length == 0) {
            inputEl.setAttribute('checked', 'checked');
        } else {
            //If it's a filtered search only check the boxes which were filtered in the request
            for (let n = 0; n < log.checkedLogLevels.length; n++) {
                const checkedLevel = log.checkedLogLevels[n];

                if (checkedLevel === level) {
                    inputEl.setAttribute('checked', 'checked');
                }
            }
        }

        formLogLevelFilter.appendChild(inputEl);
        formLogLevelFilter.innerHTML = formLogLevelFilter.innerHTML + level + "<br>";
    }

    // Processing the servlet part of left side filter
    for (let i = 0; i < log.logServlets.length; i++) {
        const servlet = log.logServlets[i];

        const inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'checkbox');
        inputEl.setAttribute('name', 'servlet');
        inputEl.value = servlet;

        //If this is an unfiltered page load then everything is checked
        if (log.checkedServlets.length == 0) {
            inputEl.setAttribute('checked', 'checked');
        }else {
            //If it's a filtered search only check the boxes which were filtered in the request
            for (let n = 0; n < log.checkedServlets.length; n++) {
                const checkedServlet = log.checkedServlets[n];

                if (checkedServlet === servlet) {
                    inputEl.setAttribute('checked', 'checked');
                }
            }
        }

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