    const entradaTarefa = document.getElementById('entrada-tarefa');
    const seletorPrioridade = document.getElementById('seletor-prioridade');
    const campoDataLimite = document.getElementById('data-limite');
    const botaoAdicionar = document.getElementById('botao-adicionar');
    const listaTarefas = document.getElementById('lista-tarefas');
    const botoesFiltro = document.querySelectorAll('.botao-filtro');
    const estatisticas = document.getElementById('estatisticas');

    let tarefas = [];

    // Salva no localStorage
    function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    tarefas = tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
    }

    // Função para ordenar tarefas por prioridade e depois por data limite
    function compararTarefas(a, b) {
    const prioridadeValor = { alta: 3, media: 2, baixa: 1 };

    const prioridadeA = prioridadeValor[a.prioridade] || 0;
    const prioridadeB = prioridadeValor[b.prioridade] || 0;

    if (prioridadeA > prioridadeB) return -1;
    if (prioridadeA < prioridadeB) return 1;

    // Se prioridade igual, compara a data limite
    const dataA = a.dataLimite ? new Date(a.dataLimite) : new Date(8640000000000000);
    const dataB = b.dataLimite ? new Date(b.dataLimite) : new Date(8640000000000000);

    if (dataA < dataB) return -1;
    if (dataA > dataB) return 1;

    return 0;
    }

    // Adiciona nova tarefa
    function adicionarTarefa() {
    const texto = entradaTarefa.value.trim();
    const prioridade = seletorPrioridade.value;
    const dataLimite = campoDataLimite.value;

    if (texto === '') {
        alert('Digite uma tarefa!');
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        texto,
        prioridade,
        dataLimite,
        concluida: false
    };

    tarefas.push(novaTarefa);

    entradaTarefa.value = '';
    campoDataLimite.value = '';
    renderizarTarefas(obterFiltroAtual());
    salvarTarefas();
    }

    // Renderiza tarefas com base no filtro
    function renderizarTarefas(filtro = 'todas') {
    listaTarefas.innerHTML = '';

    // Ordena todas as tarefas antes de filtrar e renderizar
    tarefas.sort(compararTarefas);

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtro === 'concluidas') return tarefa.concluida;
        if (filtro === 'pendentes') return !tarefa.concluida;
        if (filtro === 'todas') return true;
        return tarefa.prioridade === filtro;
    });

    tarefasFiltradas.forEach(tarefa => {
        const li = document.createElement('li');
        li.dataset.prioridade = tarefa.prioridade;
        if (tarefa.concluida) li.classList.add('concluida');

        // Checkbox para concluir
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.concluida;
        checkbox.title = 'Marcar como concluída';
        checkbox.id = `checkbox-${tarefa.id}`;
        checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        tarefa.concluida = checkbox.checked;
        renderizarTarefas(obterFiltroAtual());
        salvarTarefas();
        });

        const labelCheckbox = document.createElement('label');
        labelCheckbox.htmlFor = checkbox.id;
        labelCheckbox.classList.add('checkbox-label');
        labelCheckbox.style.cursor = 'pointer';
        labelCheckbox.textContent = '';

        const conteudo = document.createElement('div');
        conteudo.classList.add('conteudo-tarefa');

        const textoTarefa = document.createElement('span');
        textoTarefa.textContent = tarefa.texto;
        conteudo.appendChild(textoTarefa);

        if (tarefa.dataLimite) {
        const data = document.createElement('small');
        data.textContent = `⏰ ${tarefa.dataLimite}`;
        conteudo.appendChild(data);
        }

        // Alternar conclusão ao clicar no conteúdo (opcional)
        conteudo.addEventListener('click', () => {
        tarefa.concluida = !tarefa.concluida;
        renderizarTarefas(obterFiltroAtual());
        salvarTarefas();
        });

        // Botão editar
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('botao-editar');
        btnEditar.innerHTML = '✏️';
        btnEditar.title = 'Editar tarefa';
        btnEditar.addEventListener('click', (e) => {
        e.stopPropagation();
        const novoTexto = prompt('Editar tarefa:', tarefa.texto);
        if (novoTexto !== null && novoTexto.trim() !== '') {
            tarefa.texto = novoTexto.trim();
            renderizarTarefas(obterFiltroAtual());
            salvarTarefas();
        }
        });

        // Botão remover
        const btnRemover = document.createElement('button');
        btnRemover.classList.add('botao-remover');
        btnRemover.innerHTML = '🗑️';
        btnRemover.title = 'Remover tarefa';
        btnRemover.addEventListener('click', (e) => {
        e.stopPropagation();
        tarefas = tarefas.filter(t => t.id !== tarefa.id);
        renderizarTarefas(obterFiltroAtual());
        salvarTarefas();
        });

        li.appendChild(checkbox);
        li.appendChild(labelCheckbox);
        li.appendChild(conteudo);
        li.appendChild(btnEditar);
        li.appendChild(btnRemover);

        listaTarefas.appendChild(li);
    });

    atualizarEstatisticas();
    }

    // Atualiza estatísticas
    function atualizarEstatisticas() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const pendentes = total - concluidas;

    estatisticas.textContent = `Total: ${total} | Concluídas: ${concluidas} | Pendentes: ${pendentes}`;
    }

    // Filtro atual
    function obterFiltroAtual() {
    const botaoAtivo = document.querySelector('.botao-filtro.ativo');
    return botaoAtivo ? botaoAtivo.dataset.filtro : 'todas';
    }

    // Atualiza botão de filtro ativo
    function atualizarFiltroAtivo(botaoClicado) {
    botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
    botaoClicado.classList.add('ativo');
    }

    // Eventos
    botaoAdicionar.addEventListener('click', adicionarTarefa);
    entradaTarefa.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') adicionarTarefa();
    });
    botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        atualizarFiltroAtivo(botao);
        renderizarTarefas(botao.dataset.filtro);
    });
    });

    // Inicialização
    carregarTarefas();
    renderizarTarefas();
