import * as React from 'react';
import api from '../Axios.config'
import DataTable from '../components/Table'
import { Box } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';

const HomePage: React.FC = () => {
    interface CheckInAccount {
        _id: string;
        login_success: boolean;
        check_in_account: string;
        check_in_password: string;
        check_in_username: string;
    }
    const [checkInAccountData, setCheckInAccountData] = React.useState<CheckInAccount[]>([])
    const [boolean, setBoolean] = React.useState(true)
    const jwtToken = localStorage.getItem("jwtToken")
    const jwtTokenType = localStorage.getItem("jwtTokenType")
    const config = {
        headers: {
            Authorization: `${jwtTokenType} ${jwtToken}`
        },
    }
    const handleButtonClick = (id: GridRowId) => {
        // 這裡你可以使用該id做任何操作
        console.log(id);
    };
    const columns: GridColDef[] = [
        {
            field: 'check_in_account',
            headerName: '打卡帳號',
            width: 150,
        },
        {
            field: 'check_in_password',
            headerName: '密碼',
            width: 150,
            renderCell: () => {
                const obscuredPassword = "********";
                return <>{obscuredPassword}</>;
            }
        },
        {
            field: 'check_in_username',
            headerName: '使用者',
            width: 110,
        }, {
            field: 'action',
            headerName: '操作',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                const id = params.id;  // 這裡獲取到該行的id
                return (
                    <button onClick={() => handleButtonClick(id)}>
                        按鈕
                    </button>
                );
            },
        },

    ];



    React.useEffect(() => {
        api.get("/check-in-accounts", config)
            .then((response) => {
                const formattedData = response.data.map((item: CheckInAccount) => {
                    return { ...item, id: item._id };
                });

                setCheckInAccountData(formattedData)
            }).catch(error => {
                console.log(error)
            })


    }, [boolean]);

    return (
        <>
            <Box mt={20} mx={4}>
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