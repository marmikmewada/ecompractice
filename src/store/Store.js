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
  categories: [],
  searchResults:null,
};

export const useProductsStore = create((set) => ({
  ...initialState,
  syncCartWithLocalStorage: () => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    set((state) => ({ ...state, cart: localCart }));
  },
  setProducts: (products) => set((state) => ({ ...state, products })),
  setSelectedProductId: (id) => set((state) => ({ ...state, selectedProductId: id })),

  addToCart: (product) => set((state) => {
    const existingProductIndex = state.cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // If the product is already in the cart, update its quantity
        const updatedCart = state.cart.map((item, index) => {
            if (index === existingProductIndex) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        return {
            ...state,
            cart: updatedCart,
            productsInCart: state.productsInCart + 1,
        };
    } else {
        // If the product is not in the cart, add it with quantity 1
        return {
            ...state,
            cart: [...state.cart, { ...product, quantity: 1 }],
            productsInCart: state.productsInCart + 1,
        };
    }
}),

// search: (searchTerm) => set((state) => {
//   const filteredProducts = state.products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return {
//     ...state,
//     searchResults: filteredProducts,
//   };
// }),

// clearSearchResults: () => set((state) => ({
//   ...state,
//   searchResults: [],
// })),

// search: (searchTerm) => set((state) => {
//   const filteredProducts = state.products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Clear search results before setting new ones
//   state.clearSearchResults(); // Call `clearSearchResults` after filtering

//   return {
//     ...state,
//     searchResults: filteredProducts,
//   };
// }),

// search: (searchTerm) => set((state) => {
//   const filteredProducts = state.products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Clear search results before setting new ones
//   set((state) => ({ ...state, searchResults: [] }));

//   return {
//     ...state,
//     searchResults: filteredProducts,
//   };
// }),
search: (searchTerm) => set((state) => {
  const filteredProducts = state.products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    ...state,
    searchResults: filteredProducts,
  };
}),


removeFromCart: (productId) => set((state) => {
  const updatedCart = state.cart.reduce((acc, item) => {
      if (item.id === productId) {
          if (item.quantity > 1) {
              acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // If quantity is 1, don't include the item in the updated cart
      } else {
          acc.push(item);
      }
      return acc;
  }, []);

  const updatedProductsInCart = updatedCart.reduce((acc, item) => acc + item.quantity, 0);

  return {
      ...state,
      cart: updatedCart,
      productsInCart: updatedProductsInCart,
  };
}),


  
  


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
  getFilteredProducts: (searchTerm, selectedCategoryId) => set((state) => {
    // Derive filtered products based on search term and category
    const filteredProducts = state.products.filter((product) => {
      const searchTermMatch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = !selectedCategoryId || product.category === selectedCategoryId;
  
      return searchTermMatch && categoryMatch;
    });
  
    // Return the filtered products as a separate state value
    return filteredProducts;
  }),
}));
