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

const useStyles = makeStyles({
    root: {
        width: '90%',
    }
})

export const MTTable = (props) => {

    const {columns, rows, rowsPerPageOptions, hasPagination, action, actionIsEdit, isActionDropdown} = props;

    const [page, setPage] = useState(0);
    const [rowsPerPageSelection, setRowsPerPageSelection] = useState(5);
    const [openEditModal, setOpenEditModal] = useState();
    const [editRowId, setEditRowId] = useState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleEditButton = (e, row) => {
        setEditRowId(row);
        setOpenEditModal(true);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPageSelection(event.target.value);
        setPage(0);
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', boxShadow: '5' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => {
                                return <TableCell align='left'><Typography sx={{
                                        fontSize: '18px',
                                        
                                    }}>{col.label}</Typography>
                                </TableCell>
                            })}
                            {(actionIsEdit || !!(action)) && <TableCell align='right'><Typography sx={{
                                        fontSize: '18px',
                                    }}>Action</Typography>
                            </TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPageSelection, page * rowsPerPageSelection + rowsPerPageSelection).map((row) => {
                            if(row.id !== rows.length-1){
                                return <TableRow>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell><Box sx={{ 
                                                bgcolor: row.color, 
                                                border: '1px solid grey', 
                                                borderRadius: '12px',
                                                width: '100%', 
                                                height: '25px'}}/></TableCell>
                                            {actionIsEdit ? <TableCell align='right'>
                                                    <MtButton label={"EDIT"} onClick={(e) => handleEditButton(e, row.id)} />
                                                </TableCell>
                                            :
                                                !(action) && 
                                                    !isActionDropdown ? 
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
                                                                {id: 1, title: 'Edit', action: (e) => handleEditButton(e, row.id)},
                                                                {id: 2, title: 'Delete', action: (e) => action(e, row.id)}
                                                        ]} />
                                                    </TableCell>
                                            }
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
            {openEditModal && <EditTabModal open={openEditModal} setOpen={setOpenEditModal} tabEditId={editRowId} />}
        </div>
    )
}