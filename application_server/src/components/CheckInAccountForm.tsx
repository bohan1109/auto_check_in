import React, { useState } from 'react';
import { TextField, Button, Paper, Grid, Typography } from '@mui/material';

interface FormProps {
    initialValues: {
        checkInAccount: string,
        checkInPassword: string,
        checkInUsername:string
    },
    onSubmit: (values: { [key: string]: any }) => void,
    title:string
}

const CheckInAccountForm: React.FC<FormProps> = ({ initialValues, onSubmit,title }) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        onSubmit(values);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} md={4}>
                <Paper style={{ padding: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        {title}
                    </Typography>
                        
                    <Grid container direction="column" spacing={2}>
                    <Grid item>
                            <TextField
                                label="使用者名稱"
                                variant="outlined"
                                name="checkInUsername"
                                value={values.checkInUsername}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="打卡帳號"
                                variant="outlined"
                                name="checkInAccount"
                                value={values.checkInAccount}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="密碼"
                                variant="outlined"
                                name="checkInPassword"
                                value={values.checkInPassword}
                                onChange={handleChange}
                                fullWidth
                                type="password"
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default CheckInAccountForm;
