
let currentTask;

function createAvailableTaskList(tasks) {
    const ulEl = document.createElement('ul');
    ulEl.classList.add('task-list');

    if (tasks.length === 0) {
        const liEl = document.createElement('li');
        liEl.textContent = 'There are no free tasks.';
        ulEl.appendChild(liEl);
        return ulEl;
    }

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const liEl = document.createElement('li');
        const aEl = document.createElement('a');
        aEl.href = 'javascript:void(0)';
        aEl.addEventListener('click', function() {onAddTaskToColumnClicked(task.id)});
        aEl.textContent = task.name;

        liEl.appendChild(aEl);
        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function onAvailableTasksReceived() {
    if (this.status === OK) {
        const tasks = JSON.parse(this.responseText);

        const darkBackgroundDiv = document.createElement('div');
        darkBackgroundDiv.classList.add('schedule-above-div-dark');
        darkBackgroundDiv.addEventListener('click', requestCurrentSchedule);

        const aboveDivEl = document.createElement('div');
        aboveDivEl.classList.add('schedule-above-div-task');
        aboveDivEl.style.overflow = 'auto';
        aboveDivEl.id = 'column-add-task';

        aboveDivEl.appendChild(createAvailableTaskList(tasks));

        mainDiv.appendChild(darkBackgroundDiv);
        mainDiv.appendChild(aboveDivEl);
    } else {
        onOtherResponse(this);
    }
}

function getTasksToView() {
    const taskId = this.getAttribute('data-task-id');

    const params = new URLSearchParams();
    params.append('scheduleId', currentSchedule.id);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', viewTaskOnReceive);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule/task/' + taskId + '?' + params.toString());
    xhr.send();
}

function viewTaskOnReceive() {
    if (this.status === OK) {
        const task = JSON.parse(this.responseText);

        const buttonDeleteSchedule = document.getElementById('schedule-delete-button');

        const darkBackgroundDiv = document.createElement('div');
        darkBackgroundDiv.classList.add('schedule-above-div-dark');
        if (!needed) {
            darkBackgroundDiv.addEventListener('click', requestCurrentSchedule);
        } else {
            darkBackgroundDiv.addEventListener('click', doRequestScheduleForDrag);
        }

        const aboveDivEl = document.createElement('div');
        aboveDivEl.classList.add('schedule-above-div-task');
        aboveDivEl.setAttribute('id', 'schedule-add-column');
        aboveDivEl.setAttribute('schedule-id', currentSchedule.id);

        const h2El = document.createElement('h2');
        h2El.textContent = "Modify task";

        const titleSpanEl = document.createElement('span');
        titleSpanEl.setAttribute('style', 'font-style: italic');
        titleSpanEl.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title: ";

        const inputTitleEl = document.createElement('input');
        inputTitleEl.setAttribute('id', 'modify-task-title-input');
        inputTitleEl.classList.add('schedule-input');
        inputTitleEl.value = task.name;

        const inputDescriptionEl = document.createElement('input');
        inputDescriptionEl.setAttribute('id', 'modify-task-description-input');
        inputDescriptionEl.classList.add('schedule-input');
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
        inputStartEl.classList.add('schedule-input-small-padding-small-size');
        inputStartEl.value = task.start;

        const spanEndEl = document.createElement('span');
        spanEndEl.innerHTML = "&nbsp;&nbsp;End time: ";

        const inputEndEl = document.createElement('input');
        inputEndEl.setAttribute('type', 'number');
        inputEndEl.setAttribute('min', '1');
        inputEndEl.setAttribute('max', '24');
        inputEndEl.setAttribute('id', 'modify-task-end-input');
        inputEndEl.classList.add('schedule-input-small-padding-small-size');
        inputEndEl.value = task.end;

        const buttonSaveEl = document.createElement('button');
        buttonSaveEl.addEventListener('click', sendModifiedTaskData);
        buttonSaveEl.classList.add('schedule-button-small-top-margin');
        buttonSaveEl.setAttribute('data-task-id', task.id);
        buttonSaveEl.textContent = "Save";

        const buttonDeleteEl = document.createElement('button');
        buttonDeleteEl.addEventListener('click', scheduleDeleteTask);
        buttonDeleteEl.classList.add('schedule-button-small-top-margin');
        buttonDeleteEl.setAttribute('data-task-id', task.id);
        buttonDeleteEl.textContent = "Remove";

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
    } else {
        onOtherResponse(this);
    }
}

