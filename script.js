let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let pastTasks = JSON.parse(localStorage.getItem('pastTasks')) || [];

function movePastDueTasks() {
    const today = new Date('2025-04-24'); // Current date as specified
    tasks = tasks.filter((task, index) => {
        const deadline = new Date(task.deadline);
        if (deadline < today) {
            pastTasks.push({
                name: task.name,
                dateCompleted: task.deadline, // Use deadline as completion date
                satisfaction: 5, // Default satisfaction level
                description: task.description
            });
            return false; // Remove from tasks
        }
        return true; // Keep in tasks
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('pastTasks', JSON.stringify(pastTasks));
}

function displayTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return; // Only run on main page
    taskList.innerHTML = '';
    tasks.sort((a, b) => {
        if (a.deadline === b.deadline) {
            const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        return new Date(a.deadline) - new Date(b.deadline);
    });
    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.innerHTML = `
            <div class="task-header">
                <span class="task-name">${task.name}</span>
                <span class="task-date">${task.deadline}</span>
                <span class="task-difficulty">
                    <span class="difficulty-bubble difficulty-${task.difficulty.toLowerCase()}">${task.difficulty}</span>
                </span>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        `;
        taskList.appendChild(taskDiv);
    });
}

function displayPastTasks() {
    const pastTaskList = document.getElementById('past-task-list');
    if (!pastTaskList) return; // Only run on main page
    pastTaskList.innerHTML = '';
    pastTasks.sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted)); // Sort by date completed, newest first
    pastTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'past-task';
        taskDiv.innerHTML = `
            <div class="past-task-header">
                <span class="past-task-name">${task.name}</span>
                <span class="past-task-date">${task.dateCompleted}</span>
                <span class="past-task-satisfaction">
                    <span class="satisfaction-bubble">${task.satisfaction}</span>
                </span>
                <button class="delete-btn" onclick="deletePastTask(${index})">Delete</button>
            </div>
            ${task.description ? `<div class="past-task-description">${task.description}</div>` : ''}
        `;
        pastTaskList.appendChild(taskDiv);
    });
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

function deletePastTask(index) {
    if (confirm('Are you sure you want to delete this past task?')) {
        pastTasks.splice(index, 1);
        localStorage.setItem('pastTasks', JSON.stringify(pastTasks));
        displayPastTasks();
    }
}

function addTask() {
    const name = document.getElementById('task-name')?.value;
    const deadline = document.getElementById('task-deadline')?.value;
    const difficulty = document.getElementById('task-difficulty')?.value;
    const description = document.getElementById('task-description')?.value;

    if (!name || !deadline || !difficulty) {
        alert('Please fill in all required fields.');
        return;
    }

    tasks.push({ name, deadline, difficulty, description });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('task-name').value = '';
    document.getElementById('task-deadline').value = '';
    document.getElementById('task-difficulty').value = 'Easy';
    document.getElementById('task-description').value = '';
    window.location.href = 'main.html';
}

function addPastTask() {
    const name = document.getElementById('past-task-name')?.value;
    const dateCompleted = document.getElementById('past-task-date')?.value;
    const satisfaction = parseInt(document.getElementById('past-task-satisfaction')?.value);
    const description = document.getElementById('past-task-description')?.value;

    if (!name || !dateCompleted || isNaN(satisfaction) || satisfaction < 1 || satisfaction > 10) {
        alert('Please fill in all required fields with valid values (satisfaction between 1 and 10).');
        return;
    }

    pastTasks.push({ name, dateCompleted, satisfaction, description });
    localStorage.setItem('pastTasks', JSON.stringify(pastTasks));
    document.getElementById('past-task-name').value = '';
    document.getElementById('past-task-date').value = '';
    document.getElementById('past-task-satisfaction').value = '';
    document.getElementById('past-task-description').value = '';
    window.location.href = 'main.html';
}

// Initial display on main page load
if (document.getElementById('task-list')) {
    movePastDueTasks();
    displayTasks();
    displayPastTasks();
}