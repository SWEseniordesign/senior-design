import { Alert, Modal, Paper, Typography, Snackbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { MTTable } from "../mui/MTTable";
import { addEmployee } from "../../requests/tills-req";
import { getEmployee } from "../../requests/employees-req";
import MTTextField from "../mui/MTTextField";
import MTSwitch from "../mui/MTSwitch";
import MtButton from "../mui/MTButton";
import { removeEmployee } from '../../requests/tills-req';

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

    const {open, setOpen, employees, tillId} = props;

    const [employeeObjects, setEmployeeObjects] = useState([]);
    const [email, setEmail] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});

    const tableColumns = [
        {id: 0, dataPropId: 'email', label: 'Email', width: '100%'},
        {id: 1, dataPropId: 'isManager', label: 'Manager', width: '100%'},
    ]

    const handleCloseModal = () => {
        setOpen(false);
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    async function addEmp() {
        let employee = {email: email, isManager: isManager, tillId: tillId};
        let response = await addEmployee(employee);

        if(!(response) || response.code !== 201){
            setAlertMessage({message: !(response) ? 'Failed add employee' : response.err, status: 'warning'});
        } else {
            let message = (isManager ? 'Manager '+ email + ' added':  'Employee '+ email + ' added');
            setAlertMessage({message: message, status: 'success'});
            setEmployeeObjects(prevState => [...prevState, response.formattedEmployee]);
        }
        setSnackbarOpen(true);
    }

    async function deleteEmployee(e, row) {
        let response  = await removeEmployee({email: row.email, tillId: tillId});
        console.log(response);
        if(!(response) || response.code !== 200){
            setAlertMessage({message: 'Failed delete employee', status: 'warning'});
        } else {
            setEmployeeObjects(employeeObjects.filter((emp) => emp.email !== row.email)); 
            setAlertMessage({message: "Employee deleted", status: 'success'}); 
        }
        setSnackbarOpen(true);
    }

    useEffect(() => {
        async function getEmployees() {
            let empObjects = [];
            for (let i = 0; i < employees.length; i++) { 
                let employee = await getEmployee({email: employees[i]});
                empObjects.push(employee.formattedEmployee);
            }
            setEmployeeObjects(empObjects);
        }
        getEmployees();
    }, [open, employees]);

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
                <MTTable columns={tableColumns} rows={employeeObjects} hasPagination hasDelete = {deleteEmployee} tillId = {tillId} />
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
                <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={alertMessage.status} variant="filled" sx={{ width: '100%' }}>
                                {alertMessage.message}
                            </Alert>
                        </Snackbar>
            </Paper>
        </Modal>
    )
}