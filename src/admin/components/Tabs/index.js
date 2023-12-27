import React from 'react'
import { Button } from 'antd';

function Tabs({ indexs, components }) {

    const [tabIndex, setTabIndex] = React.useState(0)

    const handleChooseTab = (id) => {
        setTabIndex(id)
    }

    return (
        <div className="mt-[10px]">
            <div className="my-[10px]">
                {
                    indexs?.map((item, index) => (
                        <Button
                            style={{
                                marginRight: "10px"
                            }}
                            className={tabIndex == index && "text-[#4096ff] border-[#4096ff]"}
                            onClick={() => handleChooseTab(index)}
                            key={index}
                        >
                            {item}
                        </Button>
                    ))
                }
            </div>
            {
                components?.map((Component, index) => (
                    <div key={index} className={tabIndex == index ? "visible" : "hidden"}>
                        {Component}
                    </div>
                ))
            }
        </div>
    )
}

export default Tabs