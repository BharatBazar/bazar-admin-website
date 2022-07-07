import Loadable from 'react-loadable';
import Loading from '../components/Loading';

const Category = Loadable({
    loader: () => import('../container/dashboard/catalogue/Category'),
    loading: Loading,
});

const EditState = Loadable({
    loader: () => import('../container/dashboard/location/AddState'),
    loading: Loading,
});

const EditCity = Loadable({
    loader: () => import('../container/dashboard/location/AddCity'),
    loading: Loading,
});

const EditArea = Loadable({
    loader: () => import('../container/dashboard/location/AddArea'),
    loading: Loading,
});

const Pincode = Loadable({
    loader: () => import('../container/dashboard/location/AddPincode'),
    loading: Loading,
});

const SubCategory = Loadable({
    loader: () => import('../container/dashboard/catalogue/SubCategory'),
    loading: Loading,
});
const SubCategory1 = Loadable({
    loader: () => import('../container/dashboard/catalogue/SubCategory1'),
    loading: Loading,
});

// Filter drawer

const FilterValues = Loadable({
    loader: () => import('../container/dashboard/filter/FilterValues'),
    loading: Loading,
});

const Filter = Loadable({
    loader: () => import('../container/dashboard/filter/Filter'),
    loading: Loading,
});

// Product

const ProductStatus = Loadable({
    loader: () => import('../container/dashboard/product/ProductStatus'),
    loading: Loading,
});

const Product = Loadable({
    loader: () => import('../container/dashboard/product/Product'),
    loading: Loading,
});

const Error404 = Loadable({
    loader: () => import('../container/404'),
    loading: Loading,
});

export default [
    {
        path: '/catalogue/category',
        component: Category,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/catalogue/subCategory',
        component: SubCategory,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/catalogue/subCategory1',
        component: SubCategory1,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/filter/filter',
        component: Filter,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/filter/values',
        component: FilterValues,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/location/addState',
        component: EditState,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/location/addCity',
        component: EditCity,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/location/addArea',
        component: EditArea,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/location/addPincode',
        component: Pincode,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/product/status',
        component: ProductStatus,
        roles: ['admin', 'editor', 'guest'],
    },
    {
        path: '/product/edit',
        component: Product,
        roles: ['admin', 'editor', 'guest'],
    },
    { path: '/error/404', component: Error404 },
];
