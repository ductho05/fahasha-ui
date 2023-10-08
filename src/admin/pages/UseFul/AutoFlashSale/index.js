import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../../constants';
import SimpleItem from '../../../components/SimpleItem';
import styles from './AutoFlashSale.module.scss';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Divider, Form, Radio, Skeleton, Space, Switch, Alert } from 'antd';
import Marquee from 'react-fast-marquee';
import FlashSaleModal from '../../../components/FlashSaleModal';

const cx = classNames.bind(styles);

function getRandomElementsWithBias(arr, num) {
    const originalIndices = Array.from(arr.keys());
    const shuffledIndices = shuffleArray(originalIndices);
    const selectedIndices = shuffledIndices.slice(0, num);
    const selectedElements = selectedIndices.map((index) => arr[index]);
    return selectedElements;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function AutoFlashSale() {
    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    // var data = JSON.parse(localStorage.getItem('temporary_data'));
    useEffect(() => {
        //const randomNumberpage = Math.floor(Math.random() * 10) + 1;
        // const randomNumberperPage = Math.floor((Math.random() * 1000) / randomNumberpage) + 14;
        //?page=${1}&perPage=${randomNumberperPage}&filter=sold&sort=asc&num=14
        //
        if (localStorage.getItem('temporary_data')) {
            var data = JSON.parse(localStorage.getItem('temporary_data'));
            setIsLoading2(true);
            setTimeout(() => {
                setSuggestFlash(getRandomElementsWithBias(data, 14));
                setIsLoading2(false);
            }, 500); // 1000 milliseconds tương đương với 1 giây
        } else {
            setIsLoading2(true);
            fetch(`${api}/products?page=${1}&perPage=${1000}&filter=sold&sort=asc&num=200`)
                .then((response) => response.json())
                .then((flashsales) => {
                    localStorage.setItem('temporary_data', JSON.stringify(flashsales.data));
                    setSuggestFlash(getRandomElementsWithBias(flashsales.data, 14));
                    setIsLoading2(false);
                })
                .catch((err) => console.log(err));
        }
    }, [isLoading]);

    const handelLoading = () => {
        setIsLoading(!isLoading);
    };

    const handelSetting = () => {
        setIsLoading(!isLoading);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <p
                    style={{
                        margin: '0 0 0 20px',
                        flex: 2.5,
                    }}
                >
                    THIẾT LẬP TỰ ĐỘNG
                </p>

                <div
                    style={{
                        display: 'flex',
                        flex: 7.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Alert
                        banner
                        type="info"
                        message={
                            <Marquee pauseOnHover gradient={false}>
                                {`Hướng dẫn: Hệ thống gợi ý sản phẩm đang có xu hướng tồn kho. Nhấn icon xám để lấy sản phẩm khác, nhấn
                                icon xanh để tiến hành thiết lập FlashSale________`}
                            </Marquee>
                        }
                        style={{
                            width: '80%',
                            margin: '0 5% 0 0',
                            borderRadius: '6px',
                        }}
                    />
                    <p className={cx('btn_load')} onClick={handelLoading}>
                        <AutorenewIcon className={cx('btn_icon_load')} />
                    </p>
                    <FlashSaleModal props={{ products: suggestFlash }} handelLoading={handelLoading} />
                </div>
            </div>
            <div className={cx('content')}>
                {suggestFlash.length
                    ? suggestFlash.map((item, index) => {
                          return (
                              <SimpleItem
                                  key={index}
                                  props={{
                                      image: item.images,
                                      title: item.title,
                                      sold: item.sold,
                                      isLoading: isLoading2,
                                  }}
                              />
                          );
                      })
                    : Array.from({ length: 14 }).map((_, i) => (
                          <SimpleItem
                              key={i}
                              props={{
                                  image: null,
                                  title: null,
                                  sold: null,
                                  isLoading: isLoading2,
                              }}
                          />
                      ))}
            </div>
        </div>
    );
}

export default AutoFlashSale;
