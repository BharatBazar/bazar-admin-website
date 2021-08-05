// import { Table, Space, Button, Input, Form, Card, Tag } from 'antd';
// import React from 'react';
// import { UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
// import { RouteComponentProps } from 'react-router-dom';

// import Checkbox from 'antd/lib/checkbox/Checkbox';

// import {
//     addProductCatelogue,
//     deleteProductCatelogue,
//     updateProductCatelogue,
//     getProductCatelogue,
//     activateCatelogueItem,
// } from '../../../server/catalogue/catalogue.api';
// import { categoryType, IProductCatalogue } from '../../../server/catalogue/catalogue.interface';
// import { errorShow, success } from '../../../components/ALert';
// import { formRequiredRule } from '../../../constants';

// type LayoutType = Parameters<typeof Form>[0]['layout'];

// const columns = (onDelete, onUpdate, activate) => [
//     {
//         title: 'Category' + ' name',
//         dataIndex: 'name',
//         key: '_id' + 'City',
//         render: (text) => <a>{text}</a>,
//     },
//     {
//         title: 'Category ' + ' description',
//         dataIndex: 'description',
//         key: '_id',
//         render: (text) => <a>{text}</a>,
//     },
//     {
//         title: 'Category ' + ' image',
//         dataIndex: 'image',
//         key: '_id',
//         render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={100} width={100} />,
//     },
//     {
//         title: 'Subcategory exist ',
//         dataIndex: 'subCategoryExist',
//         key: '_id',

//         render: (text) => (text ? <CheckCircleOutlined /> : <CloseCircleOutlined />),
//     },
//     {
//         title: 'Active',
//         dataIndex: 'active',
//         width: 150,
//         key: '_id',
//         render: (value) => (
//             <div style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <Checkbox value={value} checked={value} style={{ alignSelf: 'center' }} />
//             </div>
//         ),
//     },
//     {
//         title: 'Child',
//         key: 'child',
//         dataIndex: 'child',
//         render: (child) => (
//             <span>
//                 {child.map(({ name }) => {
//                     // let color = name.length <= 5 ? 'geekblue' : name.length <= 7 ? 'volcano' : 'green';

//                     return (
//                         <Tag color={'blue'} key={name}>
//                             {name.toUpperCase()}
//                         </Tag>
//                     );
//                 })}
//             </span>
//         ),
//     },
//     {
//         title: 'Action',
//         key: 'action',
//         render: (text, record) => (
//             <Space size="middle">
//                 <Button
//                     type={'primary'}
//                     title={'Edit'}
//                     onClick={() => {
//                         onUpdate(record);
//                     }}
//                 >
//                     {'Edit'}
//                 </Button>
//                 <Button
//                     type={'primary'}
//                     title={'Active'}
//                     onClick={() => {
//                         activate(record, !text.active);
//                     }}
//                 >
//                     {text.active ? 'Deactive' : 'Active'}
//                 </Button>
//                 <Button
//                     type={'primary'}
//                     title={'Delete'}
//                     onClick={() => {
//                         onDelete(record);
//                     }}
//                     danger
//                 >
//                     {'Delete'}
//                 </Button>
//             </Space>
//         ),
//     },
// ];

// const layout = {
//     labelCol: { span: 8 },
//     wrapperCol: { span: 16 },
// };
// const tailLayout = {
//     wrapperCol: { offset: 8, span: 16 },
// };

// export interface CategoryProps extends RouteComponentProps {}

// const Category: React.FC<CategoryProps> = ({}) => {
//     const [form] = Form.useForm<Partial<IProductCatalogue>>();
//     const [loader, setLoader] = React.useState<boolean>(false);
//     const [update, setUpdate] = React.useState(null);
//     const [subCategoryExist, setSubCategoryExist] = React.useState(true);
//     const [categoryList, setCategoryList] = React.useState([]);

//     const onFinishFailed = (errorInfo: any) => {
//         console.log('Failed:', errorInfo);
//     };

//     const createCategoryListInServer = async (data) => {
//         setLoader(true);
//         try {
//             const response = await addProductCatelogue({
//                 ...data,
//                 categoryType: categoryType.Category,
//                 subCategoryExist,
//             });

//             setLoader(false);
//             if (response.payload) {
//                 success('Category' + ' created!');
//                 loadAllCategory();

//                 form.resetFields();
//             }
//         } catch (error) {
//             setLoader(false);
//             errorShow(error.message);
//         }
//     };

//     const loadAllCategory = async () => {
//         try {
//             setLoader(true);
//             const category = await getProductCatelogue({ categoryType: categoryType.Category });
//             setLoader(false);

//             setCategoryList(category.payload);
//         } catch (error) {
//             errorShow(error.message);
//             setLoader(false);
//         }
//     };

