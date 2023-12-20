import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import api from '../Axios.config'
import _ from 'lodash';
import Loading from './Loading';
import DescriptionDialog from './DescriptionDialog'
import ErrorIcon from '@mui/icons-material/Error';
import { red } from '@mui/material/colors';
interface FormDialogProps {
    title: string;
    data?: {
        id: string;
        checkInAccount: string;
        checkInPassword: string;
        checkInUsername: string;
        checkInTime: string;
        checkOutTime: string;
        useRandomCheckIn: boolean;
    };
    open: boolean;
    handleClose: () => void;
    boolean: boolean;
    setBoolean: (value: boolean) => void;
    showSnackbar: (severity: "error" | "warning" | "info" | "success", message: string) => void
}

const FormDialog: React.FC<FormDialogProps> = ({ title, data, open, handleClose, boolean, setBoolean, showSnackbar }) => {
    const [checkInAccount, setCheckInAccount] = useState(data?.checkInAccount || '');
    const [checkInPassword, setCheckInPassword] = useState('');
    const [checkInUsername, setCheckInUsername] = useState(data?.checkInUsername || '');
    const [loading, setLoading] = useState(false);
    const [checkInTime, setCheckInTime] = useState(data?.checkInTime || '08:30');
    const [checkOutTime, setCheckOutTime] = useState(data?.checkOutTime || '18:05');
    const [useRandomCheckIn, setUseRandomCheckIn] = useState(data?.useRandomCheckIn || false);
    const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false)
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
            setCheckInTime(data.checkInTime)
            setCheckOutTime(data.checkOutTime)
            setUseRandomCheckIn(data.useRandomCheckIn)
        } else {
            setCheckInAccount('');
            setCheckInPassword('');
            setCheckInUsername('');
            setUseRandomCheckIn(false);
        }
    }, [data]);


    const editData = () => {
        setLoading(true)

        const updateData = {
            checkInAccount: checkInAccount,
            checkInPassword: checkInPassword,
            checkInUsername: checkInUsername,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            useRandomCheckIn: useRandomCheckIn
        }
        const formattedData = _.mapKeys(updateData, (value, key) => _.snakeCase(key));
        api.patch(`/check-in-accounts/${data?.id}`, formattedData, config)
            .then((response) => {
                showSnackbar("success", "修改成功")
                setBoolean(!boolean)
                handleClose()
            }).catch((error) => {
                const detail = error.response.data.detail
                switch (error.response.status) {
                    case 403:
                        showSnackbar("warning", "權限錯誤")
                        break
                    case 422:
                        showSnackbar("warning", "請輸入正確資料")
                        break
                    case 400:
                        if (detail === "Check in account already exist") {
                            showSnackbar("error", "登入帳號已經存在")
                        } else if (detail === "Check in account login fail") {
                            showSnackbar("error", "打卡帳號登入失敗")
                        } else {
                            showSnackbar("error", "打卡帳號更新失敗，請聯繫開發人員")
                        }
                        break
                    case 500:
                        showSnackbar("error", "伺服器錯誤請聯繫，開發人員")
                        break
                }

            }).finally(() => {
                setLoading(false)

            })
    }

    const createData = () => {
        setLoading(true)
        const createData = {
            checkInAccount: checkInAccount,
            checkInPassword: checkInPassword,
            checkInUsername: checkInUsername,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            useRandomCheckIn: useRandomCheckIn
        }
        const formattedData = _.mapKeys(createData, (value, key) => _.snakeCase(key));
        api.post(`/check-in-accounts`, formattedData, config)
            .then((response) => {
                showSnackbar("success", "打卡帳號新增成功")
                setBoolean(!boolean)
                handleClose()
            }).catch((error) => {
                const detail = error.response.data.detail
                switch (error.response.status) {
                    case 422:
                        showSnackbar("warning", "請輸入正確資料")
                        break
                    case 400:
                        if (detail === "Check in account already exist") {
                            showSnackbar("error", "登入帳號已經存在")
                        } else if (detail === "Check in account login fail") {
                            showSnackbar("error", "打卡帳號登入失敗")
                        }
                        break
                    case 500:
                        showSnackbar("error", "伺服器錯誤，請聯繫開發人員")
                        break
                }
            }).finally(() => {
                setLoading(false)

            })
    }

    const createTimeOptions = (startHour: number, startMinute: number, endHour: number, endMinute: number, interval: number) => {
        let times = [];
        let currentTime = new Date(0, 0, 0, startHour, startMinute, 0);

        while (currentTime.getHours() < endHour || (currentTime.getHours() === endHour && currentTime.getMinutes() <= endMinute)) {
            let time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            times.push(time);
            currentTime = new Date(currentTime.getTime() + interval * 60000);
        }

        return times;
    };
    const handleOpenDescriptionDialog = () => {
        setDescriptionDialogOpen(true)
    }
    const handleDescriptionDialogClose = ()=>{
        setDescriptionDialogOpen(false)
    }

    const checkInTimes = createTimeOptions(8, 30, 9, 0, 5);
    const checkOutTimes = createTimeOptions(18, 0, 18, 25, 5);
    const handleSave = () => {

        if (data) {
            const isDataUnchanged = data &&
                checkInAccount === data.checkInAccount &&
                checkInUsername === data.checkInUsername &&
                checkInTime === data.checkInTime &&
                useRandomCheckIn === data.useRandomCheckIn &&
                checkOutTime === data.checkOutTime;

            if (isDataUnchanged) {
                handleClose();
                return;
            }
            editData();
        } else {
            const isDataIncomplete =
                checkInAccount === "" &&
                checkInPassword === "" &&
                checkInUsername === "";

            if (isDataIncomplete) {
                handleClose();
                return;
            }
            createData();
        }
    };


    return (<>
        <DescriptionDialog 
        title="自動更換打卡時間功能介紹" 
        open={descriptionDialogOpen} 
        handleClose={handleDescriptionDialogClose} 
        description="自動更換打卡時間設定為True的話，會每天打卡時間進行隨機更換，設定成False的話，則會是固定選擇的時段，並不會做更換。" 
        />
        <Dialog open={open} onClose={handleClose}>
            <Loading loading={loading} />
            <DialogTitle >{title}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    fullWidth
                    label="使用者"
                    value={checkInUsername}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckInUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="打卡帳號"
                    value={checkInAccount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckInAccount(e.target.value)}
                    disabled={!!data}
                // {!!data}等於{data?true:false}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="密碼"
                    value={checkInPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckInPassword(e.target.value)}
                />
                <InputLabel id="check-in-time-label" style={{ marginTop: '9px' }}>打卡上班時間</InputLabel>
                <Select
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    fullWidth
                    margin="dense"
                >
                    {checkInTimes.map(time => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))}
                </Select>
                <InputLabel id="check-out-time-label" style={{ marginTop: '9px' }}>打卡下班時間</InputLabel>
                <Select
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    fullWidth
                    margin="dense"
                >
                    {checkOutTimes.map(time => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))}
                </Select>
                <InputLabel id="check-out-time-label" style={{ marginTop: '9px' }}>
                    自動更換打卡時間
                    <ErrorIcon
                        fontSize="small"
                        style={{
                            color: red[500],
                            position: 'relative',
                            top: '4px'
                        }}
                        onClick={handleOpenDescriptionDialog}
                    />
                </InputLabel>
                <Select
                    value={useRandomCheckIn.toString()}
                    onChange={(e) => setUseRandomCheckIn(e.target.value === "true")}
                    fullWidth
                    margin="dense"
                >
                    <MenuItem value={"true"}>True</MenuItem>
                    <MenuItem value={"false"}>False</MenuItem>
                </Select>


            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSave}>確認</Button>
            </DialogActions>
        </Dialog>
    </>);
}

export default FormDialog;
