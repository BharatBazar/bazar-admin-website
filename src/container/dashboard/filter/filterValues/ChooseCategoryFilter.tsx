import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Space } from 'antd';
import axios from 'axios';
import React from 'react';
import { errorShow } from '../../../../components/ALert';
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

    const loadAllFilterItem = async (data?: Partial<IClassfier>) => {
        try {
            console.log('DATA => ', data);
            setLoader(true);
            const categories = await getCategory(data);
            setLoader(false);
            console.log('LOAD FILTER ITEM => ', categories.payload);
            const getSingleFilterValue = categories.payload.filter((e) => e.parent === data.parent);

            console.log('GSF', getSingleFilterValue);

            // setFilterList(category.payload);
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

            setFilterList([...getSingleFilterValue]);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    React.useEffect(() => {
        loadCategoriesFromServer();

        return () => {
            axios.defaults.baseURL = apiEndPoint;
        };
    }, []);

    return (
        <>
            <Card title={'Choose filter category'}>
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
                                axios.defaults.baseURL = `${apiEndPoint}/catalogue`;

                                loadAllFilter(value);
                            }}
                            onClick={() => form1.setFieldsValue({ type: '' })}
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
            <div>
                <AddUpdateFilter
                    form={form}
                    form1={form1}
                    setLoader={setLoader}
                    loader={loader}
                    selectedCategory={selectedCategory}
                    setFilterList={setFilterList}
                    filterList={filterList}
                    loadAllFilterItem={loadAllFilterItem}
                    classifier={classifier}
                />
            </div>
        </>
    );
};

export default ChooseCategoryFilter;
