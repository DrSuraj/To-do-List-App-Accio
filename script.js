let tasks = {
  // tasks object for tracking the properties of task item.
  todo: [],
  started: [],
  completed: [],
};

let form = document.getElementById("task-form");
let todo = document.getElementById("todo");
let started = document.getElementById("started");
let completed = document.getElementById("completed");
let dropText = document.getElementsByClassName("drop-text");

let id = 1;

// Listening sumbit event on form to create new Task
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (form.button.innerText.trim() === "Save") {
    form.button.innerHTML = `Add <i class="fa-solid fa-circle-plus"></i>`;
  }

  document.getElementById("empty-container").style.display = "none";

  const taskName = form.task.value;
  const taskDueDate = form.date.value;
  const taskPriority = form.priority.value;

  const newTask = document.createElement("div");
  newTask.className = "task-item";
  newTask.id = id++;
  newTask.setAttribute("draggable", true);
  newTask.addEventListener("dragstart", onDragStart);

  newTask.innerHTML = `<div class="header">
                          <p>Due on ${taskDueDate}</p>
                          <p class="priority" style="color:${applyColor(
                            taskPriority.trim()
                          )};">${taskPriority}</p>
                      </div>
                      <div>
                          <p>${taskName}</p>
                          <div class="buttons">
                          </div>
                      </div>`;

  // Creating edit button for task
  let editButton = document.createElement("button");
  editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;

  editButton.addEventListener("click", editTask);

  //   Creating Delete button for task
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;

  deleteButton.addEventListener("click", deleteTask);

  //   Extracting buttons container
  newTask.querySelector(".buttons").append(editButton, deleteButton);

  //   Inserting Tast element in the task list
  todo.insertBefore(newTask, dropText[0]);

  //   function for delete task
  function deleteTask() {
    const currentContainerId = newTask.parentNode.id;
    let index = (tasks[currentContainerId].findIndex = (task) =>
      task.id === newTask.id);
    tasks[currentContainerId].splice(index, 1);

    // After delete updating the local storage.
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById(
      `${currentContainerId}-count`
    ).innerText = `${tasks[currentContainerId].length}`;
    document.getElementById(
      `${currentContainerId}-high`
    ).innerText = `${countHigh(tasks[currentContainerId])} of ${
      tasks[currentContainerId].length
    }`;

    tasks.todo.length
      ? (document.getElementById("empty-container").style.display = "none")
      : (document.getElementById("empty-container").style.display = "flex");

    newTask.remove();
  }

  //   Creating Task object to store it in local storage.
  let taskObj = {
    id: newTask.id,
    name: taskName,
    dueDate: taskDueDate,
    priority: taskPriority,
  };
  tasks.todo.push(taskObj); //Pushing the new task into the tasks object.

  //   Storing the newly created task in the local storage.
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById("todo-count").innerText = `${tasks.todo.length}`;
  document.getElementById("todo-high").innerText = `${countHigh(
    tasks.todo
  )} of ${tasks.todo.length}`;

  form.reset();
});

//   function for edit task
function editTask(e) {
  const currentElementId = e.currentTarget.parentNode.parentNode.parentNode.id;
  let currentElement = null;
  for (let key in tasks) {
    tasks[key].forEach((item, index) => {
      if (item.id === currentElementId) {
        currentElement = item;
        tasks[key].splice(index, 1);
      }
    });
  }
  form.task.value = currentElement.name;
  form.date.value = currentElement.dueDate;
  form.priority.value = currentElement.priority;
  form.button.innerText = "Save";
  document.getElementById(currentElementId).remove();
}

// function for couting the highest priority tasks
function countHigh(arr) {
  let ans = 0;
  arr.forEach((item) => {
    if (item.priority === "High") ans++;
  });
  return ans;
}

// Function to apply color based on priority

function applyColor(priority) {
  if (priority === "High") return "red";
  else if (priority === "Medium") return "blue";
  else return "yellow";
}

// Changing task status (to-do, started or completed)

let draggingElement = null;
let dropIndex = null;
function onDragStart(e) {
  draggingElement = e.target;
}

todo.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropIndex = 0;
});

started.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropIndex = 1;
});

completed.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropIndex = 2;
});

// Adding drop event listener to all sections
todo.addEventListener("drop", dropElement);
started.addEventListener("drop", dropElement);
completed.addEventListener("drop", dropElement);

