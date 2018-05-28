let shareDivEl;

function addTask(mainDiv) {

}

function viewTask() {

}

function deleteSchedule() {
    const params = new URLSearchParams();
    params.append('scheduleId', this.getAttribute('schedule-id'));
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', showDashboard);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('DELETE', 'protected/schedule/?' + params.toString());
    xhr.send();
}

function sendRenameColumn() {
    const buttonEl = this;
    const inputEl = document.getElementById('column-rename-input');
    const value = inputEl.value;
    const columnId = buttonEl.getAttribute('columnId');
    const buttonDeleteSchedule = document.getElementById('schedule-delete-button');
    const scheduleId = buttonDeleteSchedule.getAttribute('schedule-id');

    const params = new URLSearchParams();
    params.append('columnId', columnId);
    params.append('columnName', value);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule/' + scheduleId + '?' + params.toString(), true);
    xhr.send();
}

function editSingleRoutineName() {
   const thEl = this;
   const columnId = thEl.getAttribute('columnId');
   const trEl = document.getElementById('header-row-' + columnId);

   const buttonEl = document.createElement('button');
   buttonEl.setAttribute('class', 'schedule-button-small-padding');
   buttonEl.setAttribute('columnId', columnId);
   buttonEl.addEventListener('click', sendRenameColumn);
   buttonEl.textContent = "Save";

   const inputEl = document.createElement('input');
   inputEl.setAttribute('id', 'column-rename-input');
   inputEl.setAttribute('class', 'schedule-input-small-padding');

   inputEl.placeholder = thEl.textContent;

   removeAllChildren(trEl);

   trEl.appendChild(inputEl);
   trEl.appendChild(buttonEl);
}

function addColumn() {
    const mainDiv = document.getElementById('main-content');

    const buttonDeleteSchedule = document.getElementById('schedule-delete-button');
    const scheduleId = buttonDeleteSchedule.getAttribute('schedule-id');

    const darkBackgroundDiv = document.createElement('div');
    darkBackgroundDiv.setAttribute('class', 'schedule-above-div-dark');
    darkBackgroundDiv.setAttribute('id', scheduleId);
    darkBackgroundDiv.addEventListener('click', onScheduleClick);

    const aboveDivEl = document.createElement('div');
    aboveDivEl.setAttribute('class', 'schedule-above-div');
    aboveDivEl.setAttribute('id', 'schedule-add-column');
    aboveDivEl.setAttribute('schedule-id', scheduleId);
    
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

    aboveDivEl.appendChild(hEl);
    aboveDivEl.appendChild(inputEl);
    aboveDivEl.appendChild(buttonEl);
    mainDiv.appendChild(darkBackgroundDiv);
    mainDiv.appendChild(aboveDivEl);
}

function editColumnNames() {

}

function removeColumn() {

}

function sendNewColumnData() {
    const inputEl = document.getElementById('new-column-input');
    const value = inputEl.value;
    const divEl = document.getElementById('schedule-add-column');
    const scheduleId = divEl.getAttribute('schedule-id');

    const params = new URLSearchParams();
    params.append('columnName', value);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'protected/schedule/' + scheduleId + '?' + params.toString());
    xhr.send();
}

function addColumnToEmptySchedule() {
    const messageDiv = document.getElementById('schedule-add-column');
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
        trEl.setAttribute('id', 'header-row-' + column.id);

        const thEl = document.createElement('th');
        thEl.addEventListener('click', editSingleRoutineName);
        thEl.textContent = column.name;
        thEl.setAttribute('columnId', column.id);

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
                tdHeight = 39 * tsk.slotsTaken.length;

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
    messageDiv.setAttribute('id', 'schedule-add-column');
    messageDiv.setAttribute('schedule-id', scheduleId);

    const hEl = document.createElement('h1');
    hEl.setAttribute('class', 'hv-centered-text');
    hEl.textContent = "You don't have any routines defined!";

    const buttonCreateEl = document.createElement('button');
    buttonCreateEl.setAttribute('id', 'schedule-new-column-button');
    buttonCreateEl.setAttribute('class', 'schedule-button-bigger');
    buttonCreateEl.addEventListener('click', addColumnToEmptySchedule);
    buttonCreateEl.innerHTML = "<h4 class=schedule-small-margin> Add one! </h4>";

    const buttonDeleteSchedule = document.createElement('button');
    buttonDeleteSchedule.setAttribute('class', 'schedule-button-bigger');
    buttonDeleteSchedule.setAttribute('schedule-id', scheduleId);
    buttonDeleteSchedule.addEventListener('click', deleteSchedule);
    buttonDeleteSchedule.innerHTML = "<h4 class=schedule-small-margin> Delete this schedule </h4>";


    const brEl = document.createElement('br');

    messageDiv.appendChild(hEl);
    messageDiv.appendChild(brEl);
    messageDiv.appendChild(buttonCreateEl);
    messageDiv.appendChild(buttonDeleteSchedule);
    mainDiv.appendChild(messageDiv);
}

