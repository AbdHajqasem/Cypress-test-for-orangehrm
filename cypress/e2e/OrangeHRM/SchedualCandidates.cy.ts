import addCandidate from "../../support/addCandidateHelper";
import addCandidatePage from "../../support/pageObjects/mainPages/addCandidatePage";
import loginPage from "../pageObjects/loginPage";
import scheduleInterviewPage from "../../support/pageObjects/mainPages/scheduleInterviewPage";

const myAddCandidate: addCandidate = new addCandidate();
const myLoginPage: loginPage = new loginPage();
const myAddCandidatePage: addCandidatePage = new addCandidatePage();
const myScheduleInterviewPage: scheduleInterviewPage =
  new scheduleInterviewPage();
describe("schedule candidate", () => {
  beforeEach(() => {
   
    cy.visit("web/index.php/auth/login");
 
    myLoginPage.login("Admin", "admin123");


    cy.fixture("candidateInfo").as("candidateInfo");
  });

  it("test", () => {
 
    cy.get("@candidateInfo").then((candidateData) => {
     
      myAddCandidate.addCandidateViaAPI(candidateData.data).then((res) => {
        let id = res.data.id;

   
        cy.api({
          method: "PUT",
          url: `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/candidates/${id}/shortlist`,
        });

       
        cy.visit(`/web/index.php/recruitment/addCandidate/${id}`);
        myAddCandidatePage.elements.acceptBTNs().click({ force: true });
       
        myScheduleInterviewPage.elements.interviewTitle().type("QA");
        myScheduleInterviewPage.elements.interviewer().type("a");
        cy.wait(3000);
        myScheduleInterviewPage.elements.autocompleteOption().eq(0).click();
        myScheduleInterviewPage.elements.dateInput().type("2023-10-26");
        myScheduleInterviewPage.elements.saveBTN().click();
  
        myAddCandidatePage.elements
          .status()
          .should("have.text", "Status: Interview Scheduled");
      });
    });
  });
});
