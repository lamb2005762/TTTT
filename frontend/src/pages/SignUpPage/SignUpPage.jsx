import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperText } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import signin from '../../assets/img/sign-in.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'
import { useEffect } from 'react'

const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isConfirmPassword, setIsConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate()
    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    )

    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleNavigateSignIn()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleSignUp = () => {
        mutation.mutate({ email, password, confirmPassword })
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>Xin chào</h1>
                    <p>Đăng nhập hoặc Tạo tài khoản</p>
                    <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com"
                        value={email} onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '50%',
                                right: '8px',
                                transform: 'translateY(-50%)',
                            }}
                        >{
                                isShowPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }
                        </span>
                        <InputForm
                            placeholder="password"
                            type={isShowPassword ? "text" : "password"}
                            value={password} onChange={handleOnchangePassword}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsConfirmPassword(!isConfirmPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '50%',
                                right: '8px',
                                transform: 'translateY(-50%)',
                            }}
                        >{
                                isConfirmPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }
                        </span>
                        <InputForm
                            placeholder="confirm password"
                            type={isConfirmPassword ? "text" : "password"}
                            value={confirmPassword} onChange={handleOnchangeConfirmPassword}
                        />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <ButtonComponent
                        disabled={!email.length || !password.length || !confirmPassword.length}
                        onClick={handleSignUp}
                        size={40}
                        styleButton={{
                            background: 'red',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textbutton={'Đăng ký'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>


                    <p style={{ fontSize: '13px' }}>Bạn đã có tài khoản? <WrapperText onClick={handleNavigateSignIn}>Đăng nhập</WrapperText></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={signin} preview={false} alt='sign-in-img'
                        height='203px' width='203px' />
                    <h4>Mua sắm tại Book Store</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignUpPage