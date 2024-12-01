const inquirer = require('inquirer');
const { Team } = require("pg");
const Team = new Team({
    user: 'employee_tracker',
    host: 'localhost',
});

Team.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));



let departments = [];
let roles = [];
let employees = [];

const mainMenu = async () => {
    const { option } = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'Select an option:',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch (option) {
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Exiting application...');
            return;
    }
    await mainMenu();
};

const viewDepartments = () => {
    console.table(departments);
};

const viewRoles = () => {
    console.table(roles);
};

const viewEmployees = () => {
    console.table(employees);
};

const addDepartment = async () => {
    const { departmentName } = await inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:'
    });
    departments.push({ id: departments.length + 1, name: departmentName });
    console.log(`Department ${departmentName} added.`);
};

const addRole = async () => {
    const { roleName, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for this role:'
        }
    ]);
    roles.push({ id: roles.length + 1, title: roleName, salary, departmentId });
    console.log(`Role ${roleName} added.`);
};

const addEmployee = async () => {
    const { firstName, lastName, roleId, manager } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee’s first name:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee’s last name:'
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the role ID for this employee:'
        },
        {
            type: 'input',
            name: 'manager',
            message: 'Enter the manager’s name:'
        }
    ]);
    employees.push({ id: employees.length + 1, firstName, lastName, roleId, manager });
    console.log(`Employee ${firstName} ${lastName} added.`);
};

const updateEmployeeRole = async () => {
    const { employeeId, newRoleId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the employee ID to update:'
        },
        {
            type: 'input',
            name: 'newRoleId',
            message: 'Enter the new role ID for this employee:'
        }
    ]);
    const employee = employees.find(emp => emp.id == employeeId);
    if (employee) {
        employee.roleId = newRoleId;
        console.log(`Employee ID ${employeeId} updated to role ID ${newRoleId}.`);
    } else {
        console.log('Employee not found.');
    }
};

mainMenu();