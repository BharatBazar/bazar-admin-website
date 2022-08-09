/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    loadAllFilter,
    classifier,
    loadAllFilterSubItem,
    showFilterForm,
    setShowFilterForm,
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
            loadAllFilter={loadAllFilter}
            loadAllFilterSubItem={loadAllFilterSubItem}
            showFilterForm={showFilterForm}
            setShowFilterForm={setShowFilterForm}
        />
    );
};

export default AddUpdateFilter;
