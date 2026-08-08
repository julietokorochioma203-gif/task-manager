
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const taskCount = document.getElementById('task-count');
    const validationMsg = document.getElementById('validation-msg');
    console.log(validationMsg)
    const inputWrap = document.getElementById('input-wrap');
    console.log(inputWrap)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty';
            empty.textContent = 'No tasks yet — add something to get started!';
            taskList.appendChild(empty);
        } else {
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = 'task-item ' + (task.completed ? 'task-completed' : '');

                const left = document.createElement('div');
                left.className = 'task-left';

                const text = document.createElement('div');
                text.className = 'task-text';
                text.textContent = task.text;

                left.appendChild(text);

                const controls = document.createElement('div');
                controls.className = 'controls';

                const completeBtn = document.createElement('button');
                completeBtn.className = 'btn-complete';
                completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
                completeBtn.addEventListener('click', () => toggleTaskCompletion(index));

                const editBtn = document.createElement('button');
                editBtn.className = 'btn-edit';
                editBtn.textContent = 'Edit';
                editBtn.addEventListener('click', () => editTask(index));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn-delete';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => removeTask(index));

                controls.appendChild(completeBtn);
                controls.appendChild(editBtn);
                controls.appendChild(deleteBtn);

                li.appendChild(left);
                li.appendChild(controls);
                taskList.appendChild(li);
            });
        }

        taskCount.textContent = `Total Tasks: ${tasks.length}`;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function showValidation(message) {
        validationMsg.textContent = message;
        inputWrap.classList.add('shake');
        setTimeout(() => {
            inputWrap.classList.remove('shake');
        }, 420);
    }

    function addTaskFromInput() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            showValidation('Task cannot be empty');
            return false;
        }
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        addTaskButton.disabled = true;
        validationMsg.textContent = '';
        saveTasks();
        renderTasks();
        return true;
    }

    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // form submit handles Enter and button click
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addTaskFromInput();
    });

    // enable/disable add button and clear validation while typing
    taskInput.addEventListener('input', () => {
        addTaskButton.disabled = taskInput.value.trim() === '';
        if (taskInput.value.trim() !== '') {
            validationMsg.textContent = '';
        }
    });

    // initial render
    renderTasks();
});
// ...existing code...