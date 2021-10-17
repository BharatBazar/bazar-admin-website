import { CommonApiResponse } from '../common.interface';

export enum productStatus {
    NOTCOMPLETED = 0,
    INVENTORY = 1,
    REJECTED = 2,
    OUTOFSTOCK = 3,
    WAITINGFORAPPROVAL = 4,
    LIVE = 5,
}

export enum classifierTypes {
    SIZE = 'size',
    COLOR = 'color',
    BRAND = 'brand',
    PATTERN = 'pattern',
    FIT = 'fit',
}

export interface IClassfier {
    name: string; // Name should be any thing like value for example for size name will be 28, for color name will be red etc..
    description: string; // Description should be meta data or for example for color colorCode will be description, for size unit like cm or inch will be description
    image: string; // Can be provided for pattern or brand etc..
    type: classifierTypes; // type is the classifier to which the document belongs
    parent: string;
    active: boolean;
}

export interface IProduct {
    brand: IClassfier;
    pattern: IClassfier[];
    fit: IClassfier;
    colors: IColor[];
    shopId: string;
    // Above field will have predifined information about the size, unit etc.
    title: string; // It can be possible that a shop sells particular brand items on their shop.
    subTitle: string;

    showPrice: boolean; // Whether dukandar wants to show price to customer or not
    productStatus: productStatus;
    rating: number;
    new: boolean; // Sometimes customer comes to shop asking what is new in the shop so this will show all the new available s
    newDeadline: Date;
    description: string; // Will be a audio as audio is better to understand in common language
    discount: [number]; // If a dukandar has decided that he wants to give special discount on particular  so discount will for each color
    discountDeadline: [Date];
    bazarAssured: boolean; // It is the flag if we have personally verified the product and it is really a good product
    createdAt: string;
    releaseDate: string;
}

export interface IProductMetaData {
    _id: string;
    createdAt: string;
    shopId: {
        shopName: string;
        city: { name: string; _id: string };
        area: { name: string; _id: string };
        owner: {
            name: string;
        };
    };
}
export interface IProductMeta extends CommonApiResponse {
    payload: IProductMetaData;
}

export interface IRProductDetails extends CommonApiResponse {
    payload: IProduct;
}

export interface IColor {
    parentId: string; // will refer to main table
    color: IClassfier; // will refer to color table
    sizes: [ISize]; // will refer to jeans size table
    photos: [string];
    includedColor: [string];
}

export enum idCreationStatus {
    'NotCreated' = 0,
    'CreatedNotProvided' = 1,
    'CreatedAndProvided' = 2,
}

export interface ISize {
    size: IClassfier; // Will refer to size table
    mrp: string;
    quantity: string;
    sp: string;
    parentId: string;
    itemId: string;
    idStatus: idCreationStatus;
}
