let tasksData = JSON.parse(localStorage.getItem("tasks")) || {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];

let draggedTask = null;

// Make sure all 3 columns exist in tasksData
columns.forEach((col) => {
  if (!tasksData[col.id]) {
    tasksData[col.id] = [];
  }
});

// ---------- Helpers ----------

function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function updateCountsAndDataFromDOM() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const countEl = col.querySelector(".heading .right");

    // Update count
    countEl.textContent = tasks.length;

    // Update tasksData from DOM
    tasksData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h2").innerText.trim(),
      desc: t.querySelector("p").innerText.trim(),
    }));
  });

  saveTasksToStorage();
}

function createTaskElement(title, desc) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="delete-task">Delete</button>
  `;

  // Drag events
  div.addEventListener("dragstart", () => {
    draggedTask = div;
    setTimeout(() => div.classList.add("dragging"), 0);
  });

  div.addEventListener("dragend", () => {
    draggedTask = null;
    div.classList.remove("dragging");
  });

  // Delete button
  const deleteBtn = div.querySelector(".delete-task");
  deleteBtn.addEventListener("click", () => {
    div.remove();
    updateCountsAndDataFromDOM();
  });

  return div;
}

// ---------- Initial render from localStorage ----------

for (const colId in tasksData) {
  const column = document.querySelector(`#${colId}`);
  if (!column) continue;

  tasksData[colId].forEach((task) => {
    const taskEl = createTaskElement(task.title, task.desc);
    column.appendChild(taskEl);
  });
}

updateCountsAndDataFromDOM();

// ---------- Drag & Drop on columns ----------

function addDragEventOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    if (draggedTask) {
      column.appendChild(draggedTask);
      column.classList.remove("hover-over");
      updateCountsAndDataFromDOM();
    }
  });
}

addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);

// ---------- Modal functionality ----------

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");
const taskTitleInput = document.querySelector("#task-title-input");
const taskDescInput = document.querySelector("#task-desc-input");

function closeModal() {
  modal.classList.remove("active");
}

function openModal() {
  modal.classList.add("active");
  taskTitleInput.focus();
}

toggleModalButton.addEventListener("click", openModal);

modalBg.addEventListener("click", closeModal);

addTaskButton.addEventListener("click", () => {
  const taskTitle = taskTitleInput.value.trim();
  const taskDesc = taskDescInput.value.trim();

  if (!taskTitle) {
    alert("Title khali mat chhod.");
    return;
  }

  const taskEl = createTaskElement(taskTitle, taskDesc);
  todo.appendChild(taskEl);

  updateCountsAndDataFromDOM();

  // Clear inputs
  taskTitleInput.value = "";
  taskDescInput.value = "";

  closeModal();
});
