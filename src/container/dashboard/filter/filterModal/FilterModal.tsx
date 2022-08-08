/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import AddAndUpdateForm from '../filters/Forms/AddUpdateForm';

const FilterModal = ({
    form,
    filterList,
    setLoader,
    loadAllFilter,
    selectedCategory,
    setFilterList,
    loadAllFilterChild,
    setShowForm,
    showForm,
}) => {
    return (
        <div>
            <AddAndUpdateForm
                form={form}
                filterList={filterList}
                setLoader={setLoader}
                loadAllFilter={loadAllFilter}
                selectedCategory={selectedCategory}
                setFilterList={setFilterList}
                loadAllFilterChild={loadAllFilterChild}
                showForm={!showForm}
                setShowForm={setShowForm}
            />
        </div>
    );
};

export default FilterModal;
