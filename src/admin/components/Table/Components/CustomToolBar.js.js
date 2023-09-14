import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid'
import classNames from 'classnames/bind'
import styles from './CustomToolBar.module.scss'

const cx = classNames.bind(styles)
function CustomToolbar() {
    return (
        <GridToolbarContainer className={cx('toolbar')}>
            <GridToolbarExport
                className={cx('btn')}
                csvOptions={{
                    utf8WithBom: true,
                }}
                excelOptions={{
                    columnsStyles: {
                        // replace the dd.mm.yyyy default date format
                        recruitmentDay: { numFmt: 'dd/mm/yyyy' },
                        // set this column in green
                        incomes: { font: { argb: 'FF00FF00' } },
                    },
                }}
            />
        </GridToolbarContainer>
    );
}

export default CustomToolbar
