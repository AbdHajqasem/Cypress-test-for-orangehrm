import GenericFunctions from "../../../../cypress/e2e/conduit/support/genericFunctions";
import table from "../objects/table";

export default class AddVacancyPage {
  private attachmentsTable: table;

  constructor() {
    this.attachmentsTable = new table();
  }

  private elements = {
    vacancyName: () =>
      cy.get(
        ".oxd-form > :nth-child(1) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input"
      ) as Cypress.Chainable,
    jobTitle: () => cy.get(".oxd-select-text") as Cypress.Chainable,
    saveBtns: () => cy.get('[type="submit"]') as Cypress.Chainable,
    cancelBtns: () => cy.get("button").contains("Cancel") as Cypress.Chainable,
    addFileBtn: () =>
      cy.get(".orangehrm-header-container > .oxd-button") as Cypress.Chainable,
    downloadFileBtns: () =>
      cy.get(".oxd-table-cell-actions > :nth-child(2)") as Cypress.Chainable,
    fileInput: () => cy.get('[type="file"]') as Cypress.Chainable,
    hiringManager: () =>
      cy.get(".oxd-autocomplete-text-input > input") as Cypress.Chainable,
    selectOption: () => cy.get(".oxd-select-option") as Cypress.Chainable,
    autocompleteOption: () =>
      cy.get(".oxd-autocomplete-option") as Cypress.Chainable,
  };

  private URLs = {
    vacancies:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/vacancies",
    visitPage: (id: number) => `/web/index.php/recruitment/addJobVacancy/${id}`,
  };

  createAttachmentsTable = () => {
    this.attachmentsTable.create([
      "File Name",
      "File Size",
      "File Type",
      "Comment",
    ]);
    return this.attachmentsTable;
  };

  addVacancy = (data: any): Cypress.Chainable<number> => {
    this.elements
      .vacancyName()
      .type(data.vacancyName + GenericFunctions.genericRandomNumber());
    this.elements.jobTitle().click();
    this.elements.selectOption().eq(1).click();
    this.elements.hiringManager().type("a");
    cy.wait(2000);
    this.elements.autocompleteOption().eq(0).click();
    this.elements.saveBtns().eq(0).click();
    cy.wait(2000);

    return cy
      .get("@addVacancyAPI")
      .its("response.body.data.id") as Cypress.Chainable<number>;
  };

  addAttachment = (path: string) => {
    this.elements.addFileBtn().click();
    this.elements.fileInput().selectFile(path, { force: true });
    this.elements.saveBtns().eq(1).click();
    this.elements.downloadFileBtns().eq(0).click();
  };

  addVacancyWithAttachment = (data: any) => {
    this.addVacancy(data);
    this.addAttachment(data.path);
  };

  visitVacancy = (id: number) => {
    cy.visit(this.URLs.visitPage(id));
  };
}
