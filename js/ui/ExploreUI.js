import { HERBS } from '../data/herbs.js';

export class ExploreUI {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'panel';
        container.style.textAlign = 'center';
        container.innerHTML = `
            <h2>🗺️ 寻访名山</h2>
            <p>探索深山，寻找珍稀药材种子。</p>
            <div style="margin: 30px 0;">
                <span style="font-size: 4rem;">⛰️</span>
            </div>
        `;

        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.fontSize = '1.2em';
        btn.style.padding = '10px 30px';
        btn.textContent = '开始探索';
        btn.onclick = () => this.explore();

        container.appendChild(btn);
        this.uiManager.mainContent.appendChild(container);

        // History Panel
        const historyPanel = document.createElement('div');
        historyPanel.className = 'panel';
        historyPanel.innerHTML = `<h3>📜 探索记录</h3>`;
        const historyList = document.createElement('div');
        historyList.id = 'explore-history-list';
        historyList.style.maxHeight = '200px';
        historyList.style.overflowY = 'auto';
        historyList.style.fontSize = '0.9em';
        historyList.style.color = '#aaa';

        this.game.exploreManager.getHistory().forEach(log => {
            const item = document.createElement('div');
            item.style.borderBottom = '1px solid #444';
            item.style.padding = '5px 0';
            item.textContent = `[${log.time}] ${log.message}`;
            historyList.appendChild(item);
        });

        historyPanel.appendChild(historyList);
        this.uiManager.mainContent.appendChild(historyPanel);


    }

    explore() {
        const result = this.game.exploreManager.explore();
        this.uiManager.showNotification(result.message);

        // Selective update for history list
        const historyList = document.getElementById('explore-history-list');
        if (historyList) {
            historyList.innerHTML = '';
            this.game.exploreManager.getHistory().forEach(log => {
                const item = document.createElement('div');
                item.style.borderBottom = '1px solid #444';
                item.style.padding = '5px 0';
                item.textContent = `[${log.time}] ${log.message}`;
                historyList.appendChild(item);
            });
        } else {
            this.uiManager.render(); // Fallback
        }
    }
}
