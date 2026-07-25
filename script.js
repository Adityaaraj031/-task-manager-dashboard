// Load tasks from LocalStorage, or start with an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save current tasks array to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// CREATE: Add a new task
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (!value) {
    alert("Task cannot be empty!");
    return;
  }

  tasks.push({
    id: Date.now(),
    name: value,
    completed: false
  });

  saveTasks();
  input.value = "";
  input.focus();
  renderTasks();
}

// UPDATE: Edit an existing task's text
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newName = prompt("Edit task:", task.name);
  if (newName === null) return; // user cancelled

  const trimmed = newName.trim();
  if (!trimmed) {
    alert("Task cannot be empty!");
    return;
  }

  task.name = trimmed;
  saveTasks();
  renderTasks();
}

// DELETE: Remove a task permanently
function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// UPDATE: Toggle completed status
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// READ: Render tasks to the page, applying search + filter
function renderTasks() {
  const list = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const searchQuery = document.getElementById("searchBox").value.toLowerCase();
  const filterValue = document.getElementById("filterSelect").value;

  list.innerHTML = "";

  let visibleTasks = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery);
    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "completed" && t.completed) ||
      (filterValue === "pending" && !t.completed);
    return matchesSearch && matchesFilter;
  });

  if (visibleTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  visibleTasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id})">
      <span class="task-text ${task.completed ? "completed" : ""}" onclick="toggleComplete(${task.id})">${escapeHtml(task.name)}</span>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateStats();
}

// Show total / completed / pending counts
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("stats").textContent =
    `Total: ${total}  |  Completed: ${completed}  |  Pending: ${pending}`;
}

// Prevent basic HTML injection when displaying task text
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Allow pressing Enter to add a task
document.getElementById("taskInput").addEventListener("keyup", function (e) {
  if (e.key === "Enter") addTask();
});

// Initial render on page load
renderTasks();
