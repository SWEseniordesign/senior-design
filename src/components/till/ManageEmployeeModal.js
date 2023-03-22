import { Modal, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { tabState } from "../../states/tabState";
import { MTTable } from "../mui/MTTable";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { addEmployee, getTill } from "../../requests/tills-req";
import { createEmployee, getEmployee } from "../../requests/employees-req";
import MTTextField from "../mui/MTTextField";
import MTSwitch from "../mui/MTSwitch";
import MtButton from "../mui/MTButton";

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
    },
    addEmployee: {
        display: 'flex',
        width: '90%',
        marginBottom: '12px',
        gap: '12px'
    }
})

//* The modal that pops up when the user wants to view the list of tabs.
export const ManageEmployeeModal = (props) => {

    const params = useParams();
    const {open, setOpen, employees, tillId} = props;
    const handleCloseModal = () => {
        setOpen(false);
    }
    const tableColumns = [
        {id: 0, dataPropId: 'email', label: 'Email', width: '100%'},
        {id: 1, dataPropId: 'isManager', label: 'Manager', width: '100%'},
    ]
    const [employeeObjects, setEmployeeObjects] = useState([]);
    const [email, setEmail] = useState('');
    const [isManager, setIsManager] = useState(false);
    
    async function getEmployees() {
        let empObjects = [];
        for (let i = 0; i < employees.length; i++) { 
            let employee = await getEmployee({email: employees[i]});
            console.log(employee);
            empObjects.push(employee.formattedEmployee);
        }
        setEmployeeObjects(empObjects);
    }

    async function addEmp() {
        let employee = {email: email, isManager: isManager, tillId: tillId};
        let ret = await addEmployee(employee);
        console.log(ret);
        if(ret.code === 201){

        }
    }

    useEffect(() => {
        getEmployees();
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
                <MTTable columns={tableColumns} rows={employeeObjects} hasPagination action = {() => {}} />
                <div className={classes.title}>
                    <Typography variant={'h4'}>Add Employee</Typography>
                </div>
                <div className={classes.addEmployee}>
                    <MTTextField 
                    label = "Email" 
                    value = {email}
                    type = "email" 
                    isRequired
                    onChangeFunc = {setEmail}>
                    </MTTextField> 
                    <MTSwitch 
                    label = "Manager"
                    value = {isManager}
                    onChangeFunc = {setIsManager}>
                    </MTSwitch>
                    <MtButton 
                    label = "Add" 
                    variant = "contained" 
                    type = "submit"
                    onClick = {() => addEmp()}>
                    </MtButton>
                </div>
            </Paper>
        </Modal>
    )
}