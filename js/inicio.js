import { SupabaseService } from "../js/supabase.js";
import { criarCardUniversidade, menus } from "../js/main.js";


const supabaseService = new SupabaseService();


async function carregarMelhorAvaliadas() {
    const container = document.getElementById('carousel-melhorAvaliadas');
    container.innerHTML = '<p>Carregando...</p>';
    const { data: universidades, error } = await supabaseService.getUniversidadesQuery('');
    if (error || !universidades) {
        container.innerHTML = '<p>Erro ao carregar universidades.</p>';
        return;
    }
    const melhores = universidades
        .sort((a, b) => (b.igc || 0) - (a.igc || 0));
        /*.slice(0, 10) */    
    container.innerHTML = melhores.map(criarCardUniversidade).join('');
    verificarOverflow('melhorAvaliadas');
    setupCarouselArrows('melhorAvaliadas');
}

async function carregarPertoDeVoce() {
    const container = document.getElementById('carousel-pertoDeVoce');
    container.innerHTML = '<p>Buscando...</p>';
    const { data: universidades, error } = await supabaseService.getUniversidadesQuery('');
    if (error || !universidades) {
        container.innerHTML = '<p>Erro ao carregar universidades.</p>';
        return;
    }
    const proximas = universidades;
    container.innerHTML = proximas.map(criarCardUniversidade).join('');
    verificarOverflow('pertoDeVoce');
    setupCarouselArrows('pertoDeVoce');
}

// Verifica se hÃ¡ overflow e mostra/esconde as setas
function verificarOverflow(sectionId) {
    const wrapper = document.querySelector(`#${sectionId} .cards-carousel-wrapper`);
    const carousel = document.getElementById(`carousel-${sectionId}`);
    if (carousel.scrollWidth > carousel.clientWidth) {
        wrapper.classList.add('has-overflow');
    } else {
        wrapper.classList.remove('has-overflow');
    }
}

// Scroll das setas
function setupCarouselArrows(sectionId) {
    const carousel = document.getElementById(`carousel-${sectionId}`);
    document.getElementById(`arrow-${sectionId}-left`).onclick = () => {
        carousel.scrollBy({ left: -370, behavior: 'smooth' });
    };
    document.getElementById(`arrow-${sectionId}-right`).onclick = () => {
        carousel.scrollBy({ left: 370, behavior: 'smooth' });
    };
}

document.addEventListener("DOMContentLoaded", async () => {
    menus();
    //Funcionamento Carrousel Bootstrap
    var myCarousel = document.querySelector('#carouselExampleIndicators');
    if (myCarousel) {
        var carousel = new bootstrap.Carousel(myCarousel, {
            interval: 3500,
            ride: 'carousel'
        });
    }
    await carregarMelhorAvaliadas();
    await carregarPertoDeVoce();
});