export type Ingredient = { id: string; name: string; quantity: string };

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  prepMinutes?: number;
  servings?: number;
  tags: string[];
  imageUri?: string;
  favorite: boolean;
  createdAt: number;
};

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'favorite'>;
