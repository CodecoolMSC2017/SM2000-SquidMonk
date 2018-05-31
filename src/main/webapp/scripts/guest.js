
let mainDiv;

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

function refreshRainbowPage() {
    clearMainContent();

    createHeaderRow('true');

    createTimeslotRows();

}

function startFlashing() {
    setInterval(refreshRainbowPage, 10);
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

function onLoad() {
    mainDiv = document.getElementById('main-content');
    currentSchedule = scheduleJSON;

    if (rainbow) {
        addMusic();
        setTimeout(startFlashing, 1350);
    }

    if (scheduleJSON.columns.length == 0) {
        guestNoColumnMessage();
    } else {
        createHeaderRow('true');

        createTimeslotRows();
    }
}

document.addEventListener('DOMContentLoaded', onLoad);
