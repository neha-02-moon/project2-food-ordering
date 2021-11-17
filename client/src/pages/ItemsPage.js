import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { OrderContext } from "../utils/OrderProvider";

function ItemsPage() {
  const { category } = useParams();
  let [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/${category}/items`);
      setItems(res.data);
    })();
  }, [category]);
  // dependency array -> if something changes in this field, the data will be retrieved from the api again

  const { state, dispatch } = useContext(OrderContext);
  // it's not required to place multiple orders of one item
  // if we have ordered an item, we can't order it again

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          padding: "3rem",
        }}
      >{`Tasty ${category}s`}</h3>
      <div
        style={{
          maxWidth: 950,
          width: "100%",
        }}
      >
        {items.subItems?.map((item) => (
          <section className="food-item" key={item._id}>
            <div>
              <h3>{item.name}</h3>
              <div
                style={{
                  marginTop: ".5rem",
                }}
              >{`₹ ${item.price}`}</div>
              <div
                style={{
                  marginTop: 10,
                  marginBottom: 18,
                  color: "rgb(100,100,100)",
                }}
              >
                {item.description}
              </div>
              <button
                onClick={async () => {
                  if (state.orderID && !state.items.includes(item._id)) {
                    await axios
                      .put(`/order/${state.orderID}`, {
                        itemId: item._id,
                      })
                      .then((res) => {
                        const orderData = JSON.parse(
                          localStorage.getItem("order_data")
                        );
                        if (orderData && !state.items.includes(item._id)) {
                          localStorage.setItem(
                            "order_data",
                            JSON.stringify({
                              order_id: orderData.order_id,
                              items: [item._id, ...orderData.items],
                            })
                          );
                          dispatch({ type: "add_item", payload: item._id });
                          // if we add an item we add it to the localStorage as well as dispatch it to the context provider
                          // context provider basically contains entire state of the application
                        }
                      });
                  } else dispatch({ type: "add_item", payload: item._id });
                }}
              >
                Order now
              </button>
            </div>
            <img src={item.image} alt={item.name} width={250} height="auto" />
          </section>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;
