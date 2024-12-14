const inquirer = require("inquirer");
const { Pool } = require("pg");
const db = new Pool({
  user: "postgres",
  password: "password",
  host: "localhost",
  database: "employee_tracker",
});

let departments = [];
let roles = [];
let employees = [];

const mainMenu = async () => {
  const { option } = await inquirer.prompt({
    type: "list",
    name: "option",
    message: "Select an option:",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit",
    ],
  });

  switch (option) {
    case "View all departments":
      viewDepartments();
      break;
    case "View all roles":
      viewRoles();
      break;
    case "View all employees":
      viewEmployees();
      break;
    case "Add a department":
      addDepartment();
      break;
    case "Add a role":
      addRole();
      break;
    case "Add an employee":
      addEmployee();
      break;
    case "Update an employee role":
      updateEmployeeRole();
      break;
    case "Exit":
      console.log("Exiting application...");
      return;
  }
};

const viewDepartments = async () => {
  const results = await db.query("SELECT * FROM departments;");

  departments = results.rows;

  console.table(departments);

  mainMenu();
};

const viewRoles = async () => {
  const results = await db.query("SELECT * FROM roles;");
  roles = results.rows;
  console.table(roles);

  mainMenu();
};

const viewEmployees = async () => {
  const results = await db.query("SELECT * FROM employees;");
  employees = results.rows;
  console.table(employees);

  mainMenu();
};

const addDepartment = async () => {
  const { departmentName } = await inquirer.prompt({
    type: "input",
    name: "departmentName",
    message: "Enter the name of the department:",
  });

  // db.query(`INSERT INTO departments (name) VALUES ('${departmentName}')`);

  await db.query("INSERT INTO departments (name) VALUES ($1)", [
    departmentName,
  ]);
  // departments.push({ id: departments.length + 1, name: departmentName });

  console.log(`Department ${departmentName} added.`);

  mainMenu();
};

const addRole = async () => {
    const departmentChoices = departments.map(department => {
        return {
            name: department.name,
            value: department.id
        }
    });

  const { roleName, salary, departmentId } = await inquirer.prompt([
    {
      type: "input",
      name: "roleName",
      message: "Enter the name of the role:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary for the role:",
    },
    {
      type: "list",
      name: "departmentId",
      message: "Select the department for this role:",
      choices: departmentChoices,
    },
  ]);

  await db.query(
    "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
    [roleName, salary, departmentId]
  );

  console.log(`Role ${roleName} added.`);

  mainMenu();
};

const addEmployee = async () => {
    const roleChoices = roles.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    });

    const employeeChoices = employees.map(employee => {
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }
    });

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "Enter the employee’s first name:",
      
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter the employee’s last name:",
    },
    {
      type: "list",
      name: "roleId",
      message: "Enter the role ID for this employee:",
      choices: roleChoices
    },
    {
      type: "list",
      name: "managerId",
      message: "Enter the manager’s name:",
      choices: employeeChoices
    },
  ]);
  await db.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, roleId, managerId]
  );
  console.log(`Employee ${firstName} ${lastName} added.`);

  mainMenu();
};

const updateEmployeeRole = async () => {
    const roleChoices = roles.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    });

    const employeeChoices = employees.map(employee => {
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }
    });


  const { employeeId, newRoleId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Enter the employee ID to update:",
      choices: employeeChoices
    },
    {
      type: "list",
      name: "newRoleId",
      message: "Enter the new role ID for this employee:",
      choices: roleChoices
    },
  ]);
  const employee = employees.find((emp) => emp.id == employeeId);
  if (employee) {
    // employee.roleId = newRoleId;

    await db.query("UPDATE employees SET role_id = $1 WHERE id = $2", [newRoleId, employeeId]);

    console.log(`Employee ID ${employeeId} updated to role ID ${newRoleId}.`);
  } else {
    console.log("Employee not found.");
  }

  mainMenu();
};

function start() {
  db.connect()
    .then(async () => {
      console.log("Connected to the database");

      // initialize departments array
      const results1 = await db.query("SELECT * FROM departments;");
      departments = results1.rows;

      // initialize roles array
      const results2 = await db.query("SELECT * FROM roles;");
      roles = results2.rows;

      // initialize employees array
      const results3 = await db.query("SELECT * FROM employees;");
      employees = results3.rows;

      mainMenu();
    })
    .catch((err) => console.error("Connection error", err.stack));
}

start();
