import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperNameProduct = styled.h1`
    color: black;
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-all;
    margin: unset;
`

export const WrapperTextSell = styled.span`
    color: gray;
    font-size: 15px;
    line-height: 24px;
`
export const WrapperPriceProduct = styled.div`
    background: #fafafa;
    border-radius: 4px;
`

export const WrapperPriceText = styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 800;
    padding: 10px;
`

export const WrapperAddressProduct = styled.div`
    span.address{
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    };

    span.changeaddress{
        color: #1E90FF	;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
    }
`

export const WrapperQuantityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    width: 100px;
`
export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    };
`

export const WrapperQuantity = styled.div`
    margin: '20px 0 20px';
    border-top: '1px solid #e5e5e5';
    border-bottom: '1px solid #e5e5e5';
    padding: '10px 0';
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`