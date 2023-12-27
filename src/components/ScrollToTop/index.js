import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    // Lấy URL hiện tại
    const location = useLocation();

    useEffect(() => {
        // Lấy URL hiện tại
        const currentPath = location.pathname;

        // Kiểm tra xem URL có chứa từ "admin" hay không
        if (!currentPath.includes('admin')) {
            // Nếu không có, xóa dữ liệu trong Local Storage
            //localStorage.removeItem('temporary_data');
           // localStorage.removeItem();
        }
        if (!currentPath.includes('admin/flashsale')) localStorage.removeItem('isCheckboxDeleteFS');
    }, [location.pathname]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
