// UTILITÁRIOS

// Oculta todos os elementos com a classe "display"
function ocultarTodasEtapas() {
    document.querySelectorAll(".display").forEach(el => {
        el.style.display = "none";
    });
}

// Exibe a próxima etapa do formulário se o valor não estiver vazio
function exibirEtapaFormulario(valor, conteinerParaExibir) {
    if (valor === "") {
        alert("Algum campo não foi preenchido");
        return;
    }
    ocultarTodasEtapas();
    conteinerParaExibir.style.display = "block";
}

// Remove todos os elementos filhos da lista de relações 
function limparRelacoesUl() {
    while (relacoesUl.firstChild) {
        relacoesUl.removeChild(relacoesUl.firstChild);
    }
}

// Limpa os valores dos campos de formulário com os IDs fornecidos
function limparCamposFormulario(ids) {
    ids.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = "";
        }
    });
}


// PLANOS DE ESTUDO

// Recupera os planos salvos no localstorage ou inicia um array vazio
let planosEstudos = JSON.parse(localStorage.getItem("planosEstudos")) || [];
const formPlanos = document.getElementById("form-planos-estudos");

// Exibe os planos de estudo cadastrados
function planoExibir() {
    const planoContainer = document.getElementById("planos-container");
    if(!planoContainer) return;

    planoContainer.innerHTML = "";

    if(planosEstudos.length === 0){
        planoContainer.innerHTML = "<p>Nenhum plano de estudo cadastrado ainda.</p>";
        return;
    }

    planosEstudos.forEach(plano => {
        const divPlano = document.createElement("div");
        divPlano.classList.add("plano");

        const details = document.createElement("details");
        details.setAttribute("aria-expanded", "false");

        const btnExcluirPlano = document.createElement("button");
        btnExcluirPlano.textContent = "Excluir Plano";
        btnExcluirPlano.classList.add("btn-excluir-plano");
        btnExcluirPlano.setAttribute('aria-label', 'Excluir plano de estudo completo');
        btnExcluirPlano.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btnExcluirPlano.click();
            }
        });
        btnExcluirPlano.onclick = () => excluirPlano(plano.id);

        // Atualiza atributo de acessibilidade quando o plano é aberto ou fechado
        details.addEventListener("toggle", () => {
            const isOpen = details.hasAttribute("open");
            details.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        const titulo = document.createElement("summary");
        titulo.innerHTML = plano.titulo;
        details.appendChild(titulo);
        details.appendChild(btnExcluirPlano);

        const ul = document.createElement("ul");

        // Cria a lista de atividades do plano
        plano.atividades.forEach((atividade, indexAtividade) => {
            const li = document.createElement("li");
            li.classList.add("atividade-criada")
            li.innerHTML = `
            <br><hr>
            <strong>${atividade.descricao}</strong><br>
            ${atividade.inicio ? `Início: ${atividade.inicio}<br>` : ""} 
            ${atividade.fim ? `Fim: ${atividade.fim}<br>` : ""} 
            ${atividade.concluido ? "<em style='background-color:#aaffaa;'>Concluído</em>" : "<em style='background-color: #ffaaaa;'>Pendente</em>"}
            <hr>`;

            // Botão para marcar como concluído
            const btnConcluir = document.createElement("button");
            btnConcluir.classList.add("edit-atividade")
            btnConcluir.textContent = "Concluir";
            btnConcluir.setAttribute('aria-label', 'Marcar atividade como concluída');
            btnConcluir.classList.add("especial")

            btnConcluir.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btnConcluir.click();
                }
            });
            btnConcluir.onclick = () => {
                atividade.concluido = true;
                // Atualiza o localStorage
                const planoIndex = planosEstudos.findIndex(p => p.id === plano.id);
                if (planoIndex !== -1) {
                    planosEstudos[planoIndex] = plano;
                    localStorage.setItem("planosEstudos", JSON.stringify(planosEstudos));
                    registrarHistorico("Plano Concluido", plano.titulo);
                }
                planoExibir();
            }

            // Botão para editar atividade - (bugado)
            /*const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.setAttribute('aria-label', 'Editar atividade');
            btnEditar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btnEditar.click();
                }
            });
            btnEditar.onclick = () => editarPlano(plano.id, indexAtividade);
            
            // Só exibe o botão de editar fora da tela inicial
            if(!window.location.pathname.endsWith("index.html") && window.location.pathname !== "/") {
                li.appendChild(btnEditar);
            }*/

            // Botão para excluir atividade
            const btnExcluirAtividade = document.createElement("button");
            btnExcluirAtividade.textContent = "Excluir";
            btnExcluirAtividade.setAttribute('aria-label', 'Excluir atividade');
            btnExcluirAtividade.classList.add("especial")
            btnExcluirAtividade.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btnExcluirAtividade.click();
                }
            });
            btnExcluirAtividade.onclick = () => excluirAtividadeDoPlano(plano.id, indexAtividade);

            li.appendChild(btnExcluirAtividade);
            li.appendChild(btnConcluir);
            ul.appendChild(li);
        });

        details.appendChild(ul);

        // Botão para adicionar nova atividade
        const btnAddAtividade = document.createElement("button");
        btnAddAtividade.textContent = "Adicionar Atividade";
        btnAddAtividade.classList.add("btn-add-atividade");
        btnAddAtividade.onclick = () => {
            formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
        };

        // Formulário de nova atividade
        const formContainer = document.createElement("div");
        formContainer.style.display = "none";
        formContainer.style.marginTop = "10px";

        formContainer.innerHTML = `
            <input type="text" placeholder="Título da atividade" class="input-desc" style="display:block; margin-bottom:4px;"></textarea>
            <label style="display:block; margin-top:8px;">Data de início:</label>
            <input type="date" class="input-inicio" style="display:block; margin-bottom:4px;" />
            <label style="display:block; margin-top:8px;">Data de fim:</label>
            <input type="date" class="input-fim" style="display:block; margin-bottom:4px;" />
            <button class="btn-salvar-atividade">Salvar</button>
        `;

        formContainer.querySelector(".btn-salvar-atividade").onclick = () => {
            const desc = formContainer.querySelector(".input-desc").value.trim();
            const inicio = formContainer.querySelector(".input-inicio").value;
            const fim = formContainer.querySelector(".input-fim").value;

            if (!desc) {
                alert("Título obrigatório.");
                return;
            }

            if (inicio && fim && new Date(fim) < new Date(inicio)) {
                alert("A data de fim deve ser depois da data de início.");
                return;
            }

            const novaAtividade = {
                descricao: desc,
                inicio: inicio || undefined,
                fim: fim || undefined,
                concluido: false
            };

            const planoIndex = planosEstudos.findIndex(p => p.id === plano.id);
            if (planoIndex !== -1) {
                planosEstudos[planoIndex].atividades.push(novaAtividade);
                localStorage.setItem("planosEstudos", JSON.stringify(planosEstudos));
                registrarHistorico("Nova Atividade Adicionada", plano.titulo);
                planoExibir();
            }
        };

        details.appendChild(btnAddAtividade);
        details.appendChild(formContainer);

        divPlano.appendChild(details);
        planoContainer.appendChild(divPlano);
    });
}

