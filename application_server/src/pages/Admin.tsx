import * as React from 'react';
import api from '../Axios.config'
import DataTable from '../components/Table'
import { Box } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from "../components/Snackbar"
import AppBar from "../components/AppBar"
import ConfirmDialog from "../components/ConfirmDialog";
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
const AdminPage: React.FC = () => {
    interface Admin {
        id: string;
        account: string;
        password: string;
        username: string;
        role:string
    }
    const navigate = useNavigate();
    const [adminData, setAdminData] = React.useState<Admin[]>([])
    const [boolean, setBoolean] = React.useState(true)
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
    const [description, setDescription] = React.useState('')
    const [confirmTitle, setConfirmTitle] = React.useState('')
    const [selectedId, setSelectedId] = React.useState<GridRowId | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"error" | "warning" | "info" | "success">("success")
    const [snackDescription, setSnackDescription] = React.useState('')
    const username = localStorage.getItem("username") || "使用者"
    const role = localStorage.getItem("role")!
    const jwtToken = localStorage.getItem("jwtToken")
    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
    }

    const columns: GridColDef[] = [
        {
            field: 'account',
            headerName: '系統帳號',
            width: 150,
        },
        {
            field: 'password',
            headerName: '密碼',
            width: 150,
            renderCell: () => {
                const obscuredPassword = "********";
                return <>{obscuredPassword}</>;
            }
        },
        {
            field: 'username',
            headerName: '使用者',
            width: 110,
        },
        {
            field: 'role',
            headerName: '權限',
            width: 110,
        },  
        {
            field: 'action',
            headerName: '操作',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return (
                    <DeleteIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleConfirmDialogOpen(params.id)}
                    />
                );
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
        setConfirmTitle('刪除系統帳號');
    }

    const handleDelete = (id: GridRowId) => {
        api.delete(`/admins/${id}`, config)
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
                        showSnackbar("error", "系統帳號刪除失敗，請確認帳號是否存在")
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

    const handleConfirmDialogClose = () => setConfirmDialogOpen(false);

    const onLogout = ()=>{
        localStorage.clear()
        navigate('/')
    }
    React.useEffect(() => {
        api.get("/admins", config)
            .then((response) => {
                const formattedData = response.data.map((item: Admin) => {
                    const camelCaseItem = _.mapKeys(item, (value, key) => _.camelCase(key));
                    return { ...camelCaseItem, id: camelCaseItem.id };
                });

                setAdminData(formattedData);
            }).catch(error => {
                if (error.response.status === 404) {
                    setAdminData([])
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
            <AppBar title='自動打卡系統' onLogout={onLogout} username={username} role={role}/>
            <ConfirmDialog
                title={confirmTitle}
                open={confirmDialogOpen}
                handleClose={handleConfirmDialogClose}
                description={description}
                handleConfirm={handleConfirmDelete}
            />
            <Box mt={4} mx={4}>
                <DataTable rows={adminData}
                    columns={columns}
                    paginationModel={{ page: 0, pageSize: 5 }}
                    pageSizeOptions={[5, 10]}
                />
            </Box>
        </>
    )
}

export default AdminPage