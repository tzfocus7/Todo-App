const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clearAllBtn = document.querySelector(".controls .clear-btn");

let editId;
let isEditedTask = false;

//getting localstorage  todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active"); 
        btn.classList.add("active");
        showTodo(btn.id);
    })
})

function showTodo(filter){
    let li = "";
    if (todos){
        todos.forEach((todo, id) => {
            //if todo status is completed, set the incompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";

            if (filter == todo.status || filter == "all"){
                li += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`;
          }   
       });
    }
    //if li is not empty, insert this value inside taskbox else insert span
    taskBox.innerHTML = li || "<span>You don't have any task here</span>";
}
showTodo("all"); //when window refreshes, display todo

function showMenu(selectedTask){
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");

    document.addEventListener("click", (e) => {
        //removing show class from the task menu on the document click
        if (e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName){
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId){
    //removing selected task and updating local storage from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAllBtn.addEventListener("click", () => {
     //removing all items and updating local storage of array/todos
     todos.splice(0, todos.length);
     localStorage.setItem("todo-list", JSON.stringify(todos));
     showTodo("all");
})

function updateStatus(selectedTask){
    //getting the paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked){
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed"; //updating the status of selected task to completed
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending"; //updating the status of selected task to pending
    }
    localStorage.setItem("todo-list", JSON.stringify(todos)); //saving the updated status to local storage
}

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim(); //prevents the user from submitting empty values
    let taskInfo = {name: userTask, status: "pending"};

    if (e.key == "Enter" && userTask){
        
        if (!isEditedTask){ //if isEditedTask is not true
            if (!todos){ //if todos does not exist, pass an empty array to the localstorage
                todos = new Array();    
            }
            todos.push(taskInfo); //adds new task to todos
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        
        taskInput.value = "";        
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");    
    }
})