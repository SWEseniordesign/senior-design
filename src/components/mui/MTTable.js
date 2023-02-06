import react from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MtButton from './MTButton';

const useStyles = makeStyles({

})

export const MTTable = (props) => {

    const {columns, rows} = props;


    return (
        <TableContainer component={Paper} sx={{ maxWidth: '90%' }}>
            <Table sx={{ maxWidth: '90%' }}>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => {
                            return <TableCell>{col.label}</TableCell>
                        })}
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow>
                            <TableCell>{row.label}</TableCell>
                            <TableCell>{row.color}</TableCell>
                            <TableCell>
                                <MtButton label={"EDIT"} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}