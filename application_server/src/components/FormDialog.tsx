import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import api from '../Axios.config'
import _ from 'lodash';
interface FormDialogProps {
    title: string;
    data?: {
        id:string;
        checkInAccount: string;
        checkInPassword: string;
        checkInUsername: string;
    };
    open: boolean;
    handleClose: () => void;
    boolean:boolean;
    setBoolean: (value: boolean) => void;
}

const FormDialog: React.FC<FormDialogProps> = ({ title, data, open, handleClose,boolean,setBoolean }) => {
    const [checkInAccount, setCheckInAccount] = useState(data?.checkInAccount || '');
    const [checkInPassword, setCheckInPassword] = useState('');
    const [checkInUsername, setCheckInUsername] = useState(data?.checkInUsername || '');
    const jwtToken = localStorage.getItem("jwtToken")
    const jwtTokenType = localStorage.getItem("jwtTokenType")
    const config = {
        headers: {
            Authorization: `${jwtTokenType} ${jwtToken}`
        },
    }
    React.useEffect(() => {
        if (data?.id) {
            setCheckInAccount(data.checkInAccount);
            setCheckInUsername(data.checkInUsername);
        } else {
            setCheckInAccount('');
            setCheckInPassword('');
            setCheckInUsername('');
        }
    }, [data]);
    
    
    const editData = ()=>{
        const updateData = {
            checkInAccount:checkInAccount,
            checkInPassword:checkInPassword,
            checkInUsername:checkInUsername,
        }
        const formattedData = _.mapKeys(updateData, (value, key) => _.snakeCase(key));
        api.patch(`/check-in-accounts/${data?.id}`,formattedData,config)
        .then((response)=>{
            console.log("修改成功",response.data)
            setBoolean(!boolean)
            handleClose()
        }).catch((error) => {
            if (error.response) {
                console.log('Error', error.response.status);
                console.log('Error data', error.response.data);
            } else if (error.request) {
                console.log('Error with request', error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        })
    }

    const createData = ()=>{
        const createData = {
            checkInAccount:checkInAccount,
            checkInPassword:checkInPassword,
            checkInUsername:checkInUsername,
        }
        const formattedData = _.mapKeys(createData, (value, key) => _.snakeCase(key));
        api.post(`/check-in-accounts`,formattedData,config)
        .then((response)=>{
            console.log("新增成功",response.data)
            setBoolean(!boolean)
            handleClose()
        }).catch((error) => {
            if (error.response) {
                console.log('Error', error.response.status);
                console.log('Error data', error.response.data);
            } else if (error.request) {
                console.log('Error with request', error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        })
    }

    const handleSave = () => {
        if (data) {
            editData();
            console.log("update")
        } else {
            console.log("create")
            createData();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle >{title}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    fullWidth
                    label="使用者"
                    value={checkInUsername}
                    onChange={(e) => setCheckInUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="打卡帳號"
                    value={checkInAccount}
                    onChange={(e) => setCheckInAccount(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="密碼"
                    value={checkInPassword}
                    onChange={(e) => setCheckInPassword(e.target.value)}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSave}>確認</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormDialog;
