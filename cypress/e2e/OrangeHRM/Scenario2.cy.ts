import AddVacancyPage from "../../support/pageObjects/mainPages/AddVacancyPage";
import LoginPage from "../../support/pageObjects/mainPages/loginPage";
import Vacancies from "../..//support/pageObjects/mainPages/Recruitment/Vacancies";
import Table from "../../support/pageObjects/objects/table";
import Sidebar from "../../support/pageObjects/subPages/sidebar";

const loginPage: LoginPage = new LoginPage();
const addVacancyPage: AddVacancyPage = new AddVacancyPage();
const sidebar: Sidebar = new Sidebar();
const vacanciesPage: Vacancies = new Vacancies();

describe("Scenario2", () => {
  before("Setup before starting Scenario2", () => {
    cy.visit("web/index.php/auth/login");

    loginPage.login("Admin", "admin123");

    cy.fixture("vacancyInfo").as("vacancyInfo");
    cy.get("@vacancyInfo").then((vacancyData: any) => {
      cy.intercept(
        "POST",
        "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/vacancies"
      ).as("addVacancyAPI");
      sidebar.getPage("Recruitment").click();
      vacanciesPage.elements.VacanciesPageBTN().click();
      vacanciesPage.elements.addVacancyBTN().click();
      addVacancyPage.addVacancy(vacancyData).then((vacancyId: number) => {
        vacancyData.vacancyId = vacancyId;
        cy.writeFile("vacancyInfo.json", vacancyData);
      });
    });
  });

  it("Scenario2 ", () => {
    cy.get("@vacancyInfo").then((vacancyData: any) => {
      addVacancyPage.visitVacancy(vacancyData.vacancyId);

      addVacancyPage.addAttachment(vacancyData.path);

      const attachmentsTable: Table = addVacancyPage.createAttachmentsTable();
      const fileName = vacancyData.path.split("/").pop();
      attachmentsTable.checkValue(1, "File Name", fileName);
    });
  });
});
