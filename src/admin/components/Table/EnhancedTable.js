import { DataGrid, viVN } from '@mui/x-data-grid';
import CustomToolbar from './Components/CustomToolBar.js';
import CustomPagination from './Components/CustomPagonation';
import { useState, useEffect, useRef } from 'react';

function moveElementToFront(arr, idToMove) {
    const index = arr.findIndex((element) => element._id === idToMove);
    if (index !== -1) {
        const elementToMove = arr.splice(index, 1)[0]; // Loại bỏ phần tử từ vị trí cũ
        arr.unshift(elementToMove); // Thêm phần tử vào đầu mảng
    }
    return arr;
}

export default function EnhancedTable({
    columns,
    rows,
    func,
    isStatus,
    isRowCurrent,
    ischeckboxSelection,
    pageSize,
    height,
}) {
    const exe = func !== undefined && isStatus !== undefined;
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    // const [rowNew, setRowNew] = useState(rows);
    useEffect(() => {
        if (exe) func(rowSelectionModel);
    }, [rowSelectionModel]);

    useEffect(
        () => {
            if (exe) setRowSelectionModel([]);
        },
        exe ? [isStatus.isToggle] : [],
    );

    // useEffect(() => {
    //     isRowCurrent == null && setRowNew(rows);
    // }, [isRowCurrent]);

    return (
        <>
            <div style={height ? { minHeight: height } : { height: 534 }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    style={{
                        fontSize: '1.3rem',
                    }}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    rows={moveElementToFront(rows, isRowCurrent) || rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: pageSize ? pageSize : 6,
                            },
                        },
                    }}
                    pageSizeOptions={[2, 6, 12, 24, 48, 96]}
                    checkboxSelection={ischeckboxSelection !== undefined ? ischeckboxSelection : true}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={isRowCurrent || rowSelectionModel}
                    slots={{
                        toolbar: CustomToolbar,
                        pagination: CustomPagination,
                    }}
                />
            </div>
        </>
    );
}
