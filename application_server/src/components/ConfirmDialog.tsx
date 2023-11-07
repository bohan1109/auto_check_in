import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmDialogProps{
    title:string,
    open: boolean;
    handleClose: () => void;
    description:string
    handleConfirm:()=>void
}

const ConfirmDialog:React.FC<ConfirmDialogProps>=({title,open,handleClose,description,handleConfirm})=> {

    return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={() => handleConfirm()}>確認</Button>
            </DialogActions>
            </Dialog>
    );
}

export default ConfirmDialog;