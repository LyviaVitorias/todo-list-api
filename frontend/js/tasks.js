const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

const filterSearch = document.getElementById("filter-search");
const filterStatus = document.getElementById("filter-status");
const filterPriority = document.getElementById("filter-priority");
const filterOrder = document.getElementById("filter-order");

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluída",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const priority = document.getElementById("task-priority").value;
  const dueDateValue = document.getElementById("task-due-date").value;

  try {
    await apiRequest("/tasks", {
      method: "POST",
      body: {
        title,
        description: description || null,
        priority,
        due_date: dueDateValue ? new Date(dueDateValue).toISOString() : null,
      },
    });
    taskForm.reset();
    loadTasks();
  } catch (err) {
    alert(err.message);
  }
});

[filterSearch, filterStatus, filterPriority, filterOrder].forEach((el) => {
  el.addEventListener("input", loadTasks);
  el.addEventListener("change", loadTasks);
});

async function loadTasks() {
  const params = new URLSearchParams();

  if (filterStatus.value) params.append("status_filter", filterStatus.value);
  if (filterPriority.value) params.append("priority_filter", filterPriority.value);
  if (filterSearch.value) params.append("search", filterSearch.value);
  params.append("order_by", filterOrder.value);

  try {
    const tasks = await apiRequest(`/tasks?${params.toString()}`);
    renderTasks(tasks);
  } catch (err) {
    console.error(err);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item priority-${task.priority}`;

    const dueDateText = task.due_date
      ? new Date(task.due_date).toLocaleDateString("pt-BR")
      : "sem prazo";

    li.innerHTML = `
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-meta">
        ${statusLabels[task.status]} · ${priorityLabels[task.priority]} · ${dueDateText}
      </div>
      <div class="task-actions"></div>
    `;

    const actionsEl = li.querySelector(".task-actions");

    const nextStatus = getNextStatus(task.status);
    const statusBtn = document.createElement("button");
    statusBtn.textContent = `Marcar como ${statusLabels[nextStatus]}`;
    statusBtn.addEventListener("click", () => updateTaskStatus(task.id, nextStatus));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actionsEl.appendChild(statusBtn);
    actionsEl.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

function getNextStatus(currentStatus) {
  if (currentStatus === "pending") return "in_progress";
  if (currentStatus === "in_progress") return "done";
  return "pending";
}

async function updateTaskStatus(taskId, newStatus) {
  try {
    await apiRequest(`/tasks/${taskId}`, {
      method: "PUT",
      body: { status: newStatus },
    });
    loadTasks();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteTask(taskId) {
  if (!confirm("Excluir esta tarefa?")) return;
  try {
    await apiRequest(`/tasks/${taskId}`, { method: "DELETE" });
    loadTasks();
  } catch (err) {
    alert(err.message);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
