import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Recipe } from '../lib/types';
import { useTheme } from '../lib/theme';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
      style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}
    >
        {recipe.imageUri ? (
          <Image source={{ uri: recipe.imageUri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.placeholder, { backgroundColor: t.border }]}>
            <Ionicons name="restaurant-outline" size={26} color={t.muted} />
          </View>
        )}
        <View style={styles.body}>
          <Text style={[styles.title, { color: t.text }]} numberOfLines={1}>
            {recipe.title}
          </Text>
          {!!recipe.description && (
            <Text style={{ color: t.muted }} numberOfLines={2}>
              {recipe.description}
            </Text>
          )}
          <Text style={[styles.meta, { color: t.muted }]}>
            {[
              recipe.prepMinutes ? `${recipe.prepMinutes} min` : null,
              recipe.servings ? `${recipe.servings} servings` : null,
              `${recipe.ingredients.length} ingredients`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
        {recipe.favorite && <Ionicons name="heart" size={18} color={t.primary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: { width: 64, height: 64, borderRadius: 10 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2 },
  title: { fontSize: 17, fontWeight: '600' },
  meta: { fontSize: 12, marginTop: 2 },
});
