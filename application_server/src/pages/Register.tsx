import * as React from 'react';
import api from '../Axios.config'
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Snackbar from "../components/Snackbar"
import _ from 'lodash';
const RegisterPage: React.FC = () => {
    const [account, setAccount] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"error" | "warning" | "info" | "success">("success")
    const [snackDescription, setSnackDescription] = React.useState('')
    const navigate = useNavigate();

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount(e.target.value);
    };
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };
    const showSnackbar = (severity:"error" | "warning" | "info" | "success", message:string) => {
        setSnackbarSeverity(severity);
        setSnackDescription(message);
        setSnackbarOpen(true);
    };
    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason !== 'clickaway') {
            setSnackbarOpen(false);
        }
    };
    const handelRegisterButton = () => {
        const registerData = {
            username:username,
            account: account,
            password: password,
            confirmPassword: confirmPassword,
            role:"user"
        }
        const formattedData = _.mapKeys(registerData, (value, key) => _.snakeCase(key));
        api.post("/admins", formattedData)
            .then((response) => {
                showSnackbar("success","註冊成功，頁面即將轉跳")
                login()
                
            }).catch((error) => {
                switch (error.response.status){
                    case 400:
                        showSnackbar("warning","帳號已存在!")
                        break
                    case 422:
                        if(error.response.data.detail==="Password and Confirm Password do not match"){
                            showSnackbar("warning","確認密碼錯誤")
                        }else{
                            showSnackbar("warning","請輸入正確資料")
                        }
                        break
                    case 500:
                        showSnackbar("error","伺服器錯誤，請聯繫開發人員")
                        break
                }
            })
    }
    const login = () => {
        api.post("/admins/login", {
            account: account,
            password: password
        })
            .then((response) => {
                const jwtToken = response.data.access_token
                localStorage.setItem('jwtToken', jwtToken);
                getTokenContent()
                showSnackbar("success", "登入成功")
                setTimeout(() => { navigate('/home') }, 900) 
                
            }).catch((error) => {
                switch (error.response.status){
                    case 422:
                            showSnackbar("warning","請輸入正確資料")
                        break
                    case 401:
                        showSnackbar("error","帳號或密碼錯誤")
                        break
                    case 500:
                        showSnackbar("error","伺服器錯誤，請聯繫開發人員")
                        break
                }
            })
    }

    const getTokenContent = () => {
        const jwtToken = localStorage.getItem("jwtToken")
                const config = {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    },
                }
        api.get('/admins/protected', config)
        .then((response)=>{
            const responseData = response.data
            localStorage.setItem('username', responseData.username);
            localStorage.setItem('role', responseData.role);
            localStorage.setItem('account', responseData.account);
        }).catch(()=>{
            showSnackbar("error", "伺服器錯誤，請聯繫開發人員")
        })
    }

    return (<>
        <Snackbar severity={snackbarSeverity} open={snackbarOpen} description={snackDescription} handleClose={handleSnackbarClose} />
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={2} style={{ padding: '20px' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        自動打卡帳號註冊
                    </Typography>
                    <TextField
                        label="使用者名稱"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleUsername}
                    />
                    <TextField
                        label="帳號"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleAccount}
                    />
                    <TextField
                        label="密碼"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        onChange={handlePassword}
                    />
                    <TextField
                        label="確認密碼"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        onChange={handleConfirmPassword}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handelRegisterButton}>
                        註冊
                    </Button>
                </Paper>
            </Grid>
        </Grid>
        </>
    );

}


export default RegisterPage