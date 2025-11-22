import { HERBS } from '../data/herbs.js';
import { RECIPES } from '../data/recipes.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.currentTab = 'clinic';

        // DOM Elements
        this.goldDisplay = document.getElementById('gold-display');
        this.herbCountDisplay = document.getElementById('herb-count-display');
        this.reputationDisplay = document.getElementById('reputation-display');
        this.mainContent = document.getElementById('main-content');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.notificationArea = document.getElementById('notification-area');

        // Inventory Drawer Elements
        this.inventoryDrawer = document.getElementById('inventory-drawer');
        this.inventoryHandle = document.getElementById('inventory-handle');
        this.inventoryContent = document.getElementById('inventory-content');
        this.isDrawerOpen = false;

        // Bind Events
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.target));
        });

        this.inventoryHandle.addEventListener('click', () => this.toggleDrawer());

        // Initial Render
        this.updateResources();
        this.render();
    }

    toggleDrawer() {
        this.isDrawerOpen = !this.isDrawerOpen;
        this.inventoryDrawer.classList.toggle('open', this.isDrawerOpen);
        if (this.isDrawerOpen) {
            this.renderInventory();
        }
    }

    renderInventory() {
        this.inventoryContent.innerHTML = '';

        // Helper to create item
        const createItem = (name, count, icon = '📦') => {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.innerHTML = `
                <span class="icon">${icon}</span>
                <span>${name}</span>
                <span class="count">x${count}</span>
            `;
            this.inventoryContent.appendChild(div);
        };

        // Seeds
        HERBS.forEach(herb => {
            const count = this.game.resourceManager.getSeedCount(herb.id);
            if (count > 0) createItem(herb.name + '种子', count, '🌱');
        });

        // Herbs
        HERBS.forEach(herb => {
            const count = this.game.resourceManager.getHerbCount(herb.id);
            if (count > 0) createItem(herb.name, count, '🌿');
        });

        // Potions
        RECIPES.forEach(recipe => {
            const count = this.game.resourceManager.getPotionCount(recipe.id);
            if (count > 0) createItem(recipe.name, count, '🧪');
        });

        if (this.inventoryContent.children.length === 0) {
            this.inventoryContent.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#666; padding:20px;">行囊空空如也...</div>';
        }
    }

    updateResources() {
        this.goldDisplay.textContent = this.game.resourceManager.gold;
        this.herbCountDisplay.textContent = this.game.resourceManager.getTotalHerbCount();
        this.reputationDisplay.textContent = this.game.resourceManager.reputation;

        // Update inventory if open
        if (this.isDrawerOpen) {
            this.renderInventory();
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        this.navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === tabName);
        });
        this.render();
    }

    render() {
        this.mainContent.innerHTML = ''; // Clear content

        switch (this.currentTab) {
            case 'garden':
                this.renderGarden();
                break;
            case 'processing':
                this.renderProcessing();
                break;
            case 'clinic':
                this.renderClinic();
                break;
            case 'explore':
                this.renderExplore();
                break;
            case 'shop':
                this.renderShop();
                break;
        }
    }

    // --- Shop UI ---
    renderShop() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `<h2>🏪 济世商铺</h2><p>童叟无欺，价格公道</p>`;
        this.mainContent.appendChild(container);

        const items = this.game.shopManager.getItems();

        // Group by type
        const categories = { 'seed': '种子', 'recipe': '配方', 'upgrade': '升级' };

        Object.keys(categories).forEach(type => {
            const typeItems = items.filter(i => i.type === type);
            if (typeItems.length === 0) return;

            const section = document.createElement('div');
            section.innerHTML = `<h3 style="margin-top:20px; border-bottom:1px solid #555;">${categories[type]}</h3>`;

            typeItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'panel';
                itemDiv.style.display = 'flex';
                itemDiv.style.justifyContent = 'space-between';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.marginBottom = '10px';

                let priceText = `${item.price} 💰`;
                let btnText = '购买';
                let disabled = false;

                if (item.purchased) {
                    priceText = '已拥有';
                    btnText = '已购';
                    disabled = true;
                } else if (this.game.resourceManager.gold < item.price) {
                    disabled = true;
                }

                itemDiv.innerHTML = `
                    <div style="display:flex; align-items:center;">
                        <span style="font-size:2em; margin-right:10px;">${item.icon}</span>
                        <div>
                            <div style="font-weight:bold;">${item.name}</div>
                            <div style="font-size:0.8em; color:#aaa;">${item.description}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="color:#ffd700; margin-bottom:5px;">${priceText}</div>
                        <button class="btn" ${disabled ? 'disabled' : ''} id="btn-buy-${item.id}">${btnText}</button>
                    </div>
                `;

                section.appendChild(itemDiv);

                // Bind click
                if (!disabled) {
                    const btn = itemDiv.querySelector(`#btn-buy-${item.id}`);
                    btn.onclick = () => this.buyItem(item.id);
                }
            });

            this.mainContent.appendChild(section);
        });
    }

    buyItem(itemId) {
        const result = this.game.shopManager.buyItem(itemId);
        this.showNotification(result.message);
        this.render();
    }

    // --- Garden UI ---
    renderGarden() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `
            <h2>🌿 百草园</h2>
            <p>等级: ${this.game.buildingManager.buildings.garden.level}</p>
        `;
        this.mainContent.appendChild(container);

        // Slots
        this.game.buildingManager.buildings.garden.slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'panel';
            slotDiv.style.borderLeft = '3px solid #ccd5ae';

            if (slot.state === 'empty') {
                slotDiv.innerHTML = `<h3>空药田</h3><p>请选择种子种植</p>`;

                // Seed Selection
                const seedList = document.createElement('div');
                let hasSeeds = false;
                HERBS.forEach(herb => {
                    const count = this.game.resourceManager.getSeedCount(herb.id);
                    if (count > 0) {
                        hasSeeds = true;
                        const btn = document.createElement('button');
                        btn.className = 'btn';
                        btn.style.margin = '2px';
                        btn.textContent = `种 ${herb.name} (${count})`;
                        btn.onclick = () => {
                            if (this.game.buildingManager.plantSeed(slot.id, herb.id)) {
                                this.render();
                            }
                        };
                        seedList.appendChild(btn);
                    }
                });

                if (!hasSeeds) {
                    seedList.innerHTML = `<span style="color:#888;">暂无种子，请去探索。</span>`;
                }
                slotDiv.appendChild(seedList);

            } else if (slot.state === 'growing') {
                const herb = HERBS.find(h => h.id === slot.seedId);
                const percent = Math.floor((slot.progress / slot.maxProgress) * 100);
                slotDiv.innerHTML = `
                    <h3>🌱 生长中: ${herb.name}</h3>
                    <div style="background:#444; height:10px; border-radius:5px; overflow:hidden; margin:10px 0;">
                        <div style="background:#ccd5ae; width:${percent}%; height:100%;"></div>
                    </div>
                    <p>剩余: ${Math.ceil(slot.maxProgress - slot.progress)}秒</p>
                    <button class="btn" style="background:#e76f51; font-size:0.8em;" onclick="window.game.uiManager.removePlant(${slot.id})">铲除</button>
                `;
            } else if (slot.state === 'mature') {
                const herb = HERBS.find(h => h.id === slot.seedId);
                slotDiv.innerHTML = `
                    <h3>🌳 成熟: ${herb.name}</h3>
                    <p>待采摘: ${slot.buffer} / ${slot.maxBuffer}</p>
                    <button class="btn" ${slot.buffer === 0 ? 'disabled' : ''} onclick="window.game.uiManager.harvestSlot(${slot.id})">采摘</button>
                    <button class="btn" style="background:#e76f51; font-size:0.8em; margin-left:10px;" onclick="window.game.uiManager.removePlant(${slot.id})">铲除</button>
                `;
            }

            this.mainContent.appendChild(slotDiv);
        });

        // Inventory View (Herbs & Seeds)
        const inventory = document.createElement('div');
        inventory.className = 'panel';
        inventory.innerHTML = `<h3>📦 库存</h3>`;

        // Seeds
        inventory.innerHTML += `<h4>种子</h4>`;
        HERBS.forEach(herb => {
            const count = this.game.resourceManager.getSeedCount(herb.id);
            if (count > 0) {
                inventory.innerHTML += `<div>${herb.name}种子: ${count}</div>`;
            }
        });

        // Herbs
        inventory.innerHTML += `<h4 style="margin-top:10px;">药材</h4>`;
        HERBS.forEach(herb => {
            const count = this.game.resourceManager.getHerbCount(herb.id);
            if (count > 0) {
                inventory.innerHTML += `<div>${herb.name}: ${count}</div>`;
            }
        });

        this.mainContent.appendChild(inventory);
    }

    harvestSlot(slotId) {
        if (this.game.buildingManager.harvestSlot(slotId)) {
            this.showNotification('采摘成功！');
            this.render();
        }
    }

    removePlant(slotId) {
        // Removed confirm for better UX and to avoid potential browser blocking issues
        this.game.buildingManager.removePlant(slotId);
        this.render();
    }

    // --- Processing UI ---
    renderProcessing() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `<h2>⚗️ 炮制室</h2><p>选择药方进行调配</p>`;
        this.mainContent.appendChild(container);

        RECIPES.forEach(recipe => {
            if (!recipe.unlocked) return; // Hide locked recipes? Or show locked? PRD says unlocked relevant.

            const card = document.createElement('div');
            card.className = 'recipe-card';

            // Check ingredients
            let canCraft = true;
            const ingredientsList = recipe.required.map(herbId => {
                const herb = HERBS.find(h => h.id === herbId);
                const has = this.game.resourceManager.getHerbCount(herbId) > 0;
                if (!has) canCraft = false;
                return `<span style="color: ${has ? '#aaddaa' : '#ff8888'}">${herb.name}</span>`;
            }).join(', ');

            card.innerHTML = `
                <h3>${recipe.name}</h3>
                <p style="font-size:0.9em; color:#ccc;">${recipe.description}</p>
                <p>所需: ${ingredientsList}</p>
                <p>库存: ${this.game.resourceManager.getPotionCount(recipe.id)}</p>
            `;

            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = '熬制';
            btn.disabled = !canCraft;
            btn.onclick = () => this.craftPotion(recipe);

            card.appendChild(btn);
            this.mainContent.appendChild(card);
        });
    }

    craftPotion(recipe) {
        // Consume ingredients
        recipe.required.forEach(herbId => {
            this.game.resourceManager.removeHerb(herbId, 1);
        });
        // Add potion
        this.game.resourceManager.addPotion(recipe.id, 1);
        this.showNotification(`成功熬制了 ${recipe.name}`);
        this.render(); // Re-render to update buttons
    }

    // --- Clinic UI ---
    renderClinic() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `<h2>🏥 大医堂</h2><p>候诊患者: ${this.game.patientManager.queue.length}</p>`;
        this.mainContent.appendChild(container);

        const queue = this.game.patientManager.getQueue();
        if (queue.length === 0) {
            const empty = document.createElement('div');
            empty.style.textAlign = 'center';
            empty.style.padding = '20px';
            empty.style.color = '#888';
            empty.textContent = '暂无病患...';
            this.mainContent.appendChild(empty);
            return;
        }

        queue.forEach(patient => {
            const card = document.createElement('div');
            card.className = 'patient-card';

            // Symptoms
            const symptoms = patient.symptoms.join('，');

            card.innerHTML = `
                <h3>病患</h3>
                <p>症状: ${symptoms}</p>
                <p>诊断: <span style="color:#d4a373;">${this.getDiagnosisHint(patient)}</span></p>
                <div class="treatment-area" id="treatment-${patient.id}"></div>
            `;

            // Potion Selection
            const treatmentArea = card.querySelector(`#treatment-${patient.id}`);

            // List available potions
            let hasPotions = false;
            RECIPES.forEach(recipe => {
                const count = this.game.resourceManager.getPotionCount(recipe.id);
                if (count > 0) {
                    hasPotions = true;
                    const btn = document.createElement('button');
                    btn.className = 'btn';
                    btn.style.marginRight = '5px';
                    btn.style.marginBottom = '5px';
                    btn.style.fontSize = '0.8em';
                    btn.textContent = `用 ${recipe.name} (${count})`;
                    btn.onclick = () => this.treatPatient(patient, recipe);
                    treatmentArea.appendChild(btn);
                }
            });

            if (!hasPotions) {
                treatmentArea.innerHTML = `<span style="color:#888; font-size:0.9em;">暂无药剂，请去炮制室。</span>`;
            }

            this.mainContent.appendChild(card);
        });
    }

    getDiagnosisHint(patient) {
        const map = { 'cold': '寒证', 'hot': '热证', 'boost': '虚证' };
        return map[patient.predicted_type] || '未知';
    }

    treatPatient(patient, recipe) {
        // Consume potion
        this.game.resourceManager.removePotion(recipe.id, 1);

        // Calculate result
        const result = this.game.patientManager.treatPatient(patient, recipe);

        let msg = '';
        if (result.result === 'success') msg = '药到病除！获得诊金与声望。';
        else if (result.result === 'partial') msg = '病情稍有好转。';
        else msg = '治疗无效，病患失望离去。';

        this.showNotification(msg);
        this.render();
    }

    // --- Explore UI ---
    renderExplore() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.style.textAlign = 'center';
        container.innerHTML = `
            <h2>🗺️ 寻访名山</h2>
            <p>探索深山，寻找珍稀药材种子。</p>
            <div style="margin: 30px 0;">
                <span style="font-size: 4rem;">⛰️</span>
            </div>
        `;

        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.fontSize = '1.2em';
        btn.style.padding = '10px 30px';
        btn.textContent = '开始探索';
        btn.onclick = () => this.explore();

        container.appendChild(btn);
        this.mainContent.appendChild(container);

        // History Panel
        const historyPanel = document.createElement('div');
        historyPanel.className = 'panel';
        historyPanel.innerHTML = `<h3>📜 探索记录</h3>`;
        const historyList = document.createElement('div');
        historyList.style.maxHeight = '200px';
        historyList.style.overflowY = 'auto';
        historyList.style.fontSize = '0.9em';
        historyList.style.color = '#aaa';

        this.game.exploreManager.getHistory().forEach(log => {
            const item = document.createElement('div');
            item.style.borderBottom = '1px solid #444';
            item.style.padding = '5px 0';
            item.textContent = `[${log.time}] ${log.message}`;
            historyList.appendChild(item);
        });

        historyPanel.appendChild(historyList);
        this.mainContent.appendChild(historyPanel);
    }

    explore() {
        const result = this.game.exploreManager.explore();
        this.showNotification(result.message);
        this.render(); // Refresh history
    }

    showNotification(msg) {
        this.game.notificationManager.show(msg);
    }
}
