
let currentScheduleId;

function addTask() {

}

function scheduleDeleteTask() {
    const taskId = this.getAttribute('data-task-id');
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('DELETE', 'protected/schedule/task/' + taskId);
    xhr.send();
}

function sendModifiedTaskData() {
    const taskId = this.getAttribute('data-task-id');
    const titleInputEl = document.getElementById('modify-task-title-input');
    const descriptionInputEl = document.getElementById('modify-task-description-input');
    const startInputEl = document.getElementById('modify-task-start-input');
    const endInputEl = document.getElementById('modify-task-end-input');

    const params = new URLSearchParams();
    params.append('title', titleInputEl.value);
    params.append('description', descriptionInputEl.value);
    params.append('start', startInputEl.value);
    params.append('end', endInputEl.value);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule/task/' + taskId + '?' + params.toString(), true);
    xhr.send();
}

function getTasksToView() {
    const taskId = this.getAttribute('data-task-id');
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', viewTaskOnReceive);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule/task/' + taskId);
    xhr.send();
}

function viewTaskOnReceive() {
    const task = JSON.parse(this.responseText);

    const mainDiv = document.getElementById('main-content');

    const buttonDeleteSchedule = document.getElementById('schedule-delete-button');
    const scheduleId = buttonDeleteSchedule.getAttribute('schedule-id');

    const darkBackgroundDiv = document.createElement('div');
    darkBackgroundDiv.setAttribute('class', 'schedule-above-div-dark');
    darkBackgroundDiv.setAttribute('id', scheduleId);
    darkBackgroundDiv.addEventListener('click', onScheduleClick);

    const aboveDivEl = document.createElement('div');
    aboveDivEl.setAttribute('class', 'schedule-above-div-task');
    aboveDivEl.setAttribute('id', 'schedule-add-column');
    aboveDivEl.setAttribute('schedule-id', scheduleId);
    aboveDivEl.setAttribute('style', 'background-color: lightblue')
    
    const h2El = document.createElement('h2');
    h2El.textContent = "Modify task";

    const titleSpanEl = document.createElement('span');
    titleSpanEl.setAttribute('style', 'font-style: italic');
    titleSpanEl.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title: ";

    const inputTitleEl = document.createElement('input');
    inputTitleEl.setAttribute('id', 'modify-task-title-input');
    inputTitleEl.setAttribute('class', 'schedule-input');
    inputTitleEl.value = task.name;

    const inputDescriptionEl = document.createElement('input');
    inputDescriptionEl.setAttribute('id', 'modify-task-description-input');
    inputDescriptionEl.setAttribute('class', 'schedule-input');
    inputDescriptionEl.value = task.content;

    const descSpanEl = document.createElement('span');
    descSpanEl.setAttribute('style', 'font-style: italic');
    descSpanEl.innerHTML = "<br>Description: ";

    const pStartEl = document.createElement('p');
    pStartEl.textContent = "Start time: ";

    const inputStartEl = document.createElement('input');
    inputStartEl.setAttribute('type', 'number');
    inputStartEl.setAttribute('min', '0');
    inputStartEl.setAttribute('max', '23');
    inputStartEl.setAttribute('id', 'modify-task-start-input');
    inputStartEl.setAttribute('class', 'schedule-input-small-padding-small-size');
    inputStartEl.value = task.start;

    const spanEndEl = document.createElement('span');
    spanEndEl.innerHTML = "&nbsp;&nbsp;End time: ";

    const inputEndEl = document.createElement('input');
    inputEndEl.setAttribute('type', 'number');
    inputEndEl.setAttribute('min', '1');
    inputEndEl.setAttribute('max', '24');
    inputEndEl.setAttribute('id', 'modify-task-end-input');
    inputEndEl.setAttribute('class', 'schedule-input-small-padding-small-size');
    inputEndEl.value = task.end;

    const buttonSaveEl = document.createElement('button');
    buttonSaveEl.addEventListener('click', sendModifiedTaskData);
    buttonSaveEl.setAttribute('class', 'schedule-button-small-top-margin');
    buttonSaveEl.setAttribute('data-task-id', task.id);
    buttonSaveEl.textContent = "Save";

    const buttonDeleteEl = document.createElement('button');
    buttonDeleteEl.addEventListener('click', scheduleDeleteTask);
    buttonDeleteEl.setAttribute('class', 'schedule-button-small-top-margin');
    buttonDeleteEl.setAttribute('data-task-id', task.id);
    buttonDeleteEl.textContent = "Delete";

    pStartEl.appendChild(inputStartEl);
    spanEndEl.appendChild(inputEndEl);
    pStartEl.appendChild(spanEndEl);

    aboveDivEl.appendChild(h2El);
    aboveDivEl.appendChild(titleSpanEl);
    aboveDivEl.appendChild(inputTitleEl);
    aboveDivEl.appendChild(descSpanEl);
    aboveDivEl.appendChild(inputDescriptionEl);
    aboveDivEl.appendChild(pStartEl);
    aboveDivEl.appendChild(buttonSaveEl);
    aboveDivEl.appendChild(buttonDeleteEl);
    mainDiv.appendChild(darkBackgroundDiv);
    mainDiv.appendChild(aboveDivEl);

}

