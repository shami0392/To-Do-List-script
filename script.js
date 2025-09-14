// Show a temporary message box
function showMessage(text, duration = 2000) {
    const messageBox = $('#message-box');
    messageBox.text(text);
    messageBox.fadeIn(300).delay(duration).fadeOut(300);
}

// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    $('#task-list .task-item').each(function() {
        tasks.push({
            text: $(this).find('.task-text').text(),
            completed: $(this).hasClass('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    $.each(tasks, function(index, task) {
        const $li = $(`<li class="task-item">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">&times;</button>
        </li>`);
        if (task.completed) {
            $li.addClass('completed');
        }
        $('#task-list').append($li);
    });
}

$(document).ready(function() {
    // Load tasks when the page loads
    loadTasks();

    // Add a new task
    function addTask() {
        const taskText = $('#task-input').val().trim();
        if (taskText) {
            const $li = $(`<li class="task-item">
                <span class="task-text">${taskText}</span>
                <button class="delete-btn">&times;</button>
            </li>`);
            $('#task-list').append($li);
            $('#task-input').val('');
            saveTasks();
            showMessage('Task added!');
        } else {
            showMessage('Please enter a task.');
        }
    }

    // Handle Add button click
    $('#add-btn').on('click', addTask);

    // Handle Enter key press on input field
    $('#task-input').on('keypress', function(e) {
        if (e.which === 13) {
            addTask();
        }
    });

    // Toggle task completion (using event delegation for dynamically added elements)
    $('#task-list').on('click', '.task-item', function(e) {
        // Check if the click was on the delete button
        if (!$(e.target).hasClass('delete-btn')) {
            $(this).toggleClass('completed');
            saveTasks();
            showMessage($(this).hasClass('completed') ? 'Task completed!' : 'Task incomplete.');
        }
    });

    // Delete a task (using event delegation)
    $('#task-list').on('click', '.delete-btn', function(e) {
        e.stopPropagation(); // Prevent the parent li from triggering its click event
        $(this).parent().fadeOut(300, function() {
            $(this).remove();
            saveTasks();
            showMessage('Task deleted!');
        });
    });

    // New functionality: Search bar
    $('#search-input').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('#task-list .task-item').each(function() {
            const taskText = $(this).find('.task-text').text().toLowerCase();
            if (taskText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
