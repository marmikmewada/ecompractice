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
  isAuthenticated: false,
};

export const useProductsStore = create((set) => ({
  ...initialState,
  syncCartWithLocalStorage: () => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    set((state) => ({ ...state, cart: localCart }));
  },
  setProducts: (products) => set((state) => ({ ...state, products })),
  setSelectedProductId: (id) => set((state) => ({ ...state, selectedProductId: id })),
  addToCart: (product, previousCart) => set((state) => {
    const currentCart = state.cart;

    const updatedState = {
      ...state,
      ...(typeof window !== 'undefined' && {
        cart: currentCart.map((item) => state.addToCart(item, previousCart)),
      }),
    };

    localStorage.setItem('cart', JSON.stringify(updatedState.cart));

    return updatedState;
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
  
      set((state) => {
        const updatedState = {
          ...state,
          user: userData,
          userId: userData.id,
          isAuthenticated: true,
          cart: state.cart.map((product) => state.addToCart(product, previousCart)),
        };
  
        // Synchronize cart with local storage on login
        updatedState.syncCartWithLocalStorage();
  
        // Clear local storage after synchronization
        localStorage.removeItem('cart');
  
        return updatedState;
      });
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
