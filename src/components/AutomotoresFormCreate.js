import React, { useState } from "react";
import { Tooltip, Container, Button, TextField, Card, CardContent, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const AutomotoresFormCreate = () => {
  const [formPoliza, setFormPoliza] = useState({
    Nombre: "",
    FechaInicio: dayjs(),
    FechaFinal: dayjs(),
    Cobertura: "",
    ValorMaxCobertura: ""
  });

  const [formAutomotores, setFormAutomotores] = useState({
    Placa: "",
    TieneInspeccion: false,
    Polizas: [],
    ClientId: ""
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddPoliza = () => {
    if (formPoliza.FechaInicio.isBefore(dayjs()) || formPoliza.FechaFinal.isBefore(formPoliza.FechaInicio)) {
      alert('La fecha de inicio de la póliza tiene que ser mayor al día actual y la fecha final tiene que ser mayor a la fecha de inicio.');
      return;
    }
    setFormAutomotores(prevState => ({
      ...prevState,
      Polizas: [...prevState.Polizas, formPoliza]
    }));
    setFormPoliza({
      Nombre: "",
      FechaInicio: dayjs(),
      FechaFinal: dayjs(),
      Cobertura: "",
      ValorMaxCobertura: ""
    });
    setDialogOpen(false);
  };

  const handleSubmitAutomotores = () => {
    // Validar las fechas de las pólizas
    for (const poliza of formAutomotores.Polizas) {
      if (poliza.FechaInicio.isBefore(dayjs()) || poliza.FechaFinal.isBefore(poliza.FechaInicio)) {
        alert('La fecha de inicio de la póliza tiene que ser mayor al día actual y la fecha final tiene que ser mayor a la fecha de inicio.');
        return;
      }
    }
    fetch('https://localhost:7186/api/Transaccion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formAutomotores,
        Polizas: formAutomotores.Polizas.map(poliza => ({
          ...poliza,
          FechaInicio: poliza.FechaInicio.format("YYYY-MM-DD"),
          FechaFinal: poliza.FechaFinal.format("YYYY-MM-DD"),
          ValorMaxCobertura: parseFloat(poliza.ValorMaxCobertura)
        }))
      })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  return (
    <Container>
      <StyledCard>
        <CardContent>
          <Typography variant="h4" gutterBottom>Crear Automotores</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="ClientId"
                value={formAutomotores.ClientId}
                onChange={e => setFormAutomotores({ ...formAutomotores, ClientId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Placa"
                value={formAutomotores.Placa}
                onChange={e => setFormAutomotores({ ...formAutomotores, Placa: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formAutomotores.TieneInspeccion}
                    onChange={e => setFormAutomotores({ ...formAutomotores, TieneInspeccion: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <span>
                    {formAutomotores.TieneInspeccion ? "Si" : "No"}
                    <Tooltip title="Indica si el automotor tiene inspección.">
                      <HelpOutlineIcon color="action" fontSize="small" style={{ marginLeft: '5px' }} />
                    </Tooltip>
                  </span>
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledButton variant="contained" onClick={() => setDialogOpen(true)}>Añadir Póliza</StyledButton>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledButton variant="contained" color="secondary" onClick={handleSubmitAutomotores}>Enviar</StyledButton>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Añadir Póliza</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Nombre"
                value={formPoliza.Nombre}
                onChange={e => setFormPoliza({ ...formPoliza, Nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Cobertura"
                value={formPoliza.Cobertura}
                onChange={e => setFormPoliza({ ...formPoliza, Cobertura: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Valor Máx. Cobertura"
                value={formPoliza.ValorMaxCobertura}
                onChange={e => setFormPoliza({ ...formPoliza, ValorMaxCobertura: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                <DatePicker
                  label="Fecha Inicio"
                  value={formPoliza.FechaInicio}
                  onChange={(newValue) => setFormPoliza({ ...formPoliza, FechaInicio: newValue })}
                  renderInput={(params) => <TextField {...params} />}
                  inputFormat="DD-MM-YYYY"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
                <DatePicker
                  label="Fecha Final"
                  value={formPoliza.FechaFinal}
                  onChange={(newValue) => setFormPoliza({ ...formPoliza, FechaFinal: newValue })}
                  renderInput={(params) => <TextField {...params} />}
                  inputFormat="DD-MM-YYYY"
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddPoliza} variant="contained" color="primary">Añadir</Button>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" color="secondary">Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}  