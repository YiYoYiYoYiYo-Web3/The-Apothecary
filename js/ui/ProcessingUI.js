import { HERBS } from '../data/herbs.js';
import { RECIPES } from '../data/recipes.js';

export class ProcessingUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `<h2>⚗️ 炮制室</h2><p>选择药方进行调配</p>`;
        this.uiManager.mainContent.appendChild(container);

        RECIPES.forEach(recipe => {
            if (!recipe.unlocked) return;

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
            this.uiManager.mainContent.appendChild(card);
        });
    }

    craftPotion(recipe) {
        // Consume ingredients
        recipe.required.forEach(herbId => {
            this.game.resourceManager.removeHerb(herbId, 1);
        });
        // Add potion
        this.game.resourceManager.addPotion(recipe.id, 1);
        this.uiManager.showNotification(`成功熬制了 ${recipe.name}`);
        this.uiManager.render();
    }
}
