import { HERBS } from '../data/herbs.js';
import { RECIPES } from '../data/recipes.js';

export class InventoryUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;

        // DOM Elements
        this.inventoryDrawer = document.getElementById('inventory-drawer');
        this.inventoryHandle = document.getElementById('inventory-handle');
        this.inventoryContent = document.getElementById('inventory-content');
        this.isDrawerOpen = false;
        
        // 记录Handle的初始位置
        this.initialHandlePosition = {
            bottom: 'calc(20px + var(--nav-height) + 10px + 40px)',
            left: '50%',
            transform: 'translateX(-50%)'
        };

        // Bind Events
        if (this.inventoryHandle) {
            this.inventoryHandle.addEventListener('click', () => this.toggleDrawer());
        }
    }

    toggleDrawer() {
        this.isDrawerOpen = !this.isDrawerOpen;
        this.inventoryDrawer.classList.toggle('open', this.isDrawerOpen);
        
        // 旋转箭头
        const arrow = document.getElementById('drawer-arrow');
        if (arrow) {
            arrow.style.transform = this.isDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        
        if (this.isDrawerOpen) {
            // 打开时显示Inventory，等待DOM更新后再移动Handle
            this.inventoryDrawer.style.display = 'flex';
            this.render();
            
            // 使用requestAnimationFrame确保DOM已经渲染完成，再获取实际高度
            requestAnimationFrame(() => {
                this.moveHandleWithDrawer();
            });
        } else {
            // 关闭时等待动画完成后再隐藏Inventory，并将Handle移回初始位置
            setTimeout(() => {
                if (!this.isDrawerOpen) {
                    this.inventoryDrawer.style.display = 'none';
                }
            }, 400); // 等待CSS动画完成，与transition时长一致
            this.resetHandlePosition();
        }
    }
    
    moveHandleWithDrawer() {
        if (this.inventoryHandle && this.inventoryDrawer) {
            // 获取Inventory的实际高度
            const inventoryHeight = this.inventoryDrawer.offsetHeight;
            const handleHeight = this.inventoryHandle.offsetHeight;
            
            // 计算Handle应该移动到的位置：Inventory顶部上方Handle高度的位置
            const handleBottomPosition = `calc(20px + var(--nav-height) + 10px + ${inventoryHeight}px + 10px)`;
            
            // 将Handle移动到Inventory上方
            this.inventoryHandle.style.bottom = handleBottomPosition;
            this.inventoryHandle.style.left = '50%';
            this.inventoryHandle.style.transform = 'translateX(-50%)';
        }
    }
    
    resetHandlePosition() {
        if (this.inventoryHandle) {
            this.inventoryHandle.style.bottom = this.initialHandlePosition.bottom;
            this.inventoryHandle.style.left = this.initialHandlePosition.left;
            this.inventoryHandle.style.transform = this.initialHandlePosition.transform;
        }
    }

    render() {
        if (!this.inventoryContent) return;

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

    updateIfOpen() {
        if (this.isDrawerOpen) {
            this.render();
        }
    }
}
