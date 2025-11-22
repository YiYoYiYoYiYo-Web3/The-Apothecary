export class ShopUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `<h2>🏪 济世商铺</h2><p>童叟无欺，价格公道</p>`;
        this.uiManager.mainContent.appendChild(container);

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

            this.uiManager.mainContent.appendChild(section);
        });
    }

    buyItem(itemId) {
        const result = this.game.shopManager.buyItem(itemId);
        this.uiManager.showNotification(result.message);
        this.uiManager.render();
    }
}
