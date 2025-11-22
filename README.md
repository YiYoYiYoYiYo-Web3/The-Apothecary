# 杏林存续录 (Whiteout)

## 项目简介 (Introduction)
《杏林存续录》是一款以中医为题材的模拟经营游戏（MVP版本）。玩家扮演一名在大雪封山背景下的医者，通过种植草药、炮制药剂、诊治病患以及探索深山，来维持医馆的运营并传承医术。

## 如何运行 (How to Run)
由于项目使用了 ES Modules，直接打开 `index.html` 可能会遇到跨域（CORS）错误。请使用本地服务器运行：

1.  **Python**:
    ```bash
    python -m http.server 8000
    ```
2.  **Node.js**:
    ```bash
    npx http-server
    ```
3.  在浏览器中访问: `http://localhost:8000`

## 核心系统与算法 (Core Systems & Algorithms)

### 1. 资源管理 (Resource Manager)
*   **核心逻辑**: 统一管理金钱（Gold）、声望（Reputation）、草药（Herbs）、种子（Seeds）和药剂（Potions）。
*   **观察者模式**: 实现了简单的观察者模式（Observer Pattern），当资源发生变化时，自动通知 UI 进行更新。

### 2. 百草园系统 (Garden System)
负责草药的种植与生长。
*   **生长算法**:
    *   每个药田格子（Slot）有独立的状态：`empty` (空闲) -> `growing` (生长中) -> `mature` (成熟)。
    *   **生长阶段**: 种植后，植物需要 `maxProgress` (默认10秒) 的时间成熟。
    *   **生产缓冲 (Buffer)**: 植物成熟后不会立即枯萎，而是进入“生产阶段”。
        *   每隔 5 秒，成熟的植物会自动产出 1 份草药存入缓冲区（Buffer）。
        *   缓冲区有上限（`maxBuffer`，默认5份）。达到上限后停止生产，直到玩家采摘。
    *   **采摘逻辑**: 玩家点击采摘时，获取缓冲区内的所有草药。植物保持“成熟”状态，继续下一轮生产。
    *   **铲除**: 玩家可以随时铲除植物以种植其他作物。

### 3. 大医堂系统 (Clinic System)
负责病患的生成与诊治。
*   **病患生成算法**:
    *   系统每隔 `arrivalRate` (默认20秒) 尝试生成一名新病患。
    *   最大排队人数限制为 5 人。
    *   病患属性基于 `PATIENT_TEMPLATES` 随机生成，包含症状描述和预测的证型（寒、热、虚）。
*   **治疗判定算法**:
    *   玩家选择药剂（Recipe）对病患进行治疗。
    *   **基础成功率**: 60%。
    *   **加成计算**:
        *   **对症加成**: 如果药剂的主治类型（`main_type`）与病患的证型（`predicted_type`）一致，成功率 +30%。
        *   **不对症惩罚**: 如果类型不匹配，成功率 -20%。
        *   **药方质量**: 加上药方的 `success_factor` (默认10%)。
    *   **最终结果**:
        *   `roll <= totalRate` 且 `totalRate >= 90`: **大获成功** (获得全额奖励)。
        *   `roll <= totalRate`: **病情好转** (获得50%奖励)。
        *   `roll > totalRate`: **治疗失败** (扣除少量声望)。

### 4. 探索系统 (Exploration System)
负责获取种子和随机事件。
*   **探索算法 (RNG)**:
    *   每次探索消耗一定时间（MVP中为瞬间完成）。
    *   **随机判定**:
        *   **50% 概率**: 发现种子。
            *   *智能掉落*: 系统会检查当前**已解锁**的配方，优先掉落这些配方所需的草药种子。
        *   **30% 概率**: 触发随机事件（如捡到钱）。
        *   **20% 概率**: 一无所获。
    *   **历史记录**: 系统保留最近 20 条探索记录供玩家回溯。

### 5. 炮制系统 (Processing System)
*   **逻辑**: 简单的合成系统。检查库存中是否有所需草药，消耗草药并增加对应药剂的库存。

## 项目结构 (Project Structure)
```
/
├── index.html          # 游戏入口与UI结构
├── css/
│   └── style.css       # 样式表
├── js/
│   ├── main.js         # 游戏主循环与初始化
│   ├── data/           # 静态数据配置
│   │   ├── herbs.js    # 草药定义
│   │   ├── recipes.js  # 药方定义
│   │   └── patients.js # 病患模板
│   ├── systems/        # 核心逻辑模块
│   │   ├── ResourceManager.js
│   │   ├── BuildingManager.js
│   │   ├── PatientManager.js
│   │   └── ExploreManager.js
│   └── ui/
│       └── UIManager.js # UI渲染与交互逻辑
└── README.md           # 说明文档
```
