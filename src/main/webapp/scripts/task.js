
function onTaskReceived() {
    if (this.status == OK) {
        const task = JSON.parse(this.responseText);
        console.log(task);

        const mainDivEl = document.getElementById('main-content');
        mainDivEl.textContent = task.name;
    }
}

function getTask() {
    const taskId = this.getAttribute('data-task-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTaskReceived);
    xhr.open('GET', "protected/tasks/" + taskId);
    xhr.send();
}
