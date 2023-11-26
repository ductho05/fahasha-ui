import React from 'react'
import { Carousel } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const contentStyle = {
    height: '35vw',
    width: '100vw',
    background: "linear-gradient(79deg, #FFE5E5 8.52%, #F5FFFE 68.88%, #FFF 101.74%)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: "20px 100px"
};
function HomeHero() {
    return (
        <div>
            <Carousel autoplay>
                <div>
                    <div style={contentStyle}>
                        <div className="flex-[1] mr-[40px]">
                            <h1 className="text-[4rem] text-[#393280] font-[600]">Tuổi Thơ Dữ Dội - Tập 1 (Tái Bản 2019)</h1>
                            <p
                                style={{
                                    display: "-webkit-flex",
                                    WebkitLineClamp: "4",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                className="text-[1.4rem] h-[20px] text-[#393280] text-start font-[500]"
                            >
                                “Tuổi Thơ Dữ Dội” là một câu chuyện hay, cảm động viết về tuổi thơ. Sách dày 404 trang mà người đọc không bao giờ muốn ngừng lại, bị lôi cuốn vì những nhân vật ngây thơ có, khôn ranh có, anh hùng có, vì những sự việc khi thì ly kỳ, khi thì hài hước, khi thì gây xúc động đến ứa nước mắ khôn ranh có, anh hùng có, vì những sự việc khi thì ly kỳ, khi thì hài hước, khi thì gây xúc động đến ứa nước mắ khôn ranh có, anh hùng có, vì những sự việc khi thì ly kỳ, khi thì hài hước, khi thì gây xúc động đến ứa nước mắ
                            </p>
                            <div
                                style={{
                                    border: "1px solid #393280",
                                    borderRadius: "5px",
                                    width: "120px",
                                    height: "40px",
                                    padding: "10px"
                                }}
                                className="flex items-center cursor-pointer mt-[40px]">
                                <p className="mr-[10px] text-[#393280]">Đọc thêm</p>
                                <ArrowRightOutlined className="text-[20px] text-[#393280]" />
                            </div>
                        </div>
                        <div className="flex-[1]">
                            <img
                                className="h-[38vw] w-[38vw] object-cover"
                                src="https://salt.tikicdn.com/ts/product/29/a4/53/a833aaa57109403c6cd173fab04a1941.jpg" alt="images"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div style={contentStyle}>
                        <div className="flex-[1] mr-[40px]">
                            <h1 className="text-[4rem] text-[#393280] font-[600]">Tuổi Thơ Dữ Dội - Tập 1 (Tái Bản 2019)</h1>
                            <p
                                style={{
                                    display: "-webkit-flex",
                                    WebkitLineClamp: "4",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                className="text-[1.4rem] text-[#393280] text-start font-[500]"
                            >
                                “Tuổi Thơ Dữ Dội” là một câu chuyện hay, cảm động viết về tuổi thơ. Sách dày 404 trang mà người đọc không bao giờ muốn ngừng lại, bị lôi cuốn vì những nhân vật ngây thơ có, khôn ranh có, anh hùng có, vì những sự việc khi thì ly kỳ, khi thì hài hước, khi thì gây xúc động đến ứa nước mắ khôn ranh có, anh hùng có, vì những sự việc khi thì ly kỳ, khi thì hài hước, khi thì gây xúc động đến ứa nước mắ khôn ranh có, anh hùng có, vì những sự việc khi thì ly kỳ, khi thì hài hước, khi thì gây xúc động đến ứa nước mắ
                            </p>
                            <div
                                style={{
                                    border: "1px solid #393280",
                                    borderRadius: "5px",
                                    width: "120px",
                                    height: "40px",
                                    padding: "10px"
                                }}
                                className="flex items-center cursor-pointer mt-[40px]">
                                <p className="mr-[10px] text-[#393280]">
                                    Đọc thêm
                                </p>
                                <ArrowRightOutlined className="text-[20px] text-[#393280]" />
                            </div>
                        </div>
                        <div className="flex-[1] bg-transparent">
                            <img
                                className="h-[38vw] w-[38vw] object-cover bg-transparent"
                                src="https://salt.tikicdn.com/ts/product/29/a4/53/a833aaa57109403c6cd173fab04a1941.jpg" alt="images"
                            />
                        </div>
                    </div>
                </div>
            </Carousel>
        </div>
    )
}

export default HomeHero