// Gera um resumo das atividades concluídas, atrasadas e pendentes 
function exibirResumoAtividades() {
    const containerResumo = document.getElementById("resumo-atividades");
    if(!containerResumo) return;

    const hoje = new Date();
    const concluidas = [];
    const emAtraso = [];
    const pendentes = [];

    planosEstudos.forEach(plano => {
        plano.atividades.forEach(atividade => {
            if(atividade.concluido) {
                concluidas.push({...atividade, planoTitulo: plano.titulo});
            }else if(atividade.fim && new Date(atividade.fim) < hoje) {
                emAtraso.push({...atividade, planoTitulo: plano.titulo});
            }else {
                pendentes.push({...atividade, planoTitulo: plano.titulo});
            }
        });
    });

    function criarSecao(titulo, lista) {
        const secao = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.textContent = titulo;
        secao.appendChild(h3);

        if(lista.length === 0) {
            secao.innerHTML += "<p>Nenhuma Atividade.</p>";
        }else {
            const ul = document.createElement("ul");
            lista.forEach(item => {
                const li = document.createElement("li");
                const mostrarData = titulo !== "Últimas Concluídas" && item.fim;
                li.innerHTML = `<strong>${item.descricao}</strong> (${item.planoTitulo})${mostrarData ? ` - até ${item.fim}` : ""}`;

                ul.appendChild(li);
            });
            secao.appendChild(ul);
        }
        return secao;
    }

    containerResumo.innerHTML = "";
    containerResumo.appendChild(criarSecao("Últimas Concluídas", concluidas.slice(-5).reverse()));
    containerResumo.appendChild(criarSecao("Em Atraso", emAtraso));
    containerResumo.appendChild(criarSecao("Pendentes", pendentes));
}

