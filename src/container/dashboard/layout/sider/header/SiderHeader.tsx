import * as React from 'react';
import { HeaderHeight } from '../../../../../constants';
import './SiderHeader.css';

export interface SiderHeaderProps {}

const SiderHeader: React.FC<SiderHeaderProps> = () => {
    return (
        <div className="sider-header" style={{ height: HeaderHeight }}>
            <div>
                <h1>{'Bharat Bazar'}</h1>
            </div>
        </div>
    );
};

export default SiderHeader;
