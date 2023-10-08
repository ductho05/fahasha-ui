import React, { useState } from 'react';
import { Button, Modal, Result } from 'antd';
import classNames from 'classnames/bind';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './FlashSaleModal.module.scss';
import FlashSaleForm from '../FlashSaleForm';
// import Abc from './Abc';

const FlashSaleModal = ({ props, handelLoading }) => {
    const cx = classNames.bind(styles);
    const [open, setOpen] = useState(false);
    const [hideForm, setHideForm] = useState(false);
    const [stateResult, setStateResult] = useState({});
    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        hideForm && handelLoading();
        setOpen(false);
        setHideForm(false);
    };

    const hideFunc = (stateResult) => {
        setStateResult(stateResult);
        setHideForm(true);
    };


    return (
        <>
            <p className={cx('btn_add_new')} onClick={showModal}>
                <ArrowForwardIcon className={cx('btn_icon_set')} />
            </p>

            <Modal title="Cài đặt FlashSale" open={open} footer={null} onCancel={handleCancel}>
                {!hideForm ? (
                    <FlashSaleForm props={props} hideFunc={hideFunc}></FlashSaleForm>
                ) : (
                    <Result
                        status={stateResult.status}
                        title={stateResult.title}
                        subTitle={stateResult.subTitle}
                        extra={
                            stateResult.status == 'success'
                                ? [
                                      <Button
                                          type="primary"
                                          onClick={() => {
                                              handelLoading();
                                              handleCancel();
                                          }}
                                      >
                                          Tiếp tục
                                      </Button>,
                                      <Button key="buy">Quản lý</Button>,
                                  ]
                                : [
                                      <Button
                                          onClick={() => {
                                              handleCancel();
                                          }}
                                      >
                                          Thử lại
                                      </Button>,
                                  ]
                        }
                    />
                )}
            </Modal>
        </>
    );
};
export default FlashSaleModal;