function salvarERecarregar() {
    const titulo = document.getElementById("titulo-plano").value;
    const descricao = document.getElementById("atividade-plano").value;
    const inicio = document.getElementById("data-inicio-plano").value;
    const fim = document.getElementById("data-fim-plano").value;

    const planosEstudos = JSON.parse(localStorage.getItem("planosEstudos")) || [];

    const idEditando = localStorage.getItem("editandoPlanoId");

    if (idEditando) {
        const planoIndex = planosEstudos.findIndex(p => p.id === idEditando);
        if (planoIndex !== -1) {
            planosEstudos[planoIndex] = {
                id: idEditando,
                titulo,
                atividades: [{
                    descricao,
                    inicio: inicio || undefined,
                    fim: fim || undefined,
                    concluido: planosEstudos[planoIndex].atividades?.[0]?.concluido || false
                }]
            };
            registrarHistorico("Edição de Plano", titulo);
            localStorage.setItem("planosEstudos", JSON.stringify(planosEstudos));
        }
        localStorage.removeItem("editandoPlanoId");
    } else {
        const novoPlano = {
            id: Date.now().toString(),
            titulo,
            atividades: [{
                descricao,
                inicio: inicio || undefined,
                fim: fim || undefined,
                concluido: false
            }]
        };
        planosEstudos.push(novoPlano);
        registrarHistorico("Criação de Plano", titulo);
    }

    localStorage.setItem("planosEstudos", JSON.stringify(planosEstudos));
    planoExibir();
    exibirResumoAtividades();
}

// Exibe o formulário para criação de atividades.
function exibicaoCriacaoPlano(){
    const planoEstudo = document.getElementById("plano-estudo")
    planoEstudo.style.display == "block" ? planoEstudo.style.display = "none" : planoEstudo.style.display = "block"
    const displayEspecial = document.querySelectorAll(".display.especial")[0]
    displayEspecial.style.display = "block"
}

// Avança para a criação de atividade
function planoExibirEtapa1() {
    const tituloInput = document.getElementById("titulo-plano").value;
    const atividade = document.getElementById("atividade");
    exibirEtapaFormulario(tituloInput, atividade);
}

// Avança para a escolha de organização
function planoExibirEtapa2() {
    const atividadePlano = document.getElementById("atividade-plano").value.trim();
    const organizacao = document.getElementById("organizacao");
    exibirEtapaFormulario(atividadePlano, organizacao);
}

// Exibe a etapa final com ou sem datas, de acordo com o botão clicado
function planoExibirEtapa3() {
    if (this.innerText === "organização sem data") {
        const posicionamento = document.getElementById("posicionamento");
        exibirEtapaFormulario("a", posicionamento);
    } else if (this.innerText === "organização com data") {
        const datas = document.getElementById("datas");
        exibirEtapaFormulario("a", datas);
    }
}

// Adiciona evento aos botões que mostram a etapa de organização
document.querySelectorAll(".exibir-organizar").forEach(button => {
    button.addEventListener("click", planoExibirEtapa3);
});

