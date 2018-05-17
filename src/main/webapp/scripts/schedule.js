function addTask(mainDiv) {

}

function viewTask(mainDiv) {
    
}

function sendNewColumnData() {
    const inputEl = document.getElementById('new-column-input');
    const value = inputEl.value;
    const messageDiv = (document.getElementsByClassName('hv-centered-div'))[0];

    const params = new URLSearchParams();
    params.append('scheduleId', messageDiv.getAttribute('schedule-id'));
    params.append('columnName', value);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'protected/schedule/?' + params.toString());
    xhr.send();
}

function addColumn() {
    const messageDiv = (document.getElementsByClassName('hv-centered-div'))[0];
    removeAllChildren(messageDiv);
    
    const hEl = document.createElement('h2');
    hEl.textContent = "Type the name of your routine:";

    const inputEl = document.createElement('input');
    inputEl.setAttribute('placeholder', 'Enter name here');
    inputEl.setAttribute('id', 'new-column-input');
    inputEl.setAttribute('class', 'schedule-input');

    const buttonEl = document.createElement('button');
    buttonEl.addEventListener('click', sendNewColumnData);
    buttonEl.setAttribute('class', 'schedule-button');
    buttonEl.textContent = "Add";

    messageDiv.appendChild(hEl);
    messageDiv.appendChild(inputEl);
    messageDiv.appendChild(buttonEl);
}

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
            counterTdEl.setAttribute('class', 'task-counter');
            trEl.appendChild(counterTdEl);

            if (typeof tsk != 'undefined') {
                tdEl.textContent = tsk.task.name;
                tdEl.setAttribute('rowspan', tsk.slotsTaken.length);
                tdEl.setAttribute('class', 'ok-task');
                taskSpaceCounter = tsk.slotsTaken.length;

                tdEl.addEventListener('click', addTask);
                trEl.appendChild(tdEl);
            }

            if (typeof tsk == 'undefined' && taskSpaceCounter <= 0) {
                tdEl.setAttribute('class', 'no-task');

                tdEl.addEventListener('click', viewTask);
                trEl.appendChild(tdEl);
            }

            tableEl.appendChild(trEl);
        }
    }
}

function noColumnMessage(mainDiv, scheduleId){
    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'hv-centered-div');
    messageDiv.setAttribute('schedule-id', scheduleId);

    const hEl = document.createElement('h1');
    hEl.setAttribute('class', 'hv-centered-text');
    hEl.textContent = "You don't have any routines defined!";

    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('id', 'schedule-new-column-button');
    buttonEl.setAttribute('class', 'schedule-button');
    buttonEl.addEventListener('click', addColumn);
    buttonEl.innerHTML = "<h4 class=schedule-small-margin> Add one! </h4>";

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
        noColumnMessage(mainDiv, schedule.scheduleId);

    } else {
        /* Create Title */
        /*const h2El = document.createElement('h2');
        h2El.textContent = "Your Daily Routine:";*/

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