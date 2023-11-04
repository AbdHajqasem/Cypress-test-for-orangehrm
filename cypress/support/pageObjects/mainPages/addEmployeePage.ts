import GenericFunctions from "../../../../cypress/e2e/conduit/support/genericFunctions";
class AddEmployeePage {
    elements = {
      saveButton: () => cy.get("button").contains("Save"),
      cancelButton: () => cy.get("button").contains("Cancel"),
      firstNameInput: () => cy.get('[placeholder = "First Name"]'),
      middleNameInput: () => cy.get('[placeholder = "Middle Name"]'),
      lastNameInput: () => cy.get('[placeholder = "Last Name"]'),
      employeeIdInput: () =>
        cy.get(
          ":nth-child(1) > .oxd-grid-2 > .oxd-grid-item > .oxd-input-group > :nth-child(2) > .oxd-input"
        ),
      loginDetailsSwitch: () => cy.get(".oxd-switch-input"),
      usernameInput: () =>
        cy.get(
          ":nth-child(4) > .oxd-grid-2 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
        ),
      passwordInput: () =>
        cy.get(
          ".user-password-cell > .oxd-input-group > :nth-child(2) > .oxd-input"
        ),
      confirmPasswordInput: () =>
        cy.get(
          ".oxd-grid-2 > :nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input"
        ),
    };
  
    urls = {
      employees: "/web/index.php/api/v2/pim/employees",
      users: "/web/index.php/api/v2/admin/users",
    };
  
    addWithLogin = (
      firstName: string,
      middleName: string,
      lastName: string,
      username: string,
      password: string
    ) => {
      this.actions.enterFirstName(firstName);
      this.actions.enterMiddleName(middleName);
      this.actions.enterLastName(lastName);
      this.actions.addLoginSwitch();
      this.actions.enterUsername(username);
      this.actions.enterPassword(password);
      this.actions.enterConfirmPassword(password);
      this.actions.clickSaveButton();
    };
  
    actions = {
      enterFirstName: (firstName: string) =>
        this.elements.firstNameInput().type(firstName),
      enterMiddleName: (middleName: string) =>
        this.elements.middleNameInput().type(middleName),
      enterLastName: (lastName: string) =>
        this.elements.lastNameInput().type(lastName),
      addLoginSwitch: () => this.elements.loginDetailsSwitch().click(),
      enterUsername: (username: string) =>
        this.elements.usernameInput().type(username),
      enterPassword: (password: string) =>
        this.elements.passwordInput().type(password),
      enterConfirmPassword: (password: string) =>
        this.elements.confirmPasswordInput().type(password),
      clickSaveButton: () => this.elements.saveButton().click(),
    };
  
    addEmployeeUsingAPI(employeeData: any) {
      const employeePayload = {
        firstName: employeeData.firstName,
        middleName: employeeData.middleName,
        lastName: employeeData.lastName,
        empPicture: null,
        employeeId:`${GenericFunctions.genericRandomNumber(1000)}`,
      };
  
      return cy.api({
        method: "POST",
        url: this.urls.employees,
        body: employeePayload,
      });
    }
  
    addUserWithLoginUsingAPI(employeeData: any) {
      return this.addEmployeeUsingAPI(employeeData).then((employeeResponse) => {
        const empNo = employeeResponse.body.data.empNumber;
  
        const userPayload = {
          username: employeeData.username,
          password: employeeData.password,
          status: true,
          userRoleId: 2,
          empNumber: empNo,
        };
  
        return cy
          .api({
            method: "POST",
            url: this.urls.users,
            body: userPayload,
          })
          .then((userResponse) => {
            console.log(userResponse);
            return userResponse.body;
          });
      });
    }
  
    deleteEmployee(id: number) {
      const deletePayload = {
        ids: [id],
      };
  
      return cy.api({
        method: "DELETE",
        url: this.urls.employees,
        body: deletePayload,
      });
    }
  }
  export default AddEmployeePage;
  