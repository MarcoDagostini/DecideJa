import { SupabaseService } from './supabase.js';

const supabaseService = new SupabaseService();

// Runtime helper to get universidade by codigo (keeps js/supabase.js untouched)
supabaseService.getUniversidadeByCodigo = async function (codigo) {
	return this.supabase
		.from('universidade')
		.select(`
			*,
			municipio:municipio_codigo (nome),
			organizacao:organizacao_academica_codigo (descricao)
		`)
		.eq('codigo', codigo)
		.single();
};

// Runtime helper to get campi for a universidade
supabaseService.getCampiByUniversidade = async function (universidadeCodigo) {
	return this.supabase
		.from('campus')
		.select(`*, municipio:municipio_codigo (nome)`)
		.eq('universidade_codigo', universidadeCodigo);
};

// Utility to read query params
function getQueryParam(name) {
	const params = new URLSearchParams(window.location.search);
	return params.get(name);
}

function criarCardCampus(campus) {
	return `
		<div class="cardcampus" data-id="${campus?.codigo}">
			<div id="topoCardCampus">
				<div id="iconeCardCampus"><i class="fa-solid fa-building"></i></div>
				<div id="nomeCampus">
					<div>${campus?.nome || 'Nome do campus'}</div>
					
				</div>
			</div>

			<div id="detalhesCardCampus">
			<div >${campus?.municipio?.nome || '-'}</div>
			</div>

			<div id=botaoCardCampus>
			<button>Saiba mais</button>
			</div>
		</div>
	`;
}

async function renderUniversidade(codigo) {
	const container = document.getElementById('card-detalhe');
	if (!container) return;

	container.innerHTML = '<p style="color:#092e5e;font-size:1.2em;">Carregando...</p>';

	try {
		const { data: universidade, error: uniError } = await supabaseService.getUniversidadeByCodigo(codigo);

		if (uniError) {
			console.error('Erro ao buscar universidade:', uniError);
			container.innerHTML = `<p style="color:#c0392b;">Erro ao carregar universidade.</p>`;
			return;
		}

		if (!universidade) {
			container.innerHTML = `<p style="color:#092e5e;">Universidade não encontrada.</p>`;
			return;
		}



		// University details HTML
		let html = `
			<div class="carduni ">
				<div class="d-flex align-items-center">
					<img id="logo" src="${universidade.logo || 'imagens/IFRS.jpg'}" alt="logo" style="width:120px;height:200px;object-fit:cover;margin-right:16px;"/>
					
				</div>

				<div id="infoUni">

					<div>
						
						<h1 id="tituloUni" >${universidade.sigla || ''}</h1>
						<p id="nomeUni" >${universidade.nome || ''}</p>
						
						
					</div>
				
					<div id="detalhesUni">
					<p><i class="fa-solid fa-location-dot"></i> ${universidade.municipio?.nome || '-'}</p>
					<p><i class="fa-solid fa-school"></i> ${universidade.organizacao?.descricao || '-'} ${universidade.categoria_administrativa || '-'}</p>
					
					
					
					</div>

					<div id="stars">
						<!-- From Uiverse.io by andrew-demchenk0 --> 
						<div class="rating">
 						 <input value="5" name="rate" id="star5" type="radio">
  						<label title="text" for="star5"></label>
 						 <input value="4" name="rate" id="star4" type="radio">
  						<label title="text" for="star4"></label>
 						 <input value="3" name="rate" id="star3" type="radio" checked="">
  						<label title="text" for="star3"></label>
  						<input value="2" name="rate" id="star2" type="radio">
  						<label title="text" for="star2"></label>
  						<input value="1" name="rate" id="star1" type="radio">
  						<label title="text" for="star1"></label>
						</div>
					</div>

				</div>
			</div>
		`;

		

		// Fetch campi for this university
		const { data: campi, error: campusError } = await supabaseService.getCampiByUniversidade(codigo);

		html += `<div id="divcampusTitulo"><h4 id="campustitulo">Campus da Universidade</h4>
				<p id="campusSubtitulo">Conheça as diferentes unidades:</p>
				</div>`;

		if (campusError) {
			console.error('Erro ao buscar campi:', campusError);
			html += `<p style="color:#c0392b;">Erro ao carregar campi.</p>`;
		} else if (!campi || campi.length === 0) {
			html += `<p style="color:#092e5e;">Nenhum campus encontrado para esta universidade.</p>`;
		} else {
			html += '<div id="campi-list">';
			campi.forEach(c => {
				html += criarCardCampus(c);
			});
			html += '</div>';
		}

		container.innerHTML = html;

	} catch (err) {
		console.error(err);
		container.innerHTML = `<p style="color:#c0392b;">Erro inesperado.</p>`;
	}
}

// On load, read codigo param and render
document.addEventListener('DOMContentLoaded', function () {
	const codigo = getQueryParam('codigo');
	if (!codigo) {
		const container = document.getElementById('card-detalhe');
		if (container) container.innerHTML = `<p style="color:#092e5e;">Nenhuma universidade selecionada.</p>`;
		return;
	}

	renderUniversidade(codigo);
});