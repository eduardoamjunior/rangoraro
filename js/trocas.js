// Dados dos lanches disponíveis
const snacks = [
    {
        id: 1,
        name: "Combo 2x Whopper",
        price: 45.90,
        image: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=WHOPPER"
    },
    {
        id: 2,
        name: "Big Mac Combo",
        price: 32.50,
        image: "https://via.placeholder.com/80/FFC72C/000000?text=BIG+MAC"
    },
    {
        id: 3,
        name: "Pizza Margherita",
        price: 78.00,
        image: "https://via.placeholder.com/80/27AE60/FFFFFF?text=PIZZA"
    },
    {
        id: 4,
        name: "Açaí 500ml",
        price: 22.90,
        image: "https://via.placeholder.com/80/9B59B6/FFFFFF?text=AÇAÍ"
    },
    {
        id: 5,
        name: "Combo Taco Bell",
        price: 55.75,
        image: "https://via.placeholder.com/80/E67E22/FFFFFF?text=TACO"
    },
    {
        id: 6,
        name: "Hambúrguer Artesanal",
        price: 89.99,
        image: "https://via.placeholder.com/80/8E44AD/FFFFFF?text=CRAFT"
    },
    {
        id: 7,
        name: "Combo KFC",
        price: 38.40,
        image: "https://via.placeholder.com/80/E74C3C/FFFFFF?text=KFC"
    },
    {
        id: 8,
        name: "Sushi Combinado",
        price: 125.00,
        image: "https://via.placeholder.com/80/2C3E50/FFFFFF?text=SUSHI"
    },
    {
        id: 9,
        name: "Combo Subway",
        price: 28.90,
        image: "https://via.placeholder.com/80/F39C12/000000?text=SUBWAY"
    },
    {
        id: 10,
        name: "Lasanha Bolonhesa",
        price: 67.50,
        image: "https://via.placeholder.com/80/16A085/FFFFFF?text=LASANHA"
    }
];

// Estado da aplicação
let selectedSnack = null;
let currentChance = 0;
let isSpinning = false;

// Elementos DOM
const priceInput = document.getElementById('price-input');
const chanceRange = document.getElementById('chance-range');
const resultPercent = document.getElementById('result-percent');
const rouletteContainer = document.querySelector('.roulette-container');
const roulettePercent = document.getElementById('roulette-percent');
const selectRangeBtn = document.getElementById('select-range');
const previewImage = document.getElementById('preview-image-placeholder');
const previewText = document.querySelector('.preview-text');
const previewPrice = document.querySelector('.price');
const previewMultiplier = document.querySelector('.multiplier');
const maxPriceBtn = document.getElementById('max-price');
const resetBtn = document.getElementById('reset-btn');
const shortcutButtons = document.querySelectorAll('.shortcut');
const productsContainer = document.querySelector('.products');
const minPriceFilter = document.getElementById('min-price');
const maxPriceFilter = document.getElementById('max-price-filter');
const sortPriceDiv = document.querySelector('.sort-price');

// Variáveis de filtro e ordenação
let sortOrder = 'desc'; // 'desc' = maior para menor, 'asc' = menor para maior
let filteredSnacks = [...snacks];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    renderProducts();
    updateRouletteDisplay();
});

function initializeEventListeners() {
    // Eventos dos controles de chance
    chanceRange.addEventListener('input', function() {
        currentChance = parseInt(this.value);
        updateChanceDisplay();
        updateRouletteDisplay();
        updatePriceCalculation();
        updateSpinButton();
    });

    priceInput.addEventListener('input', function() {
        const price = parseFloat(this.value) || 0;
        if (selectedSnack) {
            currentChance = Math.max(1, Math.min(80, (price / selectedSnack.price) * 100));
            chanceRange.value = currentChance;
            updateChanceDisplay();
            updateRouletteDisplay();
        }
        updatePreviewInfo();
        updateSpinButton();
    });

    // Botões de atalho de porcentagem
    shortcutButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            chanceRange.value = value;
            currentChance = value;
            updateChanceDisplay();
            updateRouletteDisplay();
            updatePriceCalculation();
            updateSpinButton();
        });
    });

    // Botão de máximo preço
    maxPriceBtn.addEventListener('click', function() {
        if (selectedSnack) {
            priceInput.value = selectedSnack.price.toFixed(2);
            updatePreviewInfo();
        }
    });

    // Botão de reset
    resetBtn.addEventListener('click', function() {
        resetSelection();
    });

    // Botão da roleta
    selectRangeBtn.addEventListener('click', function() {
        if (selectedSnack && currentChance > 0) {
            spinRoulette();
        }
    });

    // Interação com a roleta
    rouletteContainer.addEventListener('mousedown', handleRouletteDrag);
    rouletteContainer.addEventListener('touchstart', handleRouletteDrag, { passive: false });


    // Filtros
    minPriceFilter.addEventListener('input', applyFilters);
    maxPriceFilter.addEventListener('input', applyFilters);

    // Ordenação
    sortPriceDiv.addEventListener('click', function() {
        sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        this.textContent = sortOrder === 'desc' ? 'Preço do maior para o menor' : 'Preço do menor para o maior';
        applyFilters();
    });
}

