export class ResourceManager {
    constructor() {
        this.gold = 100; // Initial gold
        this.reputation = 0;
        this.herbs = {}; // { herbId: count }
        this.seeds = {}; // { herbId: count } - Seeds correspond to herbs 1:1
        this.potions = {}; // { recipeId: count }
        this.listeners = [];
    }

    addGold(amount) {
        this.gold += amount;
        this.notify();
    }

    removeGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            this.notify();
            return true;
        }
        return false;
    }

    addReputation(amount) {
        this.reputation += amount;
        this.notify();
    }

    addHerb(herbId, amount = 1) {
        if (!this.herbs[herbId]) {
            this.herbs[herbId] = 0;
        }
        this.herbs[herbId] += amount;
        this.notify();
    }

    removeHerb(herbId, amount = 1) {
        if (this.herbs[herbId] && this.herbs[herbId] >= amount) {
            this.herbs[herbId] -= amount;
            this.notify();
            return true;
        }
        return false;
    }

    getHerbCount(herbId) {
        return this.herbs[herbId] || 0;
    }

    getTotalHerbCount() {
        return Object.values(this.herbs).reduce((a, b) => a + b, 0);
    }

    addSeed(herbId, amount = 1) {
        if (!this.seeds[herbId]) {
            this.seeds[herbId] = 0;
        }
        this.seeds[herbId] += amount;
        this.notify();
    }

    removeSeed(herbId, amount = 1) {
        if (this.seeds[herbId] && this.seeds[herbId] >= amount) {
            this.seeds[herbId] -= amount;
            this.notify();
            return true;
        }
        return false;
    }

    getSeedCount(herbId) {
        return this.seeds[herbId] || 0;
    }

    addPotion(recipeId, amount = 1) {
        if (!this.potions[recipeId]) {
            this.potions[recipeId] = 0;
        }
        this.potions[recipeId] += amount;
        this.notify();
    }

    removePotion(recipeId, amount = 1) {
        if (this.potions[recipeId] && this.potions[recipeId] >= amount) {
            this.potions[recipeId] -= amount;
            this.notify();
            return true;
        }
        return false;
    }

    getPotionCount(recipeId) {
        return this.potions[recipeId] || 0;
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb(this));
    }
}
