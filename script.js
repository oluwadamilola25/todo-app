// Selecting the id of the Title and Description Input fields
const taskInput = document.getElementById("taskInput");
const descriptionInput = document.getElementById("descriptionInput");

// Selecting the id of the TaskList
const taskList = document.getElementById("taskList");

// Selecting the id of the Save Task  Button
const taskButton = document.getElementById("taskButton");

// Selecting the id of the Create Task  Button
const createTaskButton = document.getElementById("createTask");

// Selecting the Delete Modal
const deleteModalAction = document.getElementById("confirmDelete");

// Selecting the Modal Title
const htmlUpdateTask = document.getElementById("modalLabel");

// Selecting the  Content on the landing page
const heroComponent = document.querySelector(".hero-component");

// Selecting the  toast display comment
const toastDisplayComment = document.querySelector(".toast-body");

// Event Listener functions to Disable task button
taskInput.addEventListener("input", updateButtonState);
descriptionInput.addEventListener("input", updateButtonState);

updateButtonState();

// // Disabled button function
function updateButtonState() {
  const isTaskInputEmpty = taskInput.value.trim() === "";
  const isDescriptionInputEmpty = descriptionInput.value.trim() === "";
  console.log("hello");
  taskButton.disabled = isTaskInputEmpty && isDescriptionInputEmpty;
}

let currentTask = null;

// Calling the Create new task function
taskButton.addEventListener("click", addTask);

// Task list array
let tasks = [];

function addTask(e) {
  e.preventDefault();

  // Get the task value
  let taskValue = taskInput.value.trim();
  let descriptionValue = descriptionInput.value.trim();

  if (taskValue !== "" || descriptionValue !== "") {
    // Create task object
    const taskObject = {
      title: taskValue,
      description: descriptionValue,
    };

    // Add the task to the array
    tasks.unshift(taskObject);

    // Update the task list on the User Interface
    updateTaskList();

    // landing page content action
    landingPageContent();

    // Clear the input field
    taskInput.value = "";
    descriptionInput.value = "";

    // Dismiss modal
    closeModal(taskButton);

    // Disable button
    updateButtonState();

    // Display the Create Task comment
    toastDisplayComment.innerHTML = "Task created successfully!!";
  }
}

// landing page content action
function landingPageContent() {
  heroComponent.classList.toggle("no-show", taskList.innerHTML !== "");
}

// Error and Validation functin code
taskButton.addEventListener("click", (e) => {
  if (taskInput.value.trim() !== "") {
    const form = document.querySelector(".needs-validation");
    if (!form.checkValidity()) {
      e.preventDefault(); // Prevent form submission if validation fails
      e.stopPropagation(); // Stop event propagation to prevent other event handlers from executing
    }
    form.classList.add("was-validated"); // Add 'was-validated' class to display validation feedback
  }
});

// Close Bootstrap Modal function
function closeModal(button) {
  button.setAttribute("data-bs-dismiss", "modal");
  button.click();
  button.removeAttribute("data-bs-dismiss");
}

// Task Update feedback message function
function toast() {
  const toast = document.querySelector("#myToast");
  if (taskButton) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

    taskButton.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
}

// Edit task function
function editTask(index) {
  // Display Modal label title to Update Task
  htmlUpdateTask.innerHTML = "Update Task";

  // Display the Update Task comment
  toastDisplayComment.innerHTML = "Task updated successfully!!";

  // Show the former details of the task in the input fields.
  taskInput.value = tasks[index].title;
  descriptionInput.value = tasks[index].description;

  // remove add task functionality from "save changes" button.
  taskButton.removeEventListener("click", addTask);

  // add update task functionality to the button.
  taskButton.addEventListener("click", triggerTaskUpdate);

  // Single call function that updates a task.
  function triggerTaskUpdate() {
    const newTitle = taskInput.value;
    const newDescription = descriptionInput.value;

    // Calling back the Update task  function
    updateTask(index, newTitle, newDescription);

    // recursion: the triggerTaskUpdate function removes itself from the save changes button.
    taskButton.removeEventListener("click", triggerTaskUpdate);

    // Add back the eventlistener to the save changes button
    taskButton.addEventListener("click", addTask);

    // Activate the close modal function on the save changes button
    closeModal(taskButton);

    // Disable button
    updateButtonState();
  }
}

function updateTask(index, newTitle, newDescription) {
  //Object to re-assign the new task details into the selected task index
  tasks[index] = {
    title: newTitle,
    description: newDescription,
  };

  // Update the task list on the User Interface
  updateTaskList();

  // Indictate successful update
  toast();

  // Clear the input field
  taskInput.value = "";
  descriptionInput.value = "";
}

// Update the task list on the User Interface function
function updateTaskList() {
  // Clear the current task list
  taskList.innerHTML = "";

  // Add tasks from the array to the list dynamically
  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div class="d-flex gap-2">
              <div>
                  <input type="checkbox" class="form-check-input" id="remember" />
                  <label for="remember" class="form-check-label"></label>
              </div>
              <div>
                  <p class="line-through">${task.title}</p>
                  <p class="line-through-two">${task.description}</p>
              </div>
            </div>
            <div class="d-flex gap-1">
              <div>
                  <button class="btn btn-info btn-sm float-end me-1" data-bs-toggle="modal"
                          data-bs-target="#exampleModal" onclick="editTask(${index})">Edit
                  </button>
              </div>
              <div class="todo-item">
                  <button type="button" class="btn btn-danger btn-sm float-end" data-bs-toggle="modal"
                  data-bs-target="#deleteModal" onclick="deleteModal(${index})">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  `;
    taskList.appendChild(listItem);

    // Event listener function to mark task as completed
    const checkbox = listItem.querySelector(".form-check-input");
    checkbox.addEventListener("change", function () {
      const listGroupItem = listItem.querySelector(".line-through");
      const listGroupItem2 = listItem.querySelector(".line-through-two");
      if (this.checked) {
        listGroupItem.classList.add("completed");
        listGroupItem2.classList.add("completed");
      } else {
        listGroupItem.classList.remove("completed");
        listGroupItem2.classList.remove("completed");
      }
    });
  });

  // Show task list update
  toast();
}

// Display delete modal function
function deleteModal(index) {
  currentTask = index;
}

// Function to confirm delete on the modal
deleteModalAction.addEventListener("click", function () {
  const currentTaskAsNumber = Number(currentTask);

  // Perform deletion action here
  tasks.splice(currentTaskAsNumber, 1);

  // Update the task list on the User Interface
  updateTaskList();

  // Clear the input field
  taskInput.value = "";
  descriptionInput.value = "";

  // landing page content action
  landingPageContent();
});

// Selecting the cancel modal button
const cancelModalButton = document.getElementById("cancelModalButton");

// Selecting the cancel modal button
const closeModalButton = document.getElementById("closeModalButton");

// Clear input field function
function clearInputFields() {
  // Clear the input field
  taskInput.value = "";
  descriptionInput.value = "";

  // Display Modal label title to Add Task
  htmlUpdateTask.innerHTML = "Add Task";
}

// Event Listener function to clear fields with either of the buttons also
cancelModalButton.addEventListener("click", clearInputFields);
closeModalButton.addEventListener("click", clearInputFields);

// Display Modal label title to Add Task function
createTaskButton.addEventListener("click", function () {
  htmlUpdateTask.innerHTML = "Add Task";
});
