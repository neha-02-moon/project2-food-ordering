import { useContext } from "react";
import { OrderContext } from "../utils/OrderProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

/*
  here we've used react router to move between pages
  so basically react router doesn't query any server. it takes the route and maps it to the desired page
  in the frontend itself.

  if we press a link in a site, the browser gets reloaded. but using react router, the server doesn't get reloaded.
*/

function Header() {
  // this uses the order_context from the order_context context
  const { state, dispatch } = useContext(OrderContext);

  // this uses the navigation hook of react router
  const navigate = useNavigate();

  // to acces the location parameters of the route path we've used this hook
  const location = useLocation();

  return (
    <header className="app-header">
      <div>Food Ordering Portal</div>

      {state.orderID ? (
        <Link to="/checkout">
          <img src={"/assets/cart.svg"} alt="" width={22} height={22} />

          <span>{state.items.length}</span>
        </Link>
      ) : (
        <button
          disabled={
            location.pathname === "/checkout" || state.items.length === 0
          }
          onClick={async () => {
            if (state.items)
              await axios
                .post("/order", { items: state.items })
                .then(({ data: { orderId } }) => {
                  if (orderId) {
                    localStorage.setItem(
                      "order_data",
                      JSON.stringify({
                        order_id: orderId,
                        items: state.items,
                      })
                    );

                    // after saving that we route to /checkout page
                    dispatch({ type: "add_order", payload: orderId });
                    navigate(`/checkout`);
                  }
                });
          }}
        >
          <img src={"/assets/cart.svg"} alt="" width={22} height={22} />

          <span>{state.items.length}</span>
        </button>
      )}
    </header>
  );
}

export default Header;
