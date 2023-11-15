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
    showSnackbar:(severity:"error" | "warning" | "info" | "success", message:string)=>void
}

const FormDialog: React.FC<FormDialogProps> = ({ title, data, open, handleClose,boolean,setBoolean,showSnackbar }) => {
    const [checkInAccount, setCheckInAccount] = useState(data?.checkInAccount || '');
    const [checkInPassword, setCheckInPassword] = useState('');
    const [checkInUsername, setCheckInUsername] = useState(data?.checkInUsername || '');
    const jwtToken = localStorage.getItem("jwtToken")
    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
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
            showSnackbar("success","修改成功")
            setBoolean(!boolean)
            handleClose()
        }).catch((error) => {
            const detail = error.response.data.detail
            switch (error.response.status){
                case 422:
                        showSnackbar("warning","請輸入正確資料")
                    break
                case 400:
                    if(detail==="Check in account already exist"){
                    showSnackbar("error","登入帳號已經存在")
                    }else if(detail==="Check in account login fail"){
                        showSnackbar("error","打卡帳號登入失敗")
                    }else{
                        showSnackbar("error","打卡帳號更新失敗，請聯繫開發人員")
                    }
                    break
                case 500:
                    showSnackbar("error","伺服器錯誤請聯繫，開發人員")
                    break
            }

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
            showSnackbar("success","打卡帳號新增成功")
            setBoolean(!boolean)
            handleClose()
        }).catch((error) => {
            const detail = error.response.data.detail
            switch (error.response.status){
                case 422:
                        showSnackbar("warning","請輸入正確資料")
                    break
                case 400:
                    if(detail==="Check in account already exist"){
                    showSnackbar("error","登入帳號已經存在")
                    }else if(detail==="Check in account login fail"){
                        showSnackbar("error","打卡帳號登入失敗")
                    }
                    break
                case 500:
                    showSnackbar("error","伺服器錯誤，請聯繫開發人員")
                    break
            }
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
                    disabled={!!data}
                    // {!!data}等於{data?true:false}
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
