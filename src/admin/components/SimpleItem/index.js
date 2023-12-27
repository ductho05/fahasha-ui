import React from 'react';
import { Card, Skeleton } from 'antd';
import styles from './SimpleItem.module.scss';
import classNames from 'classnames/bind';
import SizeContext from 'antd/es/config-provider/SizeContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const { Meta } = Card;
function SimpleItem({ onClick, props, type }) {
    const { title, image, sold, isLoading } = props;
    //console.log('props', type);
    // option = type == 'static' ? 'Doanh thu' : 'Tồn kho ';
    const cx = classNames.bind(styles);
    return isLoading == false ? (
        <Card
            onClick={onClick}
            hoverable
            bodyStyle={{
                padding: '0px',
                margin: '10px',
            }}
            style={{
                margin: '0.3% 0.7%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '150px',
                height: '250px',
            }}
            cover={<LazyLoadImage effect="blur" alt="example" src={image} style={{ height: '130px', width: 'auto' }} />}
        >
            <div className={cx('text-container')}>{`[${type}: ${sold}] ${title}`}</div>
            {/* <div className={cx('text-container')}></div> */}
        </Card>
    ) : (
        <Card
            style={{
                margin: '0.3% 0.7%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '150px',
                height: '250px',
            }}
        >
            <Skeleton.Image active={true} />
            <Skeleton
                active={true}
                paragraph={{
                    rows: 2,
                    width: 100,
                    style: {
                        margin: '8px 0 0 0',
                    },
                }}
                style={{
                    margin: '15px 0 0 0',
                }}
            />
        </Card>
    );
}
export default SimpleItem;
