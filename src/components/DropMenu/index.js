import { useState } from "react"
import classNames from "classnames/bind"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import styles from './DropMenu.module.scss'

const cx = classNames.bind(styles)
function DropMenu({ options, size, optionSelected, setOptionSelected }) {
    const [isShowOption, setIsShowOption] = useState(false)
    const handleToggleOption = () => {
        setIsShowOption(!isShowOption)
    }

    const handleSelectOption = (e) => {
        setOptionSelected(
            {
                title: e.target.innerText,
                value: e.target.dataset.value,
                type: e.target.type
            }
        )
        setIsShowOption(!isShowOption)
    }

    return (
        <div className={cx('DropMenu', size)}>
            <p className={cx('select')}>{optionSelected.title}</p>
            <span onClick={handleToggleOption} className={cx('select_icon')}>
                <FontAwesomeIcon icon={faAngleDown} />
            </span>

            <ul className={isShowOption ? cx('options_list', 'visible') : cx('options_list')}>
                {
                    options.map((option, index) => (
                        <li
                            key={index}
                            data-value={option.value}
                            type={option.type}
                            onClick={(e) => handleSelectOption(e)}
                            className={option.title === optionSelected.title ? cx('options_item', 'option_active') : cx('options_item')}>
                            {option.title}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default DropMenu
