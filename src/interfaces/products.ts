import {QueryResult} from '@apollo/client';
import {Category} from './categories';
import {User} from './user';
export interface GetProductResponse {
  getProduct: Product;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  active: boolean;
  user: User;
  category: Category;
}

export interface GetProductsResponse {
  getProducts: Products;
}

export interface Products {
  products: Product[];
  count: number;
}

export type GetProductRes = QueryResult<
  GetProductResponse,
  {id: string | null}
>;

export type GetProductsRes = QueryResult<
  GetProductsResponse,
  {limit: number; skip: number}
>;

export interface CreateProductResponse {
  createProduct: Product;
}
export interface UpdateProductResponse {
  updateProduct: Product;
}
export interface DeleteProductResponse {
  deleteProduct: Product;
}