function updateChanceRange() {
    // Limita o range de 1% a 80%
    chanceRange.min = 1;
    chanceRange.max = 80;
    chanceRange.value = Math.max(1, Math.min(80, currentChance));
}

function updateChanceDisplay() {
    resultPercent.textContent = `${currentChance.toFixed(2)}%`;
}

function updateRouletteDisplay() {
    roulettePercent.textContent = `${currentChance.toFixed(2)}%`;

    const progressCircle = document.querySelector('.roulette-progress');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (currentChance / 100) * circumference;

    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = offset;
}

function updatePriceCalculation() {
    if (selectedSnack) {
        const calculatedPrice = (selectedSnack.price * currentChance / 100);
        priceInput.value = calculatedPrice.toFixed(2);
        updatePreviewInfo();
    }
}

function updatePreviewInfo() {
    if (selectedSnack) {
        const inputPrice = parseFloat(priceInput.value) || 0;
        const multiplier = selectedSnack.price / Math.max(inputPrice, 0.01);

        previewPrice.textContent = `R$${inputPrice.toFixed(2)}`;
        previewMultiplier.textContent = `x${multiplier.toFixed(2)}`;
    }
}

function selectSnack(snack) {
    selectedSnack = snack;

    // Atualiza preview
    previewImage.style.backgroundImage = `url('${snack.image}')`;
    previewText.textContent = snack.name;

    // Calcula preço baseado na chance atual
    updatePriceCalculation();

    // Habilita o botão da roleta se a chance for maior que 0
    updateSpinButton();

    // Marca o card como selecionado
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-snack-id="${snack.id}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
}

function resetSelection() {
    selectedSnack = null;
    currentChance = 1;

    // Reset dos controles
    chanceRange.value = 1;
    priceInput.value = 0;
    updateChanceDisplay();
    updateRouletteDisplay();

    // Reset do preview
    previewImage.style.backgroundImage = '';
    previewText.textContent = 'Selecione um Rango abaixo para começar';
    previewPrice.textContent = 'R$0,00';
    previewMultiplier.textContent = 'x0,00';

    // Reset da seleção
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Desabilita o botão da roleta
    selectRangeBtn.textContent = 'Selecionar Rango';
    selectRangeBtn.disabled = true;
}

