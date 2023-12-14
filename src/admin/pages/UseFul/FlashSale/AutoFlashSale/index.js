import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../../../constants';
import SimpleItem from '../../../../components/SimpleItem';
import styles from './AutoFlashSale.module.scss';
import { useNavigate } from 'react-router-dom';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Divider, Form, Radio, Skeleton, Space, Switch, Alert } from 'antd';
import Marquee from 'react-fast-marquee';
import FlashSaleModal from '../../../../components/FlashSaleModal';
import { useData } from '../../../../../stores/DataContext';
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
    const navigate = useNavigate();
    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // loading cho button
    const [isLoading2, setIsLoading2] = useState(false); // loading cho sản phẩm để hiển thị skeleton
    const { data, setData } = useData();

    console.log('123WQ', suggestFlash);
    useEffect(() => {
        if (Object.keys(data).length !== 0) {
            //var data1 = data.products;
            setIsLoading2(true);
            var data2 = [...data.products]; // Tạo bản sao của mảng

            data2.sort((a, b) => b.quantity - a.quantity);
            setTimeout(() => {
                setSuggestFlash(getRandomElementsWithBias(data2.slice(0, 500), 14));
                setIsLoading2(false);
            }, 200); // 1000 milliseconds tương đương với 1 giây
        } else {
            setIsLoading2(true);
            fetch(`${api}/products?filter=quantity&sort=desc`)
                .then((response) => response.json())
                .then((flashsales) => {
                    setSuggestFlash(getRandomElementsWithBias(flashsales.data.slice(0, 500), 14));
                    setIsLoading2(false);
                })
                .catch((err) => console.log(err));
        }
    }, [isLoading]);

    const handelLoading = () => {
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
                                {`Hướng dẫn: Hệ thống gợi ý sản phẩm đang có xu hướng tồn kho. Nhấn icon vàng để lấy sản phẩm khác, nhấn
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
                    {!isLoading2 ? (
                        <FlashSaleModal
                            props={{ products: suggestFlash }}
                            handelLoading={handelLoading}
                            disabled={true}
                            style={'auto'}
                        />
                    ) : (
                        <FlashSaleModal />
                    )}
                </div>
            </div>
            <div className={cx('content')}>
                {suggestFlash.length
                    ? suggestFlash.map((item, index) => {
                          return (
                              <SimpleItem
                                  onClick={() => {
                                      navigate(`/admin/update-product/${item._id}`);
                                  }}
                                  key={index}
                                  props={{
                                      image: item.images,
                                      title: item.title,
                                      sold: item.quantity,
                                      isLoading: isLoading2,
                                  }}
                                  type={'Tồn kho'}
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
