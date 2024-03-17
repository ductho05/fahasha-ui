import React from 'react';
import { Button, Select, Form, Input, Spin, message } from 'antd';
import { api } from '../../../../constants';
import { SendOutlined } from '@mui/icons-material';
import { Backdrop } from '@mui/material';
import { getAuthInstance } from '../../../../utils/axiosConfig';

function SendNotice({ setOpenDialog }) {
    const authInstance = getAuthInstance();
    const [optionUser, setOptionUser] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [image, setImage] = React.useState();
    const [file, setFile] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [loadingSend, setLoadingSend] = React.useState(false);

    React.useEffect(() => {
        authInstance.get(`/users`).then((result) => {
            if (result.data.status == 'OK') {
                const newList = result.data.data.map((user) => {
                    return {
                        label: user.email,
                        value: user._id,
                    };
                });

                setOptionUser(newList);
            }
        });
    }, []);

    const handleUploadImage = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
        }
    };

    React.useEffect(() => {
        const formData = new FormData();
        formData.append('images', file);
        setLoading(true);
        authInstance
            .post(`/upload-images`, formData)
            .then((result) => {
                if (result.data.status == 'OK') {
                    setImage(result.data.data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [file]);

    const handleChange = (value) => {
        setFilter(value);
    };

    const onFinish = (values) => {
        if (image) {
            values.image = image;
        }

        setLoadingSend(true);
        // authInstance
        //     .post(`/webpush/send`, {
        //         filter,
        //         notification: values,
        //     })
        //     .then((result) => {
        //         if (result.data.status == 'OK') {
        //             message.success('Gửi thông báo thành công!');
        //         } else {
        //             message.error('Gửi thông thất bại!');
        //         }
        //         setOpenDialog(false);
        //         setLoadingSend(false);
        //     })
        //     .catch(() => {
        //         message.error('Gửi thông thất bại!');
        //         setOpenDialog(false);
        //         setLoadingSend(false);
        //     });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div className="px-[20px] pt-[30px] w-[35vw]">
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingSend}>
                <Spin tip="Loading" size="large" />
            </Backdrop>
            <div className="flex items-center mb-[24px]">
                <p className="flex-[5] text-[14px] text-[#000] text-right mr-[6px]">Gửi đến: </p>
                <Select
                    defaultValue="all"
                    style={{
                        width: 160,
                        flex: 20,
                    }}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'all',
                            label: 'Tất cả người dùng',
                        },
                        {
                            value: 'admin',
                            label: 'Quản lý',
                        },
                        {
                            value: 'personal',
                            label: 'Người dùng cụ thể',
                        },
                    ]}
                />
            </div>
            <Form
                name="basic"
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 20,
                }}
                style={{
                    maxWidth: '100%',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {filter == 'personal' && (
                    <Form.Item
                        label="Người nhận"
                        name="user"
                        rules={[
                            {
                                required: true,
                                message: 'Nội dung này không được để trống!',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn người nhận"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={optionUser}
                        />
                    </Form.Item>
                )}
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Nội dung này không được để trống!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: 'Nội dung này không được để trống!',
                        },
                    ]}
                >
                    <Input.TextArea rows={5} />
                </Form.Item>

                <div className="flex items-center mb-[24px]">
                    <p className="flex-[5] text-[14px] text-[#000] text-right mr-[6px]">Hình ảnh: </p>
                    <input type="file" onChange={(e) => handleUploadImage(e)} className="flex-[20]" />
                    {loading && <Spin tip="Loading" size="small" />}
                </div>

                <Form.Item
                    label="Đường dẫn"
                    name="url"
                    rules={[
                        {
                            required: true,
                            message: 'Nội dung này không được để trống!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 5,
                        span: 20,
                    }}
                >
                    <Button htmlType="submit" icon={<SendOutlined />}>
                        Gửi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default SendNotice;