function onDeleteResponse() {
    if (this.status = NO_CONTENT) {
        showDashboard();
    } else {
        onOtherResponse(this);
    }
}

function onShowUsageButtonClicked() {
    displayTask(currentTask);
}

function createTaskAvailableScheduleTable(task) {
    const otherTable = document.getElementById('task-schedule-table');
    if (otherTable != null) {
        otherTable.remove();
    }
    const tableEl = document.createElement('table');
    tableEl.className = 'dash-table';
    tableEl.align = 'center';
    tableEl.style.marginTop = '20px';
    tableEl.style.width = '45%';
    tableEl.id = 'task-available-schedule-table';

    const thEl = document.createElement('th');
    thEl.textContent = 'Available schedules for this task';

    const headTrEl = document.createElement('tr');
    headTrEl.appendChild(thEl);

    tableEl.appendChild(headTrEl);

    if (Object.keys(task.schedules).length == 0) {
        const tdEl = document.createElement('td');
        tdEl.className = 'entry';
        tdEl.textContent = 'There are no schedules available.';

        const trEl = document.createElement('tr');
        trEl.appendChild(tdEl);

        tableEl.appendChild(trEl);
    } else {
        const ids = Object.keys(task.schedules);
        ids.sort(function(a, b) {return b - a});
        for (let id in ids) {
            const scheduleId = ids[id];
            const scheduleName = task.schedules[scheduleId];

            const tdEl = document.createElement('td');
            tdEl.className = 'entry';
            tdEl.textContent = scheduleName;

            const trEl = document.createElement('tr');
            trEl.id = scheduleId;
            trEl.addEventListener('click', onScheduleClick);
            trEl.appendChild(tdEl);
            
            tableEl.appendChild(trEl);
        }
    }

    const scheduleButton = document.getElementById('schedule-task-button');
    scheduleButton.textContent = 'Show usages';
    scheduleButton.removeEventListener('click', onScheduleButtonClicked);
    scheduleButton.addEventListener('click', onShowUsageButtonClicked);

    return tableEl;
}

function onAvailableSchedulesReceived() {
    if (this.status == OK) {
        const task = JSON.parse(this.responseText);
        const mainContentEl = document.getElementById('main-content');
        mainContentEl.appendChild(createTaskAvailableScheduleTable(task));
    } else {
        onOtherResponse(this);
    }
}

function onScheduleButtonClicked() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAvailableSchedulesReceived);
    xhr.open('GET', 'protected/tasks/' + currentTask.id + '/availableSchedules');
    xhr.send();
}

function onDeleteButtonClicked() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteResponse);
    xhr.open('DELETE', 'protected/tasks/' + currentTask.id);
    xhr.send();
}

function onEditResponse() {
    if (this.status == OK) {
        getTask();
    } else {
        onOtherResponse(this);
    }
}

function onEditTaskSubmitButtonClicked() {
    const name = document.getElementById('task-edit-name-input').value;
    const content = document.getElementById('task-edit-content-input').value;

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('content', content);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onEditResponse);
    xhr.open('PUT', 'protected/tasks/' + currentTask.id + '?' + params.toString());
    xhr.send();
}

