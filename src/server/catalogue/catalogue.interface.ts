import { CommonApiResponse } from '../common.interface';

export enum categoryType {
    Category = 'Category',
    SubCategory = 'SubCategory',
    SubCategory1 = 'SubCategory1',
}

export interface IProductCatalogue {
    _id: string;
    name: string;
    description: string;
    image: string;
    categoryType: categoryType;
    subCategoryExist: boolean;
    parentRef: string | IProductCatalogue;
    childRef: string[] | IProductCatalogue[];
    activate: boolean;
}

export interface IRProductCatalogue extends CommonApiResponse {
    payload: IProductCatalogue[];
}
