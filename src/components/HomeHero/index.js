import React from 'react'
import { Carousel } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { api } from '../../constants';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';

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

    const [bestSales, setBestSales] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {

        setLoading(true)
        axios.get(`${api}/products/bestseller-limit`)
            .then(response => {

                if (response.data.status == "OK") {
                    setBestSales(response.data.data)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    return (
        <div>
            {
                loading
                    ?
                    <Carousel autoplay>
                        {
                            <div>
                                <div style={contentStyle}>
                                    <div className="flex-[1] mr-[40px]">
                                        <h1 className="mb-[20px]"><Skeleton.Input active /></h1>
                                        <p>
                                            <Skeleton active />
                                        </p>
                                        <div
                                            style={{
                                                width: "120px",
                                                height: "40px",
                                                padding: "10px"
                                            }}
                                            className="flex items-center cursor-pointer mt-[40px]">
                                            <Skeleton.Button width={150} height={40} active />
                                        </div>

                                    </div>
                                    <div className="flex-[1]">
                                        <Skeleton.Image width={150} height={300} active />
                                    </div>
                                </div>
                            </div>
                        }
                    </Carousel>
                    :
                    <Carousel autoplay>
                        {
                            bestSales.map(product => (
                                <div key={product._id}>
                                    <div style={contentStyle}>
                                        <div className="flex-[1] mr-[40px]">
                                            <h1 className="text-[4rem] text-[#393280] font-[600]">{product.title}</h1>
                                            <p
                                                style={{
                                                    maxHeight: "140px",
                                                    minHeight: "136px",
                                                    overflow: "hidden",
                                                    whiteSpace: 'wrap',
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-flex",
                                                    WebkitLineClamp: 6,
                                                    WebkitBoxOrient: "vertical"
                                                }}
                                                className="text-[1.4rem] h-[20px] text-[#393280] text-start font-[500]"
                                            >
                                                <p dangerouslySetInnerHTML={{ __html: product.desciption }} />
                                            </p>
                                            <Link to={`/product-detail/${product._id}`}
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
                                            </Link>
                                        </div>
                                        <div className="flex-[1]">
                                            <img
                                                className="h-[38vw] w-[38vw] object-cover"
                                                src={product.images} alt="images"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </Carousel>
            }
        </div>
    )
}

export default HomeHero