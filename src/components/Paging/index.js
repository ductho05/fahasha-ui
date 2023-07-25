import { useState } from "react"
import classNames from "classnames/bind"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import styles from './Paging.module.scss'

const cx = classNames.bind(styles)
function Paging({ numPages, pages, listCurrentPage, currentPage, setCurrentPage, setListCurrentPage, fiveAndLast }) {



    const pagesIndex = [1, 2, 3, 4, 5, 6]
    const handleChangePage = (e) => {
        setCurrentPage(+e.target.innerText)
        setListCurrentPage(() => {
            let nextListPage = fiveAndLast(pages, +e.target.innerText)
            return nextListPage
        })
        window.scrollTo(0, 0);
    }

    const handlePrevPage = () => {
        setCurrentPage(prev => prev > 1 ? prev - 1 : 1)
        setListCurrentPage(() => {
            let nextListPage = fiveAndLast(pages, currentPage)
            return nextListPage
        })
        window.scrollTo(0, 0);
    }

    const handleNextPage = () => {
        setCurrentPage(prev => prev < pages.length - 1 ? prev + 1 : pages.length - 1)
        setListCurrentPage(() => {
            let nextListPage = fiveAndLast(pages, currentPage)
            return nextListPage
        })
        window.scrollTo(0, 0);
    }

    return (
        <ul className={cx('paging')}>
            <li onClick={handlePrevPage} className={currentPage === 1 ? cx('hidden') : cx('btn')}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </li>
            {
                listCurrentPage.map((page, index) => (
                    <li
                        key={page}
                        onClick={(e) => handleChangePage(e)}
                        className={currentPage === page ? cx('page_item', 'current') : cx('page_item')}>
                        {page}
                    </li>
                ))
            }
            <li onClick={handleNextPage} className={currentPage === pages.length ? cx('hidden') : cx('btn')}>
                <FontAwesomeIcon icon={faAngleRight} />
            </li>
        </ul>
    )
}

export default Paging
