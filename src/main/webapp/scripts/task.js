
function onTaskReceived() {
    if (this.status == OK) {
        const task = JSON.parse(this.responseText);
        const h1El = document.getElementById('task-title');
        h1El.textContent = task.name;
        console.log(task);
        showContents(['task-content', 'topnav-content']);
    }
}

function getTask() {
    const taskId = this.getAttribute('data-task-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTaskReceived);
    xhr.open('GET', "protected/tasks/" + taskId);
    xhr.send();
}
