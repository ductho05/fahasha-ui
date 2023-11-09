import { useState, useEffect } from 'react';
import RegisterLogin from '../../components/Forms/RegisterLogin';
import Lottie from 'react-lottie';
import loginRegisterData from '../../assets/json/loginRegister.json'
import { FloatButton } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

function RegisterLoginPage() {
    const [isShowForm, setIsShowForm] = useState(false);
    const [indexForm, setIndexForm] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Đăng nhập/Đăng ký';
    }, []);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loginRegisterData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const handleBackHome = () => {
        navigate("/")
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"

            style={{
                backgroundImage: "linear-gradient(to top, #9795f0 0%, #fbc8d4 100%)"
            }}>
            <div onClick={handleBackHome}>
                <Tooltip title="Trở về trang chủ" placement="topLeft">
                    <FloatButton
                        shape="circle"
                        type="primary"
                        style={{
                            top: 40,
                            left: 50
                        }}
                        icon={<HomeOutlined />}
                    />
                </Tooltip>
            </div>
            <div className="flex flex-col lg:flex-row w-max px-[20px] items-center justify-between bg-white rounded-[20px] shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]">

                <div className="flex px-[20px] py-[20px] lg:py-0">
                    <Lottie
                        options={defaultOptions}
                        height={350}
                        width={350}
                    />
                </div>
                <RegisterLogin
                    setShowForm={setIsShowForm}
                    indexForm={indexForm}
                    setForm={setIndexForm}
                    isAccountPage={true}
                ></RegisterLogin>
            </div>

        </div>
    );
}

export default RegisterLoginPage;
