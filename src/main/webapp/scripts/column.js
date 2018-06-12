
let currentColumnId;
let startTime;

function onEmptyRowClicked(columnId, start) {
    currentColumnId = columnId;
    startTime = start;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAvailableTasksReceived);
    xhr.open('GET', 'protected/column/' + columnId + '/availableTasks');
    xhr.send();
}

function onAddTaskToColumnClicked(taskId) {
    const params = new URLSearchParams();
    params.append('taskId', taskId);
    params.append('start', startTime);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAddTaskToColumnResponse);
    xhr.open('POST', 'protected/column/' + currentColumnId);
    xhr.send(params);
}

function onAddTaskToColumnResponse() {
    if (this.status === OK) {
        requestCurrentSchedule();
    } else {
        onOtherResponse(this);
    }
}

function addColumn() {
    const darkBackgroundDiv = document.createElement('div');
    darkBackgroundDiv.classList.add('schedule-above-div-dark');
    darkBackgroundDiv.setAttribute('id', currentSchedule.id);
    darkBackgroundDiv.addEventListener('click', onScheduleClick);

    const aboveDivEl = document.createElement('div');
    aboveDivEl.classList.add('schedule-above-div');
    aboveDivEl.setAttribute('id', 'schedule-add-column');
    aboveDivEl.setAttribute('schedule-id', currentSchedule.id);
    
    const hEl = document.createElement('h2');
    hEl.textContent = "Type the name of your routine:";

    const inputEl = document.createElement('input');
    inputEl.setAttribute('placeholder', 'Enter name here');
    inputEl.setAttribute('id', 'new-column-input');
    inputEl.classList.add('schedule-input');

    const buttonEl = document.createElement('button');
    buttonEl.addEventListener('click', sendNewColumnData);
    buttonEl.classList.add('schedule-button');
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

    const params = new URLSearchParams();
    params.append('columnName', value);
    
    const xhr = new XMLHttpRequest();
    if (!needed) {
        xhr.addEventListener('load', onScheduleReceived);
    } else {
        xhr.addEventListener('load', doRequestScheduleForDrag);
    }
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'protected/schedule/' + currentSchedule.id + '?' + params.toString());
    xhr.send();
}

