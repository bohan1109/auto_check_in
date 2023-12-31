import React,{useContext} from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {TokenContext} from "../App"
interface AppBarProps {
    title: string;
    username:string
}



const CustomAppBar: React.FC<AppBarProps> = ({ title,username }) => {
    const navigate = useNavigate();
    const context = useContext(TokenContext);

    if (!context) {
        return null; 
    }

const { setTokenContext, role, setRole } = context;
    const navigateAdminPage = ()=>{
        navigate('/admin')
    }
    const navigateHomePage = ()=>{
        navigate('/home')
    }
    const onLogout = () => {
        localStorage.clear()
        setTokenContext(null);
        setRole(null);
        navigate('/')
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <Button color="inherit" onClick={navigateHomePage}>首頁</Button>
                {role==="admin"&&<Button color="inherit" onClick={navigateAdminPage}>系統帳號列表</Button>}
                <Typography color="inherit">{username} 你好!</Typography>
                <Button color="inherit" onClick={onLogout}>登出</Button>
            </Toolbar>
        </AppBar>
    );
};

export default CustomAppBar;
