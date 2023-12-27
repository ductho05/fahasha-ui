import { DataGrid, viVN } from '@mui/x-data-grid';
import CustomToolbar from './Components/CustomToolBar.js';
import CustomPagination from './Components/CustomPagonation';
import { useState, useEffect, useRef } from 'react';
import { useData } from '../../../stores/DataContext';

export default function EnhancedTable({
    type,
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
    const { data, setData } = useData();
    // const [rowNew, setRowNew] = useState(rows);

    function moveElementToFront(arr, idToMove) {
        if (!Array.isArray(arr)) {
            console.error('arr is not an array', arr);
            return type == 'customFlashsale' && data.products;
        }
        const index = arr.findIndex((element) => element._id === idToMove);
        if (index !== -1) {
            const elementToMove = arr.splice(index, 1)[0]; // Loại bỏ phần tử từ vị trí cũ
            arr.unshift(elementToMove); // Thêm phần tử vào đầu mảng
        }
        return arr;
    }

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
            <div
                style={
                    height
                        ? type !== undefined &&
                          (type == 'customFlashsale' ||
                              type == 'statistics' ||
                              type == 'review' ||
                              type == 'order' ||
                              type == 'notification' ||
                              type == 'product' ||
                              type == 'categoryDetail' ||
                              type == 'user' ||
                              type == 'category' ||
                              type == 'flashsale' ||
                              type == 'detailFLashsale') && {
                              height: height,
                          }
                        : // : { minHeight: height }
                          { height: '100vh' }
                }
            >
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            whiteSpace: 'normal',
                            lineHeight: 'normal',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            // Forced to use important since overriding inline styles
                            height: 'unset !important',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            // Forced to use important since overriding inline styles
                            maxHeight: '168px !important',
                        },
                        '& .MuiDataGrid-cell': {
                            maxHeight: 'max-content !important',
                            whiteSpace: 'wrap !important',
                        },
                        '& .MuiDataGrid-row': {
                            maxHeight: 'max-content !important',
                            minHeight: 'max-content !important',
                            paddingTop:
                                type == 'flashsale' || type == 'detailFLashsale' || type == 'statistics'
                                    ? '0px'
                                    : '10px',
                        },
                    }}
                    disableSelectionOnClick={true}
                    disableColumnMenu={true}
                    disableColumnFilter={true}
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
