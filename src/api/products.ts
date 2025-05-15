import { Products } from "../types/product";

export const fetchProducts = async (query: string) => {
    const response = await fetch(
        `https://dummyjson.com/products/search?q=${query}`
    );
    const jsonResponse: Products = await response.json();
    return jsonResponse.products;
}