// Salva novo plano ou edita plano existente
function planoSalvar(organizacao) {
    const tituloPlano = document.getElementById("titulo-plano").value.trim();
    const atividadePlano = document.getElementById("atividade-plano").value.trim();
    const dataInicio = document.getElementById("data-inicio-plano").value;
    const dataFim = document.getElementById("data-fim-plano").value;
    const atividade = document.getElementById("atividade");

    const organizacaoId = organizacao.id;
    const editandoPlanoId = localStorage.getItem("editandoPlanoId");
    const editandoPlanoIndex = localStorage.getItem("editandoPlanoIndex");

    let novoPlano;

    if (editandoPlanoId && editandoPlanoIndex !== null) {
        // Edição de plano existente (nunca é acessado - motivo: bugado)
        if (dataInicio && dataFim && new Date(dataFim) < new Date(dataInicio)) {
            alert("A data de término deve ser posterior à data de início.");
            return;
        }

        novoPlano = {
            id: Date.now().toString(),
            titulo: tituloPlano,
            atividades: [{
                descricao: atividadePlano,
                inicio: dataInicio || undefined,
                fim: dataFim || undefined,
                concluido: false
            }]
        };

        planosEstudos = planosEstudos.filter(p => p.id !== editandoPlanoId);
        planosEstudos.push(novoPlano);
        registrarHistorico("Edição de Plano", tituloPlano);
        localStorage.removeItem("editandoPlanoId");
        localStorage.removeItem("editandoPlanoIndex");
    } else {
        // Criação de novo plano
        if (organizacaoId === "organizacao-com-data") {
            if (!tituloPlano || !atividadePlano || !dataInicio || !dataFim) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            if (dataInicio && dataFim && new Date(dataFim) < new Date(dataInicio)) {
                alert("A data de término deve ser posterior à data de início.");
                return;
            }

            novoPlano = {
                id: Date.now().toString(),
                titulo: tituloPlano,
                atividades: [{
                    descricao: atividadePlano,
                    inicio: dataInicio,
                    fim: dataFim,
                    concluido: false
                }]
            };
        } else if (organizacaoId === "organizacao-sem-data") {
            if (!tituloPlano || !atividadePlano) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            novoPlano = {
                id: Date.now().toString(),
                titulo: tituloPlano,
                atividades: [{
                    descricao: atividadePlano,
                    concluido: false
                }]
            };
        }

        planosEstudos.push(novoPlano);
        registrarHistorico("Criação de Plano", tituloPlano);
    }

    localStorage.setItem("planosEstudos", JSON.stringify(planosEstudos));
    planoExibir();
    exibirResumoAtividades();
    ocultarTodasEtapas();
    limparCamposFormulario(["titulo-plano", "atividade-plano", "data-inicio-plano", "data-fim-plano"]);
    exibicaoCriacaoPlano()
}

// Cancela a criação de plano
function planoCancelar() {
    exibicaoCriacaoPlano()
    ocultarTodasEtapas();
    limparCamposFormulario(["titulo-plano", "atividade-plano", "data-inicio-plano", "data-fim-plano"]);
}

// Carrega um plano existente para edição
/*
function editarPlano(planoId, indexAtividade) {
    const plano = planosEstudos.find(p => p.id === planoId);
    if (!plano) return;

    const atividade = plano.atividades[indexAtividade];

    localStorage.setItem("editandoPlanoId", planoId);
    localStorage.setItem("editandoPlanoIndex", indexAtividade);

    document.getElementById("titulo-plano").value = plano.titulo;
    document.getElementById("atividade-plano").value = atividade.descricao;
    document.getElementById("data-inicio-plano").value = atividade.inicio || "";
    document.getElementById("data-fim-plano").value = atividade.fim || "";

    ocultarTodasEtapas();
    document.getElementById("atividade").style.display = "block";
}
*/

// Remove a atividade selecionada
function excluirAtividadeDoPlano(planoId, indexAtividade) {
    const planoIndex = planosEstudos.findIndex(p => p.id === planoId);
    if (planoIndex === -1) return;

    planosEstudos[planoIndex].atividades.splice(indexAtividade, 1); // Remove atividade

    // Se não restar nenhuma atividade, remove o plano inteiro
    if (planosEstudos[planoIndex].atividades.length === 0) {
        registrarHistorico("Plano Removido", planosEstudos[planoIndex].titulo);
        planosEstudos.splice(planoIndex, 1);
    } else {
        registrarHistorico("Atividade Removida", planosEstudos[planoIndex].titulo);
    }

    localStorage.setItem("planosEstudos", JSON.stringify(planosEstudos));
    planoExibir();
    exibirResumoAtividades();
}

// Remove um plano do sistema
function excluirPlano(planoId) {
    planosEstudos = planosEstudos.filter(plano => plano.id !== planoId);
    localStorage.setItem("planosEstudos", JSON.stringify(planosEstudos));
    registrarHistorico("Plano Excluído", planoId);
    planoExibir();
    exibirResumoAtividades();
}


// FOCOS DE ESTUDO