function onEditButtonClicked() {
    const oldPEl = document.getElementById('task-edit-input-container');
    if (oldPEl != null) {
        oldPEl.remove();
    }
    const nameInputEl = document.createElement('input');
    nameInputEl.value = currentTask.name;
    nameInputEl.placeholder = 'Title';
    nameInputEl.className = 'task-edit-input';
    nameInputEl.id = 'task-edit-name-input';

    const contentInputEl = document.createElement('input');
    contentInputEl.value = currentTask.content;
    contentInputEl.placeholder = 'Description';
    contentInputEl.className = 'task-edit-input';
    contentInputEl.id = 'task-edit-content-input';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Save';
    submitButton.className = 'task-edit-button';
    submitButton.addEventListener('click', onEditTaskSubmitButtonClicked);

    const pEl = document.createElement('p');
    pEl.id = 'task-edit-input-container';
    pEl.appendChild(nameInputEl);
    pEl.appendChild(contentInputEl);
    pEl.appendChild(document.createElement('br'));
    pEl.appendChild(submitButton);

    const mainContentEl = document.getElementById('main-content');
    mainContentEl.insertBefore(pEl, mainContentEl.children[2]);
}

function createTaskScheduleTable(task) {
    const otherTable = document.getElementById('task-available-schedule-table');
    if (otherTable != null) {
        otherTable.remove();
    }
    const tableEl = document.createElement('table');
    tableEl.align = 'center';
    tableEl.style.marginTop = '20px';
    tableEl.style.width = '45%';
    tableEl.className = 'dash-table';
    tableEl.id = 'task-schedule-table';

    const thEl = document.createElement('th');
    thEl.textContent = 'Schedules containing this task';

    const headTrEl = document.createElement('tr');
    headTrEl.appendChild(thEl);

    tableEl.appendChild(headTrEl);

    if (Object.keys(task.schedules).length == 0) {
        const tdEl = document.createElement('td');
        tdEl.className = 'entry';
        tdEl.textContent = 'This task is not scheduled anywhere.';

        const trEl = document.createElement('tr');
        trEl.appendChild(tdEl);

        tableEl.appendChild(trEl);
    } else {
        for (let scheduleId in task.schedules) {
            const scheduleName = task.schedules[scheduleId];

            const tdEl = document.createElement('td');
            tdEl.className = 'entry';
            tdEl.textContent = scheduleName;

            const trEl = document.createElement('tr');
            trEl.id = scheduleId;
            trEl.addEventListener('click', onScheduleClick);
            trEl.appendChild(tdEl);
            
            tableEl.appendChild(trEl);
        }
    }
    return tableEl;
}

function displayTask(task) {
    currentTask = task;

    const taskNameEl = document.createElement('h1');
    taskNameEl.className = 'task-title';
    taskNameEl.textContent = task.name;

    const taskContentEl = document.createElement('h3');
    taskContentEl.className = 'task-description';
    if (task.content === '') {
        taskContentEl.textContent = 'No description';
    } else {
        taskContentEl.textContent = 'Description: ' + task.content;
    }

    const scheduleButton = document.createElement('button');
    scheduleButton.id = 'schedule-task-button';
    scheduleButton.className = 'task-button';
    scheduleButton.textContent = 'Schedule task';
    scheduleButton.addEventListener('click', onScheduleButtonClicked);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'task-button';
    editButton.addEventListener('click', onEditButtonClicked);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'task-button';
    deleteButton.addEventListener('click', onDeleteButtonClicked);

    clearMainContent();

    const mainContentEl = document.getElementById('main-content');
    mainContentEl.style.textAlign = 'center';
    mainContentEl.appendChild(taskNameEl);
    mainContentEl.appendChild(taskContentEl);
    mainContentEl.appendChild(scheduleButton);
    mainContentEl.appendChild(editButton);
    mainContentEl.appendChild(deleteButton);

    mainContentEl.appendChild(createTaskScheduleTable(task));
}

function onTaskReceived() {
    if (this.status == OK) {
        const task = JSON.parse(this.responseText);
        displayTask(task);
    } else {
        onOtherResponse(this);
    }
}

function getTask() {
    let taskId;
    if (typeof this.getAttribute != 'undefined') {
        taskId = this.getAttribute('data-task-id');
    } else {
        taskId = currentTask.id;
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTaskReceived);
    xhr.open('GET', "protected/tasks/" + taskId);
    xhr.send();
}
