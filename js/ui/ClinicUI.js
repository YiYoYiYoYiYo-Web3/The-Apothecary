import { RECIPES } from '../data/recipes.js';

export class ClinicUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.innerHTML = `<h2>🏥 大医堂</h2><p>候诊患者: <span id="clinic-patient-count">${this.game.patientManager.queue.length}</span></p>`;
        this.uiManager.mainContent.appendChild(container);

        const queue = this.game.patientManager.getQueue();
        if (queue.length === 0) {
            const empty = document.createElement('div');
            empty.style.textAlign = 'center';
            empty.style.padding = '20px';
            empty.style.color = '#888';
            empty.textContent = '暂无病患...';
            this.uiManager.mainContent.appendChild(empty);
            return;
        }

        queue.forEach(patient => {
            const card = document.createElement('div');
            card.className = 'patient-card';

            // Symptoms
            const symptoms = patient.symptoms.join('，');

            card.innerHTML = `
                <h3>病患</h3>
                <p>症状: ${symptoms}</p>
                <p>诊断: <span style="color:#d4a373;">${this.getDiagnosisHint(patient)}</span></p>
                <div class="treatment-area" id="treatment-${patient.id}"></div>
            `;

            // Potion Selection
            const treatmentArea = card.querySelector(`#treatment-${patient.id}`);

            // List available potions
            let hasPotions = false;
            RECIPES.forEach(recipe => {
                const count = this.game.resourceManager.getPotionCount(recipe.id);
                if (count > 0) {
                    hasPotions = true;
                    const btn = document.createElement('button');
                    btn.className = 'btn';
                    btn.style.marginRight = '5px';
                    btn.style.marginBottom = '5px';
                    btn.style.fontSize = '0.8em';
                    btn.textContent = `用 ${recipe.name} (${count})`;
                    btn.onclick = () => this.treatPatient(patient, recipe);
                    treatmentArea.appendChild(btn);
                }
            });

            if (!hasPotions) {
                treatmentArea.innerHTML = `<span style="color:#888; font-size:0.9em;">暂无药剂，请去炮制室。</span>`;
            }

            this.uiManager.mainContent.appendChild(card);
        });
    }

    update() {
        const patientCountElem = document.querySelector('#clinic-patient-count');
        if (patientCountElem) {
            const currentCount = this.game.patientManager.queue.length;
            const displayedCount = parseInt(patientCountElem.textContent);
            if (currentCount !== displayedCount) {
                this.uiManager.render();
            }
        }
    }

    getDiagnosisHint(patient) {
        const map = { 'cold': '寒证', 'hot': '热证', 'boost': '虚证' };
        return map[patient.predicted_type] || '未知';
    }

    treatPatient(patient, recipe) {
        // Consume potion
        this.game.resourceManager.removePotion(recipe.id, 1);

        // Calculate result
        const result = this.game.patientManager.treatPatient(patient, recipe);

        let msg = '';
        if (result.result === 'success') msg = '药到病除！获得诊金与声望。';
        else if (result.result === 'partial') msg = '病情稍有好转。';
        else msg = '治疗无效，病患失望离去。';

        this.uiManager.showNotification(msg);
        this.uiManager.render();
    }
}
