const STORAGE_KEY = 'tasks';

const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const message = document.querySelector('#message');
const counter = document.querySelector('#counter');
const emptyState = document.querySelector('#emptyState');

let tasks = load();


function save() {
  const json = JSON.stringify(tasks);
  localStorage.setItem(STORAGE_KEY, json);
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(raw) || [];
  } catch (error) {
    console.error('Could not load tasks from storage:', error);
    return [];
  }
}


function getNextId() {
  const biggest = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
  return biggest + 1;
}

function addTask(text) {
  const title = text.trim();

  if (title === '') {
    showMessage('Please type a task before adding it.');
    return;
  }

  tasks.push({ id: getNextId(), title: title, done: false });
  taskInput.value = '';
  clearMessage();
  save();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { id: task.id, title: task.title, done: !task.done };
    }
    return task;
  });
  save();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  save();
  renderTasks();
}


function taskToListItem(task) {
  const li = document.createElement('li');
  li.classList.add('task');
  li.dataset.id = task.id;
  if (task.done) {
    li.classList.add('done');
  }

  const checkButton = document.createElement('button');
  checkButton.classList.add('check');
  checkButton.textContent = task.done ? '✓' : '';
  checkButton.title = task.done ? 'Mark as not done' : 'Mark as done';

  const text = document.createElement('span');
  text.classList.add('taskText');
  text.textContent = task.title;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.textContent = 'Delete';

  li.append(checkButton);
  li.append(text);
  li.append(deleteButton);
  return li;
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks
    .map(taskToListItem)
    .forEach((li) => taskList.append(li));

  renderSummary();
}

function renderSummary() {
  const doneCount = tasks.reduce((count, task) => (task.done ? count + 1 : count), 0);

  if (tasks.length === 0) {
    counter.textContent = 'Nothing planned yet';
    emptyState.classList.remove('hidden');
  } else {
    counter.textContent = `${doneCount} of ${tasks.length} done`;
    emptyState.classList.add('hidden');
  }
}

function showMessage(text) {
  message.textContent = text;
  taskForm.classList.add('invalid');
}

function clearMessage() {
  message.textContent = '';
  taskForm.classList.remove('invalid');
}


function handleSubmit(e) {
  e.preventDefault();
  addTask(taskInput.value);
}

function handleListClick(e) {
  const li = e.target.closest('li');
  if (!li) {
    return;
  }

  const id = Number(li.dataset.id);

  if (e.target.closest('.delete')) {
    deleteTask(id);
    return;
  }
  toggleTask(id);
}

taskForm.addEventListener('submit', handleSubmit);
taskList.addEventListener('click', handleListClick);
taskInput.addEventListener('input', clearMessage);

renderTasks();