function spinRoulette() {
    if (isSpinning || !selectedSnack) return;

    isSpinning = true;
    selectRangeBtn.disabled = true;
    selectRangeBtn.textContent = 'Girando...';

    // Desabilita os controles durante a animação
    chanceRange.disabled = true;
    priceInput.disabled = true;
    shortcutButtons.forEach(btn => btn.disabled = true);
    rouletteContainer.style.pointerEvents = 'none';

    // Animação da roleta
    const rouletteArrow = document.querySelector('.roulette-arrow');
    const spins = 5 + Math.random() * 3; // 5-8 voltas completas
    const finalAngle = Math.random() * 360; // Ângulo final aleatório
    const totalRotation = (spins * 360) + finalAngle;

    // Reseta a transição e posição antes de girar
    rouletteArrow.style.transition = 'none';
    rouletteArrow.style.transform = 'rotate(0deg)';
    
    // Força o reflow para garantir que a transição será aplicada
    rouletteArrow.offsetHeight;
    
    // Aplica a transição e gira
    rouletteArrow.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    rouletteArrow.style.transform = `rotate(${totalRotation}deg)`;

    // função utilitária para extrair graus da matrix CSS
    function getRotationDegrees(el) {
        const st = window.getComputedStyle(el);
        const tr = st.getPropertyValue('transform') || st.transform;
        if (!tr || tr === 'none') return 0;
        const values = tr.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        const angle = Math.atan2(b, a) * (180 / Math.PI);
        return angle; // pode ser negativo
    }

    const chanceAngle = (currentChance / 100) * 360;
    const epsilon = 0.5; // tolerância para precisão

    // Handler que será chamado quando a transição terminar
    let finished = false;
    function onTransitionEnd(evt) {
        // garantir que seja a propriedade transform
        if (evt.propertyName && evt.propertyName.indexOf('transform') === -1) return;
        if (finished) return;
        finished = true;

        // pega o ângulo efetivo aplicado visualmente (em graus)
        const computedDeg = getRotationDegrees(rouletteArrow);
        const normalized = (computedDeg % 360 + 360) % 360;

        // Usar normalized diretamente (0 = topo, sentido horário)
        const landedAngle = normalized;

        const won = landedAngle <= (chanceAngle + epsilon);

        // cleanup
        rouletteArrow.removeEventListener('transitionend', onTransitionEnd);
        clearTimeout(fallbackTimer);

        showResult(won);

        // Reset após mostrar resultado
        setTimeout(() => {
            isSpinning = false;
            updateSpinButton();
            
            // Habilita os controles novamente
            chanceRange.disabled = false;
            priceInput.disabled = false;
            shortcutButtons.forEach(btn => btn.disabled = false);
            rouletteContainer.style.pointerEvents = 'auto';

            // Reseta a seta para a posição inicial
            rouletteArrow.style.transition = 'transform 0.5s ease';
            rouletteArrow.style.transform = 'rotate(0deg)';
        }, 2000);
    }

    // fallback caso transitionend não dispare
    const fallbackTimer = setTimeout(() => {
        if (finished) return;
        finished = true;

        const computedDeg = getRotationDegrees(rouletteArrow);
        const normalized = (computedDeg % 360 + 360) % 360;
        const landedAngle = normalized;
        const won = landedAngle <= (chanceAngle + epsilon);

        rouletteArrow.removeEventListener('transitionend', onTransitionEnd);
        showResult(won);

        setTimeout(() => {
            isSpinning = false;
            updateSpinButton();
            rouletteArrow.style.transition = 'transform 0.5s ease';
            rouletteArrow.style.transform = 'rotate(0deg)';
        }, 2000);
    }, 3600); // pouco acima dos 3s da animação

    rouletteArrow.addEventListener('transitionend', onTransitionEnd);
}

function showResult(won) {
    if (won) {
        // Primeira explosão de confete
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d62727ff', '#d6cb27', '#ffffff']
        });

        // Segunda explosão de confete após pequeno delay
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 }
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 }
            });
        }, 150);

        selectRangeBtn.textContent = `Parabéns! Ganhou por R$${(selectedSnack.price * currentChance / 100).toFixed(2)}`;
        selectRangeBtn.style.backgroundColor = '#49762bff';
    } else {
        selectRangeBtn.textContent = 'Não foi dessa vez!';
        selectRangeBtn.style.backgroundColor = '#3f2020ff';
    }

    // Resetar o estilo do botão e reativar após delay
    setTimeout(() => {
        selectRangeBtn.style.backgroundColor = '';
        selectRangeBtn.disabled = false;
        updateSpinButton();
    }, 2000);
}

function handleRouletteDrag(e) {
    e.preventDefault();
    
    function onMove(moveEvent) {
        const rect = rouletteContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        angle += 90; // Offset to start from top
        if (angle < 0) {
            angle += 360;
        }

        let newChance = (angle / 360) * 100;
        currentChance = Math.max(1, Math.min(80, newChance));

        chanceRange.value = currentChance;
        updateChanceDisplay();
        updateRouletteDisplay();
        updatePriceCalculation();
        updateSpinButton();
    }

    function onEnd() {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
}

function updateSpinButton() {
    if (selectedSnack && currentChance > 0) {
        selectRangeBtn.textContent = `Girar por R$${(selectedSnack.price * currentChance / 100).toFixed(2)}`;
        selectRangeBtn.disabled = false;
    } else {
        selectRangeBtn.textContent = 'Selecionar Rango';
        selectRangeBtn.disabled = true;
    }
}

function applyFilters() {
    const minPrice = parseFloat(minPriceFilter.value) || 0;
    const maxPrice = parseFloat(maxPriceFilter.value) || Infinity;

    // Filtrar por preço
    filteredSnacks = snacks.filter(snack => 
        snack.price >= minPrice && snack.price <= maxPrice
    );

    // Ordenar
    filteredSnacks.sort((a, b) => {
        if (sortOrder === 'desc') {
            return b.price - a.price;
        } else {
            return a.price - b.price;
        }
    });

    renderProducts();
}

function renderProducts() {
    productsContainer.innerHTML = '';

    filteredSnacks.forEach(snack => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-snack-id', snack.id);
        card.innerHTML = `
            <img src="${snack.image}" alt="${snack.name}">
            <div class="product-name">${snack.name}</div>
            <div class="product-price">R$${snack.price.toFixed(2)}</div>
        `;

        card.addEventListener('click', () => selectSnack(snack));
        productsContainer.appendChild(card);
    });
}
