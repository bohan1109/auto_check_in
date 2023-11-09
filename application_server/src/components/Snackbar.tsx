import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface CustomizedSnackbarProps {
    severity: "error" | "warning" | "info" | "success";
    open: boolean;
    description: string;
    handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
    autoHideDuration?: number;  
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbars: React.FC<CustomizedSnackbarProps> = ({
    open,
    description,
    severity,
    handleClose,
    autoHideDuration = 6000 
}) => {
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {description}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default CustomizedSnackbars;
