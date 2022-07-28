import React from 'react';
import AddAndUpdateForm from './Forms/AddUpdateForm';

const AddAndUpdateFilter = ({ form, filterList, setLoader, loadAllFilter, selectedCategory }) => {
    return (
        <AddAndUpdateForm
            form={form}
            filterList={filterList}
            setLoader={setLoader}
            loadAllFilter={loadAllFilter}
            selectedCategory={selectedCategory}
        />
    );
};

export default AddAndUpdateFilter;
