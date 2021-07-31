import * as React from 'react';

export interface SiderHeaderProps {}

const SiderHeader: React.FC<SiderHeaderProps> = () => {
    return (
        <div className="sider-header">
            <h1>{'Bharat Bazar'}</h1>
        </div>
    );
};

export default SiderHeader;
