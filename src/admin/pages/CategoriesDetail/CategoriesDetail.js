import { Backdrop, CircularProgress, Dialog, Rating } from '@mui/material';
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import numeral from 'numeral';
import React from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { api } from '../../../constants';
import { useData } from '../../../stores/DataContext';
import { useStore } from '../../../stores/hooks';
import EnhancedTable from '../../components/Table/EnhancedTable';

function CategoriesDetail() {
    const { cid } = useParams();
    const [products, setProducts] = React.useState([]);
    const [totalSold, setTotalSold] = React.useState([]);
    const [totalProduct, setTotalProduct] = React.useState([]);
    const [category, setCategory] = React.useState();
    const [displayForm, setDisplayForm] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(0);
    const [changed, setChanged] = React.useState(false);
    const { data, setData } = useData();
    const [state, dispatch] = useStore();

    React.useEffect(() => {
        fetchProduct(cid);
        fetchCategory(cid);
    }, [cid]);

    const fetchCategory = () => {
        axios
            .get(`${api}/categories/${cid}`)
            .then((response) => {
                if (response.data.status == 'OK') {
                    setCategory(response.data.data);
                }
            })
            .catch((error) => console.error(error));
    };

    const fetchProduct = (id) => {
        const listProduct = data?.products?.filter((product) => product?.categoryId?._id == id);

        const calTotalSold = listProduct?.reduce((acc, curr) => acc + curr.sold, 0);

        const calTotalProduct = listProduct?.reduce((acc, curr) => acc + curr.quantity, 0);

        setProducts(listProduct);
        setTotalSold(calTotalSold);
        setTotalProduct(calTotalProduct);
    };

    const handleDisplayForm = () => {
        setDisplayForm(true);
    };

    React.useEffect(() => {
        if (success != 0) {
            fetch(`${api}/categories?filter=simple`)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status == 'OK') {
                        setData({ ...data, categories: result.data });
                    }
                })
                .catch((err) => console.log(err.message));

            fetchCategory(cid);
        }
    }, [success]);

    const handleOk = (value) => {
        setLoading(true);
        state.authInstance
            .put(`/categories/${cid}`, { ...value })
            .then(async (response) => {
                if (response.data.status == 'OK') {
                    setDisplayForm(false);
                    toast.success('Sửa thành công!');
                    setSuccess((prev) => (prev += 1));
                } else {
                    toast.error(response.data.message);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.response.data.message);
                setLoading(false);
            });
    };
    const handleCancel = () => {
        setDisplayForm(false);
    };

    const checkChanged = (e) => {
        if (e.target.value?.trim() == category?.name) {
            setChanged(true);
        } else {
            setChanged(false);
        }
    };

    const columns = [
        {
            field: 'title',
            headerName: 'Sản phẩm',
            sortable: false,
            editable: true,
            width: 400,
            renderCell: (params) => (
                <p className={params.value ? '' : 'text-red-600'}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'images',
            headerName: 'Images',
            sortable: false,
            editable: true,
            renderCell: (params) => <img className="w-[60px] h-[50px] object-contain" src={params.value} />,
        },
        {
            field: 'author',
            headerName: 'Tác giả',
            sortable: false,
            editable: true,
            width: 180,
            renderCell: (params) => (
                <p className={params.value ? '' : 'text-red-600'}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'published_date',
            headerName: 'Ngày xuất bản',
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? '' : 'text-red-600'}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'price',
            headerName: 'Giá hiện tại(đ)',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? '' : 'text-red-600'}>
                    {params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : 'Trống'}
                </p>
            ),
        },
        {
            field: 'old_price',
            headerName: 'Giá cũ(đ)',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? '' : 'text-red-600'}>
                    {params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : 'Trống'}
                </p>
            ),
        },
        {
            field: 'rate',
            headerName: 'Đánh giá',
            width: 160,
            sortable: true,
            renderCell: (params) => <Rating name="read-only" value={params.value} readOnly />,
        },
    ];

    return (
        <div className="p-[20px]">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loading}>
                <CircularProgress color="error" />
            </Backdrop>
            <Dialog open={displayForm} onClose={handleCancel}>
                <div className="p-[20px] w-[50rem]">
                    <h1 className="py-[20px] text-[2rem] text-[#333] font-[600]">Chỉnh sửa danh mục sản phẩm</h1>
                    <Form
                        layout="vertical"
                        onFinish={handleOk}
                        autoComplete="off"
                        style={{
                            width: '100%',
                        }}
                    >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng không để trống thông tin này',
                                },
                            ]}
                        >
                            <Input defaultValue={category?.name} onChange={(e) => checkChanged(e)} />
                        </Form.Item>

                        <Form.Item
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button disabled={changed} type="primary" htmlType="submit">
                                Chỉnh sửa
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Dialog>
            <div className="border rounded-[12px] shadow-sm py-[20px] px-[40px] flex items-center justify-between">
                <div className="flex flex-col items-center justify-center">
                    <h1>Tên</h1>
                    <span className="text-[2rem] text-[#333] font-[600] mt-[10px]">{category?.name}</span>
                    <Button onClick={handleDisplayForm} className="mt-[20px]">
                        Chỉnh sửa tên
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p>Trong kho</p>
                    <span className="text-[2rem] text-[#333] font-[600] mt-[10px]">{totalProduct} sản phẩm</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p>Đã bán</p>
                    <span className="text-[2rem] text-[#333] font-[600] mt-[10px]">{totalSold} sản phẩm</span>
                </div>
            </div>
            <div className="mt-[10px]">
                <EnhancedTable
                    ischeckboxSelection={false}
                    pageSize={12}
                    columns={columns}
                    type="categoryDetail"
                    height="67vh"
                    rows={products}
                />
            </div>
        </div>
    );
}

export default CategoriesDetail;
