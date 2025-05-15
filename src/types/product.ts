export interface Product {
    id: number;
    title: string;
    // description: string;
    price: number;
    images: string[];
}

export interface Products {
    limit: number;
    products: Product[];
    skip: number;
    total: number;
}