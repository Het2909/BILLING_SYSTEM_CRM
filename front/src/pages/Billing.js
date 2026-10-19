import { useState } from "react";
import ProductSearch from "../components/ProductSearch";
import CartTable from "../components/CartTable";
import BillingSummary from "../components/BillingSummary";

function Billing() {

  const [cart, setCart] = useState([]);
  const [bill, setBill] = useState(null);

  const addToCart = (product) => {
    setBill(null);

    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {

      const updatedCart = cart.map((item) =>

        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      setCart(updatedCart);

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-5">
        POS Billing
      </h1>

      <ProductSearch addToCart={addToCart} />

      <CartTable
        cart={cart}
        setCart={setCart}
      />

      <BillingSummary
        cart={cart}
        setCart={setCart}
        bill={bill}
        setBill={setBill}
      />
    </>
  );
}

export default Billing;
