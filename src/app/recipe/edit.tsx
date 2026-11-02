import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { newId } from '../../lib/id';
import { useRecipes } from '../../lib/RecipesContext';
import { Theme, useTheme } from '../../lib/theme';
import { Ingredient } from '../../lib/types';

export default function EditRecipeScreen() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getRecipe, addRecipe, updateRecipe } = useRecipes();
  const existing = id ? getRecipe(id) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [prepMinutes, setPrepMinutes] = useState(existing?.prepMinutes?.toString() ?? '');
  const [servings, setServings] = useState(existing?.servings?.toString() ?? '');
  const [tags, setTags] = useState(existing?.tags.join(', ') ?? '');
  const [imageUri, setImageUri] = useState(existing?.imageUri);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    existing?.ingredients.length ? existing.ingredients : [{ id: newId(), name: '', quantity: '' }],
  );
  const [steps, setSteps] = useState<string[]>(existing?.steps.length ? existing.steps : ['']);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const save = () => {
    if (!title.trim()) {
      setError('Please give your recipe a title.');
      return;
    }
    const toNumber = (s: string) => {
      const n = parseInt(s, 10);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    };
    const data = {
      title: title.trim(),
      description: description.trim(),
      prepMinutes: toNumber(prepMinutes),
      servings: toNumber(servings),
      tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      imageUri,
      ingredients: ingredients
        .map((i) => ({ ...i, name: i.name.trim(), quantity: i.quantity.trim() }))
        .filter((i) => i.name),
      steps: steps.map((s) => s.trim()).filter(Boolean),
    };
    if (existing) {
      updateRecipe(existing.id, data);
      router.back();
    } else {
      const created = addRecipe(data);
      router.replace({ pathname: '/recipe/[id]', params: { id: created.id } });
    }
  };

  const updateIngredient = (idx: number, patch: Partial<Ingredient>) =>
    setIngredients((prev) => prev.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing)));

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          title: existing ? 'Edit Recipe' : 'New Recipe',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8} style={{ paddingHorizontal: 8 }}>
              <Text style={{ color: t.primary, fontSize: 17 }}>Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={save} hitSlop={8} style={{ paddingHorizontal: 8 }}>
              <Text style={{ color: t.primary, fontSize: 17, fontWeight: '700' }}>Save</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={pickImage} style={[styles.imageBox, { borderColor: t.border, backgroundColor: t.card }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={28} color={t.muted} />
              <Text style={{ color: t.muted }}>Add a photo</Text>
            </View>
          )}
        </Pressable>
        {imageUri && (
          <Pressable onPress={() => setImageUri(undefined)}>
            <Text style={[styles.link, { color: t.danger }]}>Remove photo</Text>
          </Pressable>
        )}

        <Field label="Title" t={t}>
          <Input t={t} value={title} onChangeText={(v) => { setTitle(v); setError(''); }} placeholder="e.g. Grandma's lasagna" />
        </Field>
        {!!error && <Text style={{ color: t.danger }}>{error}</Text>}

        <Field label="Description" t={t}>
          <Input t={t} value={description} onChangeText={setDescription} placeholder="Optional" multiline />
        </Field>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="Prep time (min)" t={t}>
              <Input t={t} value={prepMinutes} onChangeText={setPrepMinutes} keyboardType="number-pad" />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Servings" t={t}>
              <Input t={t} value={servings} onChangeText={setServings} keyboardType="number-pad" />
            </Field>
          </View>
        </View>

        <Field label="Tags (comma separated)" t={t}>
          <Input t={t} value={tags} onChangeText={setTags} placeholder="dinner, vegetarian" autoCapitalize="none" />
        </Field>

        <Text style={[styles.section, { color: t.text }]}>Ingredients</Text>
        {ingredients.map((ing, idx) => (
          <View key={ing.id} style={styles.row}>
            <Input t={t} style={{ flex: 2 }} value={ing.name} onChangeText={(v) => updateIngredient(idx, { name: v })} placeholder="Ingredient" />
            <Input t={t} style={{ flex: 1 }} value={ing.quantity} onChangeText={(v) => updateIngredient(idx, { quantity: v })} placeholder="Qty" />
            <RemoveButton t={t} onPress={() => setIngredients((prev) => prev.filter((_, i) => i !== idx))} />
          </View>
        ))}
        <AddButton t={t} label="Add ingredient" onPress={() => setIngredients((prev) => [...prev, { id: newId(), name: '', quantity: '' }])} />

        <Text style={[styles.section, { color: t.text }]}>Steps</Text>
        {steps.map((step, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={[styles.stepNum, { color: t.muted }]}>{idx + 1}.</Text>
            <Input
              t={t}
              style={{ flex: 1 }}
              value={step}
              onChangeText={(v) => setSteps((prev) => prev.map((s, i) => (i === idx ? v : s)))}
              placeholder="Describe this step"
              multiline
            />
            <RemoveButton t={t} onPress={() => setSteps((prev) => prev.filter((_, i) => i !== idx))} />
          </View>
        ))}
        <AddButton t={t} label="Add step" onPress={() => setSteps((prev) => [...prev, ''])} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, t, children }: { label: string; t: Theme; children: ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.label, { color: t.muted }]}>{label}</Text>
      {children}
    </View>
  );
}

function Input({ t, style, ...props }: TextInputProps & { t: Theme }) {
  return (
    <TextInput
      placeholderTextColor={t.muted}
      {...props}
      style={[styles.input, { color: t.text, backgroundColor: t.card, borderColor: t.border }, style]}
    />
  );
}

function AddButton({ t, label, onPress }: { t: Theme; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.addBtn}>
      <Ionicons name="add-circle-outline" size={20} color={t.primary} />
      <Text style={{ color: t.primary, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

function RemoveButton({ t, onPress }: { t: Theme; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.removeBtn} accessibilityLabel="Remove">
      <Ionicons name="close-circle" size={22} color={t.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 60 },
  imageBox: {
    aspectRatio: 4 / 3,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  link: { textAlign: 'center', fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minWidth: 0,
  },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  section: { fontSize: 20, fontWeight: '700', marginTop: 10 },
  stepNum: { width: 22, fontSize: 16, fontWeight: '600' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  removeBtn: { padding: 2 },
});
