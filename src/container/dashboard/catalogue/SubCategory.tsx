import { Table, Space, Button, Input, Form, Card, Select, Typography, Tag } from 'antd';
import React from 'react';
import { UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

import Checkbox from 'antd/lib/checkbox/Checkbox';

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

const { Option } = Select;
const { Title } = Typography;

const columns = (onDelete, onUpdate, activate) => [
    {
        title: 'Parent ',
        dataIndex: 'parent',
        key: '_id',

        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Sub Category' + ' name',
        dataIndex: 'name',
        key: '_id' + 'City',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Sub Category ' + ' description',
        dataIndex: 'description',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },

    {
        title: 'Sub Category ' + ' image',
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

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export interface CategoryProps extends RouteComponentProps {}

const Category: React.FC<CategoryProps> = ({}) => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [form1] = Form.useForm<Partial<IProductCatalogue>>();
    const [loader, setLoader] = React.useState<boolean>(false);
    const [category, setCategory] = React.useState<IProductCatalogue[]>([]);
    const [update, setUpdate] = React.useState(null);
    const [subCategoryExist, setSubCategoryExist] = React.useState(true);
    const [categoryList, setCategoryList] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const loadAllCategory = async (data: { categoryType: categoryType; parent?: string }) => {
        try {
            setLoader(true);
            const category = await getProductCatelogue(data);
            console.log(category);
            setLoader(false);
            if (data.categoryType === categoryType.Category) {
                setCategory(category.payload);
            } else {
                category.payload.forEach((item) => (item.parent = item.parent.name));
                setCategoryList(category.payload);
            }
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };
    const createCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await addProductCatelogue({
                ...data,
                parent: form1.getFieldValue('parent'),
                categoryType: categoryType.SubCategory,
                subCategoryExist,
            });

            setLoader(false);
            if (response.payload) {
                success('Category' + ' created!');
                loadAllCategory({ categoryType: categoryType.SubCategory, parent: form1.getFieldValue('parent') });

                form.resetFields();
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const activateCatalogueItemInServer = async (data: IProductCatalogue, activate: boolean) => {
        try {
            const response = await activateCatelogueItem({ _id: data._id, activate });

            if (response.status == 1) {
                success('Catalogue item activated!!');
                loadAllCategory({ categoryType: categoryType.SubCategory, parent: form1.getFieldValue('parent') });
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const deleteCategoryListInServer = async (data) => {
        try {
            const response = await deleteProductCatelogue({ ...data });

            if (response.status === 1) {
                success('CategoryList deleted!!');
                loadAllCategory({ categoryType: categoryType.SubCategory });
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await updateProductCatelogue({
                ...update,
                ...data,
                subCategoryExist,
                parent: form1.getFieldValue('parent'),
            });
            setLoader(false);

            if (response.status === 1) {
                success('Category Updated');
                loadAllCategory({ categoryType: categoryType.SubCategory, parent: form1.getFieldValue('parent') });
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
        loadAllCategory({ categoryType: categoryType.Category });
    }, []);
    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title={'Subcategory filter'}>
                    <Form
                        form={form1}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item style={{ flex: 1 }} label="Parent :" name="parent" rules={formRequiredRule}>
                            <Select allowClear>
                                {category.map((category) => (
                                    <Option value={category._id}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                    <Space>
                        <Button
                            type={'primary'}
                            htmlType="submit"
                            style={{ marginTop: '20px' }}
                            onClick={() => {
                                form1.validateFields().then((value) => {
                                    console.log(value);
                                    loadAllCategory({ categoryType: categoryType.SubCategory, parent: value.parent });
                                });
                            }}
                        >
                            {'Apply Filter'}
                        </Button>
                        <Button
                            type={'default'}
                            icon={<UndoOutlined />}
                            htmlType="submit"
                            style={{ marginTop: '20px' }}
                            onClick={() => {
                                form1.resetFields();
                            }}
                        >
                            {'Reset Filter'}
                        </Button>
                    </Space>
                </Card>

                <Card title="Add/Update Category" loading={loader} bordered={false} style={{ marginTop: '10px' }}>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            form.validateFields().then((value) => {
                                form1.validateFields().then(() => {
                                    if (!update) {
                                        createCategoryListInServer(value);
                                    } else {
                                        updateCategoryListInServer(value);
                                    }
                                });
                            });
                        }}
                        onFinishFailed={onFinishFailed}
                    >
                        {/* <Form.Item style={{ flex: 1 }} label="Parent :" name="parent">
                            <Select allowClear onChange={(value) => {}}>
                                {category.map((category) => (
                                    <Option value={category._id}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item> */}
                        <Form.Item label={'Name'} name={'name'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={'Description'} name={'description'} rules={formRequiredRule}>
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                        <Form.Item label={'Image'} name={'image'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="subCategoryExist" valuePropName="subCategoryExist" wrapperCol={{ offset: 4 }}>
                            <Checkbox
                                checked={subCategoryExist}
                                onChange={(subCategoryExist) => {
                                    setSubCategoryExist(subCategoryExist.target.checked);
                                }}
                            >
                                Sub Category Exist
                            </Checkbox>
                        </Form.Item>
                        <Space size="middle">
                            <Button type={'primary'} htmlType="submit" style={{ marginTop: '20px' }}>
                                {update ? 'Save' : 'Create'}
                            </Button>
                            {update && (
                                <Button
                                    type={'default'}
                                    icon={<UndoOutlined />}
                                    htmlType="reset"
                                    style={{ marginTop: '20px' }}
                                    onClick={() => {
                                        setUpdate(null);
                                        form.resetFields();
                                    }}
                                >
                                    {'Reset Fields'}
                                </Button>
                            )}
                        </Space>
                    </Form>
                </Card>
            </div>
            <Table
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateCatalogueItemInServer)}
                dataSource={categoryList}
                style={{ marginTop: '10px' }}
            />
        </div>
    );
};

export default Category;
