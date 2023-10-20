import React, { useRef, useState } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Tour } from 'antd';
import images from '../../../assets/images';
const App = ({ ref1, ref2, openGuide, func }) => {
    const steps = [
        {
            title: 'Tự động thiết đặt',
            description: 'Thuật toán lấy ra những sản phẩm đang tồn kho và tự động thêm vào flash sale.',
            cover: <img alt="tour.png" src={images.autoflashsale} />,
            target: () => ref1.current,
        },
        {
            title: 'Tùy chỉnh thiết đặt',
            description: 'Tùy chỉnh sản phẩm cho flash sale. Trang bị bộ lọc và tìm kiếm để tìm kiếm sản phẩm.',
            cover: <img alt="tour.png" src={images.customflashsale} />,
            target: () => ref2.current,
        },
    ];
    return (
        <>
            <Tour
                open={openGuide}
                steps={steps}
                onClose={() => {
                    func(false);
                }}
            />
        </>
    );
};
export default App;
