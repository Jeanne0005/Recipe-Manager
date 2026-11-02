import { Recipe } from './types';

export const sampleRecipes: Recipe[] = [
  {
    id: 'sample-pancakes',
    title: 'Fluffy Pancakes',
    description: 'Quick weekend breakfast classic.',
    ingredients: [
      { id: 'i1', name: 'Flour', quantity: '200 g' },
      { id: 'i2', name: 'Milk', quantity: '300 ml' },
      { id: 'i3', name: 'Eggs', quantity: '2' },
      { id: 'i4', name: 'Sugar', quantity: '1 tbsp' },
      { id: 'i5', name: 'Baking powder', quantity: '2 tsp' },
    ],
    steps: [
      'Whisk the dry ingredients together.',
      'Add milk and eggs, whisk until just combined.',
      'Cook ladlefuls on a hot buttered pan, 2 minutes per side.',
    ],
    prepMinutes: 20,
    servings: 4,
    tags: ['breakfast', 'sweet'],
    favorite: false,
    createdAt: 0,
  },
];
