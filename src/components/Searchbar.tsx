import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api/products";
import { Product } from "../types/product";
import { useDebounce } from "../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

function Searchbar() {
  const [products, setProducts] = useState<Product[]>([]);
  // to reduce the number of useStates, we can combine into useReducer for future
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce<string>(query, 500);

  const clearInput = useCallback(() => setQuery(""), []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts(debouncedQuery)
      .then((response) => {
        setProducts(response);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error in fetching products");
      });
  }, [debouncedQuery]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  const filteredProducts = useMemo(() => {
    if (debouncedQuery.trim() === "") {
      return products;
    }
    return products.filter((product) =>
      product.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, products]);

  const productList = useMemo(() => {
    if (filteredProducts.length === 0) {
      return <p className="mt-4 text-gray-500">No products found.</p>;
    }
    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
            )}
            <div>
              <p className="font-medium text-gray-800 truncate">{item.title}</p>
              <p className="text-gray-600 font-semibold">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }, [filteredProducts]);

  return (
    <>
      <div className="relative w-full max-w-4xl mx-auto mt-10">
        <div className="relative flex items-center">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 text-black-400 pointer-events-none"
          />

          <input
            type="search"
            value={query}
            onChange={handleInputChange}
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-0 appearance-none"
          />

          {query && (
            <button
              onClick={clearInput}
              className="absolute right-3 text-black-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {!loading && !error && productList}
      </div>
    </>
  );
}

export default Searchbar;
