import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames/bind'

import styles from './Modal.module.scss'

const cx = classNames.bind(styles)

function Modal({ isShowing, children }) {
    return isShowing ? <React.Fragment>
        <div className={cx('modal', 'hide-on-tablet-mobile')}>
            {children}
        </div>
    </React.Fragment> : children
}

export default Modal
