import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { api } from '../../../../constants';
import styles from './FlashSale.module.scss';
import EnhancedTable from '../../../components/Table/EnhancedTable';
import StateFlashSale from '../../../components/StateFlashSale';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddOptionModal from '../../../components/AddOptionModal';
import lottie from 'lottie-web';
import { Divider, Form, Button, Radio, Skeleton, Space, Switch, Alert } from 'antd';
import BarChartExample from '../../../components/charts/BarChar/BarChar';
import CustomPopconfirm from '../../../components/CustomPopconfirm/CustomPopconfirm';
import Marquee from 'react-fast-marquee';
const cx = classNames.bind(styles);

function FlashSale() {
    const container1 = useRef(null);
    const navigate = useNavigate();

    const moment = require('moment-timezone');

    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);

    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get('hours');


    lottie.loadAnimation({
        container: container1.current, // Thay container2.current bằng document.getElementById nếu bạn không sử dụng useRef.
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('../../../../assets/json/customAddFlashSale.json'),
    });

    const spaceSizeCol = [30, 150, 80, 80, 70, 60, 80, 30, 80, 160];
    const [isloadingdelete, setIsloadingdetele] = useState(null);
    const columns = [
        {
            field: 'rowNumber',
            headerName: 'STT',
            width: spaceSizeCol[0],
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <>
                        <p
                            style={{
                                padding: '0 0 0 10px',
                            }}
                        >
                            {params.value}
                        </p>
                    </>
                );
            },
        },
        {
            field: 'product',
            headerName: 'Tên sách',
            width: spaceSizeCol[1],
            sortable: false,
            editable: false,

            renderCell: (params) => {
                return (
                    <>
                        <p className={cx('text-container')}>
                            {params.value.title ? params.value.title : '[Không có thông tin]'}
                        </p>
                    </>
                );
            },
        },

        {
            field: 'point_sale',
            headerName: 'Khung giờ',
            sortable: true,
            editable: false,
            width: spaceSizeCol[2],
            renderCell: (params) => {
                return (
                    <p>{`${params.value * 3 < 10 ? `0${params.value * 3}` : params.value * 3}h - ${
                        (params.value + 1) * 3 < 10 ? `0${(params.value + 1) * 3}` : (params.value + 1) * 3
                    }h`}</p>
                );
            },
        },
        {
            field: 'date_sale',
            headerName: 'Ngày sale',
            sortable: true,
            editable: false,
            width: spaceSizeCol[3],
            renderCell: (params) => {
                return <p>{params.value}</p>;
            },
        },
        {
            field: 'num_sale',
            headerName: 'Số lượng',
            sortable: true,
            editable: false,
            width: spaceSizeCol[4],
        },
        {
            field: 'sold_sale',
            headerName: 'Đã bán',
            sortable: true,
            editable: false,
            width: spaceSizeCol[5],
        },

        {
            field: 'current_sale',
            headerName: 'Đang sale',
            editable: false,
            sortable: true,
            width: spaceSizeCol[6],
            renderCell: (params) => {
                return <p>{params.value} %</p>;
            },
        },
        {
            field: 'is_loop',
            headerName: 'Lặp',
            editable: false,
            sortable: true,
            width: spaceSizeCol[7],
            renderCell: (params) => {
                return <p>{params.value === true ? 'Có' : 'Không'}</p>;
            },
        },
        {
            headerName: 'Trạng thái',
            sortable: false,
            editable: false,
            width: spaceSizeCol[8],
            renderCell: (params) => {
                const currentDate = new Date();
                let current_point_sale = Math.floor(currentHourInVietnam / 3);
                const year = currentDate.getUTCFullYear();
                const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
                const day = currentDate.toString().slice(8, 10);
                const utcTimeString = `${year}-${month}-${day}`;
                let toDay = utcTimeString;

                return (
                    <p
                        className={
                            params.row.date_sale == toDay && params.row.point_sale == current_point_sale
                                ? cx('flashSaleText')
                                : params.row.date_sale > toDay ||
                                  (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
                                ? cx('noflashSaleText')
                                : cx('')
                        }
                    >
                        {params.row.date_sale == toDay && params.row.point_sale == current_point_sale
                            ? 'FlashSale'
                            : params.row.date_sale > toDay ||
                              (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
                            ? 'Đang đợi'
                            : 'Hết hạn'}
                    </p>
                );
            },
        },
        {
            field: 'action',
            headerName: 'Hành động',
            sortable: true,
            editable: false,
            headerAlign: 'marginLeft',
            width: spaceSizeCol[9],
            renderCell: (params) => {
                const currentDate = new Date();

                let current_point_sale = Math.floor(currentHourInVietnam / 3);
                const year = currentDate.getUTCFullYear();
                const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
                const day = currentDate.toString().slice(8, 10);
                const utcTimeString = `${year}-${month}-${day}`;
                let toDay = utcTimeString;

                return (
                    <>
                        <Button
                            type="primary"
                            ghost
                            style={{
                                margin: '0 10px 0 0',
                            }}
                            onClick={() => {
                                navigate(`/admin/flashsale/${params.row._id}`);
                            }}
                        >
                            Chi tiết
                        </Button>

                        <CustomPopconfirm
                            title="Xóa flashsale?"
                            description="Không hiển thị lại thông báo này"
                            props={{
                                disable:
                                    params.row.date_sale == toDay && params.row.point_sale == current_point_sale
                                        ? true
                                        : params.row.date_sale > toDay ||
                                          (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
                                        ? false
                                        : false,
                                isloadingdelete: isloadingdelete,
                            }}
                            func={() => {
                                setIsloadingdetele(true);
                                fetch(`${api}/flashsales/delete/${params.row._id}`, {
                                    method: 'GET',
                                })
                                    .then((response) => response.json())
                                    .then((result) => {
                                        if (result.status == 'OK') {
                                            //localStorage.setItem('isFlashsaleLoading', true);
                                            localStorage.setItem(
                                                'temporary_data',
                                                JSON.stringify({
                                                    ...JSON.parse(localStorage.getItem('temporary_data')),
                                                    flashsales: JSON.parse(
                                                        localStorage.getItem('temporary_data'),
                                                    ).flashsales.filter((item) => item._id != params.row._id),
                                                }),
                                            );
                                            setRows(
                                                JSON.parse(localStorage.getItem('temporary_data')).flashsales.filter(
                                                    (item) => item._id != params.row._id,
                                                ),
                                            );
                                        }
                                        setIsloadingdetele(false);
                                    })
                                    .catch((err) => console.log(err));
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const [suggestFlash, setSuggestFlash] = useState([]);

    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn

    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (localStorage.getItem('temporary_data')) {
            var data = JSON.parse(localStorage.getItem('temporary_data')).flashsales;
            setRows(data);
            if (localStorage.getItem('isFlashsaleLoading')) {
                //localStorage.removeItem('isFlashsaleLoading');
                fetch(`${api}/flashsales?sort=reverse`)
                    .then((response) => response.json())
                    .then((result) => {
                        setRows(result.data);
                        localStorage.setItem(
                            'temporary_data',
                            JSON.stringify({
                                ...JSON.parse(localStorage.getItem('temporary_data')),
                                flashsales: result.data,
                            }),
                        );
                        localStorage.removeItem('isFlashsaleLoading');
                    })
                    .catch((err) => console.log(err));
            }
        } else {
            fetch(`${api}/flashsales?sort=reverse`)
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
                    FLASH SALE
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
                            margin: '0 4% 0 0',
                            borderRadius: '6px',
                        }}
                    />

                    <AddOptionModal container={container1} />
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('table')}>
                    <EnhancedTable
                        ischeckboxSelection={false}
                        columns={columns}
                        rows={rows.map((row, index) => ({
                            ...row,
                            rowNumber: index + 1,
                        }))}
                        func={setSuggestFlash}
                        isStatus={{
                            isToggle: isToggle,
                        }}
                        pageSize={12}
                    />
                </div>
                <div className={cx('state')}>{rows && <BarChartExample data={rows} />}</div>
            </div>
        </div>
    );
}

export default FlashSale;
