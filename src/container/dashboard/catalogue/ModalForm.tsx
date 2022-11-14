import { Table, Space, Button, Input, Form, Card, Tag, Select, Radio, RadioChangeEvent } from 'antd';
import React, { useContext, useState } from 'react';
import { UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';

import {
    addProductCatelogue,
    deleteProductCatelogue,
    updateProductCatelogue,
    getProductCatelogue,
    activateCatelogueItem,
} from '../../../server/catalogue/catalogue.api';
import { categoryType, IProductCatalogue } from '../../../server/catalogue/catalogue.interface';
import { errorShow, success } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { CategoryContext, createCategoryContext } from './SubCategory1';

type LayoutType = Parameters<typeof Form>[0]['layout'];

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

export interface CategoryProps extends RouteComponentProps {
    setModal: (value: boolean) => void;
    updateFlow: (value: boolean) => void;
    onSelect: (value: any) => void;
    productInfo: Partial<IProductCatalogue>;
}

const ModalForm: React.FC<CategoryProps> = ({ productInfo, onSelect, setModal, updateFlow }) => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [loader, setLoader] = React.useState<boolean>(false);
    const [update, setUpdate] = React.useState(null);
    const [subCategoryExist, setSubCategoryExist] = React.useState(true);
    const [parentExist, setParentExist] = React.useState(false);
    const [category, setCategory] = React.useState<IProductCatalogue[]>([]);
    const [showForm, setShowForm] = React.useState(false);

    const onFinishFailed = (errorInfo: any) => {
        // console.log('PPPO', form.setFieldsValue({ type: form.getFieldValue('name').replace(' ', '_').toLowerCase() }));

        console.log('Failed:', errorInfo);
    };

    const { newCategory, setNewCategory } = React.useContext(CategoryContext);

    const createCategoryListInServer = async (data) => {
        setLoader(true);
        console.log(1);
        try {
            const response = await addProductCatelogue({
                ...data,

                // subCategoryExist,
            });
            console.log(2);
            setLoader(false);
            if (response.payload) {
                setNewCategory(!newCategory);
                success('Category' + ' created!');
                loadAllCategory({ categoryType: categoryType.Category, parent: form.getFieldValue('parent') });

                form.resetFields();
                setModal(false);
            }
        } catch (error) {
            setLoader(false);
            !parentExist ? errorShow('Please select parent ') : errorShow(error.message);
        }
    };

    const createSubCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await addProductCatelogue({
                ...data,
                type: form.getFieldValue('name').split(' ').join('_').toLowerCase(),
                parent: form.getFieldValue('parent'),

                // categoryType: categoryType.SubCategory,
                // subCategoryExist,
            });

            setLoader(false);
            if (response.payload) {
                setNewCategory(!newCategory);
                success('Category' + ' created!');
                loadAllCategory({ categoryType: categoryType.SubCategory, parent: form.getFieldValue('parent') });

                form.resetFields();
                setModal(false);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const loadAllCategory = async (data) => {
        try {
            setLoader(true);
            const category = await getProductCatelogue(data);

            setLoader(false);
            // setCategory(category.payload);
            setCategory(category.payload.filter((e) => e.path.length === 0));
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    const updateCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await updateProductCatelogue({ ...update, ...data, subCategoryExist });
            setLoader(false);

            if (response.payload) {
                setNewCategory(!newCategory);
                success('Category Updated');
                loadAllCategory({ parent: form.getFieldValue('parent') });

                form.resetFields();
                setUpdate(null);
                setModal(false);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const onClickUpdateInRow = (data: any) => {
        console.log(data);
        const formValue: Partial<IProductCatalogue> = {};
        formValue.name = data.name;
        formValue.description = data.description;
        formValue.image = data.image;
        formValue.customer_name = data.customer_name;
        formValue.customer_image = data.customer_image;
        formValue.customer_description = data.customer_description;
        formValue.type = data.type;
        form.setFieldsValue(!updateFlow ? '' : formValue);
        // delete data.activate;
        // setSubCategoryExist(data.subCategoryExist);

        !updateFlow ? setUpdate(null) : setUpdate(data);
    };

    React.useEffect(() => {
        // loadAllCategory({ categoryType: categoryType.Category });
        loadAllCategory();
        onClickUpdateInRow(productInfo);
        !updateFlow ? form.resetFields() : null;
    }, []);

    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card
                    title={
                        updateFlow && productInfo.path.length > 0
                            ? `Update in ${productInfo.parent.name} category`
                            : 'Add/Update Category'
                    }
                    loading={loader}
                    bordered={false}
                    style={{}}
                >
                    <Form
                        form={form}
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 18 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            // form.setFieldsValue({ type: form.getFieldValue('name').replace(' ', '_').toLowerCase() });

                            form.validateFields().then((value) => {
                                if (!update) {
                                    if (parentExist) {
                                        createSubCategoryListInServer(value);
                                    } else {
                                        createCategoryListInServer(value);
                                    }
                                } else {
                                    updateCategoryListInServer(value);
                                }
                            });
                        }}
                        onFinishFailed={onFinishFailed}
                    >
                        {updateFlow ? null : (
                            // <Form.Item name="parentExist" valuePropName="parentExist" wrapperCol={{ offset: 4 }}>
                            <Form.Item label="Parent Exist" name="parentExist" valuePropName="parentExist">
                                {/* <Checkbox
                                    checked={parentExist}
                                    onChange={(parentExist: CheckboxChangeEvent) => {
                                        setParentExist(parentExist.target.checked);
                                    }}
                                >
                                    Parent Exist
                                </Checkbox> */}

                                <Radio.Group
                                    onChange={(e: RadioChangeEvent) => {
                                        setParentExist(e.target.value);
                                        if (e.target.value) {
                                            setShowForm(false);
                                        } else {
                                            setShowForm(true);
                                        }
                                    }}
                                >
                                    <Radio value>{'Yes'}</Radio>
                                    <Radio value={false}>{'NO'}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        )}
                        {parentExist && !updateFlow ? (
                            <Form.Item style={{ flex: 1 }} label="Parent :" name="parent" rules={formRequiredRule}>
                                <Select
                                    allowClear
                                    showSearch
                                    onSelect={() => setShowForm(true)}
                                    optionFilterProp="children"
                                >
                                    {category.map((category) => (
                                        <>
                                            <Option value={category._id}>{category.name}</Option>;
                                            {category.child.map((subCategory) => {
                                                return <Option value={subCategory._id}>{subCategory.name}</Option>;
                                            })}
                                        </>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null}

                        {/* {showForm === true && parentExist === true ? ( */}
                        {showForm && (
                            <>
                                <Form.Item label={'Name'} name={'name'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label={'Description'} name={'description'} rules={formRequiredRule}>
                                    <Input.TextArea showCount maxLength={150} />
                                </Form.Item>
                                <Form.Item label={'Image'} name={'image'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label={'Customer_name'} name={'customer_name'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label={'Customer_image'} name={'customer_image'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label={'Customer_description'}
                                    name={'customer_description'}
                                    rules={formRequiredRule}
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        )}
                        {/* <Form.Item label={'Type'} name={'type'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item> */}

                        {/* <Form.Item name="subCategoryExist" valuePropName="subCategoryExist" wrapperCol={{ offset: 4 }}>
                            <Checkbox
                                checked={subCategoryExist}
                                onChange={(subCategoryExist) => {
                                    setSubCategoryExist(subCategoryExist.target.checked);
                                }}
                            >
                                Sub Category Exist
                            </Checkbox>
                        </Form.Item> */}

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
            {/* <Table
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateCatalogueItemInServer)}
                dataSource={categoryList}
                style={{ marginTop: '10vh' }}
                scroll={{ x: 1300 }}
            /> */}
        </div>
    );
};

export default ModalForm;
