import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipes } from '../lib/RecipesContext';
import { useTheme } from '../lib/theme';

export default function RecipeListScreen() {
  const t = useTheme();
  const { recipes, loading } = useRecipes();
  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (favoritesOnly && !r.favorite) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [recipes, query, favoritesOnly]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color={t.primary} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchRow}>
        <View style={[styles.search, { backgroundColor: t.card, borderColor: t.border }]}>
          <Ionicons name="search" size={18} color={t.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search title, tag or ingredient"
            placeholderTextColor={t.muted}
            style={[styles.searchInput, { color: t.text }]}
            clearButtonMode="while-editing"
          />
        </View>
        <Pressable
          onPress={() => setFavoritesOnly((v) => !v)}
          style={[styles.iconBtn, { backgroundColor: t.card, borderColor: t.border }]}
          accessibilityLabel="Show favorites only"
        >
          <Ionicons name={favoritesOnly ? 'heart' : 'heart-outline'} size={20} color={t.primary} />
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: t.muted }]}>
            {recipes.length ? 'No recipes match your search.' : 'No recipes yet. Tap + to add one!'}
          </Text>
        }
      />

      <Pressable
        onPress={() => router.push('/recipe/edit')}
        style={[styles.fab, { backgroundColor: t.primary }]}
        accessibilityLabel="Add recipe"
      >
        <Ionicons name="add" size={30} color={t.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8 },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16 },
  iconBtn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  list: { padding: 16, gap: 10, paddingBottom: 100 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
