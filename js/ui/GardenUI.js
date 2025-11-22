import { HERBS } from '../data/herbs.js';

export class GardenUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `
            <h2>🌿 百草园</h2>
            <p>等级: ${this.game.buildingManager.buildings.garden.level}</p>
        `;
        this.uiManager.mainContent.appendChild(container);

        // Slots
        this.game.buildingManager.buildings.garden.slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.id = `garden-slot-${slot.id}`;
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
                                this.uiManager.render();
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
                        <div class="progress-bar-fill" style="background:#ccd5ae; width:${percent}%; height:100%; transition: width 0.3s ease;"></div>
                    </div>
                    <p class="remaining-time">剩余: ${Math.ceil(slot.maxProgress - slot.progress)}秒</p>
                    <button class="btn" style="background:#e76f51; font-size:0.8em;" onclick="window.game.uiManager.gardenUI.removePlant(${slot.id})">铲除</button>
                `;
            } else if (slot.state === 'mature') {
                const herb = HERBS.find(h => h.id === slot.seedId);
                slotDiv.innerHTML = `
                    <h3>🌳 成熟: ${herb.name}</h3>
                    <p class="buffer-count">待采摘: ${slot.buffer} / ${slot.maxBuffer}</p>
                    <button class="btn harvest-btn" ${slot.buffer === 0 ? 'disabled' : ''} onclick="window.game.uiManager.gardenUI.harvestSlot(${slot.id})">采摘</button>
                    <button class="btn" style="background:#e76f51; font-size:0.8em; margin-left:10px;" onclick="window.game.uiManager.gardenUI.removePlant(${slot.id})">铲除</button>
                `;
            }

            this.uiManager.mainContent.appendChild(slotDiv);
        });

        // Inventory View (Herbs & Seeds) - Delegated to InventoryUI if possible, but for now inline or use InventoryUI method
        // To keep it simple and modular, I'll ask InventoryUI to render here if I can, but I haven't created it yet.
        // I'll duplicate the simple inventory view for now or wait. 
        // Better: I'll create a helper in InventoryUI later. For now, I'll copy the code to keep it working.

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

        this.uiManager.mainContent.appendChild(inventory);
    }

    update() {
        const slots = this.game.buildingManager.buildings.garden.slots;
        let needsRerender = false;

        slots.forEach((slot) => {
            const slotElem = document.querySelector(`#garden-slot-${slot.id}`);
            if (!slotElem) {
                needsRerender = true;
                return;
            }

            // Check if state has changed
            const hasProgressBar = slotElem.querySelector('.progress-bar-fill');
            const hasBufferCount = slotElem.querySelector('.buffer-count');

            if (slot.state === 'growing' && !hasProgressBar) {
                needsRerender = true;
            } else if (slot.state === 'mature' && !hasBufferCount) {
                needsRerender = true;
            } else if (slot.state === 'empty' && (hasProgressBar || hasBufferCount)) {
                needsRerender = true;
            }

            // If state matches DOM, just update the values
            if (!needsRerender) {
                if (slot.state === 'growing') {
                    const percent = Math.floor((slot.progress / slot.maxProgress) * 100);
                    const progressBar = slotElem.querySelector('.progress-bar-fill');
                    const timeText = slotElem.querySelector('.remaining-time');
                    if (progressBar) progressBar.style.width = percent + '%';
                    if (timeText) timeText.textContent = `剩余: ${Math.ceil(slot.maxProgress - slot.progress)}秒`;
                } else if (slot.state === 'mature') {
                    const bufferText = slotElem.querySelector('.buffer-count');
                    const harvestBtn = slotElem.querySelector('.harvest-btn');
                    if (bufferText) bufferText.textContent = `待采摘: ${slot.buffer} / ${slot.maxBuffer}`;
                    if (harvestBtn) harvestBtn.disabled = (slot.buffer === 0);
                }
            }
        });

        if (needsRerender) {
            this.uiManager.render();
        }
    }

    harvestSlot(slotId) {
        if (this.game.buildingManager.harvestSlot(slotId)) {
            this.uiManager.showNotification('采摘成功！');
            this.uiManager.render();
        }
    }

    removePlant(slotId) {
        this.game.buildingManager.removePlant(slotId);
        this.uiManager.render();
    }
}
