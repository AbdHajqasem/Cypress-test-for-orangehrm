import LoginPage from "../../support/pageObjects/mainPages/loginPage";
import AddEmployeePage from "../../support/pageObjects/mainPages/addEmployeePage";
import AddEntitlementsPage from "../../support/pageObjects/mainPages/Leave/Entitlements/AddEntitlementsPage";
import Sidebar from "../../support/pageObjects/subPages/sidebar";
import MyLeavePage from "../../support/pageObjects/mainPages/Leave/MyLeavePage";
import Table from "../../support/pageObjects/objects/table";
import ApplyLeavePage from "../../support/pageObjects/mainPages/Leave/ApplyLeavePage";
import LeaveListPage from "../../support/pageObjects/mainPages/Leave/LeaveListPage";

const loginPage: LoginPage = new LoginPage();
const addEmployeePage: AddEmployeePage = new AddEmployeePage();
const addEntitlementsPage: AddEntitlementsPage = new AddEntitlementsPage();
const applyLeavePage: ApplyLeavePage = new ApplyLeavePage();
const leaveListPage: LeaveListPage = new LeaveListPage();
const sidebar: Sidebar = new Sidebar();
const myLeavePage: MyLeavePage = new MyLeavePage();
const table: Table = new Table();

describe("Scenario1", () => {
  before("Setup before starting Scenario1 ", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    loginPage.login("Admin", "admin123");

    cy.fixture("employeeInfo").as("empInfo");

    cy.get("@empInfo").then((empData: any) => {
      addEmployeePage.addUserWithLoginUsingAPI(empData).then((body: any) => {
        empData.empNumber = body.data.employee.empNumber;
        empData.username = body.data.userName;

        addEntitlementsPage.addEntitlementViaAPI(empData);

        cy.writeFile(
          "./../fixtures/employeeInfo.json",
          JSON.stringify(empData)
        );
      });
    });

    loginPage.logout();
  });

  it("Scenario1", () => {
    cy.get("@empInfo").then((empData: any) => {
      loginPage.login(empData.username, empData.password);
      cy.wait(2000);

      applyLeavePage
        .applyLeaveViaAPI(empData.leaveInfo)
        .then((res: any) => {
          console.log("abed");

          console.log(res);

          empData.leaveInfo.leaveId = res.data.id;
          //empData.leaveInfo.netflexId = "abed";
          cy.writeFile(
            "../../fixtures/employeeInfo.json",
            JSON.stringify(empData)
          );
        })
        .then(() => {
          loginPage.logout();

          loginPage.login("Admin", "admin123");
          cy.wait(2000);

          leaveListPage.approveLeaveViaAPI(empData.leaveInfo.leaveId);
        });

      loginPage.logout();

      loginPage.login(empData.username, empData.password);
      cy.wait(2000);

      sidebar.getPage("Leave").click();

      const myTable: Table = myLeavePage.createTable();
      myTable.checkValue(1, "Status", "Scheduled");
    });
  });
});
