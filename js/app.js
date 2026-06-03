// Greeting and DateTime with Custom Name
let userName = localStorage.getItem('userName') || '';

function updateGreetingAndTime() {
    const now = new Date();
    const hours = now.getHours();
    const greetingEl = document.getElementById('greeting');
    const datetimeEl = document.getElementById('datetime');
    
    let greeting = '';
    if (hours >= 5 && hours < 12) {
        greeting = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
        greeting = 'Good Afternoon';
    } else if (hours >= 18 && hours < 22) {
        greeting = 'Good Evening';
    } else {
        greeting = 'Good Night';
    }
    
    if (userName) {
        greeting += `, ${userName}!`;
    } else {
        greeting += '!';
    }
    
    greetingEl.textContent = greeting;
    
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    datetimeEl.textContent = now.toLocaleDateString('en-US', options);
}

function changeName() {
    const newName = prompt('What would you like to be called?', userName);
    if (newName !== null) {
        userName = newName.trim();
        localStorage.setItem('userName', userName);
        updateGreetingAndTime();
    }
}

document.getElementById('changeNameBtn').addEventListener('click', changeName);

updateGreetingAndTime();
setInterval(updateGreetingAndTime, 1000);

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const isDarkMode = localStorage.getItem('darkMode') === 'true';

if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const darkModeActive = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', darkModeActive);
    themeToggle.textContent = darkModeActive ? '☀️' : '🌙';
});

// Focus Timer
let timerInterval = null;
let timeRemaining = 25 * 60;
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay();
            } else {
                stopTimer();
                alert('Focus session complete!');
            }
        }, 1000);
    }
}

function stopTimer() {
    isRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timeRemaining = 25 * 60;
    updateTimerDisplay();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// To-Do List
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''}`;
        
        li.innerHTML = `
            <div class="todo-left">
                <input type="checkbox" class="todo-checkbox" ${todo.done ? 'checked' : ''} onchange="toggleTodo(${index})">
                <span class="todo-text" id="todo-text-${index}">${todo.text}</span>
            </div>
            <div class="todo-actions">
                <button class="btn btn-edit" onclick="editTodo(${index})">Edit</button>
                <button class="btn btn-delete" onclick="deleteTodo(${index})">Delete</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        // Check for duplicate tasks
        const isDuplicate = todos.some(todo => todo.text.toLowerCase() === text.toLowerCase());
        
        if (isDuplicate) {
            alert('This task already exists!');
            return;
        }
        
        todos.push({ text, done: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
}

function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
}

function editTodo(index) {
    const newText = prompt('Edit task:', todos[index].text);
    if (newText !== null && newText.trim()) {
        todos[index].text = newText.trim();
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(index) {
    if (confirm('Delete this task?')) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

renderTodos();

// Quick Links
const linkName = document.getElementById('linkName');
const linkUrl = document.getElementById('linkUrl');
const addLinkBtn = document.getElementById('addLinkBtn');
const linksList = document.getElementById('linksList');

let links = JSON.parse(localStorage.getItem('links')) || [];

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    linksList.innerHTML = '';
    links.forEach((link, index) => {
        const card = document.createElement('div');
        card.className = 'link-card';
        
        card.innerHTML = `
            <button class="link-delete" onclick="deleteLink(${index})">×</button>
            <a href="${link.url}" target="_blank">${link.name}</a>
        `;
        
        linksList.appendChild(card);
    });
}

function addLink() {
    const name = linkName.value.trim();
    const url = linkUrl.value.trim();
    
    if (name && url) {
        const fullUrl = url.startsWith('http') ? url : 'https://' + url;
        links.push({ name, url: fullUrl });
        saveLinks();
        renderLinks();
        linkName.value = '';
        linkUrl.value = '';
    }
}

function deleteLink(index) {
    if (confirm('Delete this link?')) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }
}

addLinkBtn.addEventListener('click', addLink);
linkName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addLink();
    }
});
linkUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addLink();
    }
});

renderLinks();