// Recupera os focos do localstorage ou inicia com um array vazio
let focosEstudos = JSON.parse(localStorage.getItem("focosEstudos")) || [];

// Salva o array de focos no localstorage
function salvarFocos() {
    localStorage.setItem("focosEstudos", JSON.stringify(focosEstudos));
}

// Função principal para salvar um novo foco ou editar um existente
function focoSalvarPrincipal() {
    const titulo = document.getElementById("titulo-foco").value.trim();
    const conteudo = document.getElementById("conteudo-foco").value.trim();

    if (!titulo || !conteudo) {
        alert("Preencha todos os campos.");
        return;
    }

    const form = document.getElementById("form-focos-estudos");
    const focoEditandoId = form.getAttribute("data-editando-id");

    if(focoEditandoId){
        // Se está editando, atualiza o foco existente
        const foco = focosEstudos.find(f => f.id === parseInt(focoEditandoId));

        if(foco){
            foco.titulo = titulo;
            foco.conteudo = conteudo;
        }
        registrarHistorico("Edição do Foco", foco.titulo);
        form.removeAttribute("data-editando-id");
    }else{
        // Cria novo foco
        const novoFoco = {
            id: Date.now(),
            titulo,
            conteudo,
            filhoDe: [],
            relacionamentosPerifericos: []
        };
        focosEstudos.push(novoFoco);
        registrarHistorico("Criação do Foco", titulo)
    }

    salvarFocos();
    focoExibir();
    form.reset();
    document.getElementById("titulo-foco").focus();
}

// Exibe os focos na tela
function focoExibir() {
    const focoContainer = document.getElementById("focos-container");
    if(!focoContainer) return;
    focoContainer.innerHTML = "";

    if (focosEstudos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Você ainda não tem focos de estudo cadastrados.";
        focoContainer.appendChild(mensagem);
    } else {
        const focosPrincipais = focosEstudos.filter(f => !f.filhoDe || f.filhoDe.length === 0);

        focosPrincipais.forEach(foco => {
            const focoElement = criarFocoElemento(foco);
            focoContainer.appendChild(focoElement);
        });
    }
}

// Cria o elemento HTML de um foco
function criarFocoElemento(foco) {
    const divFoco = document.createElement("div");
    divFoco.classList.add("foco");
    divFoco.id = `foco-${foco.id}`;

    divFoco.setAttribute("tabindex", "0");
    divFoco.setAttribute("role", "region");
    divFoco.setAttribute("aria-labelledby", `titulo-foco-${foco.id}`);

    const titulo = document.createElement("h3");
    titulo.textContent = foco.titulo;
    titulo.id = `titulo-foco-${foco.id}`;

    const conteudo = document.createElement("p");
    conteudo.textContent = foco.conteudo;

    // Mostra os filhos (hierarquia)
    const detalhes = document.createElement("details");
    detalhes.classList.add("especial")
    const resumo = document.createElement("summary");
    resumo.textContent = "Mostrar Filhos";
    detalhes.setAttribute("aria-expanded", "false"); 
    detalhes.addEventListener("toggle", () => {
        detalhes.setAttribute("aria-expanded", detalhes.open ? "true" : "false");
    });

    const filhos = focosEstudos.filter(f => f.filhoDe && f.filhoDe.includes(foco.id));
    filhos.forEach(filho => {
        const filhoElemento = criarFocoElemento(filho);
        detalhes.appendChild(filhoElemento);
    });

    detalhes.appendChild(resumo);

    // Mostra os relacionamentos periféricos
    const detalhesPeriferico = document.createElement("details");
    const resumoPeriferico = document.createElement("summary");
    resumoPeriferico.textContent = "Relacionamentos Periféricos";
    resumoPeriferico.setAttribute("aria-expanded", "false");

    foco.relacionamentosPerifericos.forEach(idRelacionado => {
        const focoRelacionado = focosEstudos.find(f => f.id === idRelacionado);
        if (focoRelacionado) {
            const focoRelacionadoElemento = document.createElement("p");
            focoRelacionadoElemento.textContent = focoRelacionado.titulo;
            detalhesPeriferico.appendChild(focoRelacionadoElemento);
        }
    });

    detalhesPeriferico.appendChild(resumoPeriferico);

    // Botão para adicionar um elemento filho (foco)
    const btnAdicionarFilho = document.createElement("button");
    btnAdicionarFilho.textContent = "Adicionar Filho";
    btnAdicionarFilho.setAttribute("aria-label", `Adicionar filho ao foco ${foco.titulo}`);
    btnAdicionarFilho.onclick = () => mostrarFormularioAdicionarFilho(foco.id);
    btnAdicionarFilho.classList.add("especial")

    // Botão para adicionar um elemento periférico (foco)
    const btnAdicionarPeriferico = document.createElement("button");
    btnAdicionarPeriferico.textContent = "Adicionar Relação Periférica";
    btnAdicionarPeriferico.setAttribute("aria-label", `Adicionar relação periférica ao foco ${foco.titulo}`);
    btnAdicionarPeriferico.onclick = () => mostrarFormularioAdicionarPeriferico(foco.id);
    btnAdicionarPeriferico.classList.add("especial")

    // Botão para excluir foco
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.setAttribute("aria-label", `Excluir foco ${foco.titulo}`);
    btnExcluir.onclick = () => excluirFoco(foco.id);
    btnExcluir.classList.add("especial")

    // Botão de editar (aparece se o formulário principal estiver presente)
    if(document.getElementById("form-focos-estudos")){
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.setAttribute("aria-label", `Editar foco ${foco.titulo}`);
        btnEditar.onclick = () => editarFoco(foco.id);
        divFoco.appendChild(btnEditar);
    }
    
    // Montagem do bloco
    divFoco.appendChild(titulo);
    divFoco.appendChild(conteudo);
    if (filhos.length > 0) divFoco.appendChild(detalhes);
    if (foco.relacionamentosPerifericos.length > 0) divFoco.appendChild(detalhesPeriferico);
    divFoco.appendChild(btnAdicionarFilho);
    divFoco.appendChild(btnAdicionarPeriferico);
    divFoco.appendChild(btnExcluir);

    return divFoco;
}

