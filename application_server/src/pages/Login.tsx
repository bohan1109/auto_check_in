import * as React from 'react';
import api from '../Axios.config'
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Snackbar from "../components/Snackbar"
const LoginPage: React.FC = () => {
    const [account, setAccount] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"error" | "warning" | "info" | "success">("success")
    const [snackDescription, setSnackDescription] = React.useState('')
    const navigate = useNavigate();
    const handleAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount(e.target.value);
    };
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
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
    const handelLoginButton = () => {
        api.post("/admins/login", {
            account: account,
            password: password
        })
            .then((response) => {
                const jwtToken = response.data.access_token
                localStorage.setItem('jwtToken', jwtToken); 
                showSnackbar("success","登入成功")
                setTimeout(()=>{navigate('/home')},900) 
                
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
    return (<>
        <Snackbar severity={snackbarSeverity} open={snackbarOpen} description={snackDescription} handleClose={handleSnackbarClose} />
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={2} style={{ padding: '20px' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        零次方自動打卡系統
                    </Typography>
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
                    <Button variant="contained" color="primary" fullWidth onClick={handelLoginButton}>
                        登入
                    </Button>
                </Paper>
            </Grid>
        </Grid>
        </>
    );

}


export default LoginPage