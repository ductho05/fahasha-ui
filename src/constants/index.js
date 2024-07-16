export const isDeploy = process.env.NODE_ENV === 'production';
// console.log('isDeploy', isDeploy);
export const apiKeyEditor = '6dlo2vwbazk8r83upbs5h8js3bv8uqvexpc8ls76z11zl1at';
export const api = "https://bookstore-api-3hwm.onrender.com/bookstore/api/v1"
    // ? 'https://bookstore-api-3hwm.onrender.com/bookstore/api/v1'
    // : 'http://127.0.0.1:3000/bookstore/api/v1';
// export const api = 'http://127.0.0.1:3000/bookstore/api/v1';
export const apiProvinces = 'https://provinces.open-api.vn/api/?depth=3';
export const API_ADDRESS = 'https://vapi.vnappmob.com'
export const apiMaps = 'https://api.mapbox.com/';
// export const appPath = 'http://localhost:8080'

export const appPath = isDeploy ? 'https://bookstore-ta.vercel.app' : 'http://localhost:3456';

export const orderImages = 'https://www.advotics.com/wp-content/uploads/2022/02/surat-jalan-01-1-4-1536x984.png';
export const registerImages = 'https://quicklaunch.io/wp-content/uploads/2019/10/user-registration.png';
export const cancelOrderImage =
    'https://commercemarketplace.adobe.com/media/catalog/product/f/8/f80e_cancel-order-240x240_3.png';

export const flashSaleImage =
    'https://img.freepik.com/free-vector/special-flash-sale-modern-banner-design-vector-illustration_1017-38337.jpg';

export const lockImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg-9Ld8ptDN8JEy1oAwnE3etK_9Zn-xaAeEw&usqp=CAU';
export const unLockImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWOKkU25svJ7cINb3fMH2Pxo_6KOGUm-A9JQ&usqp=CAU';

export const voucherImage = 'https://cdn-www.vinid.net/483a744d-cach-san-voucher.jpg';

export const listJustWatched = JSON.parse(localStorage.getItem('mycategory')) || [];

export const superAdmin = 'superadmin1811';

export const listPathHots = [
    {
        title: 'Sách mới nhất',
        path: '/new/10',
    },
    {
        title: 'Sách rẻ nhất',
        path: '/sale/10',
    },
    {
        title: 'Bán chạy nhất',
        path: '/bestseller/10',
    },
];

export const listPathCategory = [
    {
        title: 'Lịch sử thế giới',
        path: 'category=9725&limit=10',
    },

    {
        title: 'Nghệ thuật sống đẹp',
        path: 'category=872&limit=10',
    },

    {
        title: 'Tài chính - Tiền tệ',
        path: 'category=5246&limit=10',
    },
];
export const listPathLearn = [
    {
        title: 'Băng keo - Keo hồ - Cắt keo',
        path: 'category=3898&limit=10',
    },

    {
        title: 'Bút lông màu',
        path: 'category=8934&limit=10',
    },
];
export const optionsArange = [
    {
        title: 'Giá thấp nhất',
        value: 'price',
        type: 'asc',
    },
    {
        title: 'Giá cao nhất',
        value: 'price',
        type: 'desc',
    },
    {
        title: 'Bán chạy nhất',
        value: 'sold',
        type: 'desc',
    },
    {
        title: 'Đánh giá cao nhất',
        value: 'rate',
        type: 'desc',
    },
];
export const optionsNumProduct = [
    {
        title: '12 sản phẩm',
        value: 12,
    },
    {
        title: '24 sản phẩm',
        value: 24,
    },
    {
        title: '48 sản phẩm',
        value: 48,
    },
];

export const cateList = [
    {
        title: '10 sản phẩm',
        value: 10,
    },
    {
        title: '20 sản phẩm',
        value: 20,
    },
    {
        title: '40 sản phẩm',
        value: 40,
    },
];
export const locationShop = [106.762681, 10.854211];
export const API_KEY = 'pk.eyJ1IjoiZHVjdGhvIiwiYSI6ImNsanlmem5kaDA0OTIzZnFnMGpmMzhlZ2sifQ.Tm8Tc--X7kKEwGD3p7N1gw';
// List status order
export const CHOXACNHAN = 'CHOXACNHAN';
export const DANGGIAO = 'DANGGIAO';
export const HOANTHANH = 'HOANTHANH';
export const DAHUY = 'DAHUY';

export const PUBLIC_KEY = 'BChIP9bgEuPaXNXFpNSQaIVpF5DsKYSl9WoueBtNKA-FX1LOvuS6oxc-92DBgFMgcojDPfTzPvxmbzeFz27lJ68';
