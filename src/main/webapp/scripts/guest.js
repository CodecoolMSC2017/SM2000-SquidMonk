document.addEventListener('DOMContentLoaded', (event) => {
    const mainDiv = document.getElementById('main-content');

    if (rainbow) {
        setInterval(() => {refreshRainbowPage(mainDiv, scheduleJSON)}, 10);
        addMusic();
    }

    if (scheduleJSON.columns.length == 0) {
        guestNoColumnMessage(mainDiv, scheduleJSON);
    } else {
        createHeaderRow(mainDiv, scheduleJSON, 'true');

        createTimeslotRows(mainDiv, scheduleJSON);
    }
});

function guestNoColumnMessage(mainDiv, schedule) {
    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'hv-centered-div');
    messageDiv.setAttribute('id', 'schedule-add-column');

    const hEl = document.createElement('h1');
    hEl.setAttribute('class', 'hv-centered-text');
    hEl.textContent = "This schedule has no routines defined.";

    messageDiv.appendChild(hEl);
    mainDiv.appendChild(messageDiv);
}

function refreshRainbowPage(mainDiv, schedule) {
    clearMainContent();

    createHeaderRow(mainDiv, schedule, 'true');

    createTimeslotRows(mainDiv, schedule);

}

function clearMainContent() {
    const mainDivEl = document.getElementById('main-content');
    mainDivEl.textContent = '';
}

function addMusic() {
    const soundDivEl = document.getElementById('sound-content');
    const embed = document.createElement('embed');
    embed.id = 'embed';
    embed.setAttribute('src', '../../sounds/initial.mp3');
    embed.setAttribute('hidden', 'true');
    soundDivEl.appendChild(embed);
}