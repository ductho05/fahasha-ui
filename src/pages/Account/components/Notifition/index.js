import React from 'react';
import classNames from 'classnames/bind'
import styles from './Notifition.module.scss'
import { api } from '../../../../constants';
import { useStore } from '../../../../stores/hooks';
import { Link } from 'react-router-dom';
import { seeNotice } from '../../../../stores/actions';
import { Skeleton } from 'antd';
import { getAuthInstance } from '../../../../utils/axiosConfig'
import SendNotification from '../../../../service/SendNotification';

const cx = classNames.bind(styles)
function Notifition() {

    const authInstance = getAuthInstance()

    const [notices, setNotices] = React.useState([])
    const [state, dispatch] = useStore();
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        setLoading(true)
        authInstance.post(`/webpush/get`)
            .then(result => {
                if (result.data.status === "OK") {
                    setNotices(result.data.data)
                }
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.error(err)
            })
    }, [state])

    const updateNotification = (id) => {
        authInstance.put(`/webpush`, { id: id })
            .then(result => {
                if (result.data.status === "OK") {
                    dispatch(seeNotice())
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    return (
        <div className={cx('wrapper')}>
            {
                loading ? <Skeleton
                    active
                    paragraph={{
                        rows: 10,
                    }}
                />
                    :
                    <>
                        <div className={notices.length > 0 ? cx('hide') : cx('notications_empty')}>
                            <p className={cx('message')}>Bạn chưa có thông báo nào</p>
                        </div>
                        <ul className={cx('notifications')}>
                            {
                                notices.map((notice, index) => (
                                    <Link to={notice.notification.url}
                                        onClick={() => updateNotification(notice._id)}
                                        key={index}
                                        className="flex items-center cursor-pointer hover:bg-[#f7f9fa] p-[20px]">
                                        <div className="w-[60px] h-[60px] relative">
                                            {notice.isAccess === false && <p className="w-[12px] h-[12px] rounded-[50%] bg-[#c92127] absolute top-[-5px] right-[-5px]"></p>}
                                            <img src={notice.notification.image} alt="icon" className='w-full h-full object-cover' />
                                        </div>
                                        <div className="ml-[20px]">
                                            <p className="text-[#333] text-[14px] mb-[10px]">
                                                {notice.notification.title}
                                            </p>
                                            <p className="text-[#7a7e7f] text-[14px]">
                                                {notice.notification.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            }
                        </ul>
                    </>
            }
        </div>
    )
}

export default Notifition
