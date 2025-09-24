document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const speedToggleButton = document.getElementById('speed-toggle');
    const openButton = document.querySelector('.btn-open');
    const openButtonContent = openButton.querySelector('.button-content');
    const demoButton = document.querySelector('.btn-side');
    const itemsTrack = document.querySelector('.items-track');
    const rouletteArea = document.querySelector('.roulette-area');
    const productsGrid = document.querySelector('.products');
    const boxTitleElement = document.querySelector('.box-title');
    const boxItemCountElement = document.querySelector('.box-item-count');
    const boxImageElement = document.querySelector('.box-image');

    // --- ELEMENTOS DO SISTEMA PROVABLY FAIR (ADICIONE-OS NO SEU HTML) ---
    const serverSeedHashElement = document.getElementById('server-seed-hash');
    const clientSeedInputElement = document.getElementById('client-seed-input');
    const nonceElement = document.getElementById('nonce');
    const lastServerSeedElement = document.getElementById('last-server-seed');

    const TOTAL_ROULETTE_ITEMS = 70;
    const WINNER_POSITION = 62;
    let isSpinning = false;
    let currentStage = 1;

    // --- LÓGICA PROVABLY FAIR ---
    let serverSeed, clientSeed, nonce;

    function generateRandomSeed() {
        return CryptoJS.lib.WordArray.random(16).toString();
    }

    function setupProvablyFair() {
        serverSeed = generateRandomSeed();
        clientSeed = clientSeedInputElement.value || generateRandomSeed();
        clientSeedInputElement.value = clientSeed;
        nonce = 0;
        
        if (serverSeedHashElement) serverSeedHashElement.textContent = CryptoJS.SHA256(serverSeed).toString();
        if (nonceElement) nonceElement.textContent = nonce;
        if (lastServerSeedElement) lastServerSeedElement.textContent = '???';
    }

    function getProvablyFairRandomGenerator(spinNonce) {
        const combinedSeed = `${serverSeed}-${clientSeed}-${spinNonce}`;
        const hmac = CryptoJS.HmacSHA512(combinedSeed, serverSeed).toString();
        
        let currentIndex = 0;

        return () => {
            if (currentIndex + 8 > hmac.length) {
                hmac = CryptoJS.SHA256(hmac).toString();
                currentIndex = 0;
            }
            const hex = hmac.substring(currentIndex, currentIndex + 8);
            currentIndex += 8;
            const decimal = parseInt(hex, 16);
            return decimal / 0x100000000;
        };
    }

    if (clientSeedInputElement) {
        clientSeedInputElement.addEventListener('change', () => {
            clientSeed = clientSeedInputElement.value;
            alert("Semente do cliente atualizada. Uma nova semente do servidor será gerada para o próximo giro.");
            setupProvablyFair(); 
        });
    }

    // --- DADOS ---
    const pacoteAtual = {
        nome: 'Pacote Rango Raro',
        qtdItens: 24,
        preco: 29.90,
        imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/palhacada.png',
        itens: [
            { id: 1, nome: 'Tasty Turbo 3 Carnes', valor: 55.00, raridade: 'lendario', chance: 0.50, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/tasty-turbo-3-carnes.png' },
            { id: 2, nome: 'Brabo Brabissimo Carne', valor: 47.00, raridade: 'lendario', chance: 1.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/brabo-brabissimo-carne.png' },
            { id: 3, nome: 'COMBO MCDONALDS', valor: 45.00, raridade: 'epico', chance: 1.50, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/combo-mcdonalds.png' },
            { id: 4, nome: 'McLanche Feliz com Hamburguer', valor: 35.00, raridade: 'epico', chance: 3.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/mclanche-feliz-com-hamburger.png' },
            { id: 5, nome: 'McChicken Duplo', valor: 34.00, raridade: 'raro', chance: 4.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/mcchicken-duplo.png' },
            { id: 6, nome: 'Triplo Burger', valor: 33.50, raridade: 'raro', chance: 4.50, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/triplo-burger.png' },
            { id: 7, nome: 'BIG MAC', valor: 30.00, raridade: 'raro', chance: 5.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/big-mac.png' },
            { id: 8, nome: 'Quarterão Com Queijo', valor: 30.00, raridade: 'raro', chance: 5.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/quarterao-com-queijo.png' },
            { id: 9, nome: 'Cheddar McMelt', valor: 28.00, raridade: 'incomum', chance: 7.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/cheddar-mcmelt.png' },
            { id: 10, nome: 'Duplo Burger Bacon', valor: 27.00, raridade: 'incomum', chance: 7.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/duplo-burger-bacon.png' },
            { id: 11, nome: 'Duplo Burger Com Queijo', valor: 27.00, raridade: 'incomum', chance: 7.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/duplo-burger-com-queijo.png' },
            { id: 12, nome: 'McCHICKEN', valor: 26.00, raridade: 'incomum', chance: 8.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/mcchicken.png' },
            { id: 13, nome: 'McFlurry', valor: 20.50, raridade: 'comum', chance: 4.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/mcflurry.png' },
            { id: 14, nome: 'McShake', valor: 20.50, raridade: 'comum', chance: 4.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/mcshake.png' },
            { id: 15, nome: 'McFritas Cheddar Bacon', valor: 19.00, raridade: 'comum', chance: 3.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/mcfritas-cheddar-bacon.png' },
            { id: 16, nome: 'McFritas Grande', valor: 19.00, raridade: 'comum', chance: 3.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/mcfritas-grande.png' },
            { id: 17, nome: 'Refri 500ml', valor: 17.50, raridade: 'comum', chance: 4.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/refri-500ml.png' },
            { id: 18, nome: 'Top Sundae', valor: 17.00, raridade: 'comum', chance: 4.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/top-sundae.png' },
            { id: 19, nome: 'Cheeseburger', valor: 15.00, raridade: 'comum', chance: 5.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/cheeseburger.png' },
            { id: 20, nome: 'Chicken McNuggets 4 unidades', valor: 13.00, raridade: 'comum', chance: 4.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/chicken-mcnuggets-4-unidades.png' },
            { id: 21, nome: 'Torta de Maçã', valor: 9.90, raridade: 'comum', chance: 2.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/torta-de-maca.png' },
            { id: 22, nome: 'Torta de Banana', valor: 9.90, raridade: 'comum', chance: 2.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/torta-de-banana.png' },
            { id: 23, nome: 'Casquinha', valor: 4.50, raridade: 'comum', chance: 3.00, imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/palhacada/casquinha.png' },
        ]
    };
    const highTiers = ['epico', 'lendario'];
    const itensComunsParaRoleta = pacoteAtual.itens.filter(item => !highTiers.includes(item.raridade)); // <-- ADICIONE ESTA LINHA
    const tiersDeProbabilidade = [];

    const calcularProbabilidadesPorTier = () => {
        const tiers = { comum: 0, incomum: 0, raro: 0, especial: 0 };
        pacoteAtual.itens.forEach(item => {
            if (highTiers.includes(item.raridade)) tiers.especial += item.chance;
            else tiers[item.raridade] += item.chance;
        });
        tiersDeProbabilidade.length = 0;
        tiersDeProbabilidade.push({ nome: 'Comum', chance: tiers.comum, raridade: 'comum', imagemUrl: '--' });
        tiersDeProbabilidade.push({ nome: 'Incomum', chance: tiers.incomum, raridade: 'incomum', imagemUrl: '--' });
        tiersDeProbabilidade.push({ nome: 'Raro', chance: tiers.raro, raridade: 'raro', imagemUrl: '--' });
        tiersDeProbabilidade.push({ nome: 'Épico ou Superior', chance: tiers.especial, raridade: 'especial', imagemUrl: 'https://cdn.jsdelivr.net/gh/eduardoamjunior/cdn-rangoraro@main/especial.png' });
    };

    const carregarInfoDoPacote = (pacote) => {
        if (boxTitleElement) boxTitleElement.textContent = pacote.nome;
        if (boxItemCountElement) boxItemCountElement.textContent = `Contém ${pacote.qtdItens} itens`;
        if (boxImageElement) boxImageElement.src = pacote.imagemUrl;
        const priceTag = openButton.querySelector('.price-tag');
        if (priceTag) priceTag.textContent = `R$ ${pacote.preco.toFixed(2).replace('.', ',')}`;
    };

    const criarProductCardHTML = (item) => `<div class="product-card" data-rarity="${item.raridade}"><div class="product-content"><span class="product-percentage">${item.chance.toFixed(2)}%</span><div class="image-container"><div class="rarity-glow"></div><img class="product-image" src="${item.imagemUrl}" alt="${item.nome}"></div><h3 class="product-name">${item.nome}</h3><p class="product-price">R$ ${item.valor.toFixed(2).replace('.', ',')}</p></div></div>`;
    const criarItemBoxHTML = (item) => `<div class="item-box" data-rarity="${item.raridade}"><img class="item-image" src="${item.imagemUrl}" alt="${item.nome}"><div class="item-info"><p class="item-name">${item.nome}</p><p class="item-price">${item.valor ? `R$ ${item.valor.toFixed(2).replace('.', ',')}` : ''}</p></div></div>`;

    const preencherGridDeProdutos = () => {
        if (!productsGrid || !pacoteAtual.itens) return;
        const itensOrdenados = [...pacoteAtual.itens].sort((a, b) => {
            const raridadeOrder = { 'lendario': 0, 'epico': 1, 'raro': 2, 'incomum': 3, 'comum': 4 };
            if (raridadeOrder[a.raridade] !== raridadeOrder[b.raridade]) return raridadeOrder[a.raridade] - raridadeOrder[b.raridade];
            return b.valor - a.valor;
        });
        productsGrid.innerHTML = itensOrdenados.map(criarProductCardHTML).join('');
    };

    const preencherRoleta = (itemVencedor = null, listaDeFundo = tiersDeProbabilidade) => {
        if (!itemsTrack) return;
        let visualItems = [];
        if (listaDeFundo.length === 0) return;

        const specialTierItem = tiersDeProbabilidade.find(t => t.raridade === 'especial');
        
        // Verificamos se esta é a animação do primeiro estágio (onde queremos injetar o item especial)
        const isFirstStageAnimation = (listaDeFundo === itensComunsParaRoleta && specialTierItem);

        // Função auxiliar para pegar o próximo item da roleta
        const getNextVisualItem = () => {
            // Se for a primeira roleta, damos uma chance de 15% de mostrar o item especial
            if (isFirstStageAnimation && Math.random() < 0.15) { 
                return specialTierItem;
            }
            // Caso contrário, pega um item normal da lista de fundo
            return listaDeFundo[Math.floor(Math.random() * listaDeFundo.length)];
        };

        // --- Montagem da lista de itens visuais ---
        if (itemVencedor) {
            // Preenche os itens antes do vencedor
            for (let i = 0; i < WINNER_POSITION; i++) {
                visualItems.push(getNextVisualItem());
            }
            // Adiciona o vencedor real na posição correta
            visualItems.push(itemVencedor);
            // Preenche o resto da roleta
            for (let i = WINNER_POSITION + 1; i < TOTAL_ROULETTE_ITEMS; i++) {
                visualItems.push(getNextVisualItem());
            }
        } else {
            // Se não houver vencedor (carregamento inicial da página), apenas preenche tudo
            for (let i = 0; i < TOTAL_ROULETTE_ITEMS; i++) {
                visualItems.push(getNextVisualItem());
            }
        }

        itemsTrack.innerHTML = visualItems.map(criarItemBoxHTML).join('');
    };

    const sortearTier = (random) => {
        let randomPercent = random() * 100;
        for (const tier of tiersDeProbabilidade) {
            randomPercent -= tier.chance;
            if (randomPercent <= 0) return tier;
        }
        return tiersDeProbabilidade[0];
    };

    const sortearItemDoTier = (tierRaridade, random) => {
        const itensDoTier = pacoteAtual.itens.filter(item => {
            if (tierRaridade === 'especial') return highTiers.includes(item.raridade);
            return item.raridade === tierRaridade;
        });
        if (itensDoTier.length === 0) return null;
        let totalChanceNoTier = itensDoTier.reduce((sum, item) => sum + item.chance, 0);
        let randomValue = random() * totalChanceNoTier;
        for (const item of itensDoTier) {
            randomValue -= item.chance;
            if (randomValue <= 0) return item;
        }
        return itensDoTier[itensDoTier.length - 1];
    };

    /**
     * Solução definitiva: Remove o script antigo do confete e o recarrega do zero
     * para garantir um estado limpo a cada execução.
     * @param {HTMLElement} targetElement O elemento DOM para o confete.
     */
    const dispararConfetes = (targetElement) => {
        if (!targetElement) return;

        // 1. Acha e remove o script antigo para garantir que não haja lixo
        const oldScript = document.querySelector('script[src*="canvas-confetti"]');
        if (oldScript) {
            oldScript.remove();
        }

        // 2. Cria um elemento de script totalmente novo
        const newScript = document.createElement('script');

        // 3. Define o que acontece QUANDO o novo script terminar de carregar
        newScript.onload = () => {
            // Agora a função `confetti` está disponível e "zerada"
            const rect = targetElement.getBoundingClientRect();
            const origin = {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight
            };

            // Dispara o confete
            confetti({
                particleCount: 200,
                spread: 100,
                origin: origin,
                startVelocity: 45,
                gravity: 1.2,
                ticks: 250,
                zIndex: 1001
            });
        };

        // 4. Aponta o novo script para o arquivo da biblioteca e o adiciona à página
        // Isso fará com que o navegador o carregue e execute
        newScript.src = '../js/lib/canvas-confetti.min.js';
        document.body.appendChild(newScript);
    };

    const animarRoleta = (itemVencedor, itemFinal, onComplete) => {
        const allItems = Array.from(itemsTrack.querySelectorAll('.item-box'));
        if (!rouletteArea || allItems.length <= WINNER_POSITION) { isSpinning = false; if (onComplete) onComplete(null); return; }
        const targetItem = allItems[WINNER_POSITION];
        const itemWidth = targetItem.offsetWidth;
        const rouletteWidth = rouletteArea.offsetWidth;
        if (itemWidth === 0 || rouletteWidth === 0) { isSpinning = false; if (onComplete) onComplete(null); return; }
        const itemCenterInTrack = targetItem.offsetLeft + (itemWidth / 2);
        const rouletteCenter = rouletteWidth / 2;
        const finalTranslateX = itemCenterInTrack - rouletteCenter;
        const offsetDirection = Math.random() < 0.5 ? -1 : 1;
        const offsetAmount = itemWidth * (Math.random() * 0.2 + 0.2);
        const nearMissTranslateX = finalTranslateX + (offsetAmount * offsetDirection);
        const isFast = speedToggleButton && speedToggleButton.classList.contains('active');
        const mainSpinDuration = isFast ? 2500 : 4800;
        const correctionDuration = isFast ? 500 : 800;
        itemsTrack.style.transition = `transform ${mainSpinDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
        itemsTrack.style.transform = `translateX(-${nearMissTranslateX}px)`;
        setTimeout(() => {
            itemsTrack.style.transition = `transform ${correctionDuration}ms cubic-bezier(0.55, 0.055, 0.675, 0.19)`;
            itemsTrack.style.transform = `translateX(-${finalTranslateX}px)`;
        }, mainSpinDuration);
        setTimeout(() => {
            const itemRevelado = itemFinal || itemVencedor;
            if (itemFinal && targetItem) {
                const img = targetItem.querySelector('.item-image');
                const name = targetItem.querySelector('.item-name');
                const price = targetItem.querySelector('.item-price');
                if (img) { img.src = itemFinal.imagemUrl; img.alt = itemFinal.nome; }
                if (name) name.textContent = itemFinal.nome;
                if (price) price.textContent = `R$ ${itemFinal.valor.toFixed(2).replace('.', ',')}`;
                targetItem.setAttribute('data-rarity', itemFinal.raridade);
            }
            targetItem.classList.add('revealed');

            if (itemRevelado && itemRevelado.valor > pacoteAtual.preco) {
                console.log(`%c[CONFIRMADO] Condição de confete atendida! Disparando a recarga da biblioteca...`, 'color: #007bff; font-weight: bold;');
                dispararConfetes(targetItem);
            }

            if (onComplete) onComplete(targetItem);
        }, mainSpinDuration + correctionDuration);
    };

    const prepararSegundoEstagio = () => {
        currentStage = 2;
        isSpinning = false;
        openButton.classList.add('special');
        if(openButtonContent) openButtonContent.innerHTML = "ABRIR ITEM ESPECIAL";
    };

    const resetarParaPrimeiroEstagio = () => {
        currentStage = 1;
        const priceTag = `<span class="price-tag">R$ ${pacoteAtual.preco.toFixed(2).replace('.',',')}</span>`;
        if(openButtonContent) openButtonContent.innerHTML = `Abrir ${priceTag}`;
        openButton.classList.remove('special');
    };

    const iniciarAbertura = (isDemo = false) => {
        if (isSpinning) return;
        isSpinning = true;

        nonce++;
        if (nonceElement) nonceElement.textContent = nonce;
        const random = getProvablyFairRandomGenerator(nonce);
        const oldServerSeed = serverSeed;

        itemsTrack.style.transition = 'opacity 0.2s ease-out';
        itemsTrack.style.opacity = 0;

        setTimeout(() => {
            let itemVencedorRoleta = null;
            let itemFinalRevelado = null;
            let needsSecondStage = false;
            let listaDeFundoParaRoleta;

            if (currentStage === 1) {
                const tierVencedor = sortearTier(random);
                listaDeFundoParaRoleta = itensComunsParaRoleta; 

                if (tierVencedor.raridade === 'especial') {
                    needsSecondStage = true;
                    itemVencedorRoleta = tiersDeProbabilidade.find(t => t.raridade === 'especial');
                    itemFinalRevelado = null;
                } else {
                    itemFinalRevelado = sortearItemDoTier(tierVencedor.raridade, random);
                    itemVencedorRoleta = itemFinalRevelado;
                }
            } else { // currentStage === 2
                // --- LÓGICA CORRIGIDA PARA A ROLETA ESPECIAL ---
                const itensEspeciais = pacoteAtual.itens.filter(item => highTiers.includes(item.raridade));
                itemFinalRevelado = sortearItemDoTier('especial', random);
                itemVencedorRoleta = itemFinalRevelado;
                listaDeFundoParaRoleta = itensEspeciais; // CORRIGIDO: Agora usa a lista SÓ com itens especiais.
            }

            preencherRoleta(itemVencedorRoleta, listaDeFundoParaRoleta);
            itemsTrack.style.transition = 'none';
            itemsTrack.style.transform = 'translateX(0)';
            itemsTrack.offsetHeight;
            itemsTrack.style.transition = 'opacity 0.2s ease-in';
            itemsTrack.style.opacity = 1;

            setTimeout(() => {
                animarRoleta(itemVencedorRoleta, itemFinalRevelado, () => {
                    if (lastServerSeedElement) lastServerSeedElement.textContent = oldServerSeed;
                    serverSeed = generateRandomSeed();
                    if (serverSeedHashElement) serverSeedHashElement.textContent = CryptoJS.SHA256(serverSeed).toString();
                    
                    if (needsSecondStage) {
                        setTimeout(prepararSegundoEstagio, 1000);
                    } else {
                        if (currentStage === 2) {
                            setTimeout(() => {
                                resetarParaPrimeiroEstagio();
                                isSpinning = false;
                            }, 1500);
                        } else {
                            isSpinning = false;
                        }
                    }
                });
            }, 100);
        }, 200);
    };
        
    if (speedToggleButton) { speedToggleButton.addEventListener('click', () => speedToggleButton.classList.toggle('active')); }
    if (openButton) { openButton.addEventListener('click', () => iniciarAbertura(false)); }
    if (demoButton) { demoButton.addEventListener('click', () => iniciarAbertura(true)); }

    calcularProbabilidadesPorTier();
    carregarInfoDoPacote(pacoteAtual);
    preencherGridDeProdutos();
    preencherRoleta(null, itensComunsParaRoleta);
    setupProvablyFair();
});