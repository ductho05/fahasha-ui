import styles from "./item.module.scss";
import classname from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { Progress, Skeleton } from "antd";
const numeral = require("numeral");
const cx = classname.bind(styles);
function Item(props) {
  const navigate = useNavigate();
  const { item, index } = props;
  const restAPI = "https://backoffice.nodemy.vn";
  // console.log("AAAAAA" + restAPI + item.attributes.image?.data[0].attributes.url);
  function GetCoupon(price, priceSale) {
    var coupon = 100 - Math.floor((price / priceSale) * 100);
    return coupon < 0 ? `+${Math.abs(coupon)}%` : `-${Math.abs(coupon)}%`;
  }

  return (
    <>
      <div
        key={index}
        onMouseEnter={(e) => {
          e.currentTarget.childNodes[0].style.transform = "scale(1.1)";
          e.currentTarget.childNodes[1].childNodes[0].style.color = "#288ad6";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.childNodes[0].style.transform = "scale(1.0)";
          e.currentTarget.childNodes[1].childNodes[0].style.color = "#000";
        }}
        onClick={() => navigate(`/detail/${item.attributes.slug}`)}
        className={cx("item-gift")}
      >
        <LazyLoadImage
          height="200px"
          style={{
            backgroundColor: "red",
            width: "98%",
          }}
          effect="blur"
          src={
            item.attributes.image?.data
              ? restAPI + item.attributes.image.data[0].attributes.url
              : "https://backoffice.nodemy.vn/uploads/r5_3050_1ca8d2e294ca4a3c8c875ac518beb714_large_4c8a4d705f.webp"
          }
        />
        <div className={cx("item-content")}>
          <div className={cx("item-content__title")}>
            {item.attributes.name}
          </div>
          <div className={cx("item-content__price")}>
            <div className={cx("price__new")}>
              {numeral(item.attributes.price).format("0,0")}
              <span>đ</span>
            </div>
            <div className={cx("price__old")}>
              <div className={cx("price")}>
                {numeral(item.attributes.oldPrice).format("0,0") + "đ"}
              </div>
              <div className={cx("sale")}>
                {GetCoupon(item.attributes.price, item.attributes.oldPrice)}
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Progress
              percent={
                (Math.floor(20 - item.attributes.quantityAvailable) * 100) / 20
              }
              format={(percent) => `${(percent * 20) / 100}/20`}
              status="active"
              showInfo={false}
              strokeWidth={25}
              style={{
                marginTop: "5%",
                width: "200px",
                opacity: "0.8",
              }}
              strokeColor={{
                "0%": "yellow",
                "100%": "red",
              }}
              trailColor="#dddddd"
            />
            <div
              style={{
                position: "absolute",
                top: "55%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "black",
                fontWeight: "100",
                fontSize: "0.8rem",
                width: "100%",
                textAlign: "center",
              }}
            >
              {`Đã bán ${20 - item.attributes.quantityAvailable}/20`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Item;
