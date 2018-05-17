
function onDeleteResponse() {
    if (this.status = NO_CONTENT) {
        showDashboard();
    }
}

function onScheduleButtonClicked() {
    const taskId = this.getAttribute('data-task-id');    
    console.log('schedule task');
}

function onDeleteButtonClicked() {
    const taskId = this.getAttribute('data-task-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteResponse);
    xhr.open('DELETE', 'protected/tasks/' + taskId);
    xhr.send();
}

function onEditButtonClicked() {
    const taskId = this.getAttribute('data-task-id');
    console.log('edit');
}

function createTaskScheduleTable(task) {
    const tableEl = document.createElement('table');

    const thEl = document.createElement('th');
    thEl.textContent = 'Schedules containing this task';

    const headTrEl = document.createElement('tr');
    headTrEl.appendChild(thEl);

    tableEl.appendChild(headTrEl);

    if (Object.keys(task.schedules).length == 0) {
        const tdEl = document.createElement('td');
        tdEl.textContent = 'This task is not scheduled anywhere.';

        const trEl = document.createElement('tr');
        trEl.appendChild(tdEl);

        tableEl.appendChild(trEl);
    } else {
        for (let scheduleId in task.schedules) {
            const scheduleName = task.schedules[scheduleId];

            const tdEl = document.createElement('td');
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
    const taskNameEl = document.createElement('p');
    taskNameEl.textContent = task.name;

    const scheduleButton = document.createElement('button');
    scheduleButton.textContent = 'Schedule task';
    scheduleButton.setAttribute('data-task-id', task.id);
    scheduleButton.addEventListener('click', onScheduleButtonClicked);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.setAttribute('data-task-id', task.id);
    editButton.addEventListener('click', onEditButtonClicked);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data-task-id', task.id);
    deleteButton.addEventListener('click', onDeleteButtonClicked);

    clearMainContent();

    const mainContentEl = document.getElementById('main-content');
    mainContentEl.appendChild(taskNameEl);
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
        console.log(this.responseText);
    }
}

function getTask() {
    const taskId = this.getAttribute('data-task-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTaskReceived);
    xhr.open('GET', "protected/tasks/" + taskId);
    xhr.send();
}
