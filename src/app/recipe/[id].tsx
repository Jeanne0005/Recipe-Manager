import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRecipes } from '../../lib/RecipesContext';
import { useTheme } from '../../lib/theme';

export default function RecipeDetailScreen() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipe, deleteRecipe, toggleFavorite } = useRecipes();
  const recipe = getRecipe(id);

  if (!recipe) {
    return <Text style={[styles.missing, { color: t.muted }]}>Recipe not found.</Text>;
  }

  const confirmDelete = () => {
    const doDelete = () => {
      deleteRecipe(recipe.id);
      router.back();
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${recipe.title}"?`)) doDelete();
      return;
    }
    Alert.alert('Delete recipe', `Delete "${recipe.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: doDelete },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={8}>
                <Ionicons name={recipe.favorite ? 'heart' : 'heart-outline'} size={22} color={t.primary} />
              </Pressable>
              <Pressable
                onPress={() => router.push({ pathname: '/recipe/edit', params: { id: recipe.id } })}
                hitSlop={8}
              >
                <Ionicons name="create-outline" size={22} color={t.primary} />
              </Pressable>
              <Pressable onPress={confirmDelete} hitSlop={8}>
                <Ionicons name="trash-outline" size={22} color={t.danger} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {recipe.imageUri && <Image source={{ uri: recipe.imageUri }} style={styles.image} />}
        <Text style={[styles.title, { color: t.text }]}>{recipe.title}</Text>
        {!!recipe.description && <Text style={[styles.desc, { color: t.muted }]}>{recipe.description}</Text>}

        <View style={styles.chips}>
          {recipe.prepMinutes ? <Chip icon="time-outline" label={`${recipe.prepMinutes} min`} /> : null}
          {recipe.servings ? <Chip icon="people-outline" label={`${recipe.servings} servings`} /> : null}
          {recipe.tags.map((tag) => (
            <Chip key={tag} icon="pricetag-outline" label={tag} />
          ))}
        </View>

        <Text style={[styles.section, { color: t.text }]}>Ingredients</Text>
        {recipe.ingredients.map((ing) => (
          <View key={ing.id} style={[styles.ingRow, { borderColor: t.border }]}>
            <Text style={[styles.ingName, { color: t.text }]}>{ing.name}</Text>
            <Text style={{ color: t.muted }}>{ing.quantity}</Text>
          </View>
        ))}

        <Text style={[styles.section, { color: t.text }]}>Steps</Text>
        {recipe.steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: t.primary }]}>
              <Text style={{ color: t.onPrimary, fontWeight: '700' }}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepText, { color: t.text }]}>{step}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

function Chip({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const t = useTheme();
  return (
    <View style={[styles.chip, { backgroundColor: t.card, borderColor: t.border }]}>
      <Ionicons name={icon} size={14} color={t.muted} />
      <Text style={{ color: t.text, fontSize: 13 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  missing: { textAlign: 'center', marginTop: 40 },
  headerActions: { flexDirection: 'row', gap: 18, paddingHorizontal: 8 },
  content: { padding: 16, paddingBottom: 48 },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: 16, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  desc: { fontSize: 16, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  section: { fontSize: 20, fontWeight: '700', marginTop: 24, marginBottom: 8 },
  ingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ingName: { fontSize: 16, flex: 1 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  stepNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepText: { flex: 1, fontSize: 16, lineHeight: 23 },
});
