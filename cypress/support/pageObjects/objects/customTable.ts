class customTable{
    private columns: Array<string> = new Array;

    create(customTable:Array<string>){
        this.columns = customTable;
    }

    checkValue(row:number,attr:string,expected:string){
        this.getcell(row,attr).should('have.text',expected);
    }

    getcell(row:number,attr:string){
        let ind = this.columns.indexOf(attr);
        return cy.get(`div.oxd-table-body > div:nth-child(${row}) > div > div:nth-child(${ind+1})`);
    }
}

export default customTable;