import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Space, Modal } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { errorShow, success } from '../../../../components/ALert';
import { formRequiredRule } from '../../../../constants';
import { apiEndPoint } from '../../../../server';
import { IProductCatalogue } from '../../../../server/catalogue/catalogue.interface';
import { IFilter } from '../../../../server/filter/filter/filter.interface';
import { getProductCatelogue } from '../../../../server/catalogue/catalogue.api';
import { getClassifier, getFilterWithValue } from '../../../../server/filter/filter/fitler.api';
import AddAndUpdateFilter from './AddAndUpdateFilter';
import FilterModal from '../filterModal/FilterModal';

const ChooseFilterCategory = () => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [form1] = Form.useForm<Partial<IProductCatalogue>>();
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [category, setCategory] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    const [filterList, setFilterList] = React.useState([]);
    const [update, setUpdate] = React.useState(null);
    const [classifier, setClassifier] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [openForm, setOpenForm] = React.useState(false);
    const [showFilterList, setShowFilterList] = React.useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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
        try {
            setLoader(true);
            setFilterList([]);

            const categories = await getFilterWithValue({ parent: data.parent });

            const getSingleFilterValue = categories.payload.filter.filter((e) => e.parent === data.parent || data._id);

            const getSingleDistributionValue = categories.payload.distribution.filter(
                (e) => e.parent === data.parent || data._id,
            );

            const mergingAllFilter = [...getSingleFilterValue, ...getSingleDistributionValue];
            setShowForm(true);
            if (mergingAllFilter.length > 0) {
                setShowFilterList(false);
            } else if (mergingAllFilter.length === 0) {
                setShowFilterList(true);
                success('No Filter To Show Create Filter !!');
            }
            setLoader(false);

            // setFilterList([...category.payload.filter, ...category.payload.distribution]);
            // setFilterList([...getSingleFilterValue, ...category.distribution]);
            setFilterList(mergingAllFilter);
            // setFilterList();
        } catch (error) {
            setShowForm(false);
            errorShow(error.message);
            setLoader(false);
        }
    };

    const loadAllFilterChild = async (data) => {
        console.log('_ID', data._id);
        try {
            setLoader(true);
            setFilterList([]);

            // const categories = await getFilterWithValue();
            const categories = await getFilterWithValue();
            console.log('category', categories);
            const getSingleFilterValue = categories.payload.filter.filter((e) => e._id === data._id);
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
    }, []);

    const openAllForm = () => {
        setOpenForm(!openForm);
    };

    return (
        <>
            <Card title={'Choose filter category'} loading={loader}>
                <Form
                    form={form1}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    name="basic"
                    layout="horizontal"
                    initialValues={{ remember: true }}
                >
                    <Form.Item style={{ flex: 1 }} label="Parent :" name="parent">
                        <Select
                            allowClear
                            showSearch
                            onChange={(value) => {
                                setSelectedCategory(value);
                                loadAllFilter({ parent: value });
                            }}
                            optionFilterProp="children"
                        >
                            {category.map((category) => (
                                <Option value={category._id}>{category.type}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {showForm === true ? (
                        <Space>
                            <Button
                                type={'primary'}
                                htmlType="submit"
                                style={{ marginTop: '20px' }}
                                onClick={openAllForm}
                            >
                                {openForm ? 'Hide Filter Form' : 'Create Filter'}
                            </Button>
                            <Button
                                type={'default'}
                                icon={<UndoOutlined />}
                                htmlType="submit"
                                style={{ marginTop: '20px' }}
                                onClick={() => {
                                    setShowForm(false);
                                    form1.resetFields();
                                    form.resetFields();
                                    setOpenForm(false);
                                    setSelectedCategory(null);
                                    setUpdate(null);
                                    setFilterList([]);
                                    setClassifier([]);
                                }}
                            >
                                {'Reset Filter'}
                            </Button>
                        </Space>
                    ) : null}
                </Form>
            </Card>
            <div>
                <AddAndUpdateFilter
                    form={form}
                    filterList={filterList}
                    setLoader={setLoader}
                    loadAllFilter={loadAllFilter}
                    selectedCategory={selectedCategory}
                    setFilterList={setFilterList}
                    loadAllFilterChild={loadAllFilterChild}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    showModal={showModal}
                    openForm={openForm}
                    setOpenForm={setOpenForm}
                    showFilterList={showFilterList}
                />
            </div>
            {/* <div>
                <Modal title="Category" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <FilterModal
                        form={form}
                        filterList={filterList}
                        setLoader={setLoader}
                        loadAllFilter={loadAllFilter}
                        selectedCategory={selectedCategory}
                        setFilterList={setFilterList}
                        loadAllFilterChild={loadAllFilterChild}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        setModal={setIsModalVisible}
                    />
                </Modal>
            </div> */}
        </>
    );
};

export default ChooseFilterCategory;