// Cria e salva um novo filho para um foco
function adicionarFilho(paiId, titulo, conteudo) {
    if (!titulo || !conteudo) return;

    const novoFilho = {
        id: Date.now(),
        titulo,
        conteudo,
        filhoDe: [paiId],
        relacionamentosPerifericos: []
    };

    focosEstudos.push(novoFilho);
    salvarFocos();
    registrarHistorico("Criação de Foco Filho", titulo);
    focoExibir();
}

// Mostra formulário para adicionar um foco filho
function mostrarFormularioAdicionarFilho(focoId) {
    const divFocoPai = document.getElementById(`foco-${focoId}`);
    if (!divFocoPai) return;

    // Impede múltiplos formulários
    if (divFocoPai.querySelector(".form-filho")) return;

    const form = document.createElement("form");
    form.classList.add("form-filho");

    const inputTitulo = document.createElement("input");
    inputTitulo.placeholder = "Título do Filho";
    const inputConteudo = document.createElement("input");
    inputConteudo.placeholder = "Conteúdo do Filho";

    const btnSalvar = document.createElement("button");
    btnSalvar.textContent = "Salvar";

    btnSalvar.onclick = (e) => {
        e.preventDefault();
        adicionarFilho(focoId, inputTitulo.value, inputConteudo.value);
        form.remove();
    };

    form.appendChild(inputTitulo);
    form.appendChild(inputConteudo);
    form.appendChild(btnSalvar);

    divFocoPai.appendChild(form);
}

// Adiciona relacionamento periférico entre dois focos
function adicionarPeriferico(focoId, focoPerifericoId) {
    const foco = focosEstudos.find(f => f.id === focoId);
    const focoPeriferico = focosEstudos.find(f => f.id === focoPerifericoId);

    if (foco && focoPeriferico && foco.id !== focoPeriferico.id) {
        foco.relacionamentosPerifericos.push(focoPeriferico.id);
        salvarFocos();
        registrarHistorico("Criação de Relação Periférica", foco.titulo);
        focoExibir();
    }
}

