function addTask(mainDiv) {

}

function deleteSchedule() {
    
}

function editSingleRoutineName() {

}

function addColumn() {

}

function editColumnNames() {

}

function removeColumn() {

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

function addColumnToEmptySchedule() {
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
    const tableDivEl = document.createElement('div');
    tableDivEl.setAttribute('class', 'schedule-div-table');
    
    for (let i = 0; i < schedule.columns.length; i++) {
        const column = schedule.columns[i];

        const tableEl = document.createElement('table');
        tableEl.setAttribute('class', 'schedule-table');
        tableEl.setAttribute('id', column.id);

        const trEl = document.createElement('tr');

        const thEl = document.createElement('th');
        thEl.addEventListener('click', editSingleRoutineName);
        thEl.textContent = column.name;

        trEl.appendChild(thEl);
        tableEl.appendChild(trEl);
        tableDivEl.appendChild(tableEl);
        mainDiv.appendChild(tableDivEl);   
    }
}

function createTimeslotRows(mainDiv, schedule) {
    let taskSpaceCounter = 0;
    let tdHeight = 0;
    
    /* As many columns are needed as the column list's size */
    for (let i = 0; i < schedule.columns.length; i++) {
        const column = schedule.columns[i];
        const tableEl = document.getElementById(column.id)

        /* 24 slots (rows) are needed */
        for (let n = 0; n < 24; n++) {
            const tsk = column.tasks[n];
            const trEl = document.createElement('tr');
            const tdEl = document.createElement('td');
            taskSpaceCounter--;

            if (typeof tsk != 'undefined') {
                tdHeight = 40 * tsk.slotsTaken.length;

                tdEl.innerHTML = "<b>" + tsk.task.name + "</b><br>" + tsk.task.start + ":00 to " + tsk.task.end +":00";
                tdEl.setAttribute('rowspan', tsk.slotsTaken.length);
                tdEl.setAttribute('style', 'height: ' + tdHeight + 'px');
                tdEl.setAttribute('class', 'ok-task');
                tdEl.setAttribute('data-task-id', tsk.task.id);

                taskSpaceCounter = tsk.slotsTaken.length;

                if (tdHeight >= 120) {
                    tdEl.innerHTML = "<b>" + tsk.task.name + "</b><br><i>" + tsk.task.content + "</i><br><br>" + tsk.task.start + ":00 to " + tsk.task.end +":00";
                }

                tdEl.addEventListener('click', getTask);
                trEl.appendChild(tdEl);
            }

            if (typeof tsk == 'undefined' && taskSpaceCounter <= 0) {
                tdEl.setAttribute('class', 'no-task');
                tdEl.textContent = n + ":00 - " + (n+1) + ":00";

                tdEl.addEventListener('click', addTask);
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
    buttonEl.setAttribute('style', 'margin-top: 0px; width: 20%');
    buttonEl.addEventListener('click', addColumnToEmptySchedule);
    buttonEl.innerHTML = "<h4 class=schedule-small-margin> Add one! </h4>";

    const brEl = document.createElement('br');

    messageDiv.appendChild(hEl);
    messageDiv.appendChild(brEl);
    messageDiv.appendChild(buttonEl);
    mainDiv.appendChild(messageDiv);
}

function createTitleButtons(mainDiv, columnNumber) {
    const buttonDivEl = document.createElement('div');
    buttonDivEl.setAttribute('class', 'h-centered-div');

    const buttonAdd = document.createElement('button');
    buttonAdd.setAttribute('class', 'schedule-button');
    buttonAdd.addEventListener('click', addColumn);
    buttonAdd.textContent = "Add new Routine";

    const buttonEdit = document.createElement('button');
    buttonEdit.setAttribute('class', 'schedule-button');
    buttonEdit.addEventListener('click', editColumnNames);
    buttonEdit.textContent = "Edit Routine Names";

    const buttonRemove = document.createElement('button');
    buttonRemove.setAttribute('class', 'schedule-button');
    buttonRemove.addEventListener('click', removeColumn);
    buttonRemove.textContent = "Delete a routine";

    const buttonDeleteSchedule = document.createElement('button');
    buttonDeleteSchedule.setAttribute('class', 'schedule-button');
    buttonDeleteSchedule.addEventListener('click', deleteSchedule);
    buttonDeleteSchedule.textContent = "Delete this schedule";


    if (columnNumber < 7) {
        buttonDivEl.appendChild(buttonAdd);
    }

    buttonDivEl.appendChild(buttonEdit);
    buttonDivEl.appendChild(buttonRemove);
    buttonDivEl.appendChild(buttonDeleteSchedule);
    mainDiv.appendChild(buttonDivEl);
}

function onScheduleReceived() {
    const mainDiv = document.getElementById('main-content');
    removeAllChildren(mainDiv);
    const schedule = JSON.parse(this.responseText);

    if (schedule.columns.length == 0) {
        /* If no columns show this */
        noColumnMessage(mainDiv, schedule.scheduleId);

    } else {
        /* Create Title buttons */
        createTitleButtons(mainDiv, schedule.columns.length);

        /* Create first header row */
        createHeaderRow(mainDiv, schedule);

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