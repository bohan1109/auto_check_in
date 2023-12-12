import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DescriptionDialogProps{
    title:string,
    open: boolean;
    handleClose: () => void;
    description:string
}

const DescriptionDialog:React.FC<DescriptionDialogProps>=({title,open,handleClose,description})=> {

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
            </DialogActions>
            </Dialog>
    );
}

export default DescriptionDialog;