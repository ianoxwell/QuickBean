export const CRoutes = {
  // user / account related routes
  login: 'login',
  verify: 'verify',
  error: 'error',

  // protected routes
  dashboard: 'home', // include the historical orders for today
  kitchen: 'kitchen', // active orders
  products: 'products', // list of products
  modifiers: 'modifiers', // list of modifiers
  checkouts: 'checkouts', // checkout design and management
  settings: 'settings' // user settings
};

export const CImageUrl = 'https://img.spoonacular.com/ingredients_100x100/';
export const CImageUrlLarge = 'https://img.spoonacular.com/ingredients_500x500/';
