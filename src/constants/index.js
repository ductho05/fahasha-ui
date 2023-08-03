export const api = 'https://bookstore-api-0a2i.onrender.com/bookstore/api/v1'
export const apiProvinces = 'https://provinces.open-api.vn/api/?depth=3'
export const apiMaps = 'https://api.mapbox.com/'
export const listPathHots = [
    {
        title: 'Sách mới nhất',
        path: '/new/10'
    },
    {
        title: 'Sách rẻ nhất',
        path: '/sale/10'
    },
    {
        title: 'Bán chạy nhất',
        path: '/bestseller/10'
    }
]
export const listPathCategory = [
    {
        title: 'Lịch sử thế giới',
        path: 'category=9725&limit=10'
    },

    {
        title: 'Nghệ thuật sống đẹp',
        path: 'category=872&limit=10'
    },

    {
        title: 'Tài chính - Tiền tệ',
        path: 'category=5246&limit=10'
    },
]
export const listPathLearn = [
    {
        title: 'Băng keo - Keo hồ - Cắt keo',
        path: 'category=3898&limit=10'
    },

    {
        title: 'Bút lông màu',
        path: 'category=8934&limit=10'
    }
]
export const optionsArange = [
    {
        title: 'Giá thấp nhất',
        value: 'price',
        type: 'asc'
    },
    {
        title: 'Giá cao nhất',
        value: 'price',
        type: 'desc'
    },
    {
        title: 'Bán chạy nhất',
        value: 'sold',
        type: 'desc'
    },
    {
        title: 'Đánh giá cao nhất',
        value: 'rate',
        type: 'desc'
    },
]
export const optionsNumProduct = [
    {
        title: '10 sản phẩm',
        value: 10
    },
    {
        title: '20 sản phẩm',
        value: 20
    },
    {
        title: '40 sản phẩm',
        value: 40
    }
]
export const locationShop = [106.762681, 10.854211]
export const API_KEY = 'pk.eyJ1IjoiZHVjdGhvIiwiYSI6ImNsanlmem5kaDA0OTIzZnFnMGpmMzhlZ2sifQ.Tm8Tc--X7kKEwGD3p7N1gw'
// List status order
export const CHOXACNHAN = 'CHOXACNHAN'
export const DANGGIAO = 'DANGGIAO'
export const HOANTHANH = 'HOANTHANH'
export const DAHUY = 'DAHUY'