import axios from 'axios';
import { IProduct, IProductMeta, IRProductDetails, productStatus } from './product.interface';

export function getProductMeta(divison: string, data: Object): Promise<IProductMeta> {
    return axios.post(`/catalogue/${divison}/get/productMeta`, data);
}

export function getProduct(divison: string, id: string): Promise<IRProductDetails> {
    return axios.post(`/catalogue/${divison}/get`, { _id: id });
}

export function updateProduct(divison: string, data: Partial<IProduct>): Promise<IRProductDetails> {
    return axios.patch(`/catalogue/${divison}/update`, data);
}
