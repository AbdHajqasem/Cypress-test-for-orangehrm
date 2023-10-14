import loginPage from "../../support/pageObjects/mainPages/loginPage";
import sidebar from "../../support/pageObjects/subPages/sidebar";
import PIMPage from "../../support/pageObjects/mainPages/PIMPage";
import addEmployeePage from "../../support/pageObjects/mainPages/addEmployeePage";
import employeeDetailsPersonal from "../../support/pageObjects/employeeDetails_Personal";
import employeeDetailsJob from "../../support/pageObjects/employeeDetails_Job";
import employeeDetailsReportTo from "../../support/pageObjects/employeeDetails_ReportTo";
import editEmployeeNavigation from "../../support/pageObjects/subPages/editEmployeeNavigation";
import employeeSearch from "../../support/pageObjects/subPages/employeeSearch";
import customTable from "../../support/pageObjects/objects/customTable";

const myEmployeeDetailsPersonal: employeeDetailsPersonal = new employeeDetailsPersonal();
const myEmployeeDetailsJob: employeeDetailsJob = new employeeDetailsJob();
const myEmployeeDetailsReportTo: employeeDetailsReportTo = new employeeDetailsReportTo();
const myEditEmployeeNavigation: editEmployeeNavigation = new editEmployeeNavigation();
const mySidebar: sidebar = new sidebar();
const myPIMPage: PIMPage = new PIMPage();
const myLoginPage: loginPage = new loginPage();
const myAddEmployeePage: addEmployeePage = new addEmployeePage();
const myEmployeeSearch: employeeSearch = new employeeSearch();
const myCustomTable: customTable = new customTable();

describe("First automation assignment ", () => {

    let employeeId = 1;
    beforeEach(() => {

        cy.visit("web/index.php/auth/login");


        myLoginPage.login("Admin", "admin123");


        cy.fixture("employeeInfo").as("empInfo");


        cy.get("@empInfo").then((infoData: any) => {

            mySidebar.getPage('PIM').click();

            myPIMPage.elements.addBTN().click();
            myAddEmployeePage.elements.employeeId().then(($el:any) => {
                infoData.employeeId = $el[0]._value;
                cy.request({
                    method: "POST",
                    url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees",
                    body: {
                        employeeId: infoData.employeeId,
                        firstName: infoData.firstName,
                        middleName: infoData.middleName,
                        lastName: infoData.lastName,
                    },
                }).then((res) => {
                    infoData.empNumber = res.body.data.empNumber;

                    cy.writeFile('../../fixtures/employeeInfo.json', JSON.stringify(infoData));
                })

            });
        });
    });

    it("add employee information then check it", () => {
        cy.get("@empInfo").then((infoData: any) => {

            cy.intercept(`https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/${infoData.empNumber}`).as('empDetails')
            cy.visit(`https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/${infoData.empNumber}`);
            cy.wait('@empDetails');
            myEmployeeDetailsPersonal.elements.employeeFullName().should('have.text', `${infoData.firstName} ${infoData.lastName}`);


            myEditEmployeeNavigation.getPage('Job').click({ force: true });
            myEmployeeDetailsJob.elements.newJobTitle().click();
            myEmployeeDetailsJob.elements.Option().eq(1).click().then(($el) => {
                infoData.jobTitle = $el[0].innerText;
            });
            myEmployeeDetailsJob.elements.newSubUnit().click();
            myEmployeeDetailsJob.elements.Option().eq(1).click().then(($el) => {
                infoData.subUnit = $el[0].innerText;
            });
            myEmployeeDetailsJob.elements.newEmploymentStatus().click();
            myEmployeeDetailsJob.elements.Option().eq(1).click().then(($el) => {
                infoData.employmentStatus = $el[0].innerText;
            });
            myEmployeeDetailsJob.elements.newJobSaveBTN().click();


            myEditEmployeeNavigation.getPage('Report-to').click({ force: true });
            myEmployeeDetailsReportTo.elements.addSupervisorBTN().click({ force: true });
            myEmployeeDetailsReportTo.elements.newSupervisorName().type('a');

            cy.wait(3000);
            myEmployeeDetailsReportTo.elements.autocompleteOption().eq(0).click().then(($el) => {
                infoData.supervisor = $el[0].innerText;
                cy.writeFile('../../fixtures/employeeInfo.json', infoData);
                myEmployeeDetailsReportTo.elements.addNewSupervisorReportingMethod().click();
                myEmployeeDetailsReportTo.elements.selectOption().eq(1).click();
                myEmployeeDetailsReportTo.elements.saveNewSupervisorBTN().click({ force: true });

                mySidebar.getPage('PIM').click();
                myEmployeeSearch.searchBy([{ key: "employeeId", value: infoData.employeeId }]);
                
                myCustomTable.create(['Check', 'Id', 'First (& Middle) Name', 'Last Name', 'Job Title', 'Employment Status', 'Sub Unit', 'Supervisor', 'Actions']);
                myCustomTable.checkValue(1, 'Id', infoData.employeeId);
                myCustomTable.checkValue(1, 'First (& Middle) Name', `${infoData.firstName} ${infoData.middleName}`);
                myCustomTable.checkValue(1, 'Last Name', infoData.lastName);
                myCustomTable.checkValue(1, 'Job Title', infoData.jobTitle);
                myCustomTable.checkValue(1, 'Employment Status', infoData.employmentStatus);
                myCustomTable.checkValue(1, 'Sub Unit', infoData.subUnit);
                myCustomTable.checkValue(1, 'Supervisor', infoData.supervisor.split(' ')[0] + ' ' + infoData.supervisor.split(' ')[2]);
            });

        })
    });
});


