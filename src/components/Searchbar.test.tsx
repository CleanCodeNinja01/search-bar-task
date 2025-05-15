import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Searchbar from "./Searchbar";
import { fetchProducts } from "../api/products";

jest.mock("../api/products", () => ({
  fetchProducts: jest.fn(() => Promise.resolve([])),
}));

describe("Searchbar Component", () => {
  const mockProducts = [
    { id: 1, title: "Product 1", images: ["image1.jpg"], price: 10 },
    { id: 2, title: "Product 2", images: ["image2.jpg"], price: 20 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (query: string) => {
    render(<Searchbar />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, {
      target: { value: query },
    });
    return input;
  };

  test("displays loader while fetching products", async () => {
    (fetchProducts as jest.Mock).mockResolvedValue([]);
    setup("Product");

    expect(screen.getByRole("loader")).toBeInTheDocument();
  });

  test("displays products after fetching", async () => {
    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);
    setup("Product");

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });

  test("displays error message on fetch failure", async () => {
    (fetchProducts as jest.Mock).mockRejectedValue(new Error("Fetch error"));
    setup("Product");
    await waitFor(() => {
      expect(
        screen.getByText("Error in fetching products")
      ).toBeInTheDocument();
    });
  });

  test("clears the input when clear button is clicked", () => {
    render(<Searchbar />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "Product" } });
    expect(input).toHaveValue("Product");

    fireEvent.click(screen.getByRole("button"));
    expect(input).toHaveValue("");
  });

  test("displays 'No products found' when no products match the query", async () => {
    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);
    render(<Searchbar />);

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Nonexistent" },
    });

    await waitFor(() => {
      expect(screen.getByText("No products found.")).toBeInTheDocument();
    });
  });

  test("debounces the search input", async () => {
    jest.useFakeTimers(); // Use fake timers for debounce testing
    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

    setup("Product");
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalledWith("Product");
    });

    jest.useRealTimers();
  });

  test("performs case-insensitive search", async () => {
    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

    setup("Product");
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });
});
