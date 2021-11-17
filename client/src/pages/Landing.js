import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Landing() {
  let [categories, setCategories] = useState([]);

  // effect to load data everytime this route is called
  useEffect(() => {
    (async () => {
      const res = await axios.get(`/categories`);

      // then we set the data to a state using useState
      setCategories(res.data);
    })();

    // cleanup the memory we return the same function
    return () =>
      (async () => {
        const res = await axios.get(`/categories`);

        setCategories(res.data);
      })();
  }, []);

  return (
    <div className="landing-page">
      <div style={{ display: "flex", placeContent: "center", marginTop: 120 }}>
        {categories.map((c) => (
          <Link to={`/${c.name}/items`} key={c._id}>
            <section style={{ marginLeft: 20, marginRight: 20 }}>
              <img src={c.image} alt={c.name} width={200} height="auto" />
              <div>{c.name}</div>
            </section>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Landing;
