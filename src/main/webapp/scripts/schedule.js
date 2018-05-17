function createHeaderRow(mainDiv, schedule) {
    
    for (let i = 0; i < schedule.columns.length; i++) {
        const column = schedule.columns[i];

        const tableEl = document.createElement('table');
        tableEl.setAttribute('class', 'schedule-table');
        tableEl.setAttribute('id', column.id);

        const trEl = document.createElement('tr');
        
        const thEl = document.createElement('th');
        thEl.textContent = column.name;
        thEl.setAttribute('colspan', '2');

        trEl.appendChild(thEl);
        tableEl.appendChild(trEl);
        mainDiv.appendChild(tableEl);   
    }
}

function createTimeslotRows(mainDiv, schedule) {
    let taskSpaceCounter = 0;
    
    /* As many columns are needed as the column list's size */
    for (let i = 0; i < schedule.columns.length; i++) {
        const column = schedule.columns[i];
        const tableEl = document.getElementById(column.id)

        /* 24 slots (rows) are needed */
        for (let n = 0; n < 24; n++) {
            const tsk = column.tasks[n];
            const trEl = document.createElement('tr');
            const tdEl = document.createElement('td');
            const counterTdEl = document.createElement('td');
            taskSpaceCounter--;

            counterTdEl.textContent = n + " - " + (n+1);

            if (typeof tsk != 'undefined') {
                tdEl.textContent = tsk.task.name;
                tdEl.setAttribute('rowspan', tsk.slotsTaken.length);
                tdEl.setAttribute('class', 'ok-task');
                taskSpaceCounter = tsk.slotsTaken.length;
            }

            if (typeof tsk == 'undefined' && taskSpaceCounter <= 0) {
                tdEl.setAttribute('class', 'no-task');
            }

            trEl.appendChild(counterTdEl);
            trEl.appendChild(tdEl);
            tableEl.appendChild(trEl);
        }
    }
}

function noColumnMessage(mainDiv){
    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'hv-centered-div');

    const hEl = document.createElement('h1');
    hEl.setAttribute('class', 'hv-centered-text');
    hEl.textContent = "You don't have any schedules defined!";

    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('id', 'schedule-new-column-button');
    buttonEl.textContent = "Add some!";

    const brEl = document.createElement('br');

    messageDiv.appendChild(hEl);
    messageDiv.appendChild(brEl);
    messageDiv.appendChild(buttonEl);
    mainDiv.appendChild(messageDiv);
}

function onScheduleReceived() {
    const mainDiv = document.getElementById('main-content');
    removeAllChildren(mainDiv);
    const schedule = JSON.parse(this.responseText);

    if (schedule.columns.length == 0) {
        /* If no columns show this */
        noColumnMessage(mainDiv);

    } else {
        /* Create first header row */
        const tableEl = createHeaderRow(mainDiv, schedule);

        /* Create timeslot rows with tasks */
        createTimeslotRows(mainDiv, schedule);
    }
}

function onScheduleClick() {
    const value = this.getAttribute('id');
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule/' + value);
    xhr.send();
}

function onSchedulesReceived() {
    const mainDiv = document.getElementById('main-content');
    removeAllChildren(mainDiv);
    const schedules = JSON.parse(this.responseText);

    const tableEl = document.createElement('table');
    const rowEl = document.createElement('tr');

    for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];
        const tdEl = document.createElement('td');
        tdEl.textContent = schedule.name;
        tdEl.setAttribute('value', schedule.id);
        tdEl.addEventListener('click', onScheduleClick);

        rowEl.appendChild(tdEl);
    }

    tableEl.appendChild(rowEl);
    mainDiv.appendChild(tableEl);
}

function onMenuScheduleClick() {
    const user = JSON.parse(localStorage.getItem('user'));

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onSchedulesReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedules/user/' + user.id);
    xhr.send();
}