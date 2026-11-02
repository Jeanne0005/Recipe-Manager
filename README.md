# Recipe Manager

A simple recipe app built with [Expo](https://expo.dev) (SDK 58) and Expo Router.

## Features
- Recipe list with search (by title, tag or ingredient) and a favorites filter
- Recipe detail: photo, prep time, servings, tags, ingredients, numbered steps
- Add / edit / delete recipes, with a photo from your gallery
- Everything is saved on the device (AsyncStorage)
- Light and dark mode

## Project structure
```
src/
  app/                    # screens (Expo Router: each file is a route)
    _layout.tsx           # Stack navigator + RecipesProvider
    index.tsx             # recipe list
    recipe/[id].tsx       # recipe detail
    recipe/edit.tsx       # add / edit form (?id=... to edit)
  components/RecipeCard.tsx
  lib/
    types.ts              # Recipe data model
    storage.ts            # load/save to AsyncStorage
    RecipesContext.tsx    # shared state: add/update/delete/favorite
    theme.ts              # light/dark colors
```

## Run it
```bash
npm install
npx expo start          # scan the QR code with Expo Go
npm run typecheck
```

## Working from a phone only
1. Ask Claude Code (claude.ai/code or the Claude app) for changes; they're committed to this repo.
2. To try the app on the phone, publish an update with EAS (needs a free expo.dev account):
   ```bash
   npx eas-cli@latest update --branch preview --message "..."
   ```
   then open the project's update link / QR code from expo.dev in **Expo Go**.
