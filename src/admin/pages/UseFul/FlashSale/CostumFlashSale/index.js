import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../../../constants';
import SimpleItem from '../../../../components/SimpleItem';
import styles from './CostumFlashSale.module.scss';
import EnhancedTable from '../../../../components/Table/EnhancedTable';
import StateFlashSale from '../../../../components/StateFlashSale';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FlashSaleModal from '../../../../components/FlashSaleModal';
import { Divider, Form, Radio, Skeleton, Space, Switch, Alert } from 'antd';
import Marquee from 'react-fast-marquee';
const cx = classNames.bind(styles);

function CostumFlashSale() {
    const getCategoryName = (categoryId) => {
        // categoryId là đối tượng danh mục
        // Thực hiện logic để lấy tên danh mục từ categoryId
        // Trả về tên danh mục
        return categoryId ? categoryId.name : '[Khác]'; // Ví dụ: Lấy name từ đối tượng danh mục
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
        { field: 'title', headerName: 'Tên sách', width: 250, sortable: false },
        {
            field: 'author',
            headerName: 'Tác giả',
            sortable: false,
            editable: false,
            width: 150,
            renderCell: (params) => {
                return <p>{params.value ? params.value : '[Không có thông tin]'}</p>;
            },
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
            width: 110,
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
            field: 'price',
            headerName: 'Đang giảm',
            editable: false,
            width: 110,
            renderCell: (params) => {
                return <p>{Math.ceil(((params.row.old_price - params.value) * 100) / params.row.old_price)} %</p>;
            },
        },
        {
            field: 'rate',
            headerName: 'Đánh giá',
            sortable: true,
            editable: false,
            width: 110,
            renderCell: (params) => {
                return <p>{params.value} sao</p>;
            },
        },
        {
            field: 'sold',
            headerName: 'Đã bán',
            sortable: true,
            editable: false,
            width: 110,
        },
        {
            field: '_id',
            headerName: 'Trạng thái',
            sortable: false,
            editable: false,
            width: 110,
            renderCell: (params) => {
                return <StateFlashSale params={params.value} isToggle={isToggle} />;
            },
        },
    ];

    const [suggestFlash, setSuggestFlash] = useState([]);

    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn

    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (localStorage.getItem('temporary_data')) {
            var data = JSON.parse(localStorage.getItem('temporary_data')).products;
            setRows(data);
        } else {
            fetch(`${api}/products`)
                .then((response) => response.json())
                .then((result) => {
                    setRows(result.data);
                })
                .catch((err) => console.log(err));
        }
    }, []);

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
                                nút mũi tên xanh để tiến hành thiết lập FlashSale.________`}
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
                    <FlashSaleModal
                        props={{ products: suggestFlash }}
                        func={setIsToggle}
                        isStatus={{
                            isToggle: isToggle,
                        }}
                    />
                </div>
            </div>
            <div className={cx('table')}>
                <EnhancedTable
                    columns={columns}
                    rows={rows}
                    func={setSuggestFlash}
                    isStatus={{
                        isToggle: isToggle,
                    }}
                />
            </div>
        </div>
    );
}

export default CostumFlashSale;
