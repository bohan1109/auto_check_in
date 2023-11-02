import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface FormDialogProps {
    id?: string
    title: string;
    onConfirm: (data: { account: string; password: string; checkInAccountUser: string }) => void;
    onCancel: () => void;
    open: boolean;
    handleClose: () => void;
}

const FormDialog: React.FC<FormDialogProps> = ({ id, title, onConfirm, onCancel, open, handleClose }) => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [checkInAccountUser, setCheckInAccountUser] = useState('');

    const handleConfirmClick = () => {
        onConfirm({ account, password, checkInAccountUser });
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
            <TextField
                    margin="normal"
                    fullWidth
                    label="使用者"
                    value={checkInAccountUser}
                    onChange={(e) => setCheckInAccountUser(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="帳號"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleConfirmClick}>確認</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormDialog;
