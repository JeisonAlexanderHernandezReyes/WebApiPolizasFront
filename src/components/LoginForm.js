import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent, InputAdornment } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import PasswordIcon from '@mui/icons-material/Password';
import LoginIcon from '@mui/icons-material/Login';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const schema = yup.object().shape({
        user: yup.string().email('Ingresa un email válido').required('El email es requerido'),
        password: yup.string().required('La contraseña es requerida'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await schema.validate({ user, password }, { abortEarly: false });

            const response = await fetch('https://localhost:7186/api/IniciarSesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: user,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.statusCode === 404) {
                console.error('Error en la solicitud:', data.statusCodeMessage);
                setErrorMessage('Credenciales incorrectas');
                return;
            }

            if (response.ok) {
                const token = data.result;
                localStorage.setItem('token', token);

                navigate('/Formulario');
            } else {
                console.error('Error en la solicitud:', response.status);
                setErrorMessage('Credenciales incorrectas');
            }

        } catch (error) {
            console.error('Error de validación:', error.errors);
            setErrorMessage('Error de validación');
        }
    };

    return (
        <>
            <Grid container spacing={2} justifyContent="center" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Card style={{ backgroundColor: '#ffffff' }}>
                        <CardContent>
                            <Typography variant="h4" component="h1" align="center" gutterBottom>
                                Login
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item xs={12}>
                                        <TextField
                                            label="User"
                                            type="email"
                                            value={user}
                                            onChange={(e) => setUser(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={Boolean(schema.errors?.email)}
                                            helperText={schema.errors?.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PasswordIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={Boolean(schema.errors?.password)}
                                            helperText={schema.errors?.password}
                                        />
                                    </Grid>
                                    {errorMessage && (
                                        <Grid item xs={12}>
                                            <Typography color="error">
                                                {errorMessage}
                                            </Typography>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} align="center">
                                        <Button type="submit" variant="contained" color="primary">
                                            <LoginIcon style={{ marginRight: '0.5rem' }} />
                                            Ingresar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};