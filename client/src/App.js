import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./MyRoutes";
import Header from "./components/Header";
import OrderProvider from "./utils/OrderProvider";

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <MyRoutes />
        </div>
      </BrowserRouter>
    </OrderProvider>
  );
}

export default App;