function sharePopupDialog() {
    const mainDiv = document.getElementById('main-content');
    const buttonEl = this;
    const public = (buttonEl.getAttribute('public-schedule') == 'true');
    const url = buttonEl.getAttribute('url');

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

    const shareDiv = document.createElement('div');
    shareDiv.id = 'share-div';
    shareDiv.className = 'tooltip';
    const shareUrl = document.createElement('input');
    shareUrl.setAttribute('readonly', 'readonly');
    shareUrl.type = 'text';
    shareUrl.setAttribute('id', 'schedule-share-url');
    shareDiv.appendChild(shareUrl);

    const clipboard = document.createElement('div');
    clipboard.id = 'clipboard-button';
    clipboard.innerHTML = '<i class="fa fa-copy"></i>';
    clipboard.addEventListener('click', copyToClipBoard);
    clipboard.addEventListener('mouseout', onClipboardMouseOut);
    shareDiv.appendChild(clipboard);

    const tooltip = document.createElement('span');
    tooltip.id = 'tooltip';
    tooltip.className = 'tooltiptext';
    tooltip.textContent = 'Copy to clipboard';
    clipboard.appendChild(tooltip);


    const shareTitle = document.createElement('h2');
    shareTitle.setAttribute('id', 'share-title-schedule')

    const buttonPublish = document.createElement('button');
    buttonPublish.setAttribute('class', 'schedule-button');
    buttonPublish.setAttribute('id', 'schedule-dialog-share-button');
    buttonPublish.addEventListener('click', onSchedulePublishClick);
    buttonPublish.setAttribute('data-sched-id', scheduleId);
    buttonPublish.setAttribute('ispublic', public);
    buttonPublish.style.position = 'absolute';

    const finalUrl = document.URL + "schedules/public/" + url;

    if (public === true) {
        shareTitle.textContent = 'Share this schedule!';
        shareDiv.style.display = 'block';
        shareUrl.value = finalUrl;

        buttonPublish.textContent = "Unpublish";
    } else {
        shareTitle.textContent = "You haven't shared this schedule yet!";
        shareDiv.style.display = 'none';
        buttonPublish.textContent = "Publish";
    }

    aboveDivEl.appendChild(shareTitle);
    aboveDivEl.appendChild(shareDiv);
    aboveDivEl.appendChild(buttonPublish);
    mainDiv.appendChild(darkBackgroundDiv);
    mainDiv.appendChild(aboveDivEl);
}

function copyToClipBoard() {
    const url = document.getElementById('schedule-share-url');
    url.select();
    document.execCommand('copy');
    document.getElementById('tooltip').textContent = 'Copied!';
}

function onClipboardMouseOut() {
    document.getElementById('tooltip').textContent = 'Copy to clipboard';
}

function sendDeleteSchedule() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', showDashboard);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('DELETE', 'protected/schedule/' + this.getAttribute('schedule-id'));
    xhr.send();
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

function onSaveColumnNameButtonClicked(columnId) {
    const newName = document.getElementById('remane-column-input').value;

    const params = new URLSearchParams();
    params.append('columnId', columnId);
    params.append('columnName', newName);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', requestCurrentSchedule);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule/' + currentScheduleId + '?' + params.toString(), true);
    xhr.send();
}

function onEditColumnButtonClicked(columnId) {
    // setup input field
    const thEl = document.querySelector('[columnid="' + columnId + '"]');
    const title = thEl.textContent;
    thEl.textContent = '';

    const inputEl = document.createElement('input');
    inputEl.id = 'remane-column-input';
    inputEl.value = title;
    thEl.appendChild(inputEl); 

    // setup buttons

    const trEl = document.querySelector('[tr-columnid="' + columnId + '"]');
    trEl.textContent = '';

    const saveButtonEl = document.createElement('button');
    saveButtonEl.textContent = 'Save';
    saveButtonEl.addEventListener('click', function() {onSaveColumnNameButtonClicked(columnId)});

    const backButtonEl = document.createElement('button');
    backButtonEl.textContent = 'Back';
    backButtonEl.addEventListener('click', requestCurrentSchedule);

    const saveTdEl = document.createElement('td');
    saveTdEl.appendChild(saveButtonEl);

    const backTdEl = document.createElement('td');
    backTdEl.appendChild(backButtonEl);

    trEl.appendChild(saveTdEl);
    trEl.appendChild(backTdEl);
}

