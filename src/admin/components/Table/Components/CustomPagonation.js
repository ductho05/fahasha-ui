import { GridPagination, useGridApiContext, useGridSelector, gridPageCountSelector } from '@mui/x-data-grid'
import MuiPagination from '@mui/material/Pagination';
import classNames from 'classnames/bind'
import styles from './CustomPagonation.module.scss'

const cx = classNames.bind(styles)

function Pagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <MuiPagination
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event, newPage - 1);
            }}
        />
    );
}

function CustomPagination(props) {
    return <GridPagination
        ActionsComponent={Pagination} {...props}
    />;
}

export default CustomPagination;
