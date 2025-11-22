export const PATIENT_TEMPLATES = [
    {
        symptoms: ['畏寒', '面色苍白', '手足冰冷'],
        predicted_type: 'cold',
        difficulty: 1,
        reward: { gold: 50, reputation: 10 }
    },
    {
        symptoms: ['发热', '面红', '口渴', '烦躁'],
        predicted_type: 'hot',
        difficulty: 1,
        reward: { gold: 50, reputation: 10 }
    },
    {
        symptoms: ['乏力', '气短', '自汗', '食少便溏'],
        predicted_type: 'boost',
        difficulty: 1,
        reward: { gold: 60, reputation: 15 }
    },
    {
        symptoms: ['腹痛喜温', '呕吐', '不欲饮食'],
        predicted_type: 'cold',
        difficulty: 2,
        reward: { gold: 80, reputation: 20 }
    },
    {
        symptoms: ['高热不退', '大汗出', '脉洪大'],
        predicted_type: 'hot',
        difficulty: 2,
        reward: { gold: 80, reputation: 20 }
    }
];
