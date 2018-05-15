function onScheduleReceived() {
    const mainDiv = document.getElementById('main-content');
    removeAllChildren(mainDiv);
    const schedule = JSON.parse(this.responseText);

    
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