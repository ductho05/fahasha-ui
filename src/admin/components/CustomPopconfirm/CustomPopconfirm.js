import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Button, Popconfirm, Checkbox } from 'antd';
import { useRef } from 'react';

const App = ({ title, description, props, func }) => {
    const [open, setOpen] = useState(false);
    const { disable, isloadingdelete } = props;
    const [isCheckBox, setIsCheckBox] = useState(false);
    console.log(isCheckBox);
    const handleCancel = () => {
        setOpen(false);
    };
    const handleOk = () => {
        func();
        isCheckBox && localStorage.setItem('isCheckboxDeleteFS', isCheckBox);
        setOpen(!isloadingdelete);
    };
    const onChange = (e) => {
        setIsCheckBox(e.target.checked);
    };
    return (
        <Popconfirm
            title={title}
            description={
                <p>
                    <Checkbox onChange={onChange}>{description}</Checkbox>
                </p>
            }
            onConfirm={handleOk}
            open={localStorage.getItem('isCheckboxDeleteFS') ? !localStorage.getItem('isCheckboxDeleteFS') : open}
            onCancel={handleCancel}
            okButtonProps={{
                loading: isloadingdelete,
            }}
            icon={
                <QuestionCircleOutlined
                    style={{
                        color: 'red',
                    }}
                />
            }
        >
            <Button
                danger
                disabled={disable !== undefined ? disable : false}
                onClick={() => {
                    localStorage.getItem('isCheckboxDeleteFS') ? func() : setOpen(true);
                }}
            >
                Xóa
            </Button>
        </Popconfirm>
    );
};
export default App;
