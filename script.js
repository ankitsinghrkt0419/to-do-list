document.addEventListener('DOMContentLoaded', () => {
    const inputTask = document.getElementById('inputTask');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('Task-List');
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);

    inputTask.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });


    // --- Core Functions ---

    /**
     * Retrieves tasks from localStorage.
     * @returns {Array} An array of task objects.
     */
    function getTasksFromStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    /**
     * Saves an array of tasks to localStorage.
     * @param {Array} tasks The array of tasks to save.
     */
    function saveTasksToStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    /**
     * Renders a single task object to the screen.
     * @param {object} task The task object {id, text, date}.
     */
    function renderTask(task) {
        const newTask = document.createElement('li');
        // Use a data attribute to store the unique ID
        newTask.setAttribute('data-id', task.id);

        // Create a container for the text and date
        const taskContent = document.createElement('div');
        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.text;

        const dateSpan = document.createElement('span');
        dateSpan.textContent = `Added: ${task.date}`;
        dateSpan.style.fontSize = '0.7em'; // Make date smaller
        dateSpan.style.color = '#333';
        
        taskContent.appendChild(taskSpan);
        taskContent.appendChild(document.createElement('br')); // New line
        taskContent.appendChild(dateSpan);
        
        // Create the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'deleteBtn';
        
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        // Append elements to the list item
        newTask.appendChild(taskContent);
        newTask.appendChild(deleteBtn);
        
        // Add the new task to the list on the page
        taskList.appendChild(newTask);
    }


    function loadTasks() {
        const tasks = getTasksFromStorage();
        tasks.forEach(task => renderTask(task));
    }

    function addTask() {
        const taskText = inputTask.value.trim();

        if (taskText !== '') {
            const newTask = {
                id: Date.now(),
                text: taskText,
                date: new Date().toLocaleDateString() 
            };

            // Get current tasks, add the new one, and save
            const tasks = getTasksFromStorage();
            tasks.push(newTask);
            saveTasksToStorage(tasks);
            
            // Display the new task on the screen
            renderTask(newTask);

            // Clear the input field
            inputTask.value = '';
        }
    }

    /**
     * Deletes a task from the screen and from storage.
     * @param {number} id The ID of the task to delete.
     */
    function deleteTask(id) {
        // Remove from storage
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToStorage(tasks);

        // Remove from the screen
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        if (taskElement) {
            taskList.removeChild(taskElement);
        }
    }
});