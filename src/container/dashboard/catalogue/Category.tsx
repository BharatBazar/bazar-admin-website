import { Card } from 'antd';
import * as React from 'react';

export interface CategoryProps {}

const Category: React.FC<CategoryProps> = () => {
    return <Card title={'Category'} />;
};

export default Category;
