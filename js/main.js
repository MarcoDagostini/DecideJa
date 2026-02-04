//TODO --> PRECISA MUDAR ESSE NOME, PROVAVELMENTE PARA BUSCA, POIS AQUI TRATA TODA ESSA PARTE,
//TODO --> se digitar só um caractere não é realizada a pesquisa, tem que conferir isso aí


//Importa o arquivo supabase, com todos os comandos referentes a BD presentes lá

//definição variáveis golbais
import {SupabaseService} from '../js/supabase.js';

const supabaseService = new SupabaseService();

const advancedSearchForm = document.getElementById('advanced-search-form');
const buscaInput = document.getElementById('busca');
let filtrosAtivos = ['universidade']; // Filtros padrão ao carregar

const advancedBtn = document.getElementById("advanced-search-btn");
const advancedDropdown = document.getElementById("advanced-search-dropdown");

const buscaBtn = document.getElementById('lupa');


//DOMContentLoaded faz com que seja possível interagir com os cards, eles são construídos pós DOM
document.addEventListener('DOMContentLoaded', async function () {
//somente chamando os métodos já prontos :)
    menus();
    setFiltroAtivoCheckboxes(filtrosAtivos);
    advancedSearchForm.addEventListener('submit', filtro);



//Seria um desperdício criar funções para a parte aqui de baixo, por isso deixei normalzao msm

    // Eventos de busca pelo input e botão
    if (buscaInput) {
        buscaInput.addEventListener('input', function () {
            const termo = buscaInput.value.trim();
            // Se o termo for muito curto, limpa os resultados ou espera mais entradas
            if (termo.length > 1 || termo.length === 0) { // Busca com 0 caracteres para exibir tudo se não houver termo
                buscarECriarCards(termo);
            } else {
                document.getElementById('cards-container').innerHTML = '';
            }
        });
    }


    if (buscaBtn) {
        buscaBtn.addEventListener('click', function () {
            const termo = buscaInput.value.trim();
            buscarECriarCards(termo);
        });
    }

    // Exibe resultados padrão com filtro 'universidade' ao carregar
    // Garante que o checkbox 'universidade' esteja marcado por padrão no dropdown
    const uniCheckbox = document.getElementById('universidade');
    if (uniCheckbox) {
        uniCheckbox.checked = true;
    }
    setFiltroAtivoCheckboxes(filtrosAtivos); // Atualiza a aparência dos checkboxes
    buscarECriarCards(''); // Busca inicial vazia para mostrar todas as universidades


})


