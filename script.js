const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const inputError = document.getElementById("inputError");
const filterButtons = document.querySelectorAll(".filter-btn");

const STORAGE_KEY = "taskList.tarefas";

let tarefas = carregarTarefas();
let filtroAtual = "todas";
let carregando = false;

renderizarTarefas();

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

        renderizarTarefas();
    });
});

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem(STORAGE_KEY);

    // Fallback obrigatório: se ainda não houver dados salvos, inicia com array vazio.
    if (tarefasSalvas === null) {
        return [];
    }

    try {
        const dadosConvertidos = JSON.parse(tarefasSalvas);

        return Array.isArray(dadosConvertidos) ? dadosConvertidos : [];
    } catch (error) {
        return [];
    }
}

function salvarTarefas() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function adicionarTarefa() {
    const textoTarefa = taskInput.value.trim();

    if (textoTarefa === "") {
        mostrarErro("Digite uma tarefa antes de adicionar.");
        return;
    }

    limparErro();
    ativarLoading();

    // Pequeno atraso apenas para tornar o spinner visível neste projeto front-end.
    window.setTimeout(function () {
        const novaTarefa = {
            id: gerarId(),
            texto: textoTarefa,
            concluida: false
        };

        tarefas.push(novaTarefa);
        salvarTarefas();
        renderizarTarefas();

        taskInput.value = "";
        desativarLoading();
        taskInput.focus();
    }, 600);
}

function gerarId() {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function renderizarTarefas() {
    taskList.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(function (tarefa) {
        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;
    });

    tarefasFiltradas.forEach(function (tarefa) {
        taskList.appendChild(criarElementoTarefa(tarefa));
    });
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement("li");
    li.classList.add("task-item");

    if (tarefa.concluida) {
        li.classList.add("concluida");
    }

    const taskContent = document.createElement("div");
    taskContent.classList.add("task-content");

    const titulo = document.createElement("span");
    titulo.classList.add("task-title");
    titulo.textContent = tarefa.texto;

    const badge = document.createElement("span");
    badge.textContent = tarefa.concluida ? "Concluída" : "Pendente";
    badge.className = tarefa.concluida
        ? "badge badge-concluida"
        : "badge badge-pendente";

    taskContent.appendChild(titulo);
    taskContent.appendChild(badge);

    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.textContent = tarefa.concluida ? "Reabrir" : "Concluir";
    completeBtn.classList.add("complete-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Excluir";
    deleteBtn.classList.add("delete-btn");

    completeBtn.addEventListener("click", function () {
        alternarConclusao(tarefa.id);
    });

    deleteBtn.addEventListener("click", function () {
        excluirTarefa(tarefa.id);
    });

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(actions);

    return li;
}

function alternarConclusao(id) {
    tarefas = tarefas.map(function (tarefa) {
        if (tarefa.id === id) {
            return {
                ...tarefa,
                concluida: !tarefa.concluida
            };
        }

        return tarefa;
    });

    salvarTarefas();
    renderizarTarefas();
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.id !== id;
    });

    salvarTarefas();
    renderizarTarefas();
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
