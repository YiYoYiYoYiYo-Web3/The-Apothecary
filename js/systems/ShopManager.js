import { SHOP_ITEMS } from '../data/shop_items.js';
import { RECIPES } from '../data/recipes.js';

export class ShopManager {
    constructor(resourceManager, buildingManager) {
        this.resourceManager = resourceManager;
        this.buildingManager = buildingManager;
    }

    getItems() {
        return SHOP_ITEMS.map(item => {
            // Calculate dynamic price for upgrades
            if (item.type === 'upgrade') {
                const building = this.buildingManager.getBuildingInfo(item.target);
                const currentLevel = building.level;
                // Price = Base * (Multiplier ^ (Level - 1))
                const price = Math.floor(item.basePrice * Math.pow(item.priceMultiplier, currentLevel - 1));
                return { ...item, price: price, currentLevel: currentLevel };
            }

            // Check if recipe is already unlocked
            if (item.type === 'recipe') {
                const recipe = RECIPES.find(r => r.id === item.itemId);
                if (recipe && recipe.unlocked) {
                    return { ...item, purchased: true };
                }
            }

            return item;
        });
    }

    buyItem(itemId) {
        const shopItem = this.getItems().find(i => i.id === itemId);
        if (!shopItem) return { success: false, message: '商品不存在' };
        if (shopItem.purchased) return { success: false, message: '已购买该商品' };

        if (this.resourceManager.gold >= shopItem.price) {
            // Deduct Gold
            this.resourceManager.removeGold(shopItem.price);

            // Grant Item
            switch (shopItem.type) {
                case 'seed':
                    this.resourceManager.addSeed(shopItem.itemId, 1);
                    return { success: true, message: `购买成功：${shopItem.name}` };

                case 'recipe':
                    const recipe = RECIPES.find(r => r.id === shopItem.itemId);
                    if (recipe) {
                        recipe.unlocked = true;
                        return { success: true, message: `解锁配方：${recipe.name}` };
                    }
                    break;

                case 'upgrade':
                    // BuildingManager handles the actual upgrade logic (adding slots etc)
                    // But BuildingManager's upgrade method usually costs gold. 
                    // Here we already paid. We need a method in BuildingManager to "Force Upgrade" or just use the logic here.
                    // Let's use a new method in BuildingManager or modify the existing one.
                    // For now, I'll implement the effect directly here or call a "applyUpgrade" method.
                    // Actually, BuildingManager.upgradeBuilding checks cost. 
                    // Let's create a `applyUpgrade(buildingId)` in BuildingManager that doesn't check cost.
                    this.buildingManager.applyUpgrade(shopItem.target);
                    return { success: true, message: `升级成功：${shopItem.name}` };
            }
        } else {
            return { success: false, message: '金钱不足' };
        }

        return { success: false, message: '购买失败' };
    }
}
