import { Modal, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { tabState } from "../../states/tabState";
import { MTTable } from "../mui/MTTable";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getTill } from "../../requests/tills-req";
import { getEmployee } from "../../requests/employees-req";

const useStyles = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '48px 12px 48px 12px'
    },
    title: {
        display: 'flex',
        width: '90%',
        marginBottom: '12px',
        borderBottom: '1px solid lightgrey'
    }
})

//* The modal that pops up when the user wants to view the list of tabs.
export const ManageEmployeeModal = (props) => {

    const params = useParams();
    const {open, setOpen, employees} = props;
    const handleCloseModal = () => {
        setOpen(false);
    }
    const tableColumns = [
        {id: 0, label: 'Email', width: '100%'},
        {id: 1, label: 'Manager', width: '100%'}
    ]
    const [employeeObjects, setEmployeeObjects] = useState([]);
    
    async function getEmployees() {
        let empObjects = [];
        for (let i = 0; i < employees.length; i++) { 
            let employee = await getEmployee({email: employees[i]});
            let dupe = false;
            for(let j = 0; j < employeeObjects.length; j++) {
                if(employeeObjects[j]?.id === employee.formattedEmployee.email) {
                    dupe = true;
                }
            }
            if(!dupe){
                empObjects.push(employee.formattedEmployee);
                // setEmployeeObjects(oldObjects => [...oldObjects, employee.formattedEmployee]);
            }
        }
        console.log(empObjects);
        return empObjects;
    }

    useEffect(() => {
        //getEmployees();
    }, [employees]);

    const classes = useStyles();

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                <div className={classes.title}>
                    <Typography variant={'h4'}>Manage Employees</Typography>
                </div>
                <MTTable columns={tableColumns} rows={getEmployees()} hasPagination actionIsEdit />
            </Paper>
        </Modal>
    )
}