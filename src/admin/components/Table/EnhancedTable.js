import { DataGrid, viVN } from '@mui/x-data-grid';
import CustomToolbar from './Components/CustomToolBar.js';
import CustomPagination from './Components/CustomPagonation';
import { useState, useEffect } from 'react';

export default function EnhancedTable({ columns, rows, func, isStatus, ischeckboxSelection }) {
    const exe = func !== undefined && isStatus !== undefined;
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    useEffect(() => {
        if (exe) func(rowSelectionModel);
    }, [rowSelectionModel]);

    useEffect(
        () => {
            if (exe) setRowSelectionModel([]);
        },
        exe ? [isStatus.isToggle] : [],
    );

    return (
        <>
            <div style={{ height: 534, width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    style={{
                        fontSize: '1.3rem',

                        // '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                        //     outline: 'none',
                        // },
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
                    //pageSizeOptions={[10, 20, 50, 100]}
                    checkboxSelection={ischeckboxSelection !== undefined ? ischeckboxSelection : true}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}

                    pageSizeOptions={[6, 12]}
                    
                    slots={{
                        toolbar: CustomToolbar,
                        pagination: CustomPagination,
                    }}
                />
            </div>
        </>
    );
}
