import { useState, useEffect } from 'react';
import RegisterLogin from '../../components/Forms/RegisterLogin';

function RegisterLoginPage() {
    const [isShowForm, setIsShowForm] = useState(false);
    const [indexForm, setIndexForm] = useState(0);

    useEffect(() => {
        document.title = 'Đăng nhập/Đăng ký';
    }, []);

    return (
        <div>
            <RegisterLogin
                setShowForm={setIsShowForm}
                indexForm={indexForm}
                setForm={setIndexForm}
                isAccountPage={true}
            ></RegisterLogin>
        </div>
    );
}

export default RegisterLoginPage;