export function menus() {
    const menuIcon = document.getElementById("menu-icon");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (menuIcon && sidebar && overlay) {
        //Quando clicar na sidebar/overlay vai abrir o menu
        menuIcon.addEventListener("click", function () {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        //ao clicar fora dos menu, este fecha
        overlay.addEventListener("click", function () {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    }
}


// Função para atualizar a classe 'filtro-ativo' nos labels dos checkboxes
function setFiltroAtivoCheckboxes(filtrosSelecionados) {
    advancedSearchForm.querySelectorAll('label').forEach(label => {
        label.classList.remove('filtro-ativo');
        //Remove os filtros ativos
    });
    filtrosSelecionados.forEach(filtro => {
        const checkbox = document.getElementById(filtro);

        if (checkbox) {
            //pega o label mais próximo
            const label = checkbox.closest('label');
            label.classList.add('filtro-ativo');
            //adiciona o filtro ativo
        }
    });
}


function filtro(event) {
    event.preventDefault();
    // Pega todos os filtros selecionados no dropdown e transforma num array
    filtrosAtivos = Array.from(advancedSearchForm.querySelectorAll('input[type="checkbox"]:checked'))
        .map(input => input.id);

    if (filtrosAtivos.length === 0) {
        // Se nenhum filtro for selecionado, limpa os resultados e reseta
        document.getElementById('cards-container').innerHTML = '';
        setFiltroAtivoCheckboxes([]);
        advancedDropdown.classList.add("hidden");
        return;
    }

    setFiltroAtivoCheckboxes(filtrosAtivos);
    buscarECriarCards(buscaInput.value.trim());

    // Fecha o dropdown após aplicar filtros
    advancedDropdown.classList.add("hidden");

}


// Funções para criar cards (mantidas as mesmas)
export function criarCardUniversidade(uni) {
    return `
            <div class="card-uni" data-id="${uni?.codigo}">
           <img class="card-img" src="${uni?.logo || 'imagens/IFRS.jpg'}" alt="Logo Universidade">
            <div class="card-info">
                <div class="card-header">   
                    <span class="card-nome">${uni?.sigla || ''}</span>
                    <span class="card-nomecompleto">${uni?.nome || ''}</span>
                </div>
                <div class="card-dados">
                    <span class="card-org"><b>Organização Acadêmica:</b> ${uni?.organizacao.descricao || '-'}</span>
                    <span class="card-cat"><b>Categoria:</b> ${uni?.categoria_administrativa || '-'}</span>
                    <span class="card-local"><b>Município:</b> ${uni?.municipio?.nome || '-'}</span>
                </div>
            </div>
        </div>
        `;
}



function criarCardArea(area) {
    return `
        <div class="card-uni">
            <div class="card-info">
                <div class="card-header">
                    <span class="card-nome">${area?.nome || ''}</span>
                </div>
                <div class="card-dados">

                </div>
            </div>
        </div>
        `;
}

function criarCardCurso(curso) {
    return `
        <div class="card-uni">
            <div class="card-info">
                <div class="card-header">
                    <span class="card-nome">${curso?.nome || ''}</span>
                    <span class="card-nomecompleto">${curso?.nome_completo || ''}</span>
                </div>
                <div class="card-dados">
                    <span class="card-cat"><b>Subárea:</b> ${curso?.subarea.nome || '-'}</span>
                    <span class="card-cat"><b>Grau:</b> ${curso?.grau.nome || '-'}</span>
                </div>
            </div>
        </div>
        `;
}

// Função assíncrona de busca e criação dos cards conforme filtrosAtivos
async function buscarECriarCards(termo) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '<p style="color:#092e5e;font-size:1.2em;">Buscando...</p>';

    let html = '';
    let resultados = [];

    // Lógica para buscar com base nos filtros selecionados
    // Esta parte é crucial e pode precisar de ajustes dependendo da sua estrutura de dados no Supabase
    // e como você quer combinar os filtros (AND/OR).
    // Por simplicidade, vou demonstrar como buscar para cada tipo de filtro principal.
    // Se múltiplos filtros de "tipo" (universidade, area, curso) forem selecionados,
    // você pode exibir resultados de todos eles.
    //Sei lá quem fez essa bomba aqui, ta mto bizarra, tentei entender oq tinha mas fé

//TODO --> remoção do query/supabase nesta parte
    if (filtrosAtivos.includes('universidade')) {
        const { data: universidades, error } = await supabaseService.getUniversidadesQuery(termo);

        if (error) {
            console.error('Erro ao buscar universidades:', error.message);
        } else if (universidades && universidades.length > 0) {
            universidades.forEach(uni => {
                resultados.push({type: 'universidade', data: uni});
            });
        }
    }

    if (filtrosAtivos.includes('area')) {
        let query = supabaseService.getArea();
        if (termo) {
            query = query.ilike('nome', `%${termo}%`);
        }
        const {data: areas, error} = await query;

        if (error) {
            console.error('Erro ao buscar áreas:', error.message);
        } else if (areas && areas.length > 0) {
            areas.forEach(area => {
                resultados.push({type: 'area', data: area});
            });
        }
    }

    

    if (filtrosAtivos.includes('curso')) {
        let query = supabaseService.getCursos();
        if (termo) {
            query = query.ilike('nome', `%${termo}%`);
        }
        // Adicione lógica para outros filtros de curso aqui (subarea, grau)
        // Exemplo: if (filtrosAtivos.includes('subarea')) { query = query.eq('subarea_codigo', idSubarea); }

        const {data: cursos, error} = await query;

        if (error) {
            console.error('Erro ao buscar cursos:', error.message);
        } else if (cursos && cursos.length > 0) {
            cursos.forEach(curso => {
                resultados.push({type: 'curso', data: curso});
            });
        }
    }

    // Renderiza os resultados
    if (resultados.length > 0) {
        resultados.forEach(item => {
            if (item.type === 'universidade') {
                html += criarCardUniversidade(item.data);
            } else if (item.type === 'area') {
                html += criarCardArea(item.data);
            } else if (item.type === 'curso') {
                html += criarCardCurso(item.data);
            }
        });
    }

    if (!html) {
        html = `<p style="color:#092e5e;font-size:1.2em;">Nenhum resultado encontrado.</p>`;
    }

    cardsContainer.innerHTML = html;
}


//TODO --> Funcao Clicar no card e abrir uni


//Se clicar em algum eleento interno, com isso também vai entrar no card expanded
document.addEventListener("click", function (e) {
    if (e.target.closest(".card-uni")) {
        const card = e.target.closest(".card-uni");
        const uniId = card.getAttribute("data-id");
        // Redirect to the university details page with the codigo as query parameter
        if (uniId) {
            window.location.href = `universidade.html?codigo=${encodeURIComponent(uniId)}`;
        }
    }
});

async function opnCard(uniId) {
    const {data: universidade, error} = await supabase
        .from("universidade")
        .select(`
            *,
            municipio:municipio_codigo (nome),
            organizacao:organizacao_academica_codigo (descricao)
        `)
        .eq("codigo", uniId)   // ou .eq("id", uniId) se o campo for "id"
        .single();

    if (error) {
        console.error("Erro ao buscar detalhes da universidade:", error);
        return;
    }

    // Renderiza os detalhes (pode ser um modal ou substituir o container)
    const container = document.getElementById("card-detalhe");
    container.innerHTML = `
        <div class="card-expanded">
            <div class="card-info-expanded">
                <div class="card-header-expanded">
                    <span class="card-nome">${universidade.sigla || ''}</span>
                    <span class="card-nomecompleto">${universidade.nome || ''}</span>
                </div>
                <div class="card-dados-expanded">
                    <span class="card-org"><b>Organização:</b> ${universidade.organizacao?.descricao || '-'}</span>
                    <span class="card-cat"><b>Categoria:</b> ${universidade.categoria_administrativa || '-'}</span>
                    <span class="card-local"><b>Município:</b> ${universidade.municipio?.nome || '-'}</span>
                </div>
            </div>
        </div>
    `;
}


