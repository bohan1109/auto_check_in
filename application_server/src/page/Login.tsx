import * as React from 'react';
import api from '../Axios.config'
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
const LoginPage: React.FC = () => {
    const [account, setAccount] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount(e.target.value);
    };
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handelLoginButton = async () => {
        await api.post("/admins/login", {
            account: account,
            password: password
        })
            .then((response) => {
                const jwtToken = response.data.access_token
                localStorage.setItem('jwtTokenType', 'Bearer'); 
                localStorage.setItem('jwtToken', jwtToken);     
            }).catch((error) => {
                console.log(error)
            })
    }
    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} style={{ padding: '20px' }}>
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
                        onClick={handelLoginButton}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handelLoginButton}>
                        登入
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );

}


export default LoginPage