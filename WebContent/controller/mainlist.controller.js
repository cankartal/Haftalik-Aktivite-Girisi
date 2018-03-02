sap.ui.define([
	"sap/ui/prodea/solman/aktivite/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/prodea/solman/util/Formatter"
], function (BaseController, JSONModel) {
	"use strict";
	
	return BaseController.extend("sap.ui.prodea.solman.aktivite.controller.mainlist", {
		
		onInit: function () {
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("mainlist").attachMatched(this._onRouteMatched, this);
			
		},
		_onRouteMatched : function (oEvent) {
//			var oArgs, oView, oQuery;
//			oArgs = oEvent.getParameter("arguments");
			var oView = this.getView();	
			
			
		},
		handleSearch : function(evt) {
			// create model filter
			var filters = [];
			var list = this.getView().byId("planList");
			var binding = list.getBinding("items");
			var query = evt.getSource().getValue();
			if (query && query.length > 0) {
				binding
						.filter([ new sap.ui.model.Filter(
								[
										new sap.ui.model.Filter(
												"NameFl",
												sap.ui.model.FilterOperator.Contains,
												query),
										new sap.ui.model.Filter(
												"NameFlId",
												sap.ui.model.FilterOperator.Contains,
												query),		
										new sap.ui.model.Filter(
												"Musteri",
												sap.ui.model.FilterOperator.Contains,
												query) ], false) ]);
			} else {
				binding.filter([]);
			}
		}

	});
});
 