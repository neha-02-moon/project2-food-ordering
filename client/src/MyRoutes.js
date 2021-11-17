import { Routes, Route } from "react-router";
import CheckoutPage from "./pages/CheckoutPage";
import ItemsPage from "./pages/ItemsPage";
import Landing from "./pages/Landing";

const MyRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:category/items" element={<ItemsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </>
  );
};

export default MyRoutes;
