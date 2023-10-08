import styles from "./flashsale.module.scss";
import classname from "classnames/bind";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "animate.css";
import { Item } from "../../../index";
import { Carousel, Progress, Skeleton } from "antd";

const numeral = require("numeral");
const cx = classname.bind(styles);
function FlashSale() {
  var [gifts, setGifts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://backoffice.nodemy.vn/api/products?populate=*")
      .then((res) => {
        setGifts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function GetCoupon(price, priceSale) {
    var coupon = 100 - Math.floor((price / priceSale) * 100);
    return coupon < 0 ? `+${Math.abs(coupon)}%` : `-${Math.abs(coupon)}%`;
  }

  function RestTime(props) {
    const [countdown, setCountdown] = useState(null);
    useEffect(() => {
      // Thiết lập thời gian kết thúc đếm ngược
      const countDownDate = new Date("NOV 1, 2024 16:37:25").getTime();

      // Cập nhật đồng hồ đếm ngược mỗi 1 giây
      const x = setInterval(() => {
        // Lấy thời gian hiện tại
        const now = new Date().getTime();

        // Tính thời gian còn lại giữa thời gian hiện tại và thời gian kết thúc đếm ngược
        const distance = countDownDate - now;

        // Tính toán thời gian cho giờ, phút và giây
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hiển thị đồng hồ đếm ngược
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);

        // Nếu đếm ngược kết thúc, dừng cập nhật
        if (distance < 0) {
          clearInterval(x);
          setCountdown("Đếm ngược đã kết thúc");
        }
      }, 1000);

      // Clear interval khi component unmount
      return () => clearInterval(x);
    }, []);
    return (
      <>
        <div className={cx("gift-current__time")}>
          <p className={cx("gift-current__time__title")}>Kết thúc sau</p>
          {countdown ? (
            <p className={cx("gift-current__time__title")}>{countdown}</p>
          ) : (
            <Skeleton.Input active />
          )}
        </div>
      </>
    );
  }

  function GetListGift() {
    //const { gifts } = props;
    var listGift = [];
    var listGiftTemp = [];
    gifts.map((item, index) => {
      if (index % 4 === 0 && index !== 0) {
        listGift.push(listGiftTemp);
        listGiftTemp = [];
      }
      listGiftTemp.push(item);
    });
    listGift.push(listGiftTemp);
    return listGift;
  }

  return (
    <>
      <div className={cx("gift-current")}>
        <div className={cx("gift-current__title")}>
          <h2 className={cx("gift-current__text")}>QUÀ TẶNG ĐANG DIỄN RA</h2>
          <RestTime />
        </div>
        <div className={cx("gift-current__content")}>
          {gifts.length === 0 ? (
            <div className={cx("content")}>
              {[1, 2, 3, 4].map((item, index) => {
                return (
                  <div className={cx("item-gift")}>
                    <Skeleton.Image style={{ width: "100" }} active={true} />
                    <Skeleton
                      style={{ width: "100%", margin: "20% 0 0 0" }}
                      size="2rem"
                      active={true}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <Carousel autoplay>
              {GetListGift().map((item, index) => {
                return (
                  <div key={index}>
                    <div className={cx("content")}>
                      {item.map((item, index) => {
                        return <Item item={item} index={index} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </Carousel>
          )}
        </div>
      </div>
    </>
  );
}
export default FlashSale;
