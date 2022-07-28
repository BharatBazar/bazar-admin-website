import { Button, Checkbox, Form, Input, Space } from 'antd';
import React from 'react';
import AddUpdateForms from './forms/AddUpdateForms';

const AddUpdateFilter = ({
    form,
    form1,
    setLoader,
    loader,
    selectedCategory,
    setFilterList,
    filterList,
    loadAllFilterItem,
    classifier,
}) => {
    return (
        <AddUpdateForms
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
    );
};

export default AddUpdateFilter;
