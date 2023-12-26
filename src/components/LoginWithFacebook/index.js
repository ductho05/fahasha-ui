import React, { useState } from 'react'
import { LoginSocialFacebook } from 'reactjs-social-login'
import { api } from '../../constants'
import { useStore } from '../../stores/hooks'
import { login } from '../../stores/actions'
import { Backdrop, CircularProgress } from '@mui/material'
import Button from '../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';


const LoginWithFacebook = () => {

    const [state, dispatch] = useStore()
    const [progress, setProgress] = useState(false)

    const handleLogin = (response) => {

        setProgress(true)
        fetch(`${api}/users/login/facebook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: response?.data?.email,
                username: response?.data?.name,
                image: response?.data?.picture?.data?.url,
                faceId: response?.data?.id
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === "OK") {
                    setProgress(false)
                    dispatch(login(result))
                } else {
                    setProgress(false)
                }
            })
            .catch(err => {
                setProgress(false)
                console.error(err.message)
            })
    }

    const handleError = (error) => {
        console.log(error)
    }

    return (
        <>
            <LoginSocialFacebook
                appId='1325947341377754'
                onResolve={handleLogin}
                onReject={handleError}
            >
                <Button leftIcon={<FontAwesomeIcon icon={faFacebookF} />} facebook > Đăng nhập bằng facebook</Button>
            </LoginSocialFacebook>
            <Backdrop
                sx={{ color: '#fff', zIndex: 10000 }}
                open={progress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default LoginWithFacebook