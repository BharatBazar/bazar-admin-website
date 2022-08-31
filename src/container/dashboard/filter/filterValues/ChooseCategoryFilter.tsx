import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Space } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { errorShow, success } from '../../../../components/ALert';
import { formRequiredRule } from '../../../../constants';
import { apiEndPoint } from '../../../../server';
import { getProductCatelogue } from '../../../../server/catalogue/catalogue.api';
import { IProductCatalogue } from '../../../../server/catalogue/catalogue.interface';
import { getCategory } from '../../../../server/filter/category/category.api';
import { getClassifier, getFilter } from '../../../../server/filter/filter/fitler.api';
import AddUpdateFilter from './AddUpdateFilter';

const ChooseCategoryFilter = () => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [form1] = Form.useForm<Partial<IProductCatalogue>>();
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [classifier, setClassifier] = React.useState([]);
    const [category, setCategory] = React.useState([]);
    const [filterList, setFilterList] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    const [showForm, setShowForm] = React.useState(false);
    const [showFilterForm, setShowFilterForm] = React.useState(false);
    const [showFilterList, setShowFilterList] = React.useState(false);
    const [showChooseFilter, setShowChooseFilter] = React.useState(2);

    const loadAllFilterItem = async (data?: Partial<IClassfier>) => {
        try {
            setLoader(true);
            const categories = await getCategory({ parent: data.parent });
            setLoader(false);
            setShowForm(true);

            const getSingleFilterValue = categories.payload;

            if (getSingleFilterValue.length === 0) {
                setShowFilterList(true);
                success('No Filter Values Create Filter Values !! ');
            } else if (getSingleFilterValue.length > 0) {
                setShowFilterList(false);
            }

            setFilterList([...getSingleFilterValue]);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    const loadCategoriesFromServer = async () => {
        try {
            const response = await getProductCatelogue();
            console.log('Response => ', response);
            if (response.status === 1) {
                const getRealProduct = response.payload.filter((elem) => elem.child.length === 0);
                setCategory(getRealProduct);
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const loadAllFilter = async (parentValue, number) => {
        try {
            setLoader(true);
            const response = await getFilter({ parent: parentValue });
            setLoader(false);

            const getSingleFilterValue = response.payload;

            if (getSingleFilterValue.length === 0) {
                errorShow('No filter to show');
                setShowFilterList(true);
                setShowChooseFilter(2);
                setClassifier([]);
            } else {
                setShowChooseFilter(0);
                setClassifier(getSingleFilterValue);
            }

            if (number === 2) {
                setFilterList([]);
            } else {
                setFilterList([...getSingleFilterValue]);
            }
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    const loadAllFilterSubItem = async (parentValue) => {
        try {
            setLoader(true);
            const response = await getFilter({ _id: parentValue });
            setLoader(false);

            //  const getSingleFilterValue = response.payload.filter((e) => e._id === parentValue);

            setClassifier(response.payload);

            // setFilterList([...getSingleFilterValue]);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    React.useEffect(() => {
        loadCategoriesFromServer();
    }, []);

    return (
        <>
            <Card title={'Choose filter category'} loading={loader}>
                <Form
                    form={form1}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 14 }}
                    name="basic"
                    layout="horizontal"
                    initialValues={{ remember: true }}
                    // onFinishFailed={onFinishFailed}
                >
                    <Form.Item style={{ flex: 1 }} label="Filter belongs to :" name="category" rules={formRequiredRule}>
                        <Select
                            allowClear
                            onChange={(value) => {
                                loadAllFilter(value, 2);
                            }}
                            onClick={() => form1.setFieldsValue({ type: '' })}
                        >
                            {category.map((category) => (
                                <Option value={category._id}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {showChooseFilter !== 2 ? (
                        <>
                            <Form.Item style={{ flex: 1 }} label="Choose filter :" name="type" rules={formRequiredRule}>
                                <Select
                                    allowClear
                                    onChange={(value) => {
                                        setSelectedCategory(value);
                                        loadAllFilterItem({ parent: value });
                                    }}
                                    optionFilterProp="children"
                                >
                                    {classifier.map((classifier) => (
                                        <Option value={classifier._id}>{classifier.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </>
                    ) : null}
                </Form>
                {showForm === true ? (
                    <>
                        <Space>
                            <Button
                                type={'primary'}
                                htmlType="submit"
                                style={{ marginTop: '20px' }}
                                onClick={() => {
                                    if (form1.getFieldValue('category')) {
                                        setShowFilterForm(!showFilterForm);
                                    } else {
                                        errorShow('Please select product category.');
                                    }
                                }}
                            >
                                {!showFilterForm ? 'Create Filter Value' : 'Hide Form'}
                            </Button>
                            <Button
                                type={'default'}
                                icon={<UndoOutlined />}
                                htmlType="submit"
                                style={{ marginTop: '20px' }}
                                onClick={() => {
                                    setShowForm(false);
                                    setShowChooseFilter(2);
                                    form1.resetFields();
                                    form.resetFields();
                                    setFilterList([]);
                                    setClassifier([]);
                                }}
                            >
                                {'Reset Filter'}
                            </Button>
                        </Space>
                    </>
                ) : null}
            </Card>
            <div>
                <AddUpdateFilter
                    form={form}
                    form1={form1}
                    setLoader={setLoader}
                    loader={loader}
                    selectedCategory={selectedCategory}
                    setFilterList={setFilterList}
                    filterList={filterList}
                    loadAllFilterItem={(a) => {
                        setShowFilterForm(false);
                        loadAllFilterItem(a);
                    }}
                    classifier={classifier}
                    loadAllFilterSubItem={loadAllFilterSubItem}
                    setShowFilterForm={setShowFilterForm}
                    showFilterForm={showFilterForm}
                    showFilterList={showFilterList}
                />
            </div>
        </>
    );
};

export default ChooseCategoryFilter;