function createTitleButtons(mainDiv, schedule) {
    if (schedule.public === true) {
        shareDivEl = document.createElement('div');
        shareDivEl.setAttribute('class', 'h-centered-div');

        const shareTitle = document.createElement('h2');
        shareTitle.textContent = 'Share this schedule!';

        const shareUrl = document.createElement('h3');
        shareUrl.textContent = document.URL + schedule.url;

        shareDivEl.appendChild(shareTitle);
        shareDivEl.appendChild(shareUrl);
        mainDiv.appendChild(shareDivEl);
    }

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

    const buttonPublish = document.createElement('button');
    buttonPublish.setAttribute('class', 'schedule-button');
    buttonPublish.addEventListener('click', onSchedulePublishClick);
    buttonPublish.style.width = '5%';
    buttonPublish.setAttribute('data-sched-id', schedule.id);

    buttonPublish.setAttribute('ispublic', schedule.public);
    if (schedule.public === true) {
        buttonPublish.innerHTML = '<i class="fa fa-check"></i>';
    } else {
        buttonPublish.innerHTML = '<i class="fa fa-remove"></i>';
    }

    const buttonRemove = document.createElement('button');
    buttonRemove.setAttribute('class', 'schedule-button');
    buttonRemove.addEventListener('click', removeColumn);
    buttonRemove.textContent = "Delete a routine";

    const buttonDeleteSchedule = document.createElement('button');
    buttonDeleteSchedule.setAttribute('class', 'schedule-button');
    buttonDeleteSchedule.setAttribute('id', 'schedule-delete-button');
    buttonDeleteSchedule.setAttribute('schedule-id', schedule.id);
    buttonDeleteSchedule.addEventListener('click', deleteSchedule);
    buttonDeleteSchedule.textContent = "Delete this schedule";


    if (schedule.columns.length < 7) {
        buttonDivEl.appendChild(buttonAdd);
    }

    buttonDivEl.appendChild(buttonEdit);
    buttonDivEl.appendChild(buttonPublish);
    buttonDivEl.appendChild(buttonRemove);
    buttonDivEl.appendChild(buttonDeleteSchedule);
    mainDiv.appendChild(buttonDivEl);
}

function onSchedulePublishClick() {
    const buttonEl = this;
    const id = this.getAttribute('data-sched-id');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
        onSchedulePublishReceived(buttonEl)
    });
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule/' + id + '/visible', true);
    xhr.send();
}

function onSchedulePublishReceived(el) {
    if (el.getAttribute('ispublic') === 'true') {
        el.setAttribute('ispublic', false);
        shareDivEl.style.display = 'none';
        el.innerHTML = '<i class="fa fa-remove"></i>';
    } else {
        shareDivEl.style.display = 'block';
        el.setAttribute('ispublic', true);
        el.innerHTML = '<i class="fa fa-check"></i>';
    }
}

function onScheduleReceived() {
    const mainDiv = document.getElementById('main-content');
    removeAllChildren(mainDiv);
    const schedule = JSON.parse(this.responseText);

    if (schedule.columns.length == 0) {
        /* If no columns show this */
        noColumnMessage(mainDiv, schedule.id);

    } else {
        /* Create Title buttons */
        createTitleButtons(mainDiv, schedule);

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
