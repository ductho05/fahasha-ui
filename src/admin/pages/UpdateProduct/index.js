import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UpdateProduct.module.scss';
import { TextField } from '@mui/material';
import Button from '../../../components/Button';
import { api, apiKeyEditor } from '../../../constants';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress, Backdrop, LinearProgress } from '@mui/material';
import { DatePicker, Select } from 'antd';

import { Skeleton } from 'antd';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useData } from '../../../stores/DataContext';
import { Editor } from '@tinymce/tinymce-react';
import { replaceInvalidDateByNull } from '@mui/x-date-pickers/internals';

const cx = classNames.bind(styles);

function UpdateProduct() {
    const authInstance = getAuthInstance();

    const { pid } = useParams();
    const [options, setOptions] = React.useState([]);
    const [published, setPublished] = React.useState();
    const [product, setProduct] = React.useState({});
    const [avatar, setAvatar] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [isAction, setIsAction] = React.useState(false);
    const [isChanged, setIsChanged] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const { data, setData } = useData();
    const [categoryName, setCategoryName] = React.useState({
        name: '--Chọn danh mục sản phẩm--',
        value: '',
    });
    const [imageErrors, setImageError] = React.useState(null);
    const [priceErrors, setPriceError] = React.useState(null);
    const [publishedErrors, setPublishedError] = React.useState(null);
    const [desciption, setDesciption] = React.useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        unregister,
        formState: { errors },
    } = useForm();

    const updateProductData = (product) => {
        console.log(product);
        const newListProduct = data.products?.map((p) => {
            if (p._id === product._id) {
                return { ...product };
            } else return p;
        });

        setData({ ...data, products: newListProduct });
    };

    React.useEffect(() => {
        console.log(data);
    }, [data]);
    React.useEffect(() => {
        fetch(`${api}/categories?filter=simple&lock=true`)
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

    React.useEffect(() => {
        setLoading(true);
        fetch(`${api}/products/id/${pid}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    setProduct(result.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [success]);

    const fetchProduct = () => {
        fetch(`${api}/products`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    console.log('fetch lai');
                    setData({ ...data, products: result.data });
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    React.useEffect(() => {
        Object.keys(product).forEach((key) => {
            setValue(key, product[key]);
        });
        setCategoryName({
            name: product.categoryId?.name,
            value: product.categoryId?._id,
        });
        setPublished(product.published_date);
        unregister('__v');
    }, [product]);

    const handleDate = (date, dateString) => {
        if (dateString) {
            const currentDate = new Date();
            const datePublish = new Date(dateString);

            if (currentDate < datePublish) {
                setPublishedError('Vui lòng không chọn ngày xuất bản trong tương lai');
            } else {
                setPublishedError(null);
                setPublished(dateString);
            }
        } else {
            setPublishedError('Vui lòng chọn ngày xuất bản');
        }
    };

    const handleChangeImage = (e) => {
        if (e.target.files.length > 0) {
            if (e.target.files[0].type.startsWith('image')) {
                const file = e.target.files[0];
                file.preview = URL.createObjectURL(file);

                setAvatar(file);
                setImageError(null);
            } else {
                setImageError('Vui lòng chọn loại tệp hình ảnh');
            }
        }
    };

    React.useEffect(() => {
        if (watch('price') > watch('old_price')) {
            setPriceError('Giá cũ phải lớn hơn hoặc bằng giá hiện tại');
        } else {
            setPriceError(null);
        }
    }, [watch()]);

    React.useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        if (avatar) {
            formData.set('images', avatar);
        }
        if (published != product.published_date) {
            formData.set('published_date', published);
        }
        if (desciption) {
            formData.set('desciption', desciption);
        }
        formData.set('categoryId', categoryName.value);
        formData.set('rate', product.rate);
        setIsAction(true);
        await authInstance
            .put(`/products/update/${product?._id}`, formData)
            .then((result) => {
                if (result.data.status === 'OK') {
                    toast.success('Cập nhật sản phẩm thành công!');
                    setSuccess((prev) => !prev);
                    updateProductData(result.data.data);
                } else {
                    toast.error(result.data.message);
                }
                setIsAction(false);
            })
            .catch((err) => {
                setIsAction(false);
                toast.error(err?.response?.data?.message);
                console.error(err);
            });
    };

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChange = (value, option) => {
        setCategoryName({
            name: option.label,
            value: option.value,
        });
    };

    React.useEffect(() => {
        if (
            product.title != watch('title') ||
            product.author != watch('author') ||
            product.price != watch('price') ||
            product.old_price != watch('old_price') ||
            product.quantity != watch('quantity') ||
            product.desciption != desciption ||
            product.categoryId._id != categoryName.value ||
            published != product.published_date ||
            avatar
        ) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [watch(), avatar, desciption]);

    const handleEditorChange = (value) => {
        setDesciption(value);
    };

    return (
        <>
            {loading && (
                <div>
                    <LinearProgress />
                </div>
            )}
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
                <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={isAction}>
                    {isAction && <CircularProgress color="error" />}
                </Backdrop>
                <h1 className={cx('heading')}>Chỉnh sửa thông tin sản phẩm</h1>
                {loading ? (
                    <div className="mt-[20px]">
                        <Skeleton
                            active
                            avatar
                            paragraph={{
                                rows: 8,
                            }}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className={cx('form')}>
                        <div className={cx('content')}>
                            <div className={cx('left')}>
                                <p className={cx('label')}>
                                    Trạng thái:
                                    <span
                                        className={`ml-[10px] font-[800] ${
                                            product.hasOwnProperty('status_sell')
                                                ? product.status_sell === false
                                                    ? 'text-red-500'
                                                    : 'text-green-500'
                                                : 'text-green-500'
                                        }`}
                                    >
                                        {product.hasOwnProperty('status_sell')
                                            ? product.status_sell === false
                                                ? 'Ngưng bán'
                                                : 'Hoạt động'
                                            : 'Hoạt động'}
                                    </span>
                                </p>
                                <p className={cx('label')}>
                                    Tình trạng:
                                    <span
                                        className={`ml-[10px] font-[800] ${
                                            product.quantity === 0 ? 'text-red-500' : 'text-green-500'
                                        }`}
                                    >
                                        {product.quantity === 0 ? 'Hết hàng' : 'Còn hàng'}
                                    </span>
                                </p>
                                <p className={cx('label')}>Hình ảnh</p>
                                <div className={cx('images')}>
                                    <img src={avatar ? avatar.preview : product?.images} alt="images" />
                                    <input
                                        onChange={(e) => handleChangeImage(e)}
                                        type="file"
                                        id="images"
                                        className={cx('input_images')}
                                    />
                                    <label for="images" id="images">
                                        Chỉnh sửa ảnh
                                    </label>
                                </div>
                                {imageErrors && <p className="text-red-500 my-[10px] text-[1.4rem]">{imageErrors}</p>}
                                <p className={cx('label')}>Mô tả</p>
                                {/* <TextField
                                        {...register('desciption', { required: true })}
                                        multiline
                                        fullWidth
                                        placeholder='Mô tả sản phẩm...'
                                        size='small'
                                        className="scroll-custom"
                                        InputProps={{
                                            style: {
                                                color: "#333",
                                                fontSize: "13px",
                                                marginBottom: '16px',
                                                backgroundColor: "#fff"
                                            }
                                        }}
                                    /> */}
                                <Editor
                                    apiKey={apiKeyEditor}
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
                                    initialValue={product.desciption}
                                    onEditorChange={handleEditorChange}
                                />
                                {errors?.desciption && (
                                    <p className="text-red-500 my-[10px] text-[1.4rem]">Vui lòng nhập mô tả</p>
                                )}
                            </div>
                            <div className={cx('right')}>
                                <p className={cx('label')}>Tên sản phẩm</p>
                                <TextField
                                    {...register('title', { required: true })}
                                    fullWidth
                                    placeholder="Nhập tên sản phẩm"
                                    size="small"
                                    InputProps={{
                                        style: {
                                            color: '#333',
                                            fontSize: '13px',
                                            marginBottom: '16px',
                                            backgroundColor: '#fff',
                                        },
                                    }}
                                />
                                {errors?.title && (
                                    <p className="text-red-500 my-[10px] text-[1.4rem]">Vui lòng nhập tên</p>
                                )}
                                <p className={cx('label')}>Tác giả</p>
                                <TextField
                                    {...register('author', { required: true })}
                                    fullWidth
                                    placeholder="Nhập tên tác giả"
                                    size="small"
                                    InputProps={{
                                        style: {
                                            color: '#333',
                                            fontSize: '13px',
                                            marginBottom: '16px',
                                            backgroundColor: '#fff',
                                        },
                                    }}
                                />
                                {errors.author && (
                                    <p className="text-red-500 my-[10px] text-[1.4rem]">Vui lòng nhập tên tác giả</p>
                                )}
                                <p className={cx('label')}>Giá hiện tại</p>
                                <TextField
                                    {...register('price', { min: 0, required: true })}
                                    fullWidth
                                    placeholder="Nhập giá hiện tại"
                                    size="small"
                                    type="number"
                                    InputProps={{
                                        style: {
                                            color: '#333',
                                            fontSize: '13px',
                                            marginBottom: '16px',
                                            backgroundColor: '#fff',
                                        },
                                    }}
                                />
                                {errors?.price && (
                                    <p className="text-red-500 my-[10px] text-[1.4rem]">
                                        Giá hiện tại phải lớn hơn hoặc bằng 0
                                    </p>
                                )}
                                <p className={cx('label')}>Giá cũ</p>
                                <TextField
                                    {...register('old_price', { min: 0, required: true })}
                                    fullWidth
                                    placeholder="Nhập giá cũ"
                                    size="small"
                                    type="number"
                                    InputProps={{
                                        style: {
                                            color: '#333',
                                            fontSize: '13px',
                                            marginBottom: '16px',
                                            backgroundColor: '#fff',
                                        },
                                    }}
                                />
                                {errors?.old_price && (
                                    <p className="text-red-500 my-[10px] text-[1.4rem]">
                                        Giá cũ phải lớn hơn hoặc bằng 0
                                    </p>
                                )}
                                {priceErrors && <p className="text-red-500 my-[10px] text-[1.4rem]">{priceErrors}</p>}
                                <p className={cx('label')}>Số lượng trong kho</p>
                                <TextField
                                    {...register('quantity', { min: 0, required: true })}
                                    fullWidth
                                    placeholder="Nhập số lượng "
                                    size="small"
                                    type="number"
                                    InputProps={{
                                        style: {
                                            color: '#333',
                                            fontSize: '13px',
                                            marginBottom: '16px',
                                            backgroundColor: '#fff',
                                        },
                                    }}
                                />
                                {errors?.quantity && (
                                    <p className="text-red-500 my-[10px] text-[1.4rem]">
                                        Số lượng phải lớn hơn hoặc bằng 0
                                    </p>
                                )}
                                <p className={cx('label')}>Năm xuất bản</p>
                                <DatePicker onChange={handleDate} defaultValue={dayjs(product.published_date)} />
                                {publishedErrors && (
                                    <p className="text-red-500 my-[10px] text-[1.4rem]">{publishedErrors}</p>
                                )}
                                <p className={cx('label')}></p>
                                <p className={cx('label')}>Danh mục sản phẩm</p>
                                <Select
                                    onChange={handleChange}
                                    value={categoryName}
                                    showSearch
                                    placeholder="Chọn danh mục sản phẩm"
                                    optionFilterProp="children"
                                    filterOption={filterOption}
                                    options={options}
                                    style={{
                                        minWidth: '250px',
                                    }}
                                />
                            </div>
                        </div>
                        <div className={cx('buttons')}>
                            <p>
                                <Button
                                    disabled={
                                        !isChanged ||
                                        Object.keys(errors).length > 0 ||
                                        imageErrors ||
                                        priceErrors ||
                                        publishedErrors
                                    }
                                    primary
                                >
                                    Lưu thay đổi
                                </Button>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export default UpdateProduct;
