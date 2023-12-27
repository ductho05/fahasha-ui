import React from 'react';
import { SendOutlined, CloseOutlined } from '@mui/icons-material';
import Tabs from '../../components/Tabs';
import NotificationList from './components/NotificationList';
import ListForMe from './components/ListForMe';
import { Dialog } from '@mui/material';
import SendNotice from './components/SendNotice';
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';
const components = [<NotificationList />, <ListForMe />];

function Notifications() {
    const [openDialog, setOpenDialog] = React.useState(false);

    const indexs = ['Tất cả', 'Đã nhận'];

    const handleDisplayDialog = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <div
            style={{
                padding: '10px 20px',
            }}
        >
            <div className="flex items-center justify-between px-[10px] py-[20px] rounded-[8px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <h3
                    className="uppercase text-[2rem] text-[#333] ml-[10px]"
                    style={{
                        color: '#c92127',
                    }}
                >
                    Thông báo
                </h3>
                <div
                    style={{
                        display: 'flex',
                        flex: 9,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Alert
                        banner
                        type="info"
                        message={
                            <Marquee pauseOnHover gradient={false}>
                                {`Hướng dẫn: Bạn có thể gửi thông báo đến tất cả người dùng hoặc gửi thông báo đến người dùng cụ thể bằng cách nhấn nút [Gửi thông báo] bên cạnh. _______    `}
                            </Marquee>
                        }
                        style={{
                            width: '100%',
                            margin: '0 2%',
                            borderRadius: '6px',
                        }}
                    />

                    {/* <AddOptionModal /> */}
                </div>
                <p
                    onClick={handleDisplayDialog}
                    className="flex items-center cursor-pointer text-[#00dfa2] border border-solid border-[#00dfa2] rounded-[6px] p-[6px] mr-[20px]"
                >
                    <SendOutlined />
                    <span className="ml-[6px]">Gửi thông báo</span>
                </p>
            </div>

            <Tabs indexs={indexs} components={components} />
            <Dialog open={openDialog}>
                <div className="relative">
                    <p
                        onClick={handleClose}
                        className="absolute top-1 right-1 cursor-pointer hover:bg-[#f2f4f5] p-[4px] rounded-[50%]"
                    >
                        <CloseOutlined />
                    </p>
                    <SendNotice setOpenDialog={setOpenDialog} />
                </div>
            </Dialog>
        </div>
    );
}

export default Notifications;