// Function for droping the task
function dropElement(e) {
  const prevContainerId = draggingElement.parentNode.id;
  const currentContainerId = e.currentTarget.id;

  let index = tasks[prevContainerId].findIndex(
    (task) => task.id === draggingElement.id
  );

  tasks[currentContainerId].push(tasks[prevContainerId][index]);
  tasks[prevContainerId].splice(index, 1);

  //   After modification, updating the local storage.
  localStorage.setItem("tasks", JSON.stringify(tasks));

  //   Decreesing the count of Element from previous container
  document.getElementById(
    `${prevContainerId}-count`
  ).innerText = `${tasks[prevContainerId].length}`;
  document.getElementById(`${prevContainerId}-high`).innerText = `${countHigh(
    tasks[prevContainerId]
  )} of ${tasks[prevContainerId].length}`;

  //   Increesing the count of Element in current container
  document.getElementById(
    `${currentContainerId}-count`
  ).innerText = `${tasks[currentContainerId].length}`;
  document.getElementById(
    `${currentContainerId}-high`
  ).innerText = `${countHigh(tasks[currentContainerId])} of ${
    tasks[currentContainerId].length
  }`;

  tasks.todo.length
    ? (document.getElementById("empty-container").style.display = "none")
    : (document.getElementById("empty-container").style.display = "flex");

  //   Adding element in current container
  e.currentTarget.insertBefore(draggingElement, dropText[dropIndex]);
  draggingElement = null;
}

// creating the task if localstorage have any data saved

document.addEventListener("DOMContentLoaded", () => {
  const extractedData = localStorage.getItem("tasks");
  let haveData = false;
  if (extractedData) {
    tasks = JSON.parse(extractedData);
    let i = 0;
    for (let key in tasks) {
      tasks[key].forEach((item) => {
        haveData = true;
        createTask(item.id, item.name, item.dueDate, item.priority, key, i);
      });
      i++;
    }
  }
});

// Function for creating task for stored data in local storage.
function createTask(id, taskName, taskDueDate, taskPriority, key, i) {
  const newTask = document.createElement("div");
  newTask.className = "task-item";
  newTask.id = id;
  newTask.setAttribute("draggable", true);
  newTask.addEventListener("dragstart", onDragStart);

  newTask.innerHTML = `<div class="header">
                          <p>Due on ${taskDueDate}</p>
                          <p class="priority" style="color:${applyColor(
                            taskPriority.trim()
                          )}">${taskPriority}</p>
                      </div>
                      <div>
                          <p>${taskName}</p>
                          <div class="buttons">
                          </div>
                      </div>`;

  let editButton = document.createElement("button");
  editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;

  editButton.addEventListener("click", editTask);

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;

  deleteButton.addEventListener("click", deleteTask);
  newTask.querySelector(".buttons").append(editButton, deleteButton);

  document.getElementById(`${key}`).insertBefore(newTask, dropText[i]);

  //   function for delete
  function deleteTask() {
    const currentContainerId = newTask.parentNode.id;
    let index = (tasks[currentContainerId].findIndex = (task) =>
      task.id === newTask.id);
    tasks[currentContainerId].splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById(
      `${currentContainerId}-count`
    ).innerText = `${tasks[currentContainerId].length}`;
    document.getElementById(
      `${currentContainerId}-high`
    ).innerText = `${countHigh(tasks[currentContainerId])} of ${
      tasks[currentContainerId].length
    }`;
    tasks.todo.length
      ? (document.getElementById("empty-container").style.display = "none")
      : (document.getElementById("empty-container").style.display = "flex");

    newTask.remove();
  }

  document.getElementById(`${key}-count`).innerText = `${tasks[key].length}`;
  document.getElementById(`${key}-high`).innerText = `${countHigh(
    tasks[key]
  )} of ${tasks[key].length}`;
  tasks.todo.length
    ? (document.getElementById("empty-container").style.display = "none")
    : (document.getElementById("empty-container").style.display = "flex");
}

// Filter Functionality

const filter = document.getElementById("filter");

// Adding change event for filtering the tasks according to the priorities.
filter.addEventListener("change", () => {
  for (let key in tasks) {
    tasks[key].forEach((item) => {
      const task = document.getElementById(`${item.id}`);
      if (task) task.remove();
    });
  }

  if (filter.value === "All") {
    let i = 0;
    for (let key in tasks) {
      tasks[key].forEach((item) => {
        createTask(item.id, item.name, item.dueDate, item.priority, key, i);
      });
      i++;
    }
    return;
  }

  let i = 0;
  for (let key in tasks) {
    tasks[key].forEach((item) => {
      if (item.priority === filter.value)
        createTask(item.id, item.name, item.dueDate, item.priority, key, i);
    });
    i++;
  }
});

//filtering data based on Search query.

const search = document.getElementById("search-input");

// Fuction for showing the tasks according to the search query.
search.addEventListener("input", () => {
  filter.value = "All";
  for (let key in tasks) {
    tasks[key].forEach((item) => {
      const task = document.getElementById(`${item.id}`);
      if (task) task.remove();
    });
  }

  let i = 0;
  for (let key in tasks) {
    tasks[key].forEach((item) => {
      if (item.name.toLowerCase().includes(search.value.toLowerCase()))
        createTask(item.id, item.name, item.dueDate, item.priority, key, i);
    });
    i++;
  }
});
