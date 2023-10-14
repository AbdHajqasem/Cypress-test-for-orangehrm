import loginPage from "../../support/pageObjects/mainPages/loginPage";
import sidebar from "../../support/pageObjects/subPages/sidebar";

const mySideBar: sidebar = new sidebar();
const myLoginPage: loginPage = new loginPage();

describe("cheack Candidates rows count", () => {
  beforeEach(() => {
    // visiting orangeHRM website
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    // login
    myLoginPage.login("Admin", "admin123");
  });

  it("get row counts", () => {
    cy.intercept("GET", "web/index.php/api/v2/recruitment/candidates?**").as(
      "getRequest"
    );

    mySideBar.getPage("Recruitment").click();

    cy.wait("@getRequest").then((interception) => {
      const response = interception.response;
      cy.get(".oxd-table-body")
        .children(".oxd-table-card")
        .should("have.length", response?.body.meta.total);
    });
  });
});
