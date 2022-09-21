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

export interface ProductInterface {
    // General Properties //

    _id: string;
    /*
    Parent means which catalogue this product belongs like
    mens jeans, women shoes etc. it refer to productCatalgoue
    schema.
    */
    parentId: string;

    /*
    In which stage this product is.
    */
    status: productStatus;

    /*
    Which shop product belongs to.
    */
    shopId: string;

    /*
    What are the color available in the product.
    */
    colors: string[];

    /*
    Photo for identification of product by seller
    */
    sellerIdentificationPhoto: string;

    /*
    Best Photo will be selected out of all the photo
    provided by seller for customer identification
    */
    customerIdentificationPhoto: string;

    /*
    Future plan is to let customer provide any kind of description
    like text, image, audio, video etc.
    and then we will parse that description and provide description
    which will be shown to customer and also title accordingly.
    since its a tough task and require lot of setup it is currently
    on hold Sunday 7 August 2022
    */
    descriptionGivenByCustomer: string;
    descriptionShownToCustomer: string[];
    titleGenerated: string;

    // Product Settings //

    showPrice: boolean;
    new: boolean;
    newDeadline: Date;
    discount: [number];
    discountDeadline: Date;
    createdAt: Date;
    note: [string];
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
