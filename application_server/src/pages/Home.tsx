import * as React from 'react';
import api from '../Axios.config'
import DataTable from '../components/Table'
import { Box, Button } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from "../components/FormDialog";
import Snackbar from "../components/Snackbar"
import ConfirmDialog from "../components/ConfirmDialog";
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
    const [formDialogOpen, setFormDialogOpen] = React.useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
    const [description, setDescription] = React.useState('')
    const [confirmTitle, setConfirmTitle] = React.useState('')
    const [selectedId, setSelectedId] = React.useState<GridRowId | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"error" | "warning" | "info" | "success">("success")
    const [snackDescription, setSnackDescription] = React.useState('')
    const [formTitle, setFormTitle] = React.useState('')
    const jwtToken = localStorage.getItem("jwtToken")
    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
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
                return (<>
                    <EditIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpen(rowData)}
                    />
                    <DeleteIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleConfirmDialogOpen(params.id)}
                    />
                </>
                );
            },
        },
    ];

    const showSnackbar = (severity:"error" | "warning" | "info" | "success", message:string) => {
        setSnackbarSeverity(severity);
        setSnackDescription(message);
        setSnackbarOpen(true);
    };

    const handleConfirmDialogOpen = (id: GridRowId) => {
        setSelectedId(id);
        setConfirmDialogOpen(true);
        setDescription('您確定要刪除這個帳號嗎？');
        setConfirmTitle('刪除打卡帳號');
    }

    const handleDelete = (id: GridRowId) => {
        api.delete(`/check-in-accounts/${id}`, config)
            .then((response) => {
                console.log("刪除成功", response.data)
                setSnackbarOpen(true)
                showSnackbar("success","刪除成功")
                setBoolean(!boolean)
            }).catch((error) => {
                if (error.response) {
                    console.log('Error', error.response.status);
                    console.log('Error data', error.response.data);
                } else if (error.request) {
                    console.log('Error with request', error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            })
    }

    const handleConfirmDelete = () => {
        if (selectedId !== null) {
            handleDelete(selectedId);
            setConfirmDialogOpen(false);
            setSelectedId(null);
        }
    };

    const handleOpen = (data?: CheckInAccount) => {
        if (data) {
            setFormTitle("修改打卡帳號")
            setDataToPass(data);
            setFormDialogOpen(true);
        } else {
            setDataToPass(undefined);
        }
        setFormDialogOpen(true);
    };
    const handleFormDialogClose = () => setFormDialogOpen(false);
    const handleConfirmDialogClose = () => setConfirmDialogOpen(false);

    const handleAddNew = () => {
        setFormTitle("新增打卡帳號")
        setDataToPass(undefined);
        setFormDialogOpen(true);
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
                if(error.response.status===404){
                    setCheckInAccountData([])
                    return
                }
                console.log(error)
                
            })
    }, [boolean]);

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason !== 'clickaway') {
            setSnackbarOpen(false);
        }
    };



    return (
        <>
            <Snackbar severity={snackbarSeverity} open={snackbarOpen} description={snackDescription} handleClose={handleSnackbarClose} />
            <FormDialog
                title={formTitle}
                open={formDialogOpen}
                handleClose={handleFormDialogClose}
                data={dataToPass}
                boolean={boolean}
                setBoolean={setBoolean}
                showSnackbar={showSnackbar}
            />
            <ConfirmDialog
                title={confirmTitle}
                open={confirmDialogOpen}
                handleClose={handleConfirmDialogClose}
                description={description}
                handleConfirm={handleConfirmDelete}
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