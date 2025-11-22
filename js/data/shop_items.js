export const SHOP_ITEMS = [
    // Seeds
    {
        id: 'seed_ginger',
        type: 'seed',
        itemId: 'herb_001', // Ginger
        name: '姜种子',
        description: '种植可得姜。',
        price: 50,
        icon: '🌱'
    },
    {
        id: 'seed_monkshood',
        type: 'seed',
        itemId: 'herb_002', // Monkshood (Fuzi)
        name: '附子种子',
        description: '种植可得附子。',
        price: 80,
        icon: '🌱'
    },
    {
        id: 'seed_coptis',
        type: 'seed',
        itemId: 'herb_004', // Coptis (Huanglian)
        name: '黄连种子',
        description: '种植可得黄连。',
        price: 80,
        icon: '🌱'
    },
    {
        id: 'seed_gypsum',
        type: 'seed',
        itemId: 'herb_005', // Gypsum (Shigao)
        name: '石膏种子', // Logic stretch: Gypsum is a mineral, but for game consistency we "plant" it or maybe "mine" it? Let's call it seed for MVP simplicity or "Source".
        description: '种植可得石膏。',
        price: 60,
        icon: '🪨'
    },
    {
        id: 'seed_ginseng',
        type: 'seed',
        itemId: 'herb_007', // Ginseng
        name: '人参种子',
        description: '种植可得人参。',
        price: 200,
        icon: '🌱'
    },

    // Recipes
    {
        id: 'recipe_baihu',
        type: 'recipe',
        itemId: 'recipe_002', // Bai Hu Tang
        name: '配方：白虎汤',
        description: '解锁白虎汤的制作方法。',
        price: 500,
        icon: '📜'
    },
    {
        id: 'recipe_sijunzi',
        type: 'recipe',
        itemId: 'recipe_003', // Si Jun Zi Tang
        name: '配方：四君子汤',
        description: '解锁四君子汤的制作方法。',
        price: 600,
        icon: '📜'
    },

    // Upgrades
    {
        id: 'upgrade_garden',
        type: 'upgrade',
        target: 'garden',
        name: '扩建百草园',
        description: '增加一块药田。',
        basePrice: 1000,
        priceMultiplier: 1.5, // Price increases by 50% each level
        icon: '🏡'
    },
    {
        id: 'upgrade_clinic',
        type: 'upgrade',
        target: 'clinic',
        name: '修缮大医堂',
        description: '增加最大候诊人数。',
        basePrice: 800,
        priceMultiplier: 1.2,
        icon: '🏥'
    }
];
