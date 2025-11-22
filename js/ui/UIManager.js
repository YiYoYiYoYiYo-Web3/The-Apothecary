import { GardenUI } from './GardenUI.js';
import { ClinicUI } from './ClinicUI.js';
import { ProcessingUI } from './ProcessingUI.js';
import { ExploreUI } from './ExploreUI.js';
import { ShopUI } from './ShopUI.js';
import { InventoryUI } from './InventoryUI.js';

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

        // Initialize Sub-Managers
        this.gardenUI = new GardenUI(this);
        this.clinicUI = new ClinicUI(this);
        this.processingUI = new ProcessingUI(this);
        this.exploreUI = new ExploreUI(this);
        this.shopUI = new ShopUI(this);
        this.inventoryUI = new InventoryUI(this);

        // Bind Events
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.target));
        });

        // Initial Render
        this.updateResources();
        this.render();
    }

    updateResources() {
        this.goldDisplay.textContent = this.game.resourceManager.gold;
        this.herbCountDisplay.textContent = this.game.resourceManager.getTotalHerbCount();
        this.reputationDisplay.textContent = this.game.resourceManager.reputation;

        // Update inventory if open
        this.inventoryUI.updateIfOpen();
    }

    updateDynamicElements() {
        // Delegate to specific UIs
        if (this.currentTab === 'garden') {
            this.gardenUI.update();
        } else if (this.currentTab === 'clinic') {
            this.clinicUI.update();
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
                this.gardenUI.render();
                break;
            case 'processing':
                this.processingUI.render();
                break;
            case 'clinic':
                this.clinicUI.render();
                break;
            case 'explore':
                this.exploreUI.render();
                break;
            case 'shop':
                this.shopUI.render();
                break;
        }
    }

    showNotification(msg) {
        this.game.notificationManager.show(msg);
    }
}
