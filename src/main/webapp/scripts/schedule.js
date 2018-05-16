function createHeaderRow(mainDiv, schedule) {
    const tableEl = document.createElement('table');
    tableEl.setAttribute('class', 'schedule-table');
    const trEl = document.createElement('tr');
    
    for (let i = 0; i < schedule.columns.length; i++) {
        const column = schedule.columns[i];
        
        const thEl = document.createElement('th');
        thEl.textContent = column.name;

        trEl.appendChild(thEl);

        if (i < (schedule.columns.length - 1)) {
            const emptyThEl = document.createElement('th');
            emptyThEl.setAttribute('class', 'emptyelement');
            trEl.appendChild(emptyThEl);
        }
    }

    tableEl.appendChild(trEl);
    mainDiv.appendChild(tableEl);

    return tableEl;
}

function createTimeslotRows(mainDiv, tableEl, schedule) {
    
    /* 24 slots (rows) are needed */
    for (let i = 0; i < 24; i++) {
        const trEl = document.createElement('tr');

        /* As many columns are needed as the column list's size */
        for (let n = 0; n < schedule.columns.length; n++) {
            const column = schedule.columns[n];
            const tdEl = document.createElement('td');
            tdEl.textContent = "No task for this slot";

            /* Check if there are tasks for this column's current timeslot */
            for (let j = 0; j < schedule.tasks.length; j++) {
                const task = schedule.tasks[j];
                
                /* If the task is in the current column */
                if (task.colId == column.id) {
                    
                    /* If the start time matches the row number */
                    if (task.start == i) {
                        tdEl.textContent = task.name;
                    }
                }
            }

            trEl.appendChild(tdEl);

            if (n < (schedule.columns.length - 1)) {
                const emptyTdEl = document.createElement('td');
                emptyTdEl.setAttribute('class', 'emptyelement');

                trEl.appendChild(emptyTdEl);
            }
        }

        tableEl.appendChild(trEl);
    }
}

function noColumnMessage(mainDiv){
    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'hv-centered-div');

    const hEl = document.createElement('h1');
    hEl.setAttribute('class', 'hv-centered-text');
    hEl.textContent = "You don't have any schedules defined!";

    const buttonEl = document.createElement('button');
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
        createTimeslotRows(mainDiv, tableEl, schedule);
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