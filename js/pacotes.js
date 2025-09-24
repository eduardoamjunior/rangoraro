// --- LÓGICA PARA PESQUISA E FILTRO ---

// Dados dos pacotes (simulando um banco de dados como MySQL)
const pacotes = [
    { id: 'palhacada', nome: 'Palhaçada', preco: 29.90, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/palhacada.png' },
    { id: 'oRei', nome: 'O Rei', preco: 35.50, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/o-rei.png' },
    { id: 'laBaguet', nome: 'La Baguet', preco: 25.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/la-baguet.png' },
    { id: 'alMossar', nome: 'Al Mossar', preco: 42.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/al-mossar.png' },
    { id: 'oCoronel', nome: 'O Coronel', preco: 39.90, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/o-coronel.png' },
    { id: 'sereismo', nome: 'Sereísmo', preco: 45.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/sereismo.png' },
    { id: 'mammaMia', nome: 'Mamma Mia', preco: 32.70, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/mamma-mia.png' },
    { id: 'arriba', nome: 'Arriba!', preco: 28.50, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/arriba.png' },
    { id: 'docura', nome: 'Doçura', preco: 19.90, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/docura.png' },
    { id: 'tubelicious', nome: 'Tubelicious', preco: 55.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/pacotes/tubelicious.png' }
];

const gradePacotes = document.getElementById('grade-pacotes');
const pesquisaInput = document.getElementById('pesquisaInput');
const ordenarSelect = document.getElementById('ordenarSelect');

// Função para renderizar (desenhar) os pacotes na tela
function renderizarPacotes(pacotesParaRenderizar) {
    gradePacotes.innerHTML = ''; // Limpa a grade antes de adicionar novos itens

    if (pacotesParaRenderizar.length === 0) {
        gradePacotes.innerHTML = '<p class="nenhum-resultado">Nenhum pacote encontrado.</p>';
        return;
    }

    pacotesParaRenderizar.forEach(pacote => {
        const pacoteElemento = document.createElement('div');
        pacoteElemento.className = 'pacote-wrapper';
        pacoteElemento.id = pacote.id;
        
        const precoFormatado = `R$ ${pacote.preco.toFixed(2).replace('.', ',')}`;

        pacoteElemento.innerHTML = `
            <div class="pack" style="background-image: url('${pacote.imagemUrl}')" data-tilt data-tilt-glare data-tilt-max-glare="0.6"></div>
            <div class="price">${precoFormatado}</div>
        `;
        gradePacotes.appendChild(pacoteElemento);
    });

    // Re-inicializa o efeito de tilt nos novos elementos
    // CORREÇÃO: O valor de 'max' estava 0, o que desativava o efeito. Mudei para 15.
    VanillaTilt.init(document.querySelectorAll(".pack"), {
        max: 15, // Aumentado para reativar o efeito
        speed: 1000,
        glare: true,
        "max-glare": 0.1,
        transition: true,
        easing: "cubic-bezier(.03,.98,.52,.99)"
    });
}

// Função para filtrar e ordenar os pacotes
function atualizarPacotes() {
    let pacotesFiltrados = [...pacotes];
    const termoPesquisa = pesquisaInput.value.toLowerCase();

    // 1. Filtrar por pesquisa
    if (termoPesquisa) {
        pacotesFiltrados = pacotesFiltrados.filter(pacote => 
            pacote.nome.toLowerCase().includes(termoPesquisa)
        );
    }

    // 2. Ordenar
    const tipoOrdenacao = ordenarSelect.value;
    if (tipoOrdenacao === 'menor-preco') {
        pacotesFiltrados.sort((a, b) => a.preco - b.preco);
    } else if (tipoOrdenacao === 'maior-preco') {
        pacotesFiltrados.sort((a, b) => b.preco - a.preco);
    }

    renderizarPacotes(pacotesFiltrados);
}

// Adiciona os 'escutadores' de eventos para a pesquisa e o dropdown
pesquisaInput.addEventListener('input', atualizarPacotes);
ordenarSelect.addEventListener('change', atualizarPacotes);

// Renderização inicial dos pacotes ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderizarPacotes(pacotes);
});
