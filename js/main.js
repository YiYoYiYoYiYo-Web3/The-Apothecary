import { ResourceManager } from './systems/ResourceManager.js';
import { BuildingManager } from './systems/BuildingManager.js';
import { PatientManager } from './systems/PatientManager.js';
import { ExploreManager } from './systems/ExploreManager.js';
import { ShopManager } from './systems/ShopManager.js';
import { NotificationManager } from './systems/NotificationManager.js';
import { UIManager } from './ui/UIManager.js';

class Game {
    constructor() {
        this.resourceManager = new ResourceManager();
        this.buildingManager = new BuildingManager(this.resourceManager);
        this.patientManager = new PatientManager(this.resourceManager);
        this.exploreManager = new ExploreManager(this.resourceManager);
        this.shopManager = new ShopManager(this.resourceManager, this.buildingManager);
        this.notificationManager = new NotificationManager();

        this.uiManager = null; // Initialized after DOM load

        this.lastTime = 0;
        this.loop = this.loop.bind(this);
    }

    init() {
        this.uiManager = new UIManager(this);

        // Listen for resource changes to update UI
        this.resourceManager.addListener(() => {
            if (this.uiManager) this.uiManager.updateResources();
        });

        // Start Loop
        requestAnimationFrame(this.loop);
    }

    loop(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.buildingManager.update(deltaTime);
        this.patientManager.update(deltaTime);

        // Selectively update only dynamic UI elements (progress bars, timers) without full re-render
        if (this.uiManager && (this.uiManager.currentTab === 'clinic' || this.uiManager.currentTab === 'garden')) {
            if (Math.floor(timestamp / 1000) > Math.floor((timestamp - deltaTime * 1000) / 1000)) {
                this.uiManager.updateDynamicElements();
            }
        }

        requestAnimationFrame(this.loop);
    }
}

// Start Game
const game = new Game();
game.init();
window.game = game; // For debugging
