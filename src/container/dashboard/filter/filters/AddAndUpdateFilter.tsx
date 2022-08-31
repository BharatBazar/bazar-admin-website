/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import AddAndUpdateForm from './Forms/AddUpdateForm';

const AddAndUpdateFilter = ({
    form,
    filterList,
    setLoader,
    loadAllFilter,
    selectedCategory,
    setFilterList,
    loadAllFilterChild,
    setShowForm,
    showForm,
    openForm,
    setOpenForm,
    showFilterList,
}) => {
    return (
        <AddAndUpdateForm
            form={form}
            filterList={filterList}
            setLoader={setLoader}
            loadAllFilter={(a) => {
                loadAllFilter(a);
                setOpenForm(false);
            }}
            selectedCategory={selectedCategory}
            setFilterList={setFilterList}
            loadAllFilterChild={loadAllFilterChild}
            showForm={showForm}
            setShowForm={setShowForm}
            openForm={openForm}
            setOpenForm={setOpenForm}
            showFilterList={showFilterList}
        />
    );
};

export default AddAndUpdateFilter;
