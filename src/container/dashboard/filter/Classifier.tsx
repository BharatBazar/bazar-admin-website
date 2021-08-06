/* eslint-disable no-underscore-dangle */
import { Table, Space, Button, Input, Form, Card, Select } from 'antd';
import React from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

import Checkbox from 'antd/lib/checkbox/Checkbox';

import axios from 'axios';
import {
    createCategory,
    deleteCategory,
    updateCategory,
    getCategory,
} from '../../../server/filter/category/category.api';

import { IProductCatalogue } from '../../../server/catalogue/catalogue.interface';
import { errorShow, success } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { getProductCatelogue } from '../../../server/catalogue/catalogue.api';
import { apiEndPoint } from '../../../server';
import { getClassifier, getFilter } from '../../../server/filter/filter/fitler.api';
import { IClassfier } from '../../../server/filter/category/category.interface';

const { Option } = Select;

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
        title: 'Classifier ' + ' type',
        dataIndex: 'type',
        key: '_id',
        render: (text) => <a>{text}</a>,
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
    // {
    //     title: 'Child',
    //     key: 'child',
    //     dataIndex: 'child',
    //     render: (child) => (
    //         <span>
    //             {child.map(({ name }) => {
    //                 // let color = name.length <= 5 ? 'geekblue' : name.length <= 7 ? 'volcano' : 'green';

    //                 return (
    //                     <Tag color={'blue'} key={name}>
    //                         {name.toUpperCase()}
    //                     </Tag>
    //                 );
    //             })}
    //         </span>
    //     ),
    // },
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
    const [form1] = Form.useForm<Partial<IProductCatalogue>>();
    const [loader, setLoader] = React.useState<boolean>(false);
    const [update, setUpdate] = React.useState(null);
    const [subCategoryExist, setSubCategoryExist] = React.useState(true);
    const [filterList, setFilterList] = React.useState([]);
    const [category, setCategory] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [classifier, setClassifier] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const loadAllFilterItem = async (data?: Partial<IClassfier>) => {
        try {
            setLoader(true);
            const category = await getCategory(data);
            setLoader(false);

            setFilterList(category.payload);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };
    const createFilterInServer = async (data) => {
        setLoader(true);
        try {
            const filterItem = {
                ...data,
                type: classifier[selectedCategory].type,
                parent: classifier[selectedCategory]._id,
            };
            console.log(filterItem);
            const response = await createCategory(filterItem);

            setLoader(false);
            if (response.status === 1) {
                success('Classifier' + ' created!');
                loadAllFilterItem({ type: classifier[selectedCategory].type });

                form.resetFields();
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const deleteCategoryListInServer = async (data) => {
        try {
            const response = await deleteCategory({ ...data });

            if (response.status === 1) {
                success('Classifier deleted!!');
                loadAllFilterItem();
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    // To load all categories from backend which are avaialable in the market
    const loadCategoriesFromServer = async () => {
        try {
            const response = await getProductCatelogue({ subCategoryExist: false });

            if (response.status === 1) {
                setCategory(response.payload);
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateFilterInServer = async (data) => {
        setLoader(true);
        try {
            const response = await updateCategory({ ...update, ...data });
            setLoader(false);

            if (response.status === 1) {
                success('Classifier Updated');
                loadAllFilterItem({ type: classifier[selectedCategory].type });
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const loadAllFilter = async () => {
        try {
            setLoader(true);
            const response = await getFilter({});
            setLoader(false);

            setClassifier(response.payload);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    const onClickUpdateInRow = (data: IProductCatalogue) => {
        const formValue = {};
        formValue.name = data.name;
        formValue.description = data.description;

        formValue.image = data.image;
        form.setFieldsValue(formValue);
        delete data.activate;
        setSubCategoryExist(data.subCategoryExist);

        setUpdate(data);
    };

    React.useEffect(() => {
        loadCategoriesFromServer();

        return () => {
            axios.defaults.baseURL = apiEndPoint;
        };
    }, []);
    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title={'Choose filter category'}>
                    <Form
                        form={form1}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 14 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            style={{ flex: 1 }}
                            label="Filter belongs to :"
                            name="category"
                            rules={formRequiredRule}
                        >
                            <Select
                                allowClear
                                onChange={(value) => {
                                    setSelectedCategory(value);
                                    axios.defaults.baseURL = `${apiEndPoint}/catalogue/${value.toLowerCase()}`;

                                    loadAllFilter();
                                }}
                            >
                                {category.map((category) => (
                                    <Option value={category.name}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ flex: 1 }} label="Choose filter :" name="type" rules={formRequiredRule}>
                            <Select
                                allowClear
                                onChange={(value) => {
                                    setSelectedCategory(value);
                                }}
                            >
                                {classifier.map((classifier, index) => (
                                    <Option value={index}>{classifier.name}</Option>
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
                                if (form1.getFieldValue('category')) {
                                    loadAllFilterItem({ parent: classifier[selectedCategory]._id });
                                } else {
                                    errorShow('Please select product category.');
                                }
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
                                form.resetFields();
                                setFilterList([]);
                                setClassifier([]);
                            }}
                        >
                            {'Reset Filter'}
                        </Button>
                    </Space>
                </Card>

                <Card title="Add/Update Filter Item" loading={loader} bordered={false} style={{ marginTop: '2vh' }}>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            form1.validateFields().then(() => {
                                form.validateFields().then((value) => {
                                    if (!update) {
                                        createFilterInServer(value);
                                    } else {
                                        updateFilterInServer(value);
                                    }
                                });
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
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow, () => {})}
                dataSource={filterList}
                style={{ marginTop: '2vh' }}
            />
        </div>
    );
};

export default Classifier;
