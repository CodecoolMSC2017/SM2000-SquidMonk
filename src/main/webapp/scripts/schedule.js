
let currentSchedule;

function onDeleteScheduleTaskResponse() {
    if (this.status === NO_CONTENT) {
        requestCurrentSchedule();
    } else {
        onOtherResponse(this);
    }
}

function scheduleDeleteTask() {
    const taskId = this.getAttribute('data-task-id');

    const params = new URLSearchParams();
    params.append('scheduleId', currentSchedule.id);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteScheduleTaskResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('DELETE', 'protected/schedule/task/' + taskId + '?' + params.toString());
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
    params.append('scheduleId', currentSchedule.id);
    
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule/task/' + taskId + '?' + params.toString(), true);
    xhr.send();
}

function sharePopupDialog() {
    const buttonEl = this;
    const public = (buttonEl.getAttribute('public-schedule') == 'true');
    const url = buttonEl.getAttribute('url');

    const darkBackgroundDiv = document.createElement('div');
    darkBackgroundDiv.classList.add('schedule-above-div-dark');
    darkBackgroundDiv.setAttribute('id', currentSchedule.id);
    darkBackgroundDiv.addEventListener('click', onScheduleClick);

    const aboveDivEl = document.createElement('div');
    aboveDivEl.classList.add('schedule-above-div');
    aboveDivEl.setAttribute('id', 'schedule-add-column');
    aboveDivEl.setAttribute('schedule-id', currentSchedule.id);

    const shareDiv = document.createElement('div');
    shareDiv.id = 'share-div';
    shareDiv.classList.add('tooltip');
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
    tooltip.classList.add('tooltiptext');
    tooltip.textContent = 'Copy to clipboard';
    clipboard.appendChild(tooltip);


    const shareTitle = document.createElement('h2');
    shareTitle.setAttribute('id', 'share-title-schedule')

    const buttonPublish = document.createElement('button');
    buttonPublish.classList.add('schedule-button');
    buttonPublish.setAttribute('id', 'schedule-dialog-share-button');
    buttonPublish.addEventListener('click', onSchedulePublishClick);
    buttonPublish.setAttribute('data-sched-id', currentSchedule.id);
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

function onDeleteScheduleResponse() {
    if (this.status === NO_CONTENT) {
        showDashboard();
    } else {
        onOtherResponse(this);
    }
}

function sendDeleteSchedule() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteScheduleResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('DELETE', 'protected/schedule/' + this.getAttribute('schedule-id'));
    xhr.send();
}

function createTitleButtons() {
    const buttonDivEl = document.createElement('div');
    buttonDivEl.classList.add('h-centered-div');

    const buttonAdd = document.createElement('button');
    buttonAdd.classList.add('schedule-button');
    buttonAdd.addEventListener('click', addColumn);
    buttonAdd.textContent = "Add new Routine";

    const buttonPublish = document.createElement('button');
    buttonPublish.classList.add('schedule-button');
    buttonPublish.setAttribute('id', 'schedule-share-button');
    buttonPublish.setAttribute('public-schedule', currentSchedule.public);
    buttonPublish.setAttribute('url', currentSchedule.url);
    buttonPublish.addEventListener('click', sharePopupDialog);
    buttonPublish.textContent = "Share schedule";

    const buttonDeleteSchedule = document.createElement('button');
    buttonDeleteSchedule.classList.add('schedule-button');
    buttonDeleteSchedule.setAttribute('id', 'schedule-delete-button');
    buttonDeleteSchedule.setAttribute('schedule-id', currentSchedule.id);
    buttonDeleteSchedule.addEventListener('click', sendDeleteSchedule);
    buttonDeleteSchedule.textContent = "Delete this schedule";

    if (currentSchedule.columns.length < 7) {
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
    if (this.status === OK) {
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
    } else {
        onOtherResponse(this);
    }
}

function onScheduleConflictResponse() {
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
    darkBackgroundDiv.classList.add('schedule-above-div-dark');
    darkBackgroundDiv.setAttribute('id', currentSchedule.id);
    darkBackgroundDiv.addEventListener('click', onScheduleClick);

    const aboveDivEl = document.createElement('div');
    aboveDivEl.style.height = '80px';
    aboveDivEl.classList.add('schedule-above-div');
    aboveDivEl.setAttribute('id', 'schedule-add-column');
    aboveDivEl.setAttribute('schedule-id', currentSchedule.id);

    const hEl = document.createElement('h1');
    hEl.textContent = errorMessage;
    aboveDivEl.appendChild(hEl);

    mainDiv.appendChild(darkBackgroundDiv);
    mainDiv.appendChild(aboveDivEl);
}

function onScheduleReceived() {
    if (this.status === OK) {
        clearMainContent();
        currentSchedule = JSON.parse(this.responseText);
        if (currentSchedule.columns.length === 0) {
            noColumnMessage();
        } else {
            createTitleButtons();
            createHeaderRow();
            createTimeslotRows();
        }
    } else if (this.status === CONFLICT) {
        onScheduleConflictResponse();
    } else {
        onOtherResponse(this);
    }
}

function requestCurrentSchedule() {
    doRequestSchedule(currentSchedule.id);
}

function doRequestSchedule(scheduleId) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule/' + scheduleId);
    xhr.send();
}

function onScheduleClick() {
    doRequestSchedule(this.getAttribute('id'))
}
