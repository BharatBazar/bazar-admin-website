import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Space } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { errorShow } from '../../../../components/ALert';
import { formRequiredRule } from '../../../../constants';
import { apiEndPoint } from '../../../../server';
import { IProductCatalogue } from '../../../../server/catalogue/catalogue.interface';
import { IFilter } from '../../../../server/filter/filter/filter.interface';
import { getProductCatelogue } from '../../../../server/catalogue/catalogue.api';
import { getClassifier, getFilterWithValue } from '../../../../server/filter/filter/fitler.api';
import AddAndUpdateFilter from './AddAndUpdateFilter';

const ChooseFilterCategory = () => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [form1] = Form.useForm<Partial<IProductCatalogue>>();
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [category, setCategory] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    const [filterList, setFilterList] = React.useState([]);
    const [update, setUpdate] = React.useState(null);
    const [classifier, setClassifier] = React.useState([]);

    const loadCatalogueFromServer = async () => {
        try {
            const response = await getProductCatelogue();
            const getRealProduct = response.payload.filter((elem) => elem.child.length === 0);
            if (response.status === 1) {
                setCategory(getRealProduct);
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const loadAllFilter = async (data) => {
        console.log('_ID', data);
        try {
            setLoader(true);
            setFilterList([]);

            // const categories = await getFilterWithValue();
            const categories = await getFilterWithValue();
            console.log('category', categories);
            const getSingleFilterValue = categories.payload.filter.filter((e) => e.parent === data.parent || data._id);
            console.log('GSF', getSingleFilterValue);
            setLoader(false);

            // setFilterList([...category.payload.filter, ...category.payload.distribution]);
            // setFilterList([...getSingleFilterValue, ...category.distribution]);
            setFilterList([...getSingleFilterValue]);
            // setFilterList();
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
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

    React.useEffect(() => {
        loadCatalogueFromServer();

        return () => {
            axios.defaults.baseURL = apiEndPoint;
        };
    }, []);

    return (
        <>
            <Card title={'Choose filter category'}>
                <Form
                    form={form1}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    name="basic"
                    layout="horizontal"
                    initialValues={{ remember: true }}
                >
                    <Form.Item style={{ flex: 1 }} label="Parent :" name="parent" rules={formRequiredRule}>
                        <Select allowClear showSearch optionFilterProp="children">
                            {category.map((category) => (
                                <Option value={category._id}>{category.type}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Space>
                        <Button
                            type={'primary'}
                            htmlType="submit"
                            style={{ marginTop: '20px' }}
                            onClick={() => {
                                form1.validateFields().then((value) => {
                                    console.log('VALUE', value);
                                    setSelectedCategory(value.parent);
                                    axios.defaults.baseURL = `${apiEndPoint}/catalogue`;
                                    loadAllFilter(value);
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
                                setUpdate(null);
                                setFilterList([]);
                                setClassifier([]);
                            }}
                        >
                            {'Reset Filter'}
                        </Button>
                    </Space>
                </Form>
            </Card>
            <div>
                <AddAndUpdateFilter
                    form={form}
                    filterList={filterList}
                    setLoader={setLoader}
                    loadAllFilter={loadAllFilter}
                    selectedCategory={selectedCategory}
                />
            </div>
        </>
    );
};

export default ChooseFilterCategory;
