import * as React from 'react';
import { Divider } from 'antd';

export const LeftDivider = (title: string, fontSize?: string): React.ReactChild => (
    <Divider orientation="left" style={{ fontSize: fontSize || '20px' }}>
        {title}
    </Divider>
);
