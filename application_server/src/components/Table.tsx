import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface DataTableProps {
    rows: Array<any>;
    columns: GridColDef[];
    paginationModel: { page: number, pageSize: number };
    pageSizeOptions: number[];
}

const DataTable: React.FC<DataTableProps> = ({ rows, columns, paginationModel, pageSizeOptions }) => {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: paginationModel,
                    },
                }}
                pageSizeOptions={pageSizeOptions}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </div>
    );
}

export default DataTable;
