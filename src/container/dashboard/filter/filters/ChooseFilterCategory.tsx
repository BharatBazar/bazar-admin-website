import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Space } from 'antd';

import React, { useState } from 'react';
import { errorShow, success } from '../../../../components/ALert';

import { IProductCatalogue } from '../../../../server/catalogue/catalogue.interface';

import { getProductCatelogue } from '../../../../server/catalogue/catalogue.api';
import { getFilterWithValue, getFilterWithValueAPI } from '../../../../server/filter/filter/fitler.api';

import AddAndUpdateForm from './Forms/AddUpdateForm';

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

    const loadCatalogueFromServer = async (data) => {
        try {
            const response = await getProductCatelogue(data);
            // const getRealProduct = response.payload.filter((elem) => elem.child.length === 0);
            if (response.status == 1) {
                setCategory(response.payload);
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const loadAllFilter = async (data: any) => {
        try {
            setLoader(true);
            setFilterList([]);

            const response = await getFilterWithValueAPI({ parent: data.parent });
            console.log('parent', data, response);
            const mergingAllFilter = [...response.payload];
            setShowForm(true);
            if (mergingAllFilter.length > 0) {
                setShowFilterList(false);
            } else if (mergingAllFilter.length === 0) {
                setShowFilterList(true);
                success('No Filter To Show Create Filter !!');
            }
            setLoader(false);

            setFilterList(mergingAllFilter);
        } catch (error) {
            setShowForm(false);
            errorShow(error.message);
            setLoader(false);
        }
    };

    React.useEffect(() => {
        loadCatalogueFromServer({ child: [] });
    }, []);

    const openAllForm = () => {
        setOpenForm(!openForm);
    };

    console.log('selected category', selectedCategory);
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
                                loadAllFilter({ parent: value as string });
                            }}
                            optionFilterProp="children"
                        >
                            {category.map((category) => (
                                <Option value={category._id}>{category.type.split('_').join(' ')}</Option>
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
                <AddAndUpdateForm
                    form={form}
                    filterList={filterList}
                    setLoader={setLoader}
                    loadAllFilter={() => {
                        loadAllFilter({ parent: selectedCategory });
                    }}
                    selectedCategory={selectedCategory}
                    setFilterList={setFilterList}
                    loadAllFilterChild={() => {
                        loadAllFilter({ parent: selectedCategory });
                    }}
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
