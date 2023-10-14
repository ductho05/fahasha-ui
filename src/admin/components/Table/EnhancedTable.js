import { DataGrid, viVN } from '@mui/x-data-grid';
import CustomToolbar from './Components/CustomToolBar.js';
import CustomPagination from './Components/CustomPagonation';

export default function EnhancedTable({ columns, rows }) {
    return (
        <>
            <div style={{ minHeight: 400, width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    style={{
                        fontSize: '1.3rem',
                        '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                            outline: 'none'
                        }
                    }}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 6,
                            },
                        },
                    }}
                    pageSizeOptions={[6, 12]}
                    checkboxSelection
                    slots={{
                        toolbar: CustomToolbar,
                        pagination: CustomPagination
                    }}
                />
            </div>
        </>
    )
}