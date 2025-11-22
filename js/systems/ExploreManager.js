import { HERBS } from '../data/herbs.js';
import { RECIPES } from '../data/recipes.js';

export class ExploreManager {
    constructor(resourceManager) {
        this.resourceManager = resourceManager;
        this.history = [];
    }

    explore() {
        const roll = Math.random();
        let result = null;

        if (roll < 0.5) {
            // 50% Get Seed (Relevant to Unlocked Recipes)
            const relevantHerbs = this.getRelevantHerbs();
            if (relevantHerbs.length > 0) {
                const randomHerb = relevantHerbs[Math.floor(Math.random() * relevantHerbs.length)];
                this.resourceManager.addSeed(randomHerb.id, 1);
                result = { type: 'seed', data: randomHerb, message: `你在山中寻得了一颗 ${randomHerb.name} 的种子。` };
            } else {
                // Fallback if no relevant herbs (shouldn't happen if base recipe unlocked)
                result = { type: 'empty', data: null, message: '你转了一圈，什么也没发现。' };
            }
        } else if (roll < 0.8) {
            // 30% Event
            const goldFound = Math.floor(Math.random() * 20) + 10;
            this.resourceManager.addGold(goldFound);
            result = { type: 'event', data: goldFound, message: `你遇到了一位迷路的采药人，他送给你 ${goldFound} 文钱作为答谢。` };
        } else {
            // 20% Empty
            result = { type: 'empty', data: null, message: '你转了一圈，什么也没发现。' };
        }

        this.addToHistory(result);
        return result;
    }

    getRelevantHerbs() {
        // Find all unlocked recipes
        const unlockedRecipes = RECIPES.filter(r => r.unlocked);
        // Collect all required and optional herbs from these recipes
        const herbIds = new Set();
        unlockedRecipes.forEach(r => {
            r.required.forEach(id => herbIds.add(id));
            r.optional.forEach(id => herbIds.add(id));
        });

        // Return herb objects
        return HERBS.filter(h => herbIds.has(h.id));
    }

    addToHistory(result) {
        const timestamp = new Date().toLocaleTimeString();
        this.history.unshift({ time: timestamp, ...result });
        if (this.history.length > 20) this.history.pop();
    }

    getHistory() {
        return this.history;
    }
}
