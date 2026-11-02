import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from './types';

const KEY = 'recipes:v1';

export async function loadRecipes(): Promise<Recipe[] | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Recipe[]) : null;
}

export async function saveRecipes(recipes: Recipe[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(recipes));
}
