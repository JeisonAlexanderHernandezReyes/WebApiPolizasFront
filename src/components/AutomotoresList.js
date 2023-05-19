import React, { useState, useEffect, useRef } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Collapse, Button } from '@mui/material';
import { Pagination } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

export const AutomotoresList = (props) => {

    const theme = useTheme();

    const StyledTableCell = styled(TableCell)({
        fontWeight: 'bold',
        color: theme.palette.text.secondary,
    });

    const StyledButton = styled(Button)({
        color: theme.palette.getContrastText(theme.palette.primary.main),
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    });

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [expandedRows, setExpandedRows] = useState({});
    const isMounted = useRef(null);

    useEffect(() => {
        isMounted.current = true;
        handleFetchData();
        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFetchData = async () => {
        try {
            const response = await fetch('https://localhost:7186/api/Transaccion', {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            });
            const data = await response.json();
            if (isMounted.current) {
                setData(data.result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handlePerPageChange = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const slicedData = Array.isArray(data) ? data.slice(page * perPage, page * perPage + perPage) : [];

    const handleRowClick = (index) => {
        setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Resultados
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Placa</StyledTableCell>
                            <StyledTableCell>Tiene Inspección</StyledTableCell>
                            <StyledTableCell>Cliente</StyledTableCell>
                            <StyledTableCell>Datos del Cliente</StyledTableCell>
                            <StyledTableCell>Polizas</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {slicedData.map((item, index) => (
                            <>
                                <TableRow key={index}>
                                    <TableCell>{item.placa}</TableCell>
                                    <TableCell>{item.tieneInspeccion ? 'Sí' : 'No'}</TableCell>
                                    <TableCell>{item.cliente.nombre}</TableCell>
                                    <TableCell>
                                        <StyledButton onClick={() => handleRowClick(index)} variant="outlined">
                                            Detalles
                                        </StyledButton>
                                    </TableCell>
                                    <TableCell>
                                        <StyledButton onClick={() => handleRowClick(index)} variant="outlined">
                                            Detalles
                                        </StyledButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                        <Collapse in={expandedRows[index] ?? false} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Detalles del Cliente
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    {Object.entries(item.cliente).map(([key, value]) => (
                                                        <Typography key={key}>{`${key}: ${value}`}</Typography>
                                                    ))}
                                                </Box>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Detalles de las Polizas
                                                </Typography>
                                                {item.polizas.map((poliza, i) => (
                                                    <Box key={i} sx={{ mb: 2 }}>
                                                        {Object.entries(poliza).map(([key, value]) => (
                                                            <Typography key={`${key}-${i}`}>{`${key}: ${value}`}</Typography>
                                                        ))}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                <Typography sx={{ mr: 1 }}>Resultados por página:</Typography>
                <select value={perPage} onChange={handlePerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={Math.ceil(data.length / perPage)}
                    page={page + 1}
                    onChange={handleChangePage}
                    showFirstButton
                    showLastButton
                    nextbuttontext="Siguiente"
                    prevbuttontext="Anterior"
                />
            </Box>
        </Box>
    );
};