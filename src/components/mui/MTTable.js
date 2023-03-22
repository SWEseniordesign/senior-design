import react, { useState } from 'react';
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
    TablePagination} from '@mui/material';
import MtButton from './MTButton';
import { EditTabModal } from '../till/EditTabModal';
import MTDropdown from './MTDropdown';
import { COLOR_PALETTE } from '../../Constants';
import { useHookstate } from '@hookstate/core';
import { tabState } from '../../states/tabState';
import moment from 'moment/moment';

const useStyles = makeStyles({
    root: {
        width: '90%',
    }
})

export const MTTable = (props) => {

    const {columns, rows, rowsPerPageOptions, hasPagination, action, actionStyle} = props;

    const [page, setPage] = useState(0);
    const [rowsPerPageSelection, setRowsPerPageSelection] = useState(5);
    const [editRow, setEditRow] = useState();

    const localTabState = useHookstate(tabState);

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

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', boxShadow: '5' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => {
                                if(!!(col.subprops)){
                                    return col.subprops.map((prop) => {
                                        return <TableCell align='left'><Typography sx={{
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
                            {!!(action) && <TableCell align='right'><Typography sx={{
                                        fontSize: '18px',
                                    }}>Action</Typography>
                            </TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPageSelection, page * rowsPerPageSelection + rowsPerPageSelection).map((row, i) => {
                            if(row.name !== '+'){
                                return <TableRow key={i}>
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
                    count={rows.length-1}
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
        </div>
    )
}