function onDeleteColumnRespose() {
    if (this.status == NO_CONTENT) {
        if (!needed) {
            requestCurrentSchedule();
        } else {
            doRequestScheduleForDrag();
        }
    } else {
        onOtherResponse(this);
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
    deleteConfirmButtonEl.classList.add('create-button');
    deleteConfirmButtonEl.textContent = 'Delete';
    deleteConfirmButtonEl.addEventListener('click', function() {onDeleteColumnConfirmButtonClicked(columnId)});

    const backButtonEl = document.createElement('button');
    backButtonEl.classList.add('create-button');
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
    editButton.classList.add('create-button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {onEditColumnButtonClicked(columnId)});
    editTdEl.appendChild(editButton);

    const deleteTdEl = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('create-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {onDeleteColumnButtonClicked(columnId)});
    deleteTdEl.appendChild(deleteButton);

    trEl.appendChild(editTdEl);
    trEl.appendChild(deleteTdEl);

    return trEl;
}

function onClearColumnResponse() {
    if (this.status == NO_CONTENT) {
        requestCurrentSchedule();
    } else {
        onOtherResponse(this);
    }
}

function onClearColumnButtonClicked(columnId) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onClearColumnResponse);
    xhr.open('PUT', 'protected/column/' + columnId);
    xhr.send();
}

function createClearColumnButton(columnId) {
    const buttonEl = document.createElement('button');
    buttonEl.classList.add('create-button');
    buttonEl.textContent = 'Clear column';
    buttonEl.addEventListener('click', function() {onClearColumnButtonClicked(columnId)});

    const tdEl = document.createElement('td');
    tdEl.appendChild(buttonEl);
    tdEl.colSpan = '2';

    const trEl = document.createElement('tr');
    trEl.appendChild(tdEl);
    return trEl;
}

function addColumnToEmptySchedule() {
    const messageDiv = document.getElementById('schedule-add-column');
    removeAllChildren(messageDiv);
    
    const hEl = document.createElement('h2');
    hEl.textContent = "Type the name of your routine:";

    const inputEl = document.createElement('input');
    inputEl.setAttribute('placeholder', 'Enter name here');
    inputEl.setAttribute('id', 'new-column-input');
    inputEl.classList.add('schedule-input');

    const buttonEl = document.createElement('button');
    buttonEl.addEventListener('click', sendNewColumnData);
    buttonEl.classList.add('schedule-button');
    buttonEl.textContent = "Add";

    messageDiv.appendChild(hEl);
    messageDiv.appendChild(inputEl);
    messageDiv.appendChild(buttonEl);
}

function onSaveColumnNameButtonClicked(oldName, columnId) {
    const newName = document.getElementById('remane-column-input').value;

    if (oldName === newName) {
        requestCurrentSchedule();
    }

    const params = new URLSearchParams();
    params.append('columnId', columnId);
    params.append('columnName', newName);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUpdateColumnNameResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule/' + currentSchedule.id + '?' + params.toString(), true);
    xhr.send();
}

function onUpdateColumnNameResponse() {
    if (this.status === OK) {
        requestCurrentSchedule();
    } else {
        onOtherResponse(this);
    }
}

function onEditColumnButtonClicked(columnId) {
    // setup input field
    const thEl = document.querySelector('[columnid="' + columnId + '"]');
    const title = thEl.textContent;
    thEl.textContent = '';

    const inputEl = document.createElement('input');
    inputEl.id = 'remane-column-input';
    inputEl.classList.add('rename-column');
    inputEl.value = title;
    thEl.appendChild(inputEl); 

    // setup buttons

    const trEl = document.querySelector('[tr-columnid="' + columnId + '"]');
    trEl.textContent = '';

    const saveButtonEl = document.createElement('button');
    saveButtonEl.textContent = 'Save';
    saveButtonEl.classList.add('create-button');
    saveButtonEl.addEventListener('click', function() {onSaveColumnNameButtonClicked(title, columnId)});

    const backButtonEl = document.createElement('button');
    backButtonEl.classList.add('create-button');
    backButtonEl.textContent = 'Back';
    backButtonEl.addEventListener('click', requestCurrentSchedule);

    const saveTdEl = document.createElement('td');
    saveTdEl.appendChild(saveButtonEl);

    const backTdEl = document.createElement('td');
    backTdEl.appendChild(backButtonEl);

    trEl.appendChild(saveTdEl);
    trEl.appendChild(backTdEl);
}

function createHeaderRow(isGuest) {
    const tableDivEl = document.createElement('div');
    tableDivEl.classList.add('schedule-div-table');
    
    for (let i = 0; i < currentSchedule.columns.length; i++) {
        const column = currentSchedule.columns[i];

        const tableEl = document.createElement('table');
        tableEl.classList.add('schedule-table');
        tableEl.setAttribute('id', column.id);

        const trEl = document.createElement('tr');
        trEl.setAttribute('id', 'header-row-' + column.id);

        const thEl = document.createElement('th');
        thEl.textContent = column.name;
        thEl.setAttribute('columnId', column.id);
        thEl.setAttribute('colspan', '2');

        trEl.appendChild(thEl);
        tableEl.appendChild(trEl);
        if (!isGuest) {
            tableEl.appendChild(createColumnEditButtons(column.id));
            tableEl.appendChild(createClearColumnButton(column.id));
        }
        tableDivEl.appendChild(tableEl);
        mainDiv.appendChild(tableDivEl);   
    }
}

function createTimeslotRows() {
    let taskSpaceCounter = 0;
    let tdHeight = 0;

    /* As many columns are needed as the column list's size */
    for (let i = 0; i < currentSchedule.columns.length; i++) {
        const column = currentSchedule.columns[i];
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
                tdHeight = 49 * slotsTaken; // If styling changes this must change too or switch to full td rendering!

                tdEl.innerHTML = "<b>" + task.name + "</b><br>" + task.start + ":00 to " + task.end +":00";
                tdEl.setAttribute('rowspan', slotsTaken);
                tdEl.setAttribute('style', 'height: ' + tdHeight + 'px');
                tdEl.classList.add('ok-task');
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
                if (needed) {
                    tdEl.setAttribute('draggable', 'true');
                    tdEl.setAttribute('ondragstart', 'onScheduledTaskDragStart(event)');
                }

                tdEl.style.cursor = 'pointer';
                trEl.appendChild(tdEl);
            }

            if (typeof task == 'undefined' && taskSpaceCounter <= 0) {
                tdEl.classList.add('no-task');
                tdEl.setAttribute('startTime', n);
                tdEl.textContent = n + ":00 - " + (n+1) + ":00";
                if (!needed) {
                    tdEl.addEventListener('click', function() {onEmptyRowClicked(column.id, n)});
                }
                trEl.appendChild(tdEl);
            }

            tableEl.appendChild(trEl);
        }
    }
}

function noColumnMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('hv-centered-div');
    messageDiv.setAttribute('id', 'schedule-add-column');
    messageDiv.setAttribute('schedule-id', currentSchedule.id);

    const hEl = document.createElement('h1');
    hEl.classList.add('hv-centered-text');
    hEl.textContent = "You don't have any routines defined!";

    const buttonCreateEl = document.createElement('button');
    buttonCreateEl.setAttribute('id', 'schedule-new-column-button');
    buttonCreateEl.classList.add('schedule-button-bigger');
    buttonCreateEl.addEventListener('click', addColumnToEmptySchedule);
    buttonCreateEl.innerHTML = "<h4 class=schedule-small-margin> Add one! </h4>";

    const buttonDeleteSchedule = document.createElement('button');
    buttonDeleteSchedule.classList.add('schedule-button-bigger');
    buttonDeleteSchedule.setAttribute('schedule-id', currentSchedule.id);
    buttonDeleteSchedule.addEventListener('click', sendDeleteSchedule);
    buttonDeleteSchedule.innerHTML = "<h4 class=schedule-small-margin> Delete this schedule </h4>";

    const brEl = document.createElement('br');

    messageDiv.appendChild(hEl);
    messageDiv.appendChild(brEl);
    messageDiv.appendChild(buttonCreateEl);
    messageDiv.appendChild(buttonDeleteSchedule);
    mainDiv.appendChild(messageDiv);
}
