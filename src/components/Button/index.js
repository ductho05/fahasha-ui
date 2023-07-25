import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './Button.module.scss'

const cx = classNames.bind(styles)
function Button({ to, href, primary = false, disabled = false, facebook = false, leftIcon, children, onClick }) {

    let Compo = 'Button'
    const props = {
        onClick
    }
    if (href) {
        props.href = href
        Compo = 'a'
    } else if (to) {
        props.to = to
        Compo = Link;
    }

    if (disabled) {
        Compo = 'Button'
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key]
            }
        })
    }

    const Classes = cx('wrapper', {
        primary,
        disabled,
        facebook
    })
    return (
        <Compo className={Classes} {...props}>
            {leftIcon && <p className={cx('icon')}>{leftIcon}</p>}
            {children}
        </Compo>
    )
}

export default Button