//     const deleteCategoryListInServer = async (data) => {
//         try {
//             const response = await deleteProductCatelogue({ ...data });

//             if (response.payload) {
//                 success('CategoryList deleted!!');
//                 loadAllCategory();
//             }
//         } catch (error) {
//             errorShow(error.message);
//         }
//     };

//     const activateCatalogueItemInServer = async (data: IProductCatalogue, activate: boolean) => {
//         try {
//             const response = await activateCatelogueItem({ _id: data._id, activate });

//             if (response.status == 1) {
//                 success('Catalogue item activated!!');
//                 loadAllCategory();
//             }
//         } catch (error) {
//             errorShow(error.message);
//         }
//     };

//     const updateCategoryListInServer = async (data) => {
//         setLoader(true);

//         try {
//             const response = await updateProductCatelogue({ ...update, ...data, subCategoryExist });
//             setLoader(false);

//             if (response.payload) {
//                 success('Category Updated');
//                 loadAllCategory();
//                 form.resetFields();
//                 setUpdate(null);
//             }
//         } catch (error) {
//             setLoader(false);
//             errorShow(error.message);
//         }
//     };

//     const onClickUpdateInRow = (data: IProductCatalogue) => {
//         const formValue = {};
//         formValue.name = data.name;
//         formValue.description = data.description;
//         formValue.subCategoryExist = data.subCategoryExist;
//         formValue.image = data.image;
//         form.setFieldsValue(formValue);
//         delete data.activate;
//         setSubCategoryExist(data.subCategoryExist);

//         setUpdate(data);
//     };

//     React.useEffect(() => {
//         loadAllCategory();
//     }, []);
//     return (
//         <div style={{ alignItems: 'center' }}>
//             <div className="site-card-border-less-wrapper">
//                 <Card title="Add/Update Category" loading={loader} bordered={false} style={{}}>
//                     <Form
//                         form={form}
//                         labelCol={{ span: 4 }}
//                         wrapperCol={{ span: 14 }}
//                         name="basic"
//                         layout="horizontal"
//                         initialValues={{ remember: true }}
//                         onFinish={() => {
//                             form.validateFields().then((value) => {
//                                 if (!update) {
//                                     createCategoryListInServer(value);
//                                 } else {
//                                     updateCategoryListInServer(value);
//                                 }
//                             });
//                         }}
//                         onFinishFailed={onFinishFailed}
//                     >
//                         <Form.Item label={'Name'} name={'name'} rules={formRequiredRule}>
//                             <Input />
//                         </Form.Item>
//                         <Form.Item label={'Description'} name={'description'} rules={formRequiredRule}>
//                             <Input.TextArea showCount maxLength={100} />
//                         </Form.Item>
//                         <Form.Item label={'Image'} name={'image'} rules={formRequiredRule}>
//                             <Input />
//                         </Form.Item>
//                         <Form.Item name="subCategoryExist" valuePropName="subCategoryExist" wrapperCol={{ offset: 4 }}>
//                             <Checkbox
//                                 checked={subCategoryExist}
//                                 onChange={(subCategoryExist) => {
//                                     setSubCategoryExist(subCategoryExist.target.checked);
//                                 }}
//                             >
//                                 Sub Category Exist
//                             </Checkbox>
//                         </Form.Item>

//                         <Space size="middle">
//                             {update && (
//                                 <Button
//                                     type={'default'}
//                                     icon={<UndoOutlined />}
//                                     htmlType="submit"
//                                     style={{ marginTop: '20px' }}
//                                     onClick={() => {
//                                         setUpdate(null);
//                                         form.resetFields();
//                                     }}
//                                 >
//                                     {'Reset'}
//                                 </Button>
//                             )}
//                             <Button type={'primary'} htmlType="submit" style={{ marginTop: '20px' }}>
//                                 {update ? 'Save' : 'Create'}
//                             </Button>
//                         </Space>
//                     </Form>
//                 </Card>
//             </div>
//             <Table
//                 columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateCatalogueItemInServer)}
//                 dataSource={categoryList}
//                 style={{ marginTop: '10vh' }}
//             />
//         </div>
//     );
// };

// export default Category;

