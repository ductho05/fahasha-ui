import React, { useEffect, useState } from 'react';
import { api } from '../../../constants';
import './StateFlashSale.css';
function StateFlashSale({ params, isToggle }) {
    const [flashSaleData, setFlashSaleData] = useState([]);
    const [noflashSaleData, setNoFlashSaleData] = useState([]);

    useEffect(() => {
        // Gọi API ở đây và cập nhật state khi có kết quả từ API
        fetch(`${api}/flashsales?productId=${params}&filter=expired`)
            .then((response) => response.json())
            .then((result) => {
                if (result.data.length > 0) {
                    setFlashSaleData(result.data);
                }
            })
            .catch((err) => console.log(err));

        fetch(`${api}/flashsales?productId=${params}&filter=no-expired`)
            .then((response) => response.json())
            .then((result) => {
                if (result.data.length > 0) {
                    setNoFlashSaleData(result.data);
                }
            })
            .catch((err) => console.log(err));
    }, [isToggle]);

    // // Sử dụng CSS để làm nổi bật văn bản "Đang FlashSale"
    // const flashSaleStyle = {
    //     fontWeight: 'bold', // Đặt độ đậm của chữ
    //     color: 'red', // Đặt màu chữ
    // };

    return (
        <p className={flashSaleData.length > 0 ? 'flashSaleText' : noflashSaleData.length > 0 ? 'noflashSaleText' : ''}>
            {flashSaleData.length > 0 ? 'FlashSale' : noflashSaleData.length > 0 ? 'Đang đợi' : 'Không'}
        </p>
    );
}

export default StateFlashSale;
