function CartTable({ cart, setCart }) {

  const updateQuantity = (id, type) => {

    const updatedCart = cart.map((item) => {

      if (item.id === id) {

        let quantity =
          type === "increase"
            ? item.quantity + 1
            : item.quantity - 1;

        if (quantity < 1) {
          quantity = 1;
        }

        return {
          ...item,
          quantity,
        };
      }

      return item;
    });

    setCart(updatedCart);
  };

  const removeItem = (id) => {

    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);
  };

  return (

    <div className="bg-white rounded shadow overflow-x-auto mb-5">

      <table className="w-full">

        <thead className="bg-gray-200">

          <tr>

            <th className="p-3">Product</th>

            <th className="p-3">Price</th>

            <th className="p-3">Qty</th>

            <th className="p-3">Total</th>

            <th className="p-3">Action</th>

          </tr>

        </thead>

        <tbody>

          {cart.map((item) => (

            <tr key={item.id}>

              <td style={styles.td}>
                {item.name}
              </td>

              <td style={styles.td}>
                Rs. {item.selling_price}
              </td>

              <td style={styles.td}>

                <div className="flex gap-2 items-center justify-center">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        "decrease"
                      )
                    }
                    className="bg-gray-300 px-2"
                  >
                    -
                  </button>

                  {item.quantity}

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        "increase"
                      )
                    }
                    className="bg-gray-300 px-2"
                  >
                    +
                  </button>

                </div>

              </td>

              <td style={styles.td}>

                Rs. {
                  item.quantity *
                  item.selling_price
                }

              </td>

              <td style={styles.td}>

                <button
                  onClick={() =>
                    removeItem(item.id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default CartTable;

const styles = {
  td: {
    // border: "1px solid black",
    textAlign: "center",
    padding: "10px",
  },}
