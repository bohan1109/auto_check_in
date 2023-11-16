import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

interface AppBarProps {
    title: string;
    onLogout: () => void;
    username:string
}

const CustomAppBar: React.FC<AppBarProps> = ({ title, onLogout,username }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <Typography color="inherit">{username} 你好!</Typography>
                <Button color="inherit" onClick={onLogout}>登出</Button>
            </Toolbar>
        </AppBar>
    );
};

export default CustomAppBar;
