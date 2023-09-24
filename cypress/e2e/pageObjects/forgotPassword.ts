class forgotPassword{
    elements={
        forgotPasswordBtn:()=>cy.get('[data-v-7b563373]').eq(3),
        userName:()=>cy.getByPlaceholder("Username"),
        resetPassword:()=>cy.get('[type="submit"]'),
        title:()=>cy.get('.orangehrm-forgot-password-title')
    }
    resetPassword(userName:string){
        this.elements.forgotPasswordBtn().click()
        this.elements.userName().type(userName)
        this.elements.resetPassword().click()
        this.elements.title().contains("Reset Password link sent successfully").should("exist")

    }
}
export default forgotPassword;