import { createSlice } from "@reduxjs/toolkit";

//The cart here is client-only state,and there is no card endpoint in the backend
//It is persisted via redux-persist

//Items added to cart must be from a single Kitchen, if you try a new kitchen it must start a new Cart

//Each item mirrors the backend Menu shape enough to submit an order
//{_id,name,price,image,kitchen,quantity}

//on checkout these maps to the order payload: { menuItem:_id,quantity}

const initialState = {
  items: [],
  kitchenId: null,
};

//derive helpers kept out of state; components can also compute these
const countItem = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const cartSubTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //payload: a menu item object (must include _id,name,price,kitchen)
    addToCart: (state, action) => {
      const item = action.payload;
      const itemKitchen = item.kitchen?._id || item.kitchen;

      //switching kitchen clears the existing items
      if (state.kitchenId !== itemKitchen) {
        state.items = [];
      }
      state.kitchenId = itemKitchen;

      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          image: item.image || null,
          kitchen: itemKitchen,
          quantity: item.quantity || 1,
        });
      }
    },

    //payload-> menuItem id
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      if (state.items.length === 0) state.kitchenId = null;
    },

    //payload -> { id,quantity }
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (!item) {
        return;
      }
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i._id !== id);
        if (state.items.length === 0) {
          state.kitchenId = null;
        }
      } else {
        item.quantity = quantity;
      }
    },


    //payload -> {menuItem Id}
    incrementQuantity:(state,action)=>{
        const item=state.items.find((i)=>i._id === action.payload);
        if(!item) return;
        item.quantity+=1;
    },

    //payload -> { menuItem Id }
    decrementQuantity:(state,action)=>{
        const item=state.items.find((i)=>i._id===action.payload);
        if(!item){
            return
        }
        item.quantity-=1;
        if(item.quantity<=0){
            state.items=state.items.filter((i)=>i._id!== action.payload);
            if(state.items.length===0) state.kitchenId=null
        }
    },
    clearcart:(state)=>{
        state.items=[];
        state.kitchenId=null;
    }
  },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearcart,
}=cartSlice.actions;

//export selectors
export const selectCartItems=(state)=>state.cart.items;
export const selectCartCount=(state)=>countItem(state.cart.items);
export const selectCartSubTotal=(state)=>cartSubTotal(state.cart.items);
export const selectKitchenId=(state)=>state.cart.kitchenId;

export default cartSlice.reducer;