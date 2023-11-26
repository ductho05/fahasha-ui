import React, { useState } from 'react';
import { Button, Modal, Result } from 'antd';
import classNames from 'classnames/bind';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './FlashSaleModal.module.scss';
import FlashSaleForm from '../FlashSaleForm';
import { useNavigate } from 'react-router-dom';
// import Abc from './Abc';

const FlashSaleModal = ({ props, handelLoading, func, isStatus, style }) => {
    const cx = classNames.bind(styles);
    const [open, setOpen] = useState(false);
    const [hideForm, setHideForm] = useState(false);
    const [stateResult, setStateResult] = useState({});
    const navigate = useNavigate();
    //console.log('props', props);
    const showModal = () => {
        setHideForm(false);
        setOpen(true);
    };
    const handleCancel = () => {
        hideForm && handelLoading && handelLoading(); // loading lại sản phẩm
        func && isStatus && func(!isStatus.isToggle); // ẩn check box ở custom flash sale
        setOpen(false);
    };

    const hideFunc = (stateResult) => {
        setStateResult(stateResult);

        setHideForm(true);
    };

    return (
        <>
            <p
                className={props?.products.length > 0 ? cx('btn_add_new') : cx('btn_no_loaded')}
                onClick={() => {
                    if (props?.products.length > 0) {
                        showModal();
                    }
                }}
            >
                <ArrowForwardIcon className={cx('btn_icon_set')} />
            </p>

            <Modal title="Cài đặt FlashSale" open={open} footer={null} maskClosable={false} onCancel={handleCancel}>
                {hideForm ? (
                    <Result
                        status={stateResult.status}
                        title={stateResult.title}
                        subTitle={stateResult.subTitle}
                        extra={
                            stateResult.status == 'success'
                                ? [
                                      <Button
                                          key={stateResult.status}
                                          type="primary"
                                          onClick={() => {
                                              //handelLoading && handelLoading();

                                              handleCancel();
                                          }}
                                      >
                                          Tiếp tục
                                      </Button>,
                                      <Button
                                          key="buy"
                                          onClick={() => {
                                              navigate('/admin/flashsale');
                                          }}
                                      >
                                          Quản lý
                                      </Button>,
                                  ]
                                : [
                                      <Button
                                          key={stateResult.status}
                                          onClick={() => {
                                              handleCancel();
                                          }}
                                      >
                                          Thử lại
                                      </Button>,
                                  ]
                        }
                    />
                ) : (
                    <FlashSaleForm props={props} hideFunc={hideFunc}></FlashSaleForm>
                )}
            </Modal>
        </>
    );
};
export default FlashSaleModal;
