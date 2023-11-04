export default class LeaveListPage{
    URL = {
        leaveAction: (id: number) => {return `/web/index.php/api/v2/leave/employees/leave-requests/${id}`} 
    }

    approveLeaveViaAPI = (leaveId: number) => {
        return cy.api({
            method: 'PUT',
            url: this.URL.leaveAction(leaveId),
            body:{
                action: "APPROVE"
            }
        }).its('body')
    }
}