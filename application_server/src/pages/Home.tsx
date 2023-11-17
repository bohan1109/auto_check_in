import * as React from 'react';
import api from '../Axios.config'
import DataTable from '../components/Table'
import { Box, Button } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from "../components/FormDialog";
import Snackbar from "../components/Snackbar"
import AppBar from "../components/AppBar"
import ConfirmDialog from "../components/ConfirmDialog";
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
const HomePage: React.FC = () => {
    interface CheckInAccount {
        id: string;
        loginSuccess: boolean;
        checkInAccount: string;
        checkInPassword: string;
        checkInUsername: string;
        checkInTime: string;
        checkOutTime: string;
        owner: string;
    }
    const navigate = useNavigate();
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
    const username = localStorage.getItem("username") || "使用者"
    const jwtToken = localStorage.getItem("jwtToken")
    const role = localStorage.getItem("role")!
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
        },
        {
            field: 'checkInTime',
            headerName: '上班打卡時間',
            width: 120,
        },
        {
            field: 'checkOutTime',
            headerName: '下班打卡時間',
            width: 120,
        },
        {
            field: 'action',
            headerName: '操作',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                const rowData = checkInAccountData.find(item => item.id === params.id);
                const account = localStorage.getItem("account")
                const role = localStorage.getItem("role")
                if ((rowData && rowData.owner === account) || role === "admin") {
                    return (
                        <>
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
                } else {
                    return null;
                }
            },
        },
    ];

    const showSnackbar = (severity: "error" | "warning" | "info" | "success", message: string) => {
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
                showSnackbar("success", "刪除成功")
                setBoolean(!boolean)
            }).catch((error) => {
                switch (error.response.status) {
                    case 422:
                        showSnackbar("warning", "請輸入正確資料")
                        break
                    case 400:
                        showSnackbar("error", "打卡帳號刪除失敗，請確認帳號是否存在")
                        break
                    case 403:
                        showSnackbar("warning", "權限錯誤")
                        break
                    case 500:
                        showSnackbar("error", "伺服器錯誤請聯繫，開發人員")
                        break
                }
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
    const onLogout = () => {
        localStorage.clear()
        navigate('/')
    }
    React.useEffect(() => {
        api.get("/check-in-accounts", config)
            .then((response) => {
                const formattedData = response.data.map((item: CheckInAccount) => {
                    const camelCaseItem = _.mapKeys(item, (value, key) => _.camelCase(key));
                    return { ...camelCaseItem, id: camelCaseItem.id };
                });

                setCheckInAccountData(formattedData);
            }).catch(error => {
                if (error.response.status === 404) {
                    setCheckInAccountData([])
                    return
                }
                console.log(error)

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {role === "admin" && <AppBar title='自動打卡系統' onLogout={onLogout} username={username} role={role} />}
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