import { Table, Space, Button, Input, Form, Card, Tag } from 'antd';
import React from 'react';
import { UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

import Checkbox from 'antd/lib/checkbox/Checkbox';

import { createFilter, deleteFilter, updateFilter, getFilter } from '../../../server/filter/filter/fitler.api';

import { categoryType, IProductCatalogue } from '../../../server/catalogue/catalogue.interface';
import { errorShow, success } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { getProductCatelogue } from '../../../server/catalogue/catalogue.api';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const columns = (onDelete, onUpdate, activate) => [
    {
        title: 'Classifier' + ' name',
        dataIndex: 'name',
        key: '_id' + 'City',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Classifier ' + ' description',
        dataIndex: 'description',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Classifier ' + ' image',
        dataIndex: 'image',
        key: '_id',
        render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={100} width={100} />,
    },
    {
        title: 'Subcategory exist ',
        dataIndex: 'subCategoryExist',
        key: '_id',

        render: (text) => (text ? <CheckCircleOutlined /> : <CloseCircleOutlined />),
    },
    {
        title: 'Active',
        dataIndex: 'active',
        width: 150,
        key: '_id',
        render: (value) => (
            <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Checkbox value={value} checked={value} style={{ alignSelf: 'center' }} />
            </div>
        ),
    },
    {
        title: 'Child',
        key: 'child',
        dataIndex: 'child',
        render: (child) => (
            <span>
                {child.map(({ name }) => {
                    // let color = name.length <= 5 ? 'geekblue' : name.length <= 7 ? 'volcano' : 'green';

                    return (
                        <Tag color={'blue'} key={name}>
                            {name.toUpperCase()}
                        </Tag>
                    );
                })}
            </span>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Button
                    type={'primary'}
                    title={'Edit'}
                    onClick={() => {
                        onUpdate(record);
                    }}
                >
                    {'Edit'}
                </Button>
                <Button
                    type={'primary'}
                    title={'Active'}
                    onClick={() => {
                        activate(record, !text.active);
                    }}
                >
                    {text.active ? 'Deactive' : 'Active'}
                </Button>
                <Button
                    type={'primary'}
                    title={'Delete'}
                    onClick={() => {
                        onDelete(record);
                    }}
                    danger
                >
                    {'Delete'}
                </Button>
            </Space>
        ),
    },
];

export interface CategoryProps extends RouteComponentProps {}

const Classifier: React.FC<CategoryProps> = () => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [loader, setLoader] = React.useState<boolean>(false);
    const [update, setUpdate] = React.useState(null);
    const [subCategoryExist, setSubCategoryExist] = React.useState(true);
    const [categoryList, setCategoryList] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const loadAllFilter = async () => {
        try {
            setLoader(true);
            const category = await getFilter({});
            setLoader(false);

            setCategoryList(category.payload);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };
    const createClassifierListInServer = async (data) => {
        setLoader(true);
        try {
            const response = await createFilter({
                ...data,
            });

            setLoader(false);
            if (response.status === 1) {
                success('Classifier' + ' created!');
                loadAllFilter();

                form.resetFields();
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const deleteCategoryListInServer = async (data) => {
        try {
            const response = await deleteFilter({ ...data });

            if (response.status === 1) {
                success('CategoryList deleted!!');
                loadAllFilter();
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const activateCatalogueItemInServer = async (data: IProductCatalogue) => {
        try {
            const response = await getProductCatelogue({ subCategoryExist: false });
            console.log(response);
            if (response.status === 1) {
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await updateFilter({ ...update, ...data, subCategoryExist });
            setLoader(false);

            if (response.status === 1) {
                success('Classifier Updated');
                loadAllFilter();
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const onClickUpdateInRow = (data: IProductCatalogue) => {
        const formValue = {};
        formValue.name = data.name;
        formValue.description = data.description;
        formValue.subCategoryExist = data.subCategoryExist;
        formValue.image = data.image;
        form.setFieldsValue(formValue);
        delete data.activate;
        setSubCategoryExist(data.subCategoryExist);

        setUpdate(data);
    };

    React.useEffect(() => {
        activateCatalogueItemInServer({});
    }, []);
    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title="Add/Update Classifier" loading={loader} bordered={false} style={{}}>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            form.validateFields().then((value) => {
                                if (!update) {
                                    createClassifierListInServer(value);
                                } else {
                                    updateCategoryListInServer(value);
                                }
                            });
                        }}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item label={'Name'} name={'name'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={'Description'} name={'description'} rules={formRequiredRule}>
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                        <Form.Item label={'Image'} name={'image'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>

                        <Space size="middle">
                            {update && (
                                <Button
                                    type={'default'}
                                    icon={<UndoOutlined />}
                                    htmlType="submit"
                                    style={{ marginTop: '20px' }}
                                    onClick={() => {
                                        setUpdate(null);
                                        form.resetFields();
                                    }}
                                >
                                    {'Reset'}
                                </Button>
                            )}
                            <Button type={'primary'} htmlType="submit" style={{ marginTop: '20px' }}>
                                {update ? 'Save' : 'Create'}
                            </Button>
                        </Space>
                    </Form>
                </Card>
            </div>
            <Table
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateCatalogueItemInServer)}
                dataSource={categoryList}
                style={{ marginTop: '10vh' }}
            />
        </div>
    );
};

export default Classifier;
