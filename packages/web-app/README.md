# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### Documentation Tools
- Library => [React JS](https://react.dev/)
- Routing => [React Router](https://reactrouter.com/)
- UI Component => [React Suite](https://rsuitejs.com/components/overview/)
- Styling => [UnoCSS](https://unocss.dev/guide/)
- Icon => [Material Design Icon](https://icones.js.org/collection/mdi)
- Type => [React Typescript](https://react.dev/learn/typescript)

### Running Project in Localhost
- Clone project
```js
  git clone repo_url
```
- Make sure you have `pnpm` on your machine, or you can install with this command
```js
  npm install -g pnpm
```
- Create `.env` file and set PORT like this (free to use anything port)
```js
  VITE_PORT=5002
```
- Install dependency
```js
  pnpm install
```
- Running app
```
  pnpm run dev
```

### Example

- How to use `icon`:

```html
  <div className="i-mdi:react" />
```

- How to use `unocss`:
```html
  <div className="h-screen w-full flex flex-col justify-center items-center"></div>
```