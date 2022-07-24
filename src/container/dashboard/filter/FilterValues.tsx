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
        title: 'Filter Value' + ' name',
        dataIndex: 'name',
        key: '_id' + 'City',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Filter Value ' + ' description',
        dataIndex: 'description',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Filter Value ' + ' image',
        dataIndex: 'image',
        key: '_id',
        render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={100} width={100} />,
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
                        activate({ active: !text.active, _id: record._id });
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

const FilterValues: React.FC<CategoryProps> = () => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [form1] = Form.useForm<Partial<IProductCatalogue>>();
    const [loader, setLoader] = React.useState<boolean>(false);
    const [update, setUpdate] = React.useState(null);
    const [subCategoryExist, setSubCategoryExist] = React.useState(true);
    const [filterList, setFilterList] = React.useState([]);
    const [category, setCategory] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [classifier, setClassifier] = React.useState([]);
    const [active, setActive] = React.useState(false);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const loadAllFilterItem = async (data?: Partial<IClassfier>) => {
        try {
            console.log('DATA => ', data);
            setLoader(true);
            const category = await getCategory(data);
            setLoader(false);
            console.log('LOAD FILTER ITEM => ', category.payload);
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
                ...data.value,
                parent: data.selectedCategory,
                // type: classifier[selectedCategory].type,
                // parent: classifier[selectedCategory]._id,
            };
            const response = await createCategory(filterItem);

            setLoader(false);
            if (response.status === 1) {
                success('Classifier' + ' created!');
                loadAllFilterItem({
                    // type: classifier.length > 0 && selectedCategory ? classifier[selectedCategory].type : undefined,
                    type: classifier.length > 0 && selectedCategory ? classifier.type : undefined,
                });

                form.resetFields();
                // form1.resetFields();
                setActive(false);
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
                loadAllFilterItem({
                    type: classifier.length > 0 && selectedCategory ? classifier[selectedCategory].type : undefined,
                });
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    // To load all categories from backend which are avaialable in the market
    const loadCategoriesFromServer = async () => {
        try {
            const response = await getProductCatelogue();

            if (response.status === 1) {
                const getRealProduct = response.payload.filter((elem) => elem.child.length === 0);
                setCategory(getRealProduct);
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
            const response = await updateCategory({ ...update, ...data });
            setLoader(false);

            if (response.status === 1) {
                success('Classifier Updated');
                loadAllFilterItem({
                    type: classifier.length > 0 && selectedCategory ? classifier[selectedCategory].type : undefined,
                });
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const loadAllFilter = async (parentValue) => {
        console.log('PARENTVALUE', parentValue);
        try {
            setLoader(true);
            const response = await getFilter({});
            setLoader(false);
            console.log('CLASSIFIER => ', response.payload);
            const getSingleFilterValue = response.payload.filter((e) => e.parent === parentValue);
            console.log('GSF', getSingleFilterValue);
            // setClassifier(response.payload);
            setClassifier(getSingleFilterValue);
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
                                    axios.defaults.baseURL = `${apiEndPoint}/catalogue`;

                                    loadAllFilter(value);
                                }}
                            >
                                {category.map((category) => (
                                    <Option value={category._id}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ flex: 1 }} label="Choose filter :" name="type" rules={formRequiredRule}>
                            <Select
                                allowClear
                                onChange={(value) => {
                                    console.log('VALUE => ', value);
                                    setSelectedCategory(value);
                                }}
                                optionFilterProp="children"
                            >
                                {classifier.map((classifier, index) => (
                                    <Option value={classifier._id}>{classifier.name}</Option>
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
                                    console.log(classifier[selectedCategory], 'LL', selectedCategory);
                                    // loadAllFilterItem({
                                    //     parent: classifier[selectedCategory]
                                    //         ? classifier._id
                                    //         : undefined,
                                    // });
                                    loadAllFilterItem({
                                        parent: selectedCategory || undefined,
                                    });
                                    loadClassifiersFromServer();
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
                                        createFilterInServer({ value, selectedCategory });
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
                        <Form.Item label={'CustomerName'} name={'customerName'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={'CustomerDescription'} name={'customerDescription'} rules={formRequiredRule}>
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                        <Form.Item label={'Customer Image'} name={'customerImage'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        {/* <Form.Item style={{ flex: 1 }} label="Filter Value Type :" name="type" rules={formRequiredRule}>
                            <Select allowClear disabled={update}>
                                {classifier.map((classifier) => (
                                    <Option value={classifier}>{classifier}</Option>
                                ))}
                            </Select>
                        </Form.Item> */}

                        <Form.Item name="active" valuePropName="active" wrapperCol={{ offset: 4 }}>
                            <Checkbox
                                checked={active}
                                onChange={(active) => {
                                    setActive(active.target.checked);
                                }}
                            >
                                Active
                            </Checkbox>
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
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow, updateFilterInServer)}
                dataSource={filterList}
                style={{ marginTop: '2vh' }}
            />
        </div>
    );
};

export default FilterValues;
