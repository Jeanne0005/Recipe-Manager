import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { newId } from './id';
import { sampleRecipes } from './sampleRecipes';
import { loadRecipes, saveRecipes } from './storage';
import { Recipe, RecipeInput } from './types';

type RecipesContextValue = {
  recipes: Recipe[];
  loading: boolean;
  getRecipe: (id: string) => Recipe | undefined;
  addRecipe: (input: RecipeInput) => Recipe;
  updateRecipe: (id: string, input: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

const RecipesContext = createContext<RecipesContextValue | null>(null);

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes()
      .then((stored) => setRecipes(stored ?? sampleRecipes))
      .catch(() => setRecipes(sampleRecipes))
      .finally(() => setLoading(false));
  }, []);

  // Persist every change once the initial load is done.
  useEffect(() => {
    if (!loading) saveRecipes(recipes).catch(console.warn);
  }, [recipes, loading]);

  const getRecipe = useCallback((id: string) => recipes.find((r) => r.id === id), [recipes]);

  const addRecipe = useCallback((input: RecipeInput) => {
    const recipe: Recipe = { ...input, id: newId(), createdAt: Date.now(), favorite: false };
    setRecipes((prev) => [recipe, ...prev]);
    return recipe;
  }, []);

  const updateRecipe = useCallback((id: string, input: Partial<Recipe>) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...input, id } : r)));
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));
  }, []);

  return (
    <RecipesContext.Provider
      value={{ recipes, loading, getRecipe, addRecipe, updateRecipe, deleteRecipe, toggleFavorite }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used inside <RecipesProvider>');
  return ctx;
}
