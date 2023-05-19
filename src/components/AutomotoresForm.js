import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  TextField,
  Card,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { Edit } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Info } from "@mui/icons-material";
import { ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AutomotoresList } from "./AutomotoresList";
import { AutomotoresFormCreate } from "./AutomotoresFormCreate";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#333",
});

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#ff5722",
  },
});

const StyledTab = styled(Tab)({
  color: "#fff",
  "&.Mui-selected": {
    fontWeight: "bold",
  },
});

const StyledCard = styled(Card)({
  padding: "1rem",
  backgroundColor: "#f5f5f5",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

const StyledTypography = styled(Typography)({
  marginBottom: "0.5rem",
});

export const AutomotoresForm = () => {
  const [token, setToken] = useState("");
  const [tabValue, setTabValue] = useState("1");
  const [policyId, setPolicyId] = useState("");
  const [plate, setPlate] = useState("");
  const [vehicleData, setVehicleData] = useState(null);
  const [polizaData, setPolizaData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [cache, setCache] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchVehicleData = async () => {
    let url, key;
    if (plate) {
      url = `https://localhost:7186/api/Transaccion/placa/${plate}`;
      key = `placa:${plate}`;
    } else if (policyId) {
      url = `https://localhost:7186/api/Transaccion/poliza/${policyId}`;
      key = `poliza:${policyId}`;
    } else {
      return;
    }

    if (cache[key]) {
      if (plate) {
        setVehicleData(cache[key]);
      } else {
        setPolizaData(cache[key]);
      }
      return;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCache((prevCache) => ({ ...prevCache, [key]: data.result }));
        if (plate) {
          setVehicleData(data.result);
        } else {
          setPolizaData(data.result);
        }
      } else {
        const data = await response.json();
        if (data.result === "Automóvil no encontrado.") {
          setOpenDialog(true);
        }
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value) => {
    return value
      .toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
      .replace(",00", "");
  };

  return (
    <TabContext value={tabValue}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <StyledAppBar position="static">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <StyledTabs
              value={tabValue}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <StyledTab label="Busqueda de Informacion" value="1" />
              <StyledTab label="Obtener todos los registros" value="2" />
              <StyledTab label="Agregar Registros" value="3" />
            </StyledTabs>
            <IconButton onClick={handleLogout} color="inherit">
              <ExitToApp />
            </IconButton>
          </Box>
        </StyledAppBar>
        <TabPanel value="1">
          <StyledCard sx={{ marginBottom: "1rem" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="ID Poliza"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                sx={{ marginRight: "1rem" }}
              />
              <TextField
                label="Placa"
                value={plate}
                inputProps={{
                  maxLength: 6,
                  pattern: "[A-Za-z]{0,3}[0-9]{0,3}",
                }}
                helperText="La placa debe ser AAA123"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const plateRegex = /^[A-Za-z]{0,3}[0-9]{0,3}$/;
                  if (plateRegex.test(inputValue) || inputValue === "") {
                    setPlate(inputValue.toUpperCase());
                  }
                }}
                sx={{ marginRight: "1rem" }}
              />
              <IconButton onClick={fetchVehicleData}>
                <Edit />
              </IconButton>
            </Box>
          </StyledCard>
          {plate && (
            <StyledCard>
              <StyledTypography variant="h5">
                Vehiculo con Placa: {plate.toUpperCase()}
              </StyledTypography>
              {Array.isArray(vehicleData) &&
                vehicleData.map((data, index) => (
                  <div key={index}>
                    <StyledTypography variant="h6">
                      Poliza: {data.nombre}
                    </StyledTypography>
                    <StyledTypography variant="body2">
                      ID Unico de Poliza: {data.id}
                    </StyledTypography>
                    <StyledTypography variant="body2">
                      Fecha de Inicio: {formatDateString(data.fechaInicio)}
                    </StyledTypography>
                    <StyledTypography variant="body2">
                      Fecha Final: {formatDateString(data.fechaFinal)}
                    </StyledTypography>
                    <StyledTypography variant="body2">
                      Cobertura: {data.cobertura}
                    </StyledTypography>
                    <StyledTypography variant="body2">
                      Valor Maximo de Cobertura:{" "}
                      {formatCurrency(data.valorMaxCobertura)}
                    </StyledTypography>
                  </div>
                ))}
              <Info
                style={{ color: "#999", fontSize: "1.5rem", marginTop: "1rem" }}
              />
            </StyledCard>
          )}
          {policyId && (
            <Card>
              <Typography variant="h5">Póliza: {policyId}</Typography>
              {polizaData && (
                <div>
                  <Typography>{`ID: ${polizaData.id}`}</Typography>
                  <Typography>{`Nombre: ${polizaData.nombre}`}</Typography>
                  <Typography>{`Cobertura: ${polizaData.cobertura}`}</Typography>
                  <Typography>{`Valor máximo de cobertura: ${polizaData.valorMaxCobertura}`}</Typography>
                  <Typography>{`Fecha de inicio: ${polizaData.fechaInicio}`}</Typography>
                  <Typography>{`Fecha final: ${polizaData.fechaFinal}`}</Typography>
                </div>
              )}
            </Card>
          )}
        </TabPanel>
       
        <TabPanel value="2">
          <AutomotoresList token={token} />
        </TabPanel>

        <TabPanel value="3">
          <AutomotoresFormCreate token={token} />
          </TabPanel>
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>No hay pólizas para ese vehículo</DialogTitle>
        <DialogContent>
          <p>El vehículo con placa {plate} no tiene pólizas asociadas.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </TabContext>
  );
};