// Mostra formulário para criar uma relação periférica
function mostrarFormularioAdicionarPeriferico(focoId) {
    const divFocoPai = document.getElementById(`foco-${focoId}`);
    if (!divFocoPai) {
        console.error("Foco pai não encontrado.");
        return;
    }

    // Impede múltiplos formulários
    if (divFocoPai.querySelector(".form-periferico")) return;

    const formAdicionarPeriferico = document.createElement("form");
    formAdicionarPeriferico.classList.add("form-periferico");

    const focoSelect = document.createElement("select");
    focoSelect.innerHTML = focosEstudos
        .filter(f => f.id !== focoId)
        .map(f => `<option value="${f.id}">${f.titulo}</option>`)
        .join("");

    const btnSalvarPeriferico = document.createElement("button");
    btnSalvarPeriferico.textContent = "Salvar Relação Periférica";

    btnSalvarPeriferico.onclick = (e) => {
        e.preventDefault();
        const focoPerifericoId = parseInt(focoSelect.value);
        adicionarPeriferico(focoId, focoPerifericoId);
        formAdicionarPeriferico.remove();
    };

    formAdicionarPeriferico.appendChild(focoSelect);
    formAdicionarPeriferico.appendChild(btnSalvarPeriferico);

    divFocoPai.appendChild(formAdicionarPeriferico);
}

// Edita um foco existente, preenchendo o formulário com seus dados
function editarFoco(id) {
    const foco = focosEstudos.find(f => f.id === id);
    if(!foco) return;

    document.getElementById("titulo-foco").value = foco.titulo;
    document.getElementById("conteudo-foco").value = foco.conteudo;

    document.getElementById("form-focos-estudos").setAttribute("data-editando-id", id);
}

// Exclui um foco e seus filhos/relacionamentos
function excluirFoco(id) {
    const focoPai = focosEstudos.find(f => f.id === id);

    // Remove os filhos
    focosEstudos = focosEstudos.filter(foco => !foco.filhoDe.includes(id));

    // Remove o ID de relacionamentos periféricos de outros focos
    focosEstudos.forEach(foco => {
        foco.relacionamentosPerifericos = foco.relacionamentosPerifericos.filter(idRelacionado => idRelacionado !== id);
    });

    // Remove o foco principal
    focosEstudos = focosEstudos.filter(foco => foco.id !== id);

    salvarFocos();
    registrarHistorico("Exclusão de Foco", focoPai.titulo);
    focoExibir();
}

// HISTÓRICO DE ATIVIDADES

// Registra ações (criar, editar, excluir) no localstorage
function registrarHistorico(acao, detalhes) {
    const historico = JSON.parse(localStorage.getItem("historicoAtividades")) || [];
    historico.push({
        data: new Date().toISOString(),
        acao,
        detalhes
    });
    localStorage.setItem("historicoAtividades", JSON.stringify(historico));
}

// Exibe o histórico de atividades
function exibirHistórico() {
    const container = document.getElementById("historico-atividades");
    if (!container) return;

    const historico = JSON.parse(localStorage.getItem("historicoAtividades")) || [];

    container.innerHTML = "<h3>Histórico de Atividades</h3>";

    if (historico.length === 0) {
        container.innerHTML += "<p>Nenhuma atividade registrada.</p>";
    } else {
        const ul = document.createElement("ul");

        historico
            .sort((a, b) => new Date(b.data) - new Date(a.data)) // Mais recente primeiro
            .forEach(item => {
                const li = document.createElement("li");
                const dataFormatada = new Date(item.data).toLocaleString();
                li.textContent = `[${dataFormatada}] ${item.acao}: ${item.detalhes}`;
                ul.appendChild(li);
            });

        container.appendChild(ul);
    }

    // Cria o botão Limpar Histórico
    let btnLimpar = document.getElementById("btnLimparHistorico");
    if (!btnLimpar) {
        btnLimpar = document.createElement("button");
        btnLimpar.id = "btnLimparHistorico";
        btnLimpar.textContent = "Limpar Histórico";
        container.appendChild(btnLimpar);

        btnLimpar.addEventListener("click", () => {           
            limparHistorico();  
        });
    }
}

// Limpa o histórico e atualiza a exibição
function limparHistorico() {
    localStorage.removeItem("historicoAtividades");
    exibirHistórico();
}

// AO CARREGAR A PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    planoExibir();
    focoExibir();
    exibirResumoAtividades();
    exibirHistórico();

    // Adiciona evento no botão limpar histórico
    const btnLimpar = document.getElementById("btnLimparHistorico");
    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {      
            limparHistorico();         
        });
    }
});