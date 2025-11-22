import { PATIENT_TEMPLATES } from '../data/patients.js';

export class PatientManager {
    constructor(resourceManager) {
        this.resourceManager = resourceManager;
        this.queue = [];
        this.maxQueueSize = 5;
        this.lastArrival = Date.now();
        this.arrivalRate = 20; // Seconds
    }

    update(deltaTime) {
        const now = Date.now();
        if ((now - this.lastArrival) / 1000 >= this.arrivalRate) {
            this.generatePatient();
            this.lastArrival = now;
        }
    }

    generatePatient() {
        if (this.queue.length >= this.maxQueueSize) return;

        const template = PATIENT_TEMPLATES[Math.floor(Math.random() * PATIENT_TEMPLATES.length)];
        const patient = {
            ...template,
            id: 'patient_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            arrivalTime: Date.now()
        };
        this.queue.push(patient);
        // Notify UI? handled by polling or event in main loop
    }

    getQueue() {
        return this.queue;
    }

    removePatient(patientId) {
        this.queue = this.queue.filter(p => p.id !== patientId);
    }

    // Treatment Logic
    treatPatient(patient, recipe) {
        if (!recipe) return { success: false, message: "没有药方" };

        let baseRate = 60;
        let bonus = 0;

        // 1. Match Type
        if (patient.predicted_type === recipe.main_type) {
            bonus += 30;
        } else {
            // Penalty for wrong type? PRD doesn't say, but implies low success.
            bonus -= 20;
        }

        // 2. Optional Herbs (Simplified: if recipe has optional herbs, add bonus)
        // In MVP, recipes are static, so we assume standard recipe quality.
        // If we had dynamic crafting, we'd check recipe quality.
        // Let's assume recipe.success_factor is the base quality bonus.
        bonus += recipe.success_factor;

        const totalRate = Math.min(100, Math.max(0, baseRate + bonus));
        const roll = Math.random() * 100;

        let result = 'fail';
        if (roll <= totalRate) {
            if (totalRate >= 90) result = 'success'; // Great success
            else result = 'partial';
        } else {
            result = 'fail';
        }

        // Apply Rewards
        if (result === 'success') {
            this.resourceManager.addGold(patient.reward.gold);
            this.resourceManager.addReputation(patient.reward.reputation);
        } else if (result === 'partial') {
            this.resourceManager.addGold(Math.floor(patient.reward.gold * 0.5));
            this.resourceManager.addReputation(Math.floor(patient.reward.reputation * 0.5));
        } else {
            // Fail: No reward, maybe reputation loss?
            this.resourceManager.addReputation(-5);
        }

        this.removePatient(patient.id);

        return {
            result: result,
            roll: roll,
            rate: totalRate,
            reward: patient.reward
        };
    }
}
