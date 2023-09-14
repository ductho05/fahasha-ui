import React from 'react'
import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'

const LoginWithFacebook = () => {

    const handleLogin = (response) => {
        console.log(response)
    }

    const handleError = (error) => {
        console.log(error)
    }

    return (
        <LoginSocialFacebook
            appId='1767849030313092'
            onResolve={handleLogin}
            onReject={handleError}
        >
            <FacebookLoginButton />
        </LoginSocialFacebook>
    )
}

export default LoginWithFacebook