import { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import styles from './ReadMore.module.scss';

const cx = classNames.bind(styles);
function ReadMore({ children }) {
    let text = children;
    var temp = 0;
    for (let i in text) {
        temp += 1;
    }
    const [isReadMore, setIsReadMore] = useState(false);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <>
            <p className={isReadMore ? cx('content') : cx('content', 'ellipsis')}>
                <p dangerouslySetInnerHTML={{ __html: text }} />
            </p>
            <div onClick={toggleReadMore} className={temp > 400 ? cx('toggle') : cx('hidden')}>
                {isReadMore ? (
                    <span>
                        Ẩn bớt
                        <FontAwesomeIcon icon={faAngleUp} />
                    </span>
                ) : (
                    <span>
                        Xem thêm
                        <FontAwesomeIcon icon={faAngleDown} />
                    </span>
                )}
            </div>
        </>
    );
}

export default ReadMore;
