const eachTaskTemplate = {
  completeFlag: false,
  editFlag: false,
  value: null,
  id: null
}
const taskStorageObject = "taskList";

const addTaskId = () => {
  let taskAdded = document.getElementById("new-task");
  let taskError = document.getElementById("add-task-error");
  if (!!taskAdded.value) {
      let newTask = createAndSaveTask(taskAdded.value);
      appendTask(newTask);
      taskAdded.value = '';
      taskAdded.classList.remove('error');
      taskError.innerText = '';
      taskError.hidden = true;
  } else {
      taskAdded.classList.add('error');
      taskError.innerText = 'Empty task cannot be submitted';
      taskError.hidden = false;
  }
};

const createAndSaveTask = (task) => {
  const taskCreated = {
      ...eachTaskTemplate,
      id: createNewTaskId(),
      value: task
  }
  addTask(taskCreated);
  return taskCreated;
}

const createNewTaskId = () => {
  var lastTask = [...getTaskList()].slice(-1)[0];
  return !!lastTask ? lastTask.id + 1 : 1;
}

const addTask = (task) => {
  const tasks = getTaskList();
  tasks.push(task);
  setTasks(tasks);
}

const getTaskList = () => {
  return JSON.parse(window.localStorage.getItem(taskStorageObject)) || [];
}

const appendTask = (task) => {
  const taskTemplateSection = document.getElementById("taskTemplateSection");
  const taskAdded = document.importNode(taskTemplateSection.content, true);
  taskAdded.querySelector('li').id = `task_${task.id}`;
  taskAdded.querySelector('label').innerText = task.value;
  taskAdded.querySelector('input[type=text]').value = task.value;
  taskAdded.querySelector('input[type=checkbox]').checked = task.completeFlag;
  taskAdded.querySelector('button.edit').addEventListener('click', () => editTask(task.id), false)
  taskAdded.querySelector('button.delete').addEventListener('click', () => deleteTask(task.id), false)
  taskAdded.querySelector("input[type=checkbox]").addEventListener('click', () => updateTaskStatus(task.id), false);
  let incompleteTaskItemList = document.getElementById('incomplete-tasks');
  incompleteTaskItemList.appendChild(taskAdded);

  updateTaskEdit(task.id, task.editFlag);
  UpdateTaskCompletion(task.id, task.completeFlag);
  return taskAdded;
}

const editTask = (taskId) => {
  const task = findTask(taskId);
  task.editFlag = !task.editFlag;
  updateTaskEdit(taskId, task.editFlag);
  task.value = findTaskDetails(taskId);
  updateTask(task);
};

const findTask = (taskId) => {
  return getTaskList().find(task => task.id === taskId);
}

const updateTaskEdit = (taskId, editFlag) => {
  const task = getTask(taskId);
  if (editFlag) {
      findTaskToBeEdited(task).value = findTaskLabel(task).innerText;
      task.classList.add("editMode");
  } else {
      findTaskLabel(task).innerText = findTaskToBeEdited(task).value;
      task.classList.remove("editMode");
  }
  getEditButton(task).innerText = editFlag ? "Save" : "Edit";
}

const findTaskDetails = (taskId) => {
  return findTaskLabel(getTask(taskId)).innerText;
}

const updateTask = (task) => {
  const tasklist = getTaskList();
  const updatedTaskList = tasklist.map(eachTask => eachTask.id === task.id ? {
      ...eachTask,
      ...task
  } : eachTask)
  setTasks(updatedTaskList);
}

const getTask = (taskId) => {
  return document.getElementById(`task_${taskId}`);
}

const findTaskToBeEdited = (task) => {
  return task.querySelector("input[type=text]");
}

const findTaskLabel = (task) => {
  return task.querySelector("label");
}

const getEditButton = (task) => {
  return task.querySelector("button.edit");
}

const setTasks = (tasks) => {
  window.localStorage.setItem(taskStorageObject, JSON.stringify(tasks));
}

const deleteTask = (taskId) => {
  cancelTask(taskId);
  popTask(taskId);
};

const cancelTask = (taskId) => {
  const taskList = getTaskList();
  const updatedTaskList = taskList.filter(task => task.id != taskId);
  setTasks(updatedTaskList);
}

const popTask = (taskId) => {
  const taskToBeDeleted = getTask(taskId);
  const taskList = taskToBeDeleted.parentNode;
  taskList.removeChild(taskToBeDeleted);
}

const updateTaskStatus = (taskId) => {
  const task = findTask(taskId);
  task.completeFlag = !task.completeFlag;
  updateTask(task);
  UpdateTaskCompletion(taskId, task.completeFlag);
}

const UpdateTaskCompletion = (taskId, completeFlag) => {
  const taskCompletion = getTask(taskId);
  const taskCompletionStatus = completeFlag ? 'completed-tasks' : 'incomplete-tasks';
  document.getElementById(taskCompletionStatus).appendChild(taskCompletion);
}

(
  () => {
      let taskList = getTaskList();
      if (!taskList.length) {
          const dumbTasks = [{
                  id: 1,
                  value: 'Pay Bills',
                  editFlag: false,
                  completeFlag: false
              },
              {
                  id: 2,
                  value: 'Go Shopping',
                  editFlag: true,
                  completeFlag: false
              },
              {
                  id: 3,
                  value: 'See the Doctor',
                  editFlag: false,
                  completeFlag: true
              },
          ];
          setTasks(dumbTasks);
          taskList = dumbTasks;
      }
      taskList.forEach(task => appendTask(task));
  })();