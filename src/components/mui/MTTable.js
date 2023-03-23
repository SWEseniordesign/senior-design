import react, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography, 
    Box, 
    TablePagination,
    IconButton,
    Collapse,
    Snackbar,
    Alert} from '@mui/material';
import MtButton from './MTButton';
import { EditTabModal } from '../till/EditTabModal';
import MTDropdown from './MTDropdown';
import { useHookstate } from '@hookstate/core';
import { tabState } from '../../states/tabState';
import moment from 'moment/moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { itemState } from '../../states/itemState';
import { removeEmployee } from '../../requests/tills-req';

const useStyles = makeStyles({
    root: {
        width: '90%',
    }
})

export const MTTable = (props) => {

    const {columns, rows, rowsPerPageOptions, hasPagination, action, actionStyle, hasMoreInfo, hasDelete} = props;

    const [page, setPage] = useState(0);
    const [rowsPerPageSelection, setRowsPerPageSelection] = useState(5);
    const [editRow, setEditRow] = useState();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});

    const localTabState = useHookstate(tabState);
    const localItemState = useHookstate(itemState);

    useEffect(() => {
        for (const row of rows) {
            if(localItemState.itemListOpen.get().length <= rows.length){
                localItemState.itemListOpen.set(b => [...b, false])
            }
        }
    }, [hasMoreInfo])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleEditButton = (e, row) => {
        setEditRow(row);
        localTabState.isEdit.set(true);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPageSelection(event.target.value);
        setPage(0);
    };

    const determineFormattedOutput = (propId, row) => {
        switch(propId){
            case 'date':
                return moment(row[propId]).format('MMMM Do YYYY, h:mm:ss a');
            case 'totalPrice':
                return '$' + row[propId];
            default:
                return row[propId];
        }
    }

    const handleMoreInfo = (i) => {
        localItemState.itemListOpen[i].set(info => !info);
    }

    const handleDeleteButton = (e, row) => {
        console.log(row);
        deleteEmployee(row);
    }

    async function deleteEmployee(row) {
        let response  = await removeEmployee(row.email);
        if(!(response) || response.code !== 201){
            setAlertMessage({message: 'Failed delete employee', status: 'warning'});
        } else {
            setAlertMessage({message: "Employee deleted", status: 'success'});
        }
        setSnackbarOpen(true);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', boxShadow: '5' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {columns.map((col) => {
                                if(!!(col.subprops)){
                                    return col.subprops.map((prop, i) => {
                                        return <TableCell align='left' key={i}><Typography sx={{
                                            fontSize: '20px'
                                        }}>{prop.label}</Typography>
                                        </TableCell>
                                    })
                                } else {
                                    return <TableCell align='left'><Typography sx={{
                                        fontSize: '20px'
                                    }}>{col.label}</Typography>
                                    </TableCell>
                                }
                            })}
                            {hasDelete && <TableCell align='right'><Typography sx={{fontSize: '18px'}}>Delete</Typography></TableCell>}
                            {!!(action) && <TableCell align='right'><Typography sx={{
                                        fontSize: '18px',
                                    }}>Action</Typography>
                            </TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPageSelection, page * rowsPerPageSelection + rowsPerPageSelection).map((row, i) => {
                            if(row.name !== '+'){
                                return <>
                                    <TableRow key={i}>
                                        {hasMoreInfo && <TableCell>
                                            <IconButton size='small' onClick={() => handleMoreInfo(i)}>
                                                {localItemState.itemListOpen[i].get() ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                                            </IconButton>
                                        </TableCell>}
                                        {columns.map(({dataPropId}, i) => {
                                            if(typeof row[dataPropId] === 'object' && !!(columns[i].subprops)){
                                                return Object.keys(row[dataPropId]).map((key, index) => {
                                                    if(!!(row[dataPropId][columns[i].subprops[index]?.dataPropId])){
                                                        return dataPropId !== 'color' ?
                                                            <TableCell key={key}><Typography sx={{fontSize: '16px'}}>{row[dataPropId][key]}</Typography></TableCell> :
                                                            <TableCell><Box sx={{bgcolor: row[dataPropId], border: '1px solid grey', height: '25px', width: '100%', borderRadius: '5px'}} /></TableCell>
                                                    }

                                                })
                                            } else {
                                                return dataPropId !== 'color' ?
                                                    <TableCell key={dataPropId}><Typography sx={{fontSize: '16px'}}>{determineFormattedOutput(dataPropId, row)}</Typography></TableCell> :
                                                    <TableCell><Box sx={{bgcolor: row[dataPropId], border: '1px solid grey', height: '25px', width: '100%', borderRadius: '5px'}} /></TableCell>
                                            }
                                        })}
                                        {hasDelete &&
                                            <TableCell align='right'>
                                                <MtButton label={"Delete"} onClick={(e) => handleDeleteButton(e, row)} />
                                            </TableCell>
                                        }
                                        {!!(action) && (actionStyle === 'normal' ?
                                                <TableCell align='right'>
                                                    <MtButton label={"ACTION"} onClick={action} />
                                                </TableCell>
                                            :
                                                <TableCell align='right'>
                                                    <MTDropdown
                                                        textColor={'info'}
                                                        hasDropdownIcon
                                                        tooltip={'Tab Options'}
                                                        label={"Options"}
                                                        menuItems={[
                                                            {id: 1, title: 'Edit', action: (e) => handleEditButton(e, row)},
                                                            {id: 2, title: 'Delete', action: (e) => action(e, row.id)}
                                                    ]} />
                                                </TableCell>)}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                                <Collapse in={localItemState.itemListOpen[i].get()} timeout="auto" unmountOnExit >
                                                    <Box>
                                                    <Typography variant="h6">
                                                        Items
                                                    </Typography>
                                                    <Table size="small">
                                                        <TableHead>
                                                        <TableRow>
                                                            <TableCell>Id</TableCell>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell align="right">Price</TableCell>
                                                            <TableCell align="right">Quantity</TableCell>
                                                        </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                        {row.items.map((item, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell component="th" scope="row">
                                                                    {item.id}
                                                                </TableCell>
                                                                <TableCell>{item.name}</TableCell>
                                                                <TableCell align="right">{item.price}</TableCell>
                                                                <TableCell align="right">
                                                                    {item.quantity}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        </TableBody>
                                                    </Table>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                            }

                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {hasPagination &&
                <TablePagination 
                    component={'div'}
                    rowsPerPage={rowsPerPageSelection}
                    rowsPerPageOptions={[5, 10]}
                    count={rows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        bgcolor: 'white',
                        borderRadius: '0 0 4px 4px',
                        boxShadow: '5'
                    }}
                />
            }
            {!!(editRow) && <EditTabModal tabEdit={editRow} />}
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={alertMessage.status} variant="filled" sx={{ width: '100%' }}>
                                {alertMessage.message}
                            </Alert>
                        </Snackbar>
        </div>
    )
}