import create from 'zustand';

const initialState = {
  products: [],
  selectedProductId: null,
  cart: [],
  productsInCart: 0,
  userId: null,
  user: {
    name: '',
    email: '',
    password: '',
    previousOrders: [],
    currentOrderStatus: null,
  },
  isAuthenticated: false, // New state for tracking authentication status
};

export const useProductsStore = create((set) => ({
  ...initialState,
  setProducts: (products) => set((state) => ({ ...state, products })),
  setSelectedProductId: (id) => set((state) => ({ ...state, selectedProductId: id })),
  addToCart: (product, previousCart) => set((state) => {
    const existingItemIndex = (previousCart || state.cart).findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      const updatedCart = (previousCart || state.cart).map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );

      return {
        ...state,
        cart: updatedCart,
        productsInCart: updatedCart.reduce((acc, item) => acc + item.quantity, 0),
      };
    } else {
      return {
        ...state,
        cart: [...(previousCart || state.cart), { ...product, quantity: 1 }],
        productsInCart: (previousCart || state.cart).reduce((acc, item) => acc + item.quantity, 0) + 1,
      };
    }
  }),
  removeFromCart: (productId) => set((state) => ({
    ...state,
    cart: state.cart.filter((item) => item.id !== productId),
    productsInCart: state.cart.reduce((acc, item) => acc + item.quantity, 0),
  })),
  setCart: (newCart) => set((state) => ({ ...state, cart: newCart })),
  emptyCart: () => set((state) => ({
    ...state,
    cart: [],
    productsInCart: 0,
  })),
  setUser: (userData) => set((state) => ({ ...state, user: userData, userId: userData.id, isAuthenticated: true })),
  setPreviousOrders: (orders) => set((state) => ({ ...state, user: { ...state.user, previousOrders: orders } })),
  setCurrentOrderStatus: (status) => set((state) => ({ ...state, user: { ...state.user, currentOrderStatus: status } })),
  fetchUser: async () => {
    const response = await fetch('/api/user');
    const userData = await response.json();
    set((state) => ({ ...state, user: userData, userId: userData.id, isAuthenticated: true }));
  },
  fetchPreviousOrders: async () => {
    const response = await fetch('/api/orders', {
      headers: {
        // Include authorization header based on your authentication mechanism (e.g., token)
      },
    });
    const orders = await response.json();
    set((state) => ({ ...state, user: { ...state.user, previousOrders: orders } }));
  },
  fetchCurrentOrderStatus: async () => {
    const response = await fetch('/api/orders/status', {
      headers: {
        // Include authorization header based on your authentication mechanism (e.g., token)
      },
    });
    const status = await response.json();
    set((state) => ({ ...state, user: { ...state.user, currentOrderStatus: status } }));
  },
  login: async ({ email, password }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      const previousCartResponse = await fetch(`/api/user/${userData.id}/cart`);
      const previousCart = await previousCartResponse.json();

      set((state) => ({
        ...state,
        user: userData,
        userId: userData.id,
        isAuthenticated: true,
        cart: state.cart.map((product) => state.addToCart(product, previousCart)),
      }));
    } else {
      throw new Error('Login failed');
    }
  },
  signup: async ({ name, email, password }) => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      set((state) => ({ ...state, user: userData, userId: userData.id, isAuthenticated: true }));
    } else {
      throw new Error('Signup failed');
    }
  },
}));