function onDeleteColumnRespose() {
    if (this.status == NO_CONTENT) {
        requestCurrentSchedule();
    } else {
        console.log(this);
    }
}

function onDeleteColumnConfirmButtonClicked(columnId) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteColumnRespose);
    xhr.open('DELETE', 'protected/column/' + columnId);
    xhr.send();
}

function onDeleteColumnButtonClicked(columnId) {
    const thEl = document.querySelector('[columnid="' + columnId + '"]');
    thEl.textContent = 'Are you sure?';

    const trEl = document.querySelector('[tr-columnid="' + columnId + '"]');
    trEl.textContent = '';

    const deleteConfirmButtonEl = document.createElement('button');
    deleteConfirmButtonEl.textContent = 'Delete';
    deleteConfirmButtonEl.addEventListener('click', function() {onDeleteColumnConfirmButtonClicked(columnId)});

    const backButtonEl = document.createElement('button');
    backButtonEl.textContent = 'Back';
    backButtonEl.addEventListener('click', requestCurrentSchedule);

    const deleteConfirmTdEl = document.createElement('td');
    deleteConfirmTdEl.appendChild(deleteConfirmButtonEl);

    const backTdEl = document.createElement('td');
    backTdEl.appendChild(backButtonEl);

    trEl.appendChild(deleteConfirmTdEl);
    trEl.appendChild(backTdEl);
}

function createColumnEditButtons(columnId) {
    const trEl = document.createElement('tr');
    trEl.setAttribute('tr-columnid', columnId);

    const editTdEl = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {onEditColumnButtonClicked(columnId)});
    editTdEl.appendChild(editButton);

    const deleteTdEl = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {onDeleteColumnButtonClicked(columnId)});
    deleteTdEl.appendChild(deleteButton);

    trEl.appendChild(editTdEl);
    trEl.appendChild(deleteTdEl);

    return trEl;
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
        //thEl.addEventListener('click', editSingleRoutineName);
        thEl.textContent = column.name;
        thEl.setAttribute('columnId', column.id);
        thEl.setAttribute('colspan', '2');

        trEl.appendChild(thEl);
        tableEl.appendChild(trEl);
        tableEl.appendChild(createColumnEditButtons(column.id));
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
            const task = column.tasks[n];
            const trEl = document.createElement('tr');
            const tdEl = document.createElement('td');
            tdEl.setAttribute('colspan', '2');
            taskSpaceCounter--;

            if (typeof task != 'undefined') {
                const slotsTaken = task.end - task.start;
                tdHeight = 39 * slotsTaken;

                tdEl.innerHTML = "<b>" + task.name + "</b><br>" + task.start + ":00 to " + task.end +":00";
                tdEl.setAttribute('rowspan', slotsTaken);
                tdEl.setAttribute('style', 'height: ' + tdHeight + 'px');
                tdEl.setAttribute('class', 'ok-task');
                const colors = new Array();
                for (let i = 0; i < 3; i++) {
                    const num = Math.floor((Math.random() * 120) + 60);
                    colors.push(num);
                }

                tdEl.style.backgroundColor = 'rgb('+colors[0]+', '+colors[1]+', '+colors[2]+')';
                tdEl.setAttribute('data-task-id', task.id);

                taskSpaceCounter = slotsTaken;

                if (tdHeight >= 120) {
                    tdEl.innerHTML = "<b>" + task.name + "</b><br><i>" + task.content + "</i><br><br>" + task.start + ":00 to " + task.end +":00";
                }

                tdEl.addEventListener('click', getTasksToView);
                trEl.appendChild(tdEl);
            }

            if (typeof task == 'undefined' && taskSpaceCounter <= 0) {
                tdEl.setAttribute('class', 'no-task');
                tdEl.setAttribute('startTime', n);
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
    buttonDeleteSchedule.addEventListener('click', sendDeleteSchedule);
    buttonDeleteSchedule.innerHTML = "<h4 class=schedule-small-margin> Delete this schedule </h4>";


    const brEl = document.createElement('br');

    messageDiv.appendChild(hEl);
    messageDiv.appendChild(brEl);
    messageDiv.appendChild(buttonCreateEl);
    messageDiv.appendChild(buttonDeleteSchedule);
    mainDiv.appendChild(messageDiv);
}

