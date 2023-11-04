import forgetPage from "./forgetPage";

const myForgetPage = new forgetPage();
class LoginPage {
  elements = {
    userName: () => cy.get('[placeholder="Username"]'),
    password: () => cy.get('[placeholder="Password"]'),
    loginBTN: () => cy.get("button"),
    forgetPasswordLink: () => cy.get(".orangehrm-login-forgot-header"),
    usernameErrorText: () =>
      cy.get(":nth-child(2) > .oxd-input-group > .oxd-text"),
    passwordErrorText: () =>
      cy.get(":nth-child(3) > .oxd-input-group > .oxd-text"),
    message: () => cy.get(".oxd-alert-content > .oxd-text"),
  };

  login(userName: string, password: string) {
    if (userName != "") {
      this.elements.userName().type(userName).should("have.value", userName);
    }
    if (password != "") {
      this.elements.password().type(password).should("have.value", password);
    }
    this.elements.loginBTN().click();
  }

  forgetPassword(userName: string) {
    this.elements.forgetPasswordLink().click();
    myForgetPage.typeUserName(userName);
    myForgetPage.reset();
    myForgetPage.checkReset();
  }

  logout() {
    cy.request(
      "GET",
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/logout",
      {}
    ).then((response) => {
      expect(response.status).to.eq(200);
    });

    cy.clearCookies();
    cy.visit("/");
  }
}

export default LoginPage;
