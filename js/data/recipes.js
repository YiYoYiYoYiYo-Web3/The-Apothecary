export const RECIPES = [
    {
        id: 'recipe_001',
        name: '理中汤',
        main_type: 'cold', // Treats Cold patterns
        required: ['herb_001'], // Requires Ginger
        optional: ['herb_002', 'herb_007'],
        success_factor: 10,
        description: '温中祛寒，补气健脾',
        unlocked: true // Default unlocked
    },
    {
        id: 'recipe_002',
        name: '白虎汤',
        main_type: 'hot', // Treats Hot patterns
        required: ['herb_005'], // Requires Gypsum
        optional: ['herb_004', 'herb_006', 'herb_009'],
        success_factor: 10,
        description: '清热生津',
        unlocked: false
    },
    {
        id: 'recipe_003',
        name: '四君子汤',
        main_type: 'boost', // Treats Deficiency
        required: ['herb_007'], // Requires Ginseng
        optional: ['herb_008', 'herb_009', 'herb_001'],
        success_factor: 10,
        description: '益气健脾',
        unlocked: false
    }
];
