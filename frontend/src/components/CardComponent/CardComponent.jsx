import React from 'react'
import { StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscountText, WrapperCardStyle, WrapperTextSell } from './style';
import { StarFilled } from '@ant-design/icons';
import { convertPrice } from '../../utils'
import { useNavigate } from 'react-router-dom';

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, type, discount, id, selled } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            style={{ width: 200 }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ margin: '4px' }}>
                    <span>4.9</span><StarFilled style={{ fontSize: '12px', color: 'yellow' }} /></span>
                <WrapperTextSell> | Đã bán {selled > 0 ? selled : 0}</WrapperTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                <WrapperDiscountText>
                    -{discount}%
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent