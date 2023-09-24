class loginPage{
    elements={
        userName:()=>cy.get('[placeholder="Username"]'),

        password:()=>cy.get('[placeholder="Password"]'),

        loginButton:()=>cy.get('button')
    }
    login(userName:string,password:string){
        this.elements.userName().type(userName)
        this.elements.password().type(password)
        this.elements.loginButton().click()
    }
}
export default loginPage;