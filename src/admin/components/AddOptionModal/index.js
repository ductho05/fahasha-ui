import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Result } from 'antd';
import classNames from 'classnames/bind';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './AddOptionModal.module.scss';
import FlashSaleForm from '../FlashSaleForm';
import { Card, Skeleton } from 'antd';
import Tour from '../Tour/Tour';
import HelpIcon from '@mui/icons-material/Help';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
const AddOptionModal = ({ handelLoading, func, isStatus }) => {
    const cx = classNames.bind(styles);
    const [open, setOpen] = useState(false);
    const [hideForm, setHideForm] = useState(false);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const [openGuide, setOpenGuide] = useState(false);
    const navigate = useNavigate();
    const container1 = useRef();
    const container2 = useRef();

    // lottie.loadAnimation(
    //     {
    //         container: container1.current,
    //         renderer: 'svg',
    //         loop: true,
    //         autoplay: true,
    //         animationData: require('../../../assets/json/autoAddFlaShSale.json'),
    //     },
    //     () => {
    //         console.log('Hoạt hình 1 đã tải hoàn tất.');
    //     },
    // );

    // lottie.loadAnimation(
    //     {
    //         container: container2.current,
    //         renderer: 'svg',
    //         loop: true,
    //         autoplay: true,
    //         animationData: require('../../../assets/json/customAddFlashSale.json'),
    //     },
    //     () => {
    //         console.log('Hoạt hình 2 đã tải hoàn tất.');
    //     },
    // );

    // const [animationLoaded, setAnimationLoaded] = useState(false);

    // const animation = lottie.loadAnimation(
    //     {
    //         container: document.getElementById('container2'), // Thay container2.current bằng document.getElementById nếu bạn không sử dụng useRef.
    //         renderer: 'svg',
    //         loop: true,
    //         autoplay: true,
    //         animationData: require('../../../assets/json/customAddFlashSale.json'),
    //     },
    //     () => {
    //         console.log('Hoạt hình 2 đã tải hoàn tất.');
    //         setAnimationLoaded(true);
    //     },
    // );

    useEffect(() => {
        const animation1 = lottie.loadAnimation({
            container: container1.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../../assets/json/autoAddFlaShSale.json'),
        });

        const animation2 = lottie.loadAnimation({
            container: container2.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../../assets/json/customAddFlashSale.json'),
        });

        // Sử dụng sự kiện 'data_ready' để theo dõi khi hoạt hình đã tải hoàn tất.
        animation1.addEventListener('data_ready', () => {
            //console.log('Hoạt hình 1 đã tải hoàn tất.');
        });

        animation2.addEventListener('data_ready', () => {
            //console.log('Hoạt hình 2 đã tải hoàn tất.');
        });

        // Trả về một hàm xử lý để huỷ bỏ sự kiện khi component bị unmounted.
        return () => {
            animation1.destroy();
            animation2.destroy();
        };
    });

    const showModal = () => {
        setHideForm(false);
        setOpen(true);
    };
    const handleCancel = () => {
        hideForm && handelLoading && handelLoading(); // loading lại sản phẩm
        func && isStatus && func(!isStatus.isToggle); // ẩn check box ở custom flash sale
        setOpen(false);
    };

    return (
        <>
            <p className={cx('btn_add_new')} onClick={showModal}>
                <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                <span>Thêm mới</span>
            </p>

            <Modal
                open={open}
                title={
                    <div className={cx('header')}>
                        <div className={cx('header-title')}>THIẾT LẬP FLASHSALE </div>
                        <div className={cx('help-icon')}>
                            <HelpIcon
                                onClick={() => {
                                    setOpenGuide(true);
                                }}
                            />
                        </div>
                    </div>
                }
                footer={null}
                header={true}
                closable={false}
                onCancel={handleCancel}
                style={!openGuide ? { top: '25%', width: '400px' } : { width: '400px', transform: 'translateY(-30%)' }}
            >
                <div className={cx('wrapper')}>
                    {
                        <Card
                            onClick={() => {
                                navigate('/admin/flashsale/auto');
                            }}
                            ref={ref1}
                            hoverable
                            bodyStyle={{
                                padding: '0px',
                                margin: '10px',
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '150px',
                                height: '220px',
                                margin: '0 10px',
                            }}
                            cover={<div className={cx('animation-loading')} ref={container1}></div>}
                        >
                            <div className={cx('text-container')} style={{}}>
                                {'TỰ ĐỘNG'}
                            </div>
                        </Card>
                    }
                    {
                        <Card
                            onClick={() => {
                                navigate('/admin/flashsale/custom');
                            }}
                            ref={ref2}
                            hoverable
                            bodyStyle={{
                                padding: '0px',
                                margin: '10px',
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '150px',
                                height: '220px',
                                margin: '0 10px',
                            }}
                            cover={<div className={cx('animation-loading')} ref={container2}></div>}
                        >
                            <div className={cx('text-container')}>{'THỦ CÔNG'}</div>
                        </Card>
                    }
                </div>
                <Tour ref1={ref1} ref2={ref2} openGuide={openGuide} func={setOpenGuide} />
            </Modal>
        </>
    );
};
export default AddOptionModal;
