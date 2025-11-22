import { HERBS } from '../data/herbs.js';

export class BuildingManager {
    constructor(resourceManager) {
        this.resourceManager = resourceManager;
        this.buildings = {
            garden: {
                level: 1,
                slots: [
                    { id: 0, state: 'empty', seedId: null, progress: 0, maxProgress: 10, buffer: 0, maxBuffer: 5 }
                ]
            },
            processing: { level: 1, bonus: 10 }, // Bonus %
            clinic: { level: 1, capacity: 3 }
        };
    }

    getBuildingInfo(buildingId) {
        return this.buildings[buildingId];
    }

    // Called every frame/tick
    update(deltaTime) {
        this.updateGarden(deltaTime);
    }

    updateGarden(deltaTime) {
        this.buildings.garden.slots.forEach(slot => {
            if (slot.state === 'growing') {
                slot.progress += deltaTime;
                if (slot.progress >= slot.maxProgress) {
                    slot.state = 'mature';
                    slot.progress = 0;
                    // Initial produce
                    this.produceToBuffer(slot);
                }
            } else if (slot.state === 'mature') {
                // Produce over time
                slot.progress += deltaTime;
                // Every 5 seconds produce 1 herb
                if (slot.progress >= 5) {
                    this.produceToBuffer(slot);
                    slot.progress = 0;
                }
            }
        });
    }

    produceToBuffer(slot) {
        if (slot.buffer < slot.maxBuffer) {
            slot.buffer++;
        }
    }

    plantSeed(slotId, seedId) {
        const slot = this.buildings.garden.slots.find(s => s.id === slotId);
        if (slot && slot.state === 'empty') {
            if (this.resourceManager.removeSeed(seedId, 1)) {
                slot.state = 'growing';
                slot.seedId = seedId;
                slot.progress = 0;
                slot.buffer = 0;
                // Different herbs could have different growth times
                slot.maxProgress = 10; // Fixed 10s for MVP
                return true;
            }
        }
        return false;
    }

    harvestSlot(slotId) {
        const slot = this.buildings.garden.slots.find(s => s.id === slotId);
        if (slot && slot.buffer > 0) {
            const amount = slot.buffer;
            this.resourceManager.addHerb(slot.seedId, amount);
            slot.buffer = 0;
            return true;
        }
        return false;
    }

    removePlant(slotId) {
        const slot = this.buildings.garden.slots.find(s => s.id === slotId);
        if (slot) {
            slot.state = 'empty';
            slot.seedId = null;
            slot.progress = 0;
            slot.buffer = 0;
            return true;
        }
        return false;
    }

    applyUpgrade(buildingId) {
        if (buildingId === 'garden') {
            this.buildings.garden.level++;
            // Add a new slot
            this.buildings.garden.slots.push({
                id: this.buildings.garden.slots.length,
                state: 'empty',
                seedId: null,
                progress: 0,
                maxProgress: 10,
                buffer: 0,
                maxBuffer: 5
            });
        } else if (buildingId === 'processing') {
            this.buildings.processing.level++;
            this.buildings.processing.bonus += 5; // Increase bonus by 5%
        } else if (buildingId === 'clinic') {
            this.buildings.clinic.level++;
            this.buildings.clinic.capacity += 1; // Increase capacity
        }
    }
}

