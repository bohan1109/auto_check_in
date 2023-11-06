import * as React from 'react';
import api from '../Axios.config'
import DataTable from '../components/Table'
import { Box, Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import FormDialog from "../components/FormDialog";
import _ from 'lodash';
const HomePage: React.FC = () => {
    interface CheckInAccount {
        id: string; 
        loginSuccess: boolean; 
        checkInAccount: string; 
        checkInPassword: string; 
        checkInUsername: string; 
    }

    const [checkInAccountData, setCheckInAccountData] = React.useState<CheckInAccount[]>([])
    const [dataToPass, setDataToPass] = React.useState<CheckInAccount | undefined>()
    const [boolean, setBoolean] = React.useState(true)
    const jwtToken = localStorage.getItem("jwtToken")
    const jwtTokenType = localStorage.getItem("jwtTokenType")
    const config = {
        headers: {
            Authorization: `${jwtTokenType} ${jwtToken}`
        },
    }

    const columns: GridColDef[] = [
        {
            field: 'checkInAccount',
            headerName: '打卡帳號',
            width: 150,
        },
        {
            field: 'checkInPassword',
            headerName: '密碼',
            width: 150,
            renderCell: () => {
                const obscuredPassword = "********";
                return <>{obscuredPassword}</>;
            }
        },
        {
            field: 'checkInUsername',
            headerName: '使用者',
            width: 110,
        }, {
            field: 'action',
            headerName: '操作',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                const rowData = checkInAccountData.find(item => item.id === params.id);
                return (
                    <EditIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpen(rowData)}
                    />
                );
            },
        },

    ];

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleOpen = (data?: CheckInAccount) => {
        if (data) {
            setDataToPass(data);
            setDialogOpen(true);
        } else {
            setDataToPass(undefined);
        }
        setDialogOpen(true);
    };
    const handleClose = () => setDialogOpen(false);

    const handleAddNew = () => {
        setDataToPass(undefined);
        setDialogOpen(true);
    };
    


    React.useEffect(() => {
        api.get("/check-in-accounts", config)
            .then((response) => {
                const formattedData = response.data.map((item: CheckInAccount) => {
                    const camelCaseItem = _.mapKeys(item, (value, key) => _.camelCase(key));
                    return { ...camelCaseItem, id: camelCaseItem.id }; 
                });
    
                setCheckInAccountData(formattedData);
            }).catch(error => {
                console.log(error)
            })


    }, [boolean]);

    return (
        <>
        <FormDialog
                title="填寫資料"
                open={dialogOpen}
                handleClose={handleClose}
                data={dataToPass}
                boolean={boolean}
                setBoolean={setBoolean}
            />
            <Box m={2} mx={4}> {/* m = margin */}
            <Button variant="contained" color="primary" onClick={handleAddNew}>
                    新增打卡帳號
                </Button>
            </Box>
            <Box mt={4} mx={4}>
                <DataTable rows={checkInAccountData}
                    columns={columns}
                    paginationModel={{ page: 0, pageSize: 5 }}
                    pageSizeOptions={[5, 10]}
                />
            </Box>
        </>
    )

}

export default HomePage