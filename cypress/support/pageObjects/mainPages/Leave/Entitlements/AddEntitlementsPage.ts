export default class AddEntitlementsPage {
    URL = {
      addEntitlement:
        "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements",
    };
  
    addEntitlementViaAPI = (data: any) => {
      const requestBody = {
        empNumber: data.empNumber,
        entitlement: data.entitlementInfo.entitlement,
        fromDate: data.entitlementInfo.fromDate,
        leaveTypeId: data.entitlementInfo.leaveTypeId,
        toDate: data.entitlementInfo.toDate,
      };
      
      cy.api({
        url: this.URL.addEntitlement,
        method: "POST",
        body: requestBody,
      });
    };
  }
  