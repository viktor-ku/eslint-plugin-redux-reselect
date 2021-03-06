# eslint-plugin-redux-reselect

> Eslint plugin for reduxjs/reselect Selector library for Redux

## Install

```bash
npm i -D eslint-plugin-redux-reselect
```

**NB!** Don't forget to add `reselect` to eslint config `plugins` as well as add rules from below to your `rules`.

## Rules

Currently has a few simple rules:

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

### `redux-reselect/selector-args-type`

Enforces passing other selectors into `createSelector` function either by one `array` argument containing selectors, or by passing all of the selectors directly to a function (`args`)

You should specify either of the following options in the eslint config

1. `array`
2. `args`

e.g. `redux-reselect/selector-args-type: [1, "array"]`

### `redux-reselect/format-selector-name`

1. Selector variable name should end with `Selector`
2. Nothing like `makeSelect`, `select` or `selector` at the start is allowed

**incorrect:**

```js
const apples = createSelector();
const makeSelectBooks = createSelector();
```

**correct:**

```js
const applesSelector = createSelector();
const booksSelector = createSelector();
```
