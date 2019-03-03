# eslint-plugin-redux-reselect

> Eslint plugin for reduxjs/reselect Selector library for Redux

## Install

```bash
npm i -D eslint-plugin-redux-reselect
```

**NB!** Don't forget to add `reselect` to eslint config `plugins` as well as add rules from below to your `rules`.

## Rules

Currently has 4 simple rules, but **more** will come shortly.

### `redux-reselect/assign-selector-to-variable`

Enforces `createSelector` result to be directly assigned to the selector function.

**incorrect:**

```js
const fooSelector = () => createSelector();
```

**correct:**

```js
const fooSelector = createSelector();
```

### `redux-reselect/name-ends-with-selector`

Enforces selector variable name to end with `Selector` in its name.

**incorrect:**

```js
const apples = createSelector();
```

**correct:**

```js
const applesSelector = createSelector();
```

### `redux-reselect/no-make-select`

Very specific rule in case you've used higher order function to wrap your selector and called it with `makeSelect` in its name.

**incorrect:**

```js
const makeSelectBooks = () => createSelector();
```

**correct:**

```js
const applesSelector = createSelector();
```

### `redux-reselect/prefer-selector-ref`

Enforces passing other selectors references into `createSelector` function

**incorrect:**

```js
const makeUsers = () => createSelector(...);
const booksSelector = createSelector(
  makeUsers(),
  ...
);
```

**correct:**

```js
const usersSelector = createSelector(...);
const booksSelector = createSelector(usersSelector, ...);
```
