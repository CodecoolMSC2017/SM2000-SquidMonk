function sendFilterData() {
    const servletFilterDiv = document.getElementById('servlet-filter');
    const logLevelFilterDiv = document.getElementById('level-filter');

    const servletElements = servletFilterDiv.getElementsByTagName('div');
    const logLevelElements = logLevelFilterDiv.getElementsByTagName('div');

    let servletToFilter = [];
    let logLevelToFilter = [];

    for (let i = 0; i < servletElements.length; i++) {
        const element = servletElements[i];

        if (element.getAttribute('checked') === 'checked') {
            servletToFilter.push(element.textContent);
        }
    }

    for (let i = 0; i < logLevelElements.length; i++) {
        const element = logLevelElements[i];

        if (element.getAttribute('checked') === 'checked') {
            logLevelToFilter.push(element.textContent);
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

    const table = document.createElement('table');
    table.className = 'log-table';
    table.appendChild(createLogTableHead());



    // Processing logtext
    for (let i = log.logText.length-1; i >= 0; i--) {
        const line = log.logText[i];

        table.appendChild(createLogTableEntry(line));

        //divTextAreaEl.innerHTML = divTextAreaEl.innerHTML + line + "<br>";
    }

    divTextAreaEl.appendChild(table);
    const buttonEmptyLog = document.createElement('button');

    const leftFilterDiv = document.createElement('div');
    leftFilterDiv.setAttribute('class', 'side-bar');
    leftFilterDiv.setAttribute('id', 'side-bar');

    const hEl = document.createElement('h1');
    hEl.style.color = 'white';
    hEl.setAttribute('class', 'hv-centered-text')
    hEl.textContent = 'Filters';
    hEl.style.paddingTop = '10%';

    const buttonFilter = document.createElement('button');
    buttonFilter.textContent = "Filter";
    buttonFilter.className = 'create-button';
    buttonFilter.setAttribute('onclick', 'sendFilterData()');

    const servletFilterDiv = document.createElement('div');
    servletFilterDiv.setAttribute('id', 'servlet-filter');
    servletFilterDiv.setAttribute('class', 'log-small-margin');

    const logLevelFilterDiv = document.createElement('div');
    logLevelFilterDiv.setAttribute('id', 'level-filter');
    logLevelFilterDiv.setAttribute('class', 'log-small-margin');

    // Processing the levels part of left side filter
    for (let i = 0; i < log.logLevels.length; i++) {
        const level = log.logLevels[i];

        const inputEl = document.createElement('div');
        inputEl.className = 'dragdrop-task';
        inputEl.textContent = level;

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

        if (inputEl.getAttribute('checked') === 'checked') {
            inputEl.style.backgroundColor = 'rgb(18, 183, 0)';
        } else {
            inputEl.style.backgroundColor = 'rgb(130, 130, 130)';
        }


        inputEl.setAttribute('onclick', 'onLogInputClick(event)');
        logLevelFilterDiv.appendChild(inputEl);
        logLevelFilterDiv.innerHTML = logLevelFilterDiv.innerHTML + "<br>";
    }

    // Processing the servlet part of left side filter
    for (let i = 0; i < log.logServlets.length; i++) {
        const servlet = log.logServlets[i];

        const inputEl = document.createElement('div');
        inputEl.className = 'dragdrop-task';
        inputEl.textContent = servlet;

        //If this is an unfiltered page load then everything is checked
        if (log.checkedServlets.length == 0) {
            inputEl.setAttribute('checked', 'checked');
        } else {
            //If it's a filtered search only check the boxes which were filtered in the request
            for (let n = 0; n < log.checkedServlets.length; n++) {
                const checkedServlet = log.checkedServlets[n];

                if (checkedServlet === servlet) {
                    inputEl.setAttribute('checked', 'checked');
                }
            }
        }

        if (inputEl.getAttribute('checked') === 'checked') {
            inputEl.style.backgroundColor = 'rgb(18, 183, 0)';
        } else {
            inputEl.style.backgroundColor = 'rgb(130, 130, 130)';
        }


        inputEl.setAttribute('onclick', 'onLogInputClick(event)');
        servletFilterDiv.appendChild(inputEl);
        servletFilterDiv.innerHTML = servletFilterDiv.innerHTML + '<br>';
    }

    leftFilterDiv.appendChild(hEl);
    leftFilterDiv.appendChild(logLevelFilterDiv);
    leftFilterDiv.appendChild(servletFilterDiv);
    leftFilterDiv.appendChild(buttonFilter);

    logViewDiv.appendChild(leftFilterDiv);
    logViewDiv.appendChild(divTextAreaEl);
    mainDiv.appendChild(logViewDiv);

    //timedRefreshLogView();
}

function createLogTableHead() {
    const trHead = document.createElement('tr');
    trHead.className = 'log-table-head-row';

    const tdHeadDate = document.createElement('td');
    tdHeadDate.className = 'log-table-head-entry';
    tdHeadDate.textContent = 'Date';

    const tdHeadTime = document.createElement('td');
    tdHeadTime.className = 'log-table-head-entry';
    tdHeadTime.textContent = 'Time';

    const tdHeadType = document.createElement('td');
    tdHeadType.className = 'log-table-head-entry';
    tdHeadType.textContent = 'Type';

    const tdHeadServlet = document.createElement('td');
    tdHeadServlet.className = 'log-table-head-entry';
    tdHeadServlet.textContent = 'Source';

    const tdHeadMessage = document.createElement('td');
    tdHeadMessage.className = 'log-table-head-entry';
    tdHeadMessage.textContent = 'Message';

    trHead.appendChild(tdHeadDate);
    trHead.appendChild(tdHeadTime);
    trHead.appendChild(tdHeadType);
    trHead.appendChild(tdHeadServlet);
    trHead.appendChild(tdHeadMessage);

    return trHead;
}

function createLogTableEntry(line) {
    const trBody = document.createElement('tr');
    trBody.className = 'log-table-body-row';
    const splitLineBySpace = line.split(' ');
    const splitLineByDash = line.split('-');

    const date = splitLineBySpace[0];
    const time = splitLineBySpace[1];
    const type = splitLineBySpace[2];
    let servlet;
    let color;
    if (type === 'DEBUG') {
        //orange
        color = 'rgb(29, 186, 9)';
        servlet = splitLineBySpace[3];
    }

    if (type === 'ERROR') {
        //red
        color = 'rgb(255, 0, 0)';
        servlet = splitLineBySpace[3];
    }

    if (type === 'TRACE') {
        //gray
        color = 'rgb(135, 135, 135)';
        servlet = splitLineBySpace[3];
    }

    if (type === 'INFO') {
        //blue
        color = 'rgb(0, 71, 214)';
        servlet = splitLineBySpace[4];
    }
    if (type === 'WARN') {
        //yellow
        color = 'rgb(255, 144, 0)';
        servlet = splitLineBySpace[4];
    }

    const message = splitLineByDash[3];

    const dateTd = document.createElement('td');
    dateTd.className = 'log-table-body-entry';
    dateTd.textContent = date;

    const timeTd = document.createElement('td');
    timeTd.className = 'log-table-body-entry';
    timeTd.textContent = time;

    const typeTd = document.createElement('td');
    typeTd.className = 'log-table-body-entry';
    typeTd.style.color = color;
    typeTd.textContent = type;

    const servletTd = document.createElement('td');
    servletTd.className = 'log-table-body-entry';
    servletTd.textContent = servlet;

    const messageTd = document.createElement('td');
    messageTd.className = 'log-table-body-entry';
    messageTd.textContent = message;

    trBody.appendChild(dateTd);
    trBody.appendChild(timeTd);
    trBody.appendChild(typeTd);
    trBody.appendChild(servletTd);
    trBody.appendChild(messageTd);


    return trBody;
}

function onMenuLogClick() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLogReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/logview/' + "pageload");
    xhr.send();
}

function timedRefreshLogView() {
    const timer = setInterval(onMenuLogClick, 10000); // 10 seconds
}

function onLogInputClick(event) {
    const el = event.target;
    if (el.getAttribute('checked') === 'checked') {
        el.removeAttribute('checked');
        el.style.backgroundColor = 'rgb(130, 130, 130)';
    } else {
        el.setAttribute('checked', 'checked');
        el.style.backgroundColor = 'rgb(18, 183, 0)';
    }
}