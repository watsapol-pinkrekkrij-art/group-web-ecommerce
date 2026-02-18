import { defineStore } from "pinia";
import {ref} from "vue"

export const useCartStore = defineStore( 'cart',()=>{
    const theQty =ref(0)
    const cartId =ref(null)
    
    const updateQty=()=>{
        theQty.value++;
        console.log("QTY++ : "+theQty.value);
    };

    const setId=(id)=>{
        cartId.value=id;
    };
    
    // ⭐ เพิ่มฟังก์ชันนี้
    const clearCart=()=>{
        theQty.value = 0;
        cartId.value = null;
        console.log("Cart cleared");
    };

    // ⭐ อย่าลืม return clearCart ออกมาด้วย
    return {theQty, cartId, updateQty, setId, clearCart};
})

