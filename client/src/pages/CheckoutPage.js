import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { OrderContext } from "../utils/OrderProvider";

function CheckoutPage() {
  const { state, dispatch } = useContext(OrderContext);

  let [items, setItems] = useState([]);
  let [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/order/${state.orderID}`);
        setItems(res.data.items);
      } catch (error) {
        setError("no items in cart");
      }
    })();

    return () =>
      (async () => {
        try {
          const res = await axios.get(`/order/${state.orderID}`);
          setItems(res.data.items);
        } catch (error) {
          setError("no items in cart");
        }
      })();
  }, [state.orderID]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h3 style={{ padding: "2rem" }}>You have ordered</h3>
        <div>order id: {state.orderID}</div>
      </div>
      {items && (
        <div
          style={{
            maxWidth: 950,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {items.map((item) => (
            <section
              key={item._id}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: "2rem",
                alignItems: "center",
                borderBottom: "1px solid rgb(225,225,225)",
              }}
            >
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
                  className="remove-btn"
                  onClick={async () => {
                    await axios.delete(`/order/${state.orderID}/${item._id}`);

                    dispatch({ type: "remove_item", payload: item._id });
                    setItems(items.filter((itm) => itm._id !== item._id));

                    const orderData = JSON.parse(
                      localStorage.getItem("order_data")
                    );

                    localStorage.setItem(
                      "order_data",
                      JSON.stringify({
                        order_id: orderData.order_id,
                        items: orderData.items.filter(
                          (itm) => itm !== item._id
                        ),
                      })
                    );
                  }}
                >
                  remove
                </button>
              </div>
              <div>
                <img
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height="auto"
                />
              </div>
            </section>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            {state.orderID ? (
              <button
                className="remove-btn"
                onClick={async () => {
                  await axios.delete(`/order/${state.orderID}`).then(() => {
                    navigate("/", { replace: true });
                    localStorage.removeItem("order_data");
                    setItems([]);
                    dispatch({ type: "order_success" });
                  });
                }}
              >
                {state.items.length > 0 ? "Place order" : "Remove order"}
              </button>
            ) : (
              <div style={{ display: "none" }} />
            )}
          </div>
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
}

export default CheckoutPage;
