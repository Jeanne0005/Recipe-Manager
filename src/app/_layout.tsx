import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RecipesProvider } from '../lib/RecipesContext';
import { useTheme } from '../lib/theme';

export default function RootLayout() {
  const t = useTheme();
  return (
    <RecipesProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.bg },
          headerTintColor: t.primary,
          headerTitleStyle: { color: t.text },
          contentStyle: { backgroundColor: t.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'My Recipes' }} />
        <Stack.Screen name="recipe/[id]" options={{ title: '' }} />
        <Stack.Screen name="recipe/edit" options={{ presentation: 'modal', title: 'Recipe' }} />
      </Stack>
    </RecipesProvider>
  );
}
