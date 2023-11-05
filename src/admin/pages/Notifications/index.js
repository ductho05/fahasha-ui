import React from 'react'
import { SendOutlined, CloseOutlined } from '@mui/icons-material'
import Tabs from '../../components/Tabs'
import NotificationList from './components/NotificationList';
import ListForMe from './components/ListForMe';
import { Dialog } from '@mui/material';
import SendNotice from './components/SendNotice';

const components = [<NotificationList />, <ListForMe />]

function Notifications() {

    const [openDialog, setOpenDialog] = React.useState(false)

    const indexs = ["Tất cả", "Đã nhận"]

    const handleDisplayDialog = () => {
        setOpenDialog(true)
    }

    const handleClose = () => {
        setOpenDialog(false)
    }

    return (
        <div className="p-[20px]">
            <div className="flex items-center justify-between px-[10px] py-[20px] rounded-[8px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <h3 className="uppercase text-[2rem] text-[#333] ml-[10px]">Thông báo</h3>
                <p
                    onClick={handleDisplayDialog}
                    className="flex items-center cursor-pointer text-[#00dfa2] border border-solid border-[#00dfa2] rounded-[6px] p-[6px] mr-[20px]">
                    <SendOutlined />
                    <span className="ml-[6px]">Gửi thông báo</span>
                </p>
            </div>

            <Tabs indexs={indexs} components={components} />
            <Dialog
                open={openDialog}
            >
                <div className="relative">
                    <p
                        onClick={handleClose}
                        className='absolute top-1 right-1 cursor-pointer hover:bg-[#f2f4f5] p-[4px] rounded-[50%]'>
                        <CloseOutlined />
                    </p>
                    <SendNotice setOpenDialog={setOpenDialog} />
                </div>
            </Dialog>
        </div>
    )
}

export default Notifications