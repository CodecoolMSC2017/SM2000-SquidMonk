document.addEventListener('DOMContentLoaded', (event) => {
    const mainDiv = document.getElementById('main-content');
    const schedule = scheduleJSON;

    if (schedule.columns.length == 0) {
        /* If no columns show this */
        guestNoColumnMessage(mainDiv, schedule);
    } else {
        /* Create first header row */
        createHeaderRow(mainDiv, schedule, 'true');

        /* Create timeslot rows with tasks */
        createTimeslotRows(mainDiv, schedule);
    }
});

function guestNoColumnMessage(mainDiv, schedule){
    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'hv-centered-div');
    messageDiv.setAttribute('id', 'schedule-add-column');

    const hEl = document.createElement('h1');
    hEl.setAttribute('class', 'hv-centered-text');
    hEl.textContent = "This schedule has no routines defined.";

    messageDiv.appendChild(hEl);
    mainDiv.appendChild(messageDiv);
}