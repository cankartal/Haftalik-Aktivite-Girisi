sap.ui.controller("sap.ui.prodea.solman.aktivite.controller.linedetail", {
    handleNavBack: function(evt) {
        var oHistory, sPreviousHash;
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oHistory = sap.ui.core.routing.History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();
      
        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            oRouter.navTo("main", {}, true /* no history */ );
        }       
    },	
});