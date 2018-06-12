function checkStartTime() {
    endInputEl = document.getElementById('modify-task-end-input');
    startInputEl = document.getElementById('modify-task-start-input');

    startInputEl.setAttribute('max', endInputEl.value);
    endInputEl.setAttribute('min', startInputEl.value);
}

function checkEndTime() {
    endInputEl = document.getElementById('modify-task-end-input');
    startInputEl = document.getElementById('modify-task-start-input');

    endInputEl.setAttribute('min', startInputEl.value);
    startInputEl.setAttribute('max', endInputEl.value);
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
        inputStartEl.setAttribute('max', task.end);
        inputStartEl.setAttribute('id', 'modify-task-start-input');
        inputStartEl.classList.add('schedule-input-small-padding-small-size');
        inputStartEl.addEventListener('click', checkStartTime);
        inputStartEl.value = task.start;

        const spanEndEl = document.createElement('span');
        spanEndEl.innerHTML = "&nbsp;&nbsp;End time: ";

        const inputEndEl = document.createElement('input');
        inputEndEl.setAttribute('type', 'number');
        inputEndEl.setAttribute('min', task.start);
        inputEndEl.setAttribute('max', '24');
        inputEndEl.setAttribute('id', 'modify-task-end-input');
        inputEndEl.classList.add('schedule-input-small-padding-small-size');
        inputEndEl.addEventListener('click', checkEndTime);
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