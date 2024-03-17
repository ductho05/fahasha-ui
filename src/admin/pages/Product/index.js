import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api, appPath } from '../../../constants';
import { Rating } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import numeral from 'numeral';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Delete, Update } from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Dialog } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress, Backdrop } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Dropdown from 'react-multilevel-dropdown';
import { Input, DatePicker, Form, Button, Skeleton, Popconfirm, Select, Rate, Checkbox, Tooltip } from 'antd';
import SendNotification from '../../../service/SendNotification';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useData } from '../../../stores/DataContext';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '../../../components/Popper';
import { CloseOutlined, FilterOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import BlockIcon from '@mui/icons-material/Block';
import { Editor } from '@tinymce/tinymce-react';

const cx = classNames.bind(styles);

const sortOptions = [
    {
        label: 'Mặc định',
        value: 'default',
    },
    {
        label: 'Giá cao nhất',
        value: 'price_desc',
    },
    {
        label: 'Giá thấp nhất',
        value: 'price_asc',
    },
    {
        label: 'Đánh giá cao nhất',
        value: 'rate_desc',
    },
    {
        label: 'Đánh giá thấp nhất',
        value: 'rate_asc',
    },
];

const priceOptions = [
    {
        label: '0đ - 150,000 đ',
        valueMin: 0,
        valueMax: 150000,
    },
    {
        label: '150000 đ - 300,000 đ',
        valueMin: 150000,
        valueMax: 300000,
    },
    {
        label: '300,000 đ - 500,000 đ',
        valueMin: 300000,
        valueMax: 500000,
    },
    {
        label: '500,000 đ - 700,000 đ',
        valueMin: 500000,
        valueMax: 700000,
    },
    {
        label: '700.000 đ - Trở lên',
        valueMin: 700000,
    },
];

const rateOptions = [1, 2, 3, 4, 5];

const quantityOptions = [
    {
        label: 'Còn hàng',
        value: true,
    },
    {
        label: 'Hết hàng',
        value: false,
    },
];

const statusOptions = [
    {
        label: 'Hoạt động',
        value: true,
    },

    {
        label: 'Ngưng bán',
        value: false,
    },
];

function Product() {
    const authInstance = getAuthInstance();
    const [temporary_data, setTemporary_data] = useState([]); // lưu lại những sản phẩm đã chọn để gợi ý
    const [showDialog, setShowDialog] = useState(false);
    const [published, setPublished] = useState();
    const [rows, setRows] = useState([]);
    const [avatar, setAvatar] = useState();
    const [loading, setLoading] = useState(false);
    const [isAction, setIsAction] = useState(false);
    const [options, setOptions] = useState([]);
    const [success, setSuccess] = useState(0);
    const { data, setData } = useData();
    const [errors, setErrors] = useState({});
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const [selectCategory, setSelectCategory] = useState(null);
    const [selectSort, setSelectSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [keywords, setKeywords] = useState(null);
    const [status, setStatus] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [desciption, setDesciption] = React.useState(null);

    const updateProductData = (product) => {
        const newListProduct = data.products?.map((p) => {
            if (p._id === product._id) {
                return { ...product };
            } else return p;
        });

        setData({ ...data, products: newListProduct });
    };

    const insertProductData = (product) => {
        const newList = data?.products;
        newList.push(product);
        setData({ ...data, products: newList });
    };

    const columns = [
        {
            field: 'rowNumber',
            headerName: 'STT',
            width: 30,
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
            field: 'title',
            headerName: 'Sản phẩm',
            sortable: false,
            editable: true,
            width: 320,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'images',
            headerName: 'Images',
            sortable: false,
            editable: true,
            renderCell: (params) => <img className={cx('image')} src={params.value} />,
        },
        {
            field: 'author',
            headerName: 'Tác giả',
            sortable: false,
            editable: true,
            width: 160,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'price',
            headerName: 'Giá hiện tại(đ)',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>
                    {params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : 'Trống'}
                </p>
            ),
        },
        {
            field: 'rate',
            headerName: 'Đánh giá',
            width: 120,
            sortable: true,
            renderCell: (params) => <Rating name="read-only" value={params.value} readOnly />,
        },
        {
            field: 'status_sell',
            headerName: 'Trạng thái',
            width: 120,
            renderCell: (params) => {
                return (
                    <p
                        className={
                            params ? (params?.value == false ? 'text-red-500' : 'text-green-500') : 'text-green-500'
                        }
                    >
                        {' '}
                        {params ? (params?.value == false ? 'Ngưng bán' : 'Hoạt động') : 'Hoạt động'}
                    </p>
                );
            },
        },
        {
            field: 'quantity',
            headerName: 'Tình trạng',
            width: 120,
            renderCell: (params) => {
                return (
                    <p className={params?.value === 0 ? 'text-red-500' : 'text-green-500'}>
                        {' '}
                        {params?.value === 0 ? 'Hết hàng' : 'Còn hàng'}
                    </p>
                );
            },
        },

        {
            field: '_id',
            headerName: 'Hành động',
            disableColumnMenu: true,
            sortable: false,
            width: 120,
            renderCell: (params) => {
                const handleOnCLick = (e) => {
                    e.stopPropagation();
                };

                const handleUpdateStatus = (status_sell) => {
                    let status;
                    if (params.row.hasOwnProperty('status_sell') && status_sell === false) {
                        status = true;
                    } else {
                        status = false;
                    }
                    setLoading(true);
                    setIsAction(true);
                    authInstance
                        .put(`${api}/products/update/${params.row._id}`, {
                            status_sell: status,
                        })
                        .then(async (result) => {
                            if (result.data.status === 'OK') {
                                updateProductData(result.data.data);
                                const title = 'Thông báo sản phẩm';
                                let description = `${result.data.data.title} vừa được mở bán trở lại`;
                                if (!result.data.data.status_sell) {
                                    description = `${result.data.data.title} tạm thời ngưng bán`;
                                }
                                const url = `${appPath}/admin/products/${result.data.data._id}`;
                                const image = result.data.data.images;
                                // await authInstance
                                //     .post('/webpush/send', {
                                //         filter: 'admin',
                                //         notification: {
                                //             title,
                                //             description,
                                //             image: image,
                                //             url,
                                //         },
                                //     })
                                //     .catch((err) => {
                                //         console.error(err);
                                //     });
                                toast.success('Cập nhật thành công!');
                                setSuccess((prev) => prev + 1);
                            } else {
                                toast.error(result.data.message);
                            }
                            setLoading(false);
                            setIsAction(false);
                        })
                        .catch((err) => {
                            setLoading(false);
                            setIsAction(false);
                            toast.error(err?.response?.data?.message);
                        });
                };

                return (
                    <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                        <Popconfirm
                            title="Xác nhận?"
                            description={
                                params.row.hasOwnProperty('status_sell')
                                    ? params.row.status_sell === false
                                        ? 'Sản phẩm sẽ được bán lại trên hệ thống'
                                        : 'Sản phẩm sẽ không bán trên hệ thống cho đến khi mở lại'
                                    : 'Sản phẩm sẽ không bán trên hệ thống cho đến khi mở lại'
                            }
                            onConfirm={() => handleUpdateStatus(params.row.status_sell)}
                            onCancel={() => {}}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Tooltip
                                title={
                                    params.row.hasOwnProperty('status_sell')
                                        ? params.row.status_sell === false
                                            ? 'Mở bán lại sản phẩm'
                                            : 'Ngưng bán sản phẩm'
                                        : 'Ngưng bán sản phẩm'
                                }
                            >
                                <Button
                                    className="mr-[20px]"
                                    icon={
                                        params.row.hasOwnProperty('status_sell') ? (
                                            params.row.status_sell === false ? (
                                                <UnlockOutlined />
                                            ) : (
                                                <LockOutlined />
                                            )
                                        ) : (
                                            <LockOutlined />
                                        )
                                    }
                                    danger
                                />
                            </Tooltip>
                        </Popconfirm>
                        <Link to={`/admin/products/${params.row._id}`}>
                            <Tooltip title="Chỉnh sửa">
                                <Button type="primary" ghost icon={<EditOutlined />} />
                            </Tooltip>
                        </Link>
                    </div>
                );
            },
        },
    ];

    console.log('dat3123a', rows);

    // fetch(`${api}/products`)
    //     .then((response) => response.json())
    //     .then((result) => {
    //         if (result.status === 'OK') {
    //             console.log('fetch lai');
    //             setData({ ...data, products: result.data.products });
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(error.message);
    //     });

    // React.useEffect(() => {
    //     setRows(data.products);
    // }, [data]);

    // React.useEffect(() => {

    //     if (success !== 0) {
    //         fetchProduct();
    //     }
    // }, [success]);

    useEffect(() => {
        fetch(`${api}/categories?filter=simple`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    const newList = result.data.map((category) => {
                        return {
                            label: category.name,
                            value: category._id,
                        };
                    });
                    setOptions(newList);
                }
            })
            .catch((err) => console.log(err.message));
    }, []);

    console.log('dat322123a', temporary_data);

    const onFinish = async (data) => {
        if (Object.keys(errors).length <= 0) {
            if (!desciption) {
                setErrors((prev) => {
                    return {
                        ...prev,
                        desciption: 'Vui lòng nhập mô tả',
                    };
                });
            }
            if (!avatar) {
                setErrors((prev) => {
                    return {
                        ...prev,
                        image: 'Vui lòng chọn hình ảnh',
                    };
                });
            } else if (!published) {
                setErrors((prev) => {
                    return {
                        ...prev,
                        published: 'Vui lòng chọn ngày xuất bản',
                    };
                });
            } else if (parseInt(data.old_price) < parseInt(data.price)) {
                setErrors((prev) => {
                    return {
                        ...prev,
                        old_price: 'Giá cũ phải lớn hơn hoặc bằng giá hiện tại',
                    };
                });
            } else {
                const formData = new FormData();
                Object.keys(data).forEach((key) => {
                    formData.append(key, data[key]);
                });
                formData.append('images', avatar);
                formData.append('published_date', published);
                formData.append('desciption', desciption);

                setLoading(true);
                await authInstance
                    .post(`/products/add`, formData)
                    .then(async (result) => {
                        if (result.data.status === 'OK') {
                            setSuccess((prev) => prev + 1);
                            insertProductData(result.data.data);
                            const title = 'Thông báo sản phẩm';
                            const description = 'TA Book Store vừa ra mắt sản phẩm mới. Xem ngay';
                            const url = `${appPath}/product-detail/${result.data.data._id}`;
                            const image = result.data.data.images;
                            // await authInstance
                            //     .post('/webpush/send', {
                            //         filter: 'all',
                            //         notification: {
                            //             title,
                            //             description,
                            //             image: image,
                            //             url,
                            //         },
                            //     })
                            //     .catch((err) => {
                            //         console.error(err);
                            //     });
                            setShowDialog(false);
                            toast.success('Thêm mới sản phẩm thành công');
                        } else {
                            toast.error(result.data.message);
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        toast.error(err?.response?.data?.message);
                    });
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (published) {
            setErrors((prev) => {
                delete prev.published;
                return {
                    ...prev,
                };
            });
        }
    }, [published]);

    useEffect(() => {
        if (desciption) {
            setErrors((prev) => {
                delete prev.desciption;
                return {
                    ...prev,
                };
            });
        }
    }, [desciption]);

    useEffect(() => {
        if (avatar) {
            setErrors((prev) => {
                delete prev.image;
                return {
                    ...prev,
                };
            });
        }
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    const handleChooseImage = (e) => {
        if (e.target.files.length > 0) {
            if (e.target.files[0].type.startsWith('image')) {
                const file = e.target.files[0];
                file.preview = URL.createObjectURL(file);

                setAvatar(file);
            } else {
                setAvatar(null);
                setErrors((prev) => {
                    return {
                        ...prev,
                        image: 'Vui lòng chọn loại tệp hình ảnh',
                    };
                });
            }
        }
    };

    const changeDate = (date, dateString) => {
        if (dateString) {
            const currentDate = new Date();
            const datePublish = new Date(dateString);

            if (currentDate < datePublish) {
                setErrors((prev) => {
                    return {
                        ...prev,
                        published: 'Vui lòng không chọn ngày xuất bản trong tương lai',
                    };
                });
            } else {
                setErrors((prev) => {
                    delete prev.published;
                    return {
                        ...prev,
                    };
                });
                setPublished(dateString);
            }
        } else {
            setErrors((prev) => {
                return {
                    ...prev,
                    published: 'Vui lòng chọn ngày xuất bản',
                };
            });
        }
    };

    const handleEditorChange = (value) => {
        setDesciption(value);
    };

    const handleShowDialog = () => {
        setShowDialog(true);
        setErrors({});
    };

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChangeCategory = (value, option) => {
        setSelectCategory(option);
    };

    const handleSortChange = (value, option) => {
        setSelectSort(option);
    };

    const handleChangePrice = (option) => {
        setPrice(option);
    };

    const handleChangeRate = (rateItem) => {
        setRate(rateItem);
    };

    const handleShowFilter = () => {
        setShowFilter((prev) => !prev);
    };

    const handleClearFilter = () => {
        setPrice(null);
        setRate(null);
        setSelectCategory(null);
        setQuantity(null);
        setStatus(null);
        // setRows(data?.products);
        const productsToSort = [...(data?.products || data?.tem_products)];
        const sortedProducts = productsToSort.sort((a, b) => a.title.localeCompare(b.title));
        setRows(sortedProducts);
    };

    const handleSearch = (value) => {
        setKeywords(value);
    };
    console.log('adugas213hbj', rows);

    console.log('sfyugasjh', rows, data);

    const filterProduct = (rate, price, category, keywords, quantity, status) => {
        let newList = data?.products?.length > 0 ? [...data.products] : [...temporary_data];
        // console.log('dang filter', newList);
        newList = newList.filter((product) => {
            if (keywords) {
                // console.log('dang 123', product.title.toLowerCase().includes(keywords.toLowerCase()));
                if (rate && price && selectCategory) {
                    if (price.valueMax) {
                        return (
                            product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin &&
                            product.price <= price.valueMax
                        );
                    } else {
                        return (
                            product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin
                        );
                    }
                } else if (rate && price) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.rate === rate &&
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax
                    );
                } else if (rate && category) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.rate === rate &&
                        product.categoryId._id === category.value
                    );
                } else if (price && category) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax &&
                        product.categoryId._id === category.value
                    );
                } else if (rate) {
                    return product.title.toLowerCase().includes(keywords.toLowerCase()) && product.rate === rate;
                } else if (price) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax
                    );
                } else if (category) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.categoryId._id === category.value
                    );
                } else return product.title.toLowerCase().includes(keywords.toLowerCase());
            } else {
                if (rate && price && selectCategory) {
                    if (price.valueMax) {
                        return (
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin &&
                            product.price <= price.valueMax
                        );
                    } else {
                        return (
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin
                        );
                    }
                } else if (rate && price) {
                    return product.rate === rate && product.price >= price.valueMin && product.price <= price.valueMax;
                } else if (rate && category) {
                    return product.rate === rate && product.categoryId._id === category.value;
                } else if (price && category) {
                    return (
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax &&
                        product.categoryId._id === category.value
                    );
                } else if (rate) {
                    return product.rate === rate;
                } else if (price) {
                    return price.valueMax
                        ? product.price >= price.valueMin && product.price <= price.valueMax
                        : product.price >= price.valueMin;
                } else if (category) {
                    return product.categoryId._id === category.value;
                } else return product;
            }
        });

        if (quantity) {
            const list2 = newList?.filter((product) => {
                if (quantity.value) {
                    return product.quantity > 0;
                } else return product.quantity === 0;
            });
            newList = [...list2];
        }

        if (status) {
            const list3 = newList.filter((product) => {
                if (product.hasOwnProperty('status_sell')) {
                    return product.status_sell === status.value;
                } else {
                    if (status.value) {
                        return product;
                    } else {
                        return null;
                    }
                }
            });
            newList = [...list3];
        }

        newList !== undefined && setRows(newList); // : setRows(data.products);
    };

    // console.log('dfyhasv', rows);

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, quantity, status);
        filterProduct(rate, price, selectCategory, keywords, quantity, status);
        setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [rate, price, selectCategory, keywords, quantity, status]);

    useEffect(() => {
        if (selectSort) {
            sortProduct(selectSort);
            // setIsSort(false);
        }
    }, [selectSort]);

    const sortProduct = (sort) => {
        let newList2 = [...rows].sort((a, b) => {
            if (sort.value == 'price_asc') {
                return a.price - b.price;
            } else if (sort.value == 'price_desc') {
                return b.price - a.price;
            } else if (sort.value == 'rate_asc') {
                return a.rate - b.rate;
            } else if (sort.value == 'rate_desc') {
                return b.rate - a.rate;
            } else {
                return a.title.localeCompare(b.title);
            }
        });
        //  console.log('newList42222', newList);
        //  setIsSort(false);
        setRows(newList2);
    };

    useEffect(() => {
        if (data?.products?.length > 0) {
            //var data1 = data.products;
            // console.log('kdhas', data1);
            handleClearFilter();
            //setRows(data1.sort((a, b) => a.title.localeCompare(b.title)));
            console.log('g321hádfb', data?.products?.length, temporary_data.length);
        } else {
            if (data.products?.length == 0) {
                // ngăn load lại 2 lần data không cần thiết
                // fetch(`${api}/products?perPage=50`)
                //     .then((response) => response.json())
                //     .then((result) => {
                //         console.log('ghádfb2');
                if (data?.tem_products?.length > 0) {
                    // console.log('ghádfb3234', data.tem_products);
                    setTemporary_data(data.tem_products);
                    setRows([...data.tem_products].sort((a, b) => a.title.localeCompare(b.title)));
                }
            }
        }
    }, [data]);

    return (
        <div className={cx('wrapper')}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Dialog
                open={showDialog}
                onClose={() => {
                    setErrors({});
                    setShowDialog(false);
                }}
            >
                <div className={cx('dialog_add_user')}>
                    <h1 className="uppercase text-red-500 font-[600] text-center mb-[20px]">Thêm sản phẩm mới</h1>
                    <p className={cx('btn_close')} onClick={() => setShowDialog(false)}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="true">
                        <Form.Item
                            label="Tên"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tên sản phẩm" />
                        </Form.Item>

                        <Form.Item
                            label="Tác giả"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tên tác giả" />
                        </Form.Item>

                        <Form.Item
                            label="Giá hiện tại"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input type="number" placeholder="Nhập giá hiện tại" min="1000" />
                        </Form.Item>

                        <Form.Item
                            label="Giá cũ"
                            name="old_price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input type="number" placeholder="Nhập giá cũ" min="1000" />
                        </Form.Item>
                        {errors.old_price && <p className="text-red-500 mt-[10px]">{errors.old_price}</p>}

                        <Form.Item
                            label="Danh mục sản phẩm"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn danh mục sản phẩm"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                options={options}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số lượng nhập"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống!',
                                },
                            ]}
                        >
                            <Input type="number" min="1" />
                        </Form.Item>
                        <p className={cx('label')}></p>
                        <div className="flex flex-col">
                            <p className={cx('label')}>
                                <span className="text-red-500 text-right mr-[5px]">*</span>
                                Năm xuất bản:
                            </p>
                            <div className="flex flex-[18] justify-start">
                                <DatePicker onChange={changeDate} />
                            </div>
                            {errors.published && <p className="text-red-500 mt-[10px]">{errors.published}</p>}
                        </div>
                        <p className={cx('label')}></p>
                        <p className={cx('label')}>
                            <span className="text-red-500 text-right mr-[5px]">*</span>
                            Mô tả:
                        </p>
                        <div className="flex justify-start w-full">
                            <Editor
                                apiKey="d5t4u2d5qyjye0wlx6xiu3sznmxxu7p9ltiwar6n22xi56ln"
                                init={{
                                    plugins:
                                        'spellchecker tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker a11ychecker typography inlinecss',
                                    toolbar:
                                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                    tinycomments_mode: 'embedded',
                                    tinycomments_author: 'Author name',
                                    spellchecker_language: 'vi_VN',
                                    spellchecker_underline: false,
                                    mergetags_list: [
                                        { value: 'First.Name', title: 'First Name' },
                                        { value: 'Email', title: 'Email' },
                                    ],
                                }}
                                value={desciption}
                                onEditorChange={handleEditorChange}
                            />
                        </div>
                        {errors?.desciption && (
                            <p className="text-red-500 my-[10px] text-[1.4rem]">Vui lòng nhập mô tả</p>
                        )}

                        <div className="flex flex-col mb-[20px]">
                            <p className={cx('label')}>
                                <span className="text-red-500 text-right mr-[5px]">*</span>
                                Hình ảnh:
                            </p>
                            <div className={cx('avatar')}>
                                <p className={cx('edit_avatar')}>
                                    <label for="image">
                                        <AccountCircleIcon className={cx('icon')} />
                                        Chọn
                                    </label>
                                    <input type="file" id="image" name="image" onChange={(e) => handleChooseImage(e)} />
                                </p>
                                {avatar && <img src={avatar.preview} />}
                            </div>
                            {errors.image && <p className="text-red-500 mt-[10px]">{errors.image}</p>}
                        </div>
                        <Form.Item
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Dialog>
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loading}>
                <CircularProgress color="error" />
            </Backdrop>
            <div className={cx('heading')}>
                <h3>Quản lý sản phẩm</h3>
                <p onClick={handleShowDialog} className={cx('btn_add_new')}>
                    <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                    <span>Thêm mới</span>
                </p>
            </div>

            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        disabled={data?.products?.length == 0 && temporary_data.length == 0}
                        className="w-[200px]"
                        placeholder="Chọn..."
                        options={sortOptions}
                        onChange={handleSortChange}
                        value={
                            selectSort
                                ? {
                                      label: selectSort.label,
                                      value: selectSort.value,
                                  }
                                : null
                        }
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Input.Search
                        disabled={data?.products?.length == 0 && temporary_data.length == 0}
                        // onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-[400px]"
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
                        interactive={true}
                        disabled={data?.products?.length == 0 && temporary_data.length == 0}
                        visible={showFilter}
                        placement="bottom"
                        render={(attrs) => (
                            <div
                                className="tippy-admin max-w-max min-w-[280px] shadow-lg max-h-[64vh] overflow-y-scroll"
                                tabIndex="-1"
                                {...attrs}
                            >
                                <PopperWrapper>
                                    <div className="relative h-max px-[20px] pb-[20px] pt-[30px] rounded-[12px]">
                                        {rate || price || selectCategory || quantity || status ? (
                                            <div>
                                                {status && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Trạng thái: {status.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setStatus(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {quantity && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Tình trạng: {quantity.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setQuantity(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {selectCategory && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Nhóm: {selectCategory.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setSelectCategory(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {rate && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem]">Sao: {rate}</p>
                                                        <CloseOutlined
                                                            onClick={() => setRate(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {price && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem]">Giá: {price.label}</p>
                                                        <CloseOutlined
                                                            onClick={() => setPrice(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    onClick={handleClearFilter}
                                                    className="mb-[10px] cursor-pointer w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500"
                                                >
                                                    <p className="text-[1.3rem]">Xóa bộ lọc</p>
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div
                                            className="absolute top-[8px] right-[8px] p-[6px] cursor-pointer hover:bg-slate-200 rounded-[50%]"
                                            onClick={() => setShowFilter(false)}
                                        >
                                            <CloseOutlined className="text-[1.4rem]" />
                                        </div>
                                        <div className="border-b">
                                            <h1 className="text-[1.4rem] text-[#333] uppercase font-[600]">
                                                Nhóm sản phẩm
                                            </h1>
                                            <Select
                                                onChange={handleChangeCategory}
                                                showSearch
                                                placeholder="Chọn danh mục"
                                                optionFilterProp="children"
                                                filterOption={filterOption}
                                                options={options}
                                                className="my-[20px] w-full"
                                            />
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">
                                                Trạng thái
                                            </h1>
                                            {statusOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            setStatus(option);
                                                        }}
                                                        checked={option.value === status?.value}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option?.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">
                                                Tình trạng
                                            </h1>
                                            {quantityOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            setQuantity(option);
                                                        }}
                                                        checked={option.value === quantity?.value}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">Giá</h1>
                                            {priceOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => handleChangePrice(option)}
                                                        checked={option.valueMin === price?.valueMin}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">Đánh giá</h1>
                                            {rateOptions.map((rateItem) => (
                                                <div key={rateItem} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => handleChangeRate(rateItem)}
                                                        checked={rate === rateItem}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        <Rate
                                                            style={{
                                                                fontSize: '1.4rem',
                                                            }}
                                                            disabled
                                                            defaultValue={rateItem}
                                                        />
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopperWrapper>
                            </div>
                        )}
                    >
                        <Button icon={<FilterOutlined />} className="w-[200px]" onClick={handleShowFilter}>
                            Lọc
                        </Button>
                    </Tippy>
                </div>
            </div>
            <p> {data?.products?.length}</p>
            {rows && (
                <EnhancedTable
                    ischeckboxSelection={false}
                    pageSize={12}
                    type="product"
                    height="70vh"
                    columns={columns}
                    rows={rows?.map((row, index) => ({
                        ...row,
                        rowNumber: index + 1,
                    }))}
                />
            )}
        </div>
    );
}

export default Product;
