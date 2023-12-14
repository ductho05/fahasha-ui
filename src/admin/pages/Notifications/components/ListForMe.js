import React from 'react'
import { api } from '../../../../constants';
import { useStore } from '../../../../stores/hooks';
import { Link } from 'react-router-dom';
import { seeNotice } from '../../../../stores/actions';
import { getAuthInstance } from "../../../../utils/axiosConfig"

function ListForMe() {

    const authInstance = getAuthInstance()

    const [notices, setNotices] = React.useState([])
    const [state, dispatch] = useStore();

    React.useEffect(() => {
        authInstance.post(`/webpush/get`)
            .then(result => {
                if (result.data.status === "OK") {
                    setNotices(result.data.data)
                }
            })
            .catch(err => {
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
        <ul className="bg-white mt-[20px]">
            {
                notices.map((notice, index) => (
                    <Link to={notice.notification.url}
                        onClick={() => updateNotification(notice._id)}
                        key={index}
                        className="flex items-center cursor-pointer hover:bg-[#f7f9fa] p-[20px]">
                        <div className="w-[50px] h-[50px] relative">
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
    )
}

export default ListForMe