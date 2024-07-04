import React, { useState } from 'react'
import { Col, Row } from 'antd';
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { WrapperAddressProduct, WrapperNameProduct, WrapperPriceProduct, WrapperPriceText, WrapperTextSell, WrapperQuantityProduct, WrapperInputNumber, WrapperQuantity, WrapperStyleColImage, WrapperStyleImageSmall } from './style';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query'
import { convertPrice } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { useEffect } from 'react'
import * as message from '../Message/Message'

const ProductDetailComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        console.log('id', id)
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const { data: productDetails } = useQuery({ queryKey: ['productDetails', idProduct], queryFn: fetchGetDetailsProduct, enabled: !!idProduct })
    // console.log('productDetails', productDetails)

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

    return (
        <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
            <Col span={10} style={{ paddingRight: '10px', borderRight: '1px solid #e5e5e5', }}>
                <img src={productDetails?.image} alt='image product' style={{ width: '100%', height: 'auto' }} />
            </Col>
            <Col span={14} style={{ paddingLeft: '10px' }}>
                <WrapperNameProduct>{productDetails?.name}</WrapperNameProduct>
                <div>
                    <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                    <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                    <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                    <WrapperTextSell> | Đã bán {productDetails?.selled > 0 ? productDetails?.selled : 0}</WrapperTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceText>{convertPrice(productDetails?.price)}</WrapperPriceText>
                </WrapperPriceProduct>
                <WrapperAddressProduct>
                    <span>Giao đến </span>
                    <span className='address'>{user?.address}</span>
                    <span className='changeaddress'> Đổi địa chỉ</span>
                </WrapperAddressProduct>
                <WrapperQuantity style={{ margin: '20px 0 20px', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '10px 0' }}>
                    <div>Số lượng</div>
                    <WrapperQuantityProduct>
                        <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('', numProduct === 1)}>
                            <MinusOutlined style={{ color: '#000', fontSize: '15px' }} />
                        </button>
                        <WrapperInputNumber min={1} max={productDetails?.countInStock} defaultValue={1} onChange={onChange} value={numProduct} size="small" />
                        <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                            <PlusOutlined style={{ color: '#000', fontSize: '15px' }} />
                        </button>
                    </WrapperQuantityProduct>
                </WrapperQuantity>
                <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                    <div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'red',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            onClick={handleAddOrderProduct}
                            textbutton={'Chọn mua'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                        {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm hết hàng</div>}
                    </div>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            background: '#fff',
                            height: '48px',
                            width: '220px',
                            border: '1px solid rgb(13, 92, 182)',
                            borderRadius: '4px'
                        }}
                        textbutton={'Mua trả sau'}
                        styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                    ></ButtonComponent>

                </div>
                <WrapperAddressProduct>
                    <p>Mô tả sản phẩm</p>
                    <ul>
                        <li>Tác giả: {productDetails?.auth}</li>
                        <li>{productDetails?.publisher}</li>
                        <li>Thể loại: {productDetails?.type}</li>
                        <li>Tóm tắt: {productDetails?.description}</li>
                    </ul>
                </WrapperAddressProduct>
            </Col>
        </Row>
    )
}

export default ProductDetailComponent