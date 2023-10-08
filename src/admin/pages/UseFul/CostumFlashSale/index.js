import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../../constants';
import SimpleItem from '../../../components/SimpleItem';
import styles from './CostumFlashSale.module.scss';
import EnhancedTable from '../../../components/Table/EnhancedTable';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FlashSaleModal from '../../../components/FlashSaleModal';
import { Divider, Form, Radio, Skeleton, Space, Switch, Alert } from 'antd';
import Marquee from 'react-fast-marquee';
const cx = classNames.bind(styles);

function CostumFlashSale() {
    const getCategoryName = (categoryId) => {
        // categoryId là đối tượng danh mục
        // Thực hiện logic để lấy tên danh mục từ categoryId
        // Trả về tên danh mục
        return categoryId ? categoryId.name : ''; // Ví dụ: Lấy name từ đối tượng danh mục
    };
    const columns = [
        // { field: '_id', headerName: 'ID', width: 230 },
        // {
        //     field: 'images',
        //     headerName: 'Images',
        //     sortable: false,
        //     editable: true,
        //     renderCell: (params) => {
        //         return params ? <img className={cx('image')} src={params.value} /> : <Skeleton.Image active={true} />;
        //     },
        // },
        { field: 'title', headerName: 'Tên sách', width: 200, sortable: false },
        {
            field: 'author',
            headerName: 'Tác giả',
            sortable: false,
            editable: false,
            width: 150,
        },
        {
            field: 'categoryId',
            headerName: 'Thể loại',
            sortable: true,
            editable: false,
            width: 150,
            valueGetter: (params) => getCategoryName(params.row.categoryId),
        },
        {
            field: 'old_price',
            headerName: 'Giá gốc',
            sortable: true,
            editable: false,
            width: 120,
            valueFormatter: (params) => {
                const price = params.value; // Giá gốc từ dữ liệu
                if (typeof price === 'number') {
                    // Kiểm tra nếu giá gốc là một số
                    return price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    });
                }
                // Nếu không phải số, trả về giá trị ban đầu
                return params.value;
            },
        },
        {
            field: 'rate',
            headerName: 'Đánh giá',
            sortable: true,
            editable: false,
            width: 120,
            renderCell: (params) => {
                return <p>{params.value} sao</p>;
            },
        },
        {
            field: 'sold',
            headerName: 'Đã bán',
            sortable: true,
            editable: false,
            width: 120,
        },
        {
            field: 'status',
            headerName: 'Tình trạng',
            sortable: false,
            editable: false,
            width: 120,
        },
    ];

    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    const handelLoading = () => {
        setIsLoading(!isLoading);
    };

    const handelSetting = () => {
        setIsLoading(!isLoading);
    };

    const [rows, setRows] = useState([]);
    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 70) + 1;
        fetch(`${api}/products`)
            .then((response) => response.json())
            .then((result) => {
                setRows(result.data);
            })
            .catch((err) => console.log(err));
    }, []);

    console.log(rows);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <p
                    style={{
                        margin: '0 0 0 20px',
                        flex: 2.5,
                    }}
                >
                    THIẾT LẬP TÙY CHỈNH
                </p>

                <div
                    style={{
                        display: 'flex',
                        flex: 7.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Alert
                        banner
                        type="info"
                        message={
                            <Marquee pauseOnHover gradient={false}>
                                {`Hướng dẫn: Chọn sản phẩm ở bảng bên dưới. Bạn có thể sử dụng bộ lọc bằng cách nhấn vào icon 3 chấm ở đầu mỗi cột, sau đó nhấn
                                icon xanh để tiến hành thiết lập FlashSale________`}
                            </Marquee>
                        }
                        style={{
                            width: '80%',
                            margin: '0 5% 0 0',
                            borderRadius: '6px',
                        }}
                    />
                    {/* <p className={cx('btn_load')} onClick={handelLoading}>
                        <AutorenewIcon className={cx('btn_icon_load')} />
                    </p> */}
                    <FlashSaleModal props={{ products: suggestFlash }} handelLoading={handelLoading} />
                </div>
            </div>
            <div className={cx('table')}>
                <EnhancedTable columns={columns} rows={rows} />
            </div>
        </div>
    );
}

export default CostumFlashSale;