function createTitleButtons(mainDiv, schedule) {

    const buttonDivEl = document.createElement('div');
    buttonDivEl.setAttribute('class', 'h-centered-div');

    const buttonAdd = document.createElement('button');
    buttonAdd.setAttribute('class', 'schedule-button');
    buttonAdd.addEventListener('click', addColumn);
    buttonAdd.textContent = "Add new Routine";

    const buttonPublish = document.createElement('button');
    buttonPublish.setAttribute('class', 'schedule-button');
    buttonPublish.setAttribute('id', 'schedule-share-button');
    buttonPublish.setAttribute('public-schedule', schedule.public);
    buttonPublish.setAttribute('url', schedule.url);
    buttonPublish.addEventListener('click', sharePopupDialog);
    buttonPublish.textContent = "Share schedule";

    const buttonDeleteSchedule = document.createElement('button');
    buttonDeleteSchedule.setAttribute('class', 'schedule-button');
    buttonDeleteSchedule.setAttribute('id', 'schedule-delete-button');
    buttonDeleteSchedule.setAttribute('schedule-id', schedule.id);
    buttonDeleteSchedule.addEventListener('click', sendDeleteSchedule);
    buttonDeleteSchedule.textContent = "Delete this schedule";


    if (schedule.columns.length < 7) {
        buttonDivEl.appendChild(buttonAdd);
    }

    buttonDivEl.appendChild(buttonPublish);
    buttonDivEl.appendChild(buttonDeleteSchedule);
    mainDiv.appendChild(buttonDivEl);
}

function onSchedulePublishClick() {
    const buttonEl = this;
    const id = buttonEl.getAttribute('data-sched-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onSchedulePublishReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule/' + id + '/visible', true);
    xhr.send();
}

function onSchedulePublishReceived() {
    const is_public = JSON.parse(this.responseText);
    const shareButton = document.getElementById('schedule-dialog-share-button');
    const shareUrl = document.getElementById('schedule-share-url');
    const shareTitle = document.getElementById('share-title-schedule');
    const url = document.getElementById('schedule-share-button').getAttribute('url');
    const shareDiv = document.getElementById('share-div');
    shareDiv.appendChild(shareUrl);

    if (is_public.message === 'false') {
        shareButton.setAttribute('ispublic', false);
        shareDiv.style.display = 'none';
        shareTitle.textContent = "You haven't shared this schedule yet!";
        shareButton.textContent = "Publish";
    } else {
        shareButton.setAttribute('ispublic', true);
        shareTitle.textContent = 'Share this schedule!';
        shareDiv.style.display = 'block';
        shareUrl.value = document.URL + "schedules/public/" + url;
        shareButton.textContent = "Unpublish";
    }
}

function onScheduleReceived() {
    const mainDiv = document.getElementById('main-content');

    if (this.status === 200) {
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
    } else if (this.status === 409) {
        document.getElementById('schedule-add-column').remove();
        let errorMessage;
        const error = JSON.parse(this.responseText);
        if (error.message.startsWith('ERROR: Task start')) {
            errorMessage = 'Task start time intersects another task';
        } else if (error.message.startsWith('ERROR: Task end')) {
            errorMessage = 'Task end time intersects another task';
        } else if (error.message.startsWith('ERROR: new row')) {
            errorMessage = 'End time of task can\'t be before start time';
        } else {
            errorMessage = 'Something went wrong. Try again.';
        }
        const darkBackgroundDiv = document.createElement('div');
        darkBackgroundDiv.setAttribute('class', 'schedule-above-div-dark');
        darkBackgroundDiv.setAttribute('id', currentScheduleId);
        darkBackgroundDiv.addEventListener('click', onScheduleClick);

        const aboveDivEl = document.createElement('div');
        aboveDivEl.style.height = '80px';
        aboveDivEl.setAttribute('class', 'schedule-above-div');
        aboveDivEl.setAttribute('id', 'schedule-add-column');
        aboveDivEl.setAttribute('schedule-id', currentScheduleId);

        const hEl = document.createElement('h1');
        hEl.textContent = errorMessage;
        aboveDivEl.appendChild(hEl);

        mainDiv.appendChild(darkBackgroundDiv);
        mainDiv.appendChild(aboveDivEl);
        aboveDivEl.setAttribute('class', 'schedule-above-div');
    }
}

function requestCurrentSchedule() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule/' + currentScheduleId);
    xhr.send();
}

function onScheduleClick() {
    currentScheduleId = this.getAttribute('id');
    requestCurrentSchedule();
}
