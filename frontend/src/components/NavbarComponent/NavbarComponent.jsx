import { Checkbox, Col, Rate, Row } from 'antd'
import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './style'
import { useState } from 'react'
import { useEffect } from 'react'
import * as ProductService from '../../services/ProductService'
import TypeProduct from '../TypeProduct/TypeProduct'

const NavbarComponent = () => {
    const onChange = () => { }
    const [typeProducts, setTypeProducts] = useState([])

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return (
        <div>
            <WrapperLableText>Thể loại</WrapperLableText>
            <WrapperContent>
                {typeProducts.map((item) => {
                    return (
                        <TypeProduct name={item} key={item} />
                    )
                })}
            </WrapperContent>
        </div>
    )
}

export default NavbarComponent