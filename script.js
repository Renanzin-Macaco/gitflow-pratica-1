const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const inputError = document.getElementById("inputError");
const filterButtons = document.querySelectorAll(".filter-btn");

let filtroAtual = "todas";
let carregando = false;

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (carregando) {
        return;
    }

    adicionarTarefa();
});

taskInput.addEventListener("input", limparErro);

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filtroAtual = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            const selecionado = filterButton === button;

            filterButton.classList.toggle("active", selecionado);
            filterButton.setAttribute("aria-pressed", selecionado);
        });

        filtrarTarefas();
    });
});

function adicionarTarefa() {
    const textoTarefa = taskInput.value.trim();

    if (textoTarefa === "") {
        mostrarErro("Digite uma tarefa antes de adicionar.");
        return;
    }

    limparErro();
    ativarLoading();

    // Simula um pequeno processamento para demonstrar o spinner no projeto front-end.
    window.setTimeout(function () {
        const novaTarefa = criarElementoTarefa(textoTarefa);
        taskList.appendChild(novaTarefa);

        taskInput.value = "";
        desativarLoading();
        filtrarTarefas();
        taskInput.focus();
    }, 600);
}

function criarElementoTarefa(textoTarefa) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.dataset.status = "pendente";

    const taskContent = document.createElement("div");
    taskContent.classList.add("task-content");

    const titulo = document.createElement("span");
    titulo.classList.add("task-title");
    titulo.textContent = textoTarefa;

    const badge = document.createElement("span");
    badge.textContent = "Pendente";
    badge.classList.add("badge", "badge-pendente");

    taskContent.appendChild(titulo);
    taskContent.appendChild(badge);

    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.textContent = "Concluir";
    completeBtn.classList.add("complete-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Excluir";
    deleteBtn.classList.add("delete-btn");

    completeBtn.addEventListener("click", function () {
        const tarefaConcluida = li.classList.toggle("concluida");

        li.dataset.status = tarefaConcluida ? "concluida" : "pendente";
        badge.textContent = tarefaConcluida ? "Concluída" : "Pendente";
        badge.className = tarefaConcluida
            ? "badge badge-concluida"
            : "badge badge-pendente";
        completeBtn.textContent = tarefaConcluida ? "Reabrir" : "Concluir";

        filtrarTarefas();
    });

    deleteBtn.addEventListener("click", function () {
        li.remove();
    });

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(actions);

    return li;
}

function filtrarTarefas() {
    const tarefas = document.querySelectorAll(".task-item");

    tarefas.forEach(function (tarefa) {
        const status = tarefa.dataset.status;
        const deveExibir =
            filtroAtual === "todas" ||
            (filtroAtual === "pendentes" && status === "pendente") ||
            (filtroAtual === "concluidas" && status === "concluida");

        tarefa.hidden = !deveExibir;
    });
}

function mostrarErro(mensagem) {
    inputError.textContent = mensagem;
    taskInput.classList.add("input-invalid");
    taskInput.setAttribute("aria-invalid", "true");
    taskInput.focus();
}

function limparErro() {
    inputError.textContent = "";
    taskInput.classList.remove("input-invalid");
    taskInput.removeAttribute("aria-invalid");
}

function ativarLoading() {
    carregando = true;
    addTaskBtn.classList.add("loading");
    addTaskBtn.disabled = true;
    taskForm.setAttribute("aria-busy", "true");
}

function desativarLoading() {
    carregando = false;
    addTaskBtn.classList.remove("loading");
    addTaskBtn.disabled = false;
    taskForm.setAttribute("aria-busy", "false");
}
