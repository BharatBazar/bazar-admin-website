import { Table, Space, Button, Input, Form, Card, Tag, Select, Radio } from 'antd';
import React from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

import Checkbox from 'antd/lib/checkbox/Checkbox';

import axios from 'axios';
import {
    createFilter,
    deleteFilter,
    updateFilter,
    getFilter,
    getClassifier,
    getFilterWithValue,
    activateFilter,
} from '../../../server/filter/filter/fitler.api';

import { categoryType, IProductCatalogue } from '../../../server/catalogue/catalogue.interface';
import { errorShow, success } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { getProductCatelogue } from '../../../server/catalogue/catalogue.api';
import { apiEndPoint } from '../../../server';

const { Option } = Select;

const columns = (onDelete, onUpdate, activate) => [
    {
        title: 'Filter' + ' name',
        dataIndex: 'name',
        key: '_id' + 'City',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Filter ' + ' description',
        dataIndex: 'description',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Filter ' + ' image',
        dataIndex: 'image',
        key: '_id',
        render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={100} width={100} />,
    },
    {
        title: 'Filter ' + ' type',
        dataIndex: 'type',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Filter ' + ' level',
        dataIndex: 'filterLevel',
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
    {
        title: 'Child',
        key: 'values',
        dataIndex: 'values',
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
                        activate({ _id: record._id, active: !text.active });
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

const Filter: React.FC<CategoryProps> = () => {
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

    const loadAllFilter = async () => {
        try {
            setLoader(true);
            const category = await getFilterWithValue({});
            console.log('category', category);
            setLoader(false);

            setFilterList([...category.payload.filter, ...category.payload.distribution]);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };
    const createFilterInServer = async (data) => {
        setLoader(true);
        try {
            const response = await createFilter({
                ...data,
            });

            setLoader(false);
            if (response.status === 1) {
                success('Filter' + ' created!');
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
                success('Filter deleted!!');
                loadAllFilter();
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

    const loadClassifiersFromServer = async () => {
        try {
            const response = await getClassifier();

            if (response.status === 1) {
                setClassifier(response.payload);
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateFilterInServer = async (data) => {
        setLoader(true);
        try {
            const response = await updateFilter({ ...update, ...data, subCategoryExist });
            setLoader(false);

            if (response.status === 1) {
                success('Filter Updated');
                loadAllFilter();
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const activateFilterInServer = async (data: { _id: string; active: boolean }) => {
        setLoader(true);
        try {
            const response = await activateFilter(data);
            setLoader(false);

            if (response.status === 1) {
                success('Filter Activated');
                loadAllFilter();
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
        formValue.type = data.type;
        formValue.filterLevel = data.filterLevel;
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
                                    <Option value={category.name}>{category.name}</Option>
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
                                    setSelectedCategory(value.parent);
                                    axios.defaults.baseURL = `${apiEndPoint}/catalogue/${value.parent.toLowerCase()}`;
                                    loadAllFilter();
                                    loadClassifiersFromServer();
                                    // loadAllCategory({ categoryType: categoryType.SubCategory, parent: value.parent });
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
                                form.resetFields();
                                setFilterList([]);
                                setClassifier([]);
                            }}
                        >
                            {'Reset Filter'}
                        </Button>
                    </Space>
                </Card>

                <Card title="Add/Update Filter" loading={loader} bordered={false} style={{ marginTop: '2vh' }}>
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

                        <Form.Item style={{ flex: 1 }} label="Classifier type :" name="type" rules={formRequiredRule}>
                            <Select allowClear disabled={update}>
                                {classifier.map((classifier) => (
                                    <Option value={classifier}>{classifier}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={'Image'} name={'image'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Filter level" name="filterLevel" rules={formRequiredRule}>
                            <Radio.Group>
                                <Radio value={0}>{'0 for a basic filter'}</Radio>
                                <Radio value={1}>
                                    {
                                        '1 is for higher filter which is main categorical distribution like color for a jeans.'
                                    }
                                </Radio>
                                <Radio value={2}>{'2 is for category under higher filter like size in color.'}</Radio>
                            </Radio.Group>
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
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateFilterInServer)}
                dataSource={filterList}
                style={{ marginTop: '2vh' }}
            />
        </div>
    );
};

export default Filter;
