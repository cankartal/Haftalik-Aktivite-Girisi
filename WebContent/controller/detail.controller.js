sap.ui.define([
	"sap/ui/prodea/solman/aktivite/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("sap.ui.prodea.solman.aktivite.controller.detail", {
		onInit: function () {
			
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss a"});
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
			
		},
		_onRouteMatched : function (oEvent) {
			this.getExplanationPart();
			
		    },
		    
		getExplanationPart: function (){
			var visibleModel = sap.ui.getCore().byId("app").getModel("visibleModel");
			var visValueExpPlan =  visibleModel.oData.visValueExpPlan;
			var visValueExp = visibleModel.oData.visValueExp;
			if(visValueExpPlan == "Navigation"){
				this.getView().byId("onSetDetailsForActivityId").setType("Navigation");
			}
			else{
				this.getView().byId("onSetDetailsForActivityId").setType("Inactive");
			}
			if(visValueExp == "Inactive"){
				this.getView().byId("onSetDetailsForActivityConsultantId").setType("Inactive");
			}
			else{
				this.getView().byId("onSetDetailsForActivityConsultantId").setType("Navigation");
			}
		},    
		    handleCloseButton: function (oEvent) {
				this._oPopover.close();
			},
			onExit : function () {
				if (this._oPopover) {
					this._oPopover.destroy();
				}
			},
			onSetDetailsForActivityConsultant: function(oEvent){
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("sap.ui.prodea.solman.aktivite.fragment.detailPlanPopoverConsultant", this);
//					this._oPopover.bindElement("/ProductCollection/0");
					this.getView().addDependent(this._oPopover);
				}
	 
				this._oPopover.openBy(oEvent.getSource());
			
				
			},
			
		 onSetDetailsForActivity: function(oEvent){
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("sap.ui.prodea.solman.aktivite.fragment.detailPlanPopover", this);
//				this._oPopover.bindElement("/ProductCollection/0");
				this.getView().addDependent(this._oPopover);
			}
 
			this._oPopover.openBy(oEvent.getSource());
		
			
		},    
		onSelectConsultantDetail: function (oEvent) {
			var selectedKey = oEvent.getParameter("selectedItem").mProperties.key;
			var detailModel = sap.ui.getCore().byId("app").getModel("detailModel");
			var detailRow = detailModel.oData.DetailRow;
			detailRow.DanismanOrtak = selectedKey;
			detailModel.refresh();

			
		},
		
		setCitySelection: function(oEvent){
			var selectedKey = oEvent.getSource().mProperties.value;
			var detailModel = sap.ui.getCore().byId("app").getModel("detailModel");
			var detailRow = detailModel.oData.DetailRow;
			detailRow.Sehir = selectedKey;
			detailModel.refresh();
		},
		
		
		setActivityType: function(oEvent){
			var selectedKey = oEvent.getSource().mProperties.selectedKey;
			var detailModel = sap.ui.getCore().byId("app").getModel("detailModel");
			var detailRow = detailModel.oData.DetailRow;
			detailRow.Aktivite = selectedKey;
			detailModel.refresh();
		},
		
		numberToSeconds: function(time){
			if(time){
				var hour =  time.replace(/:/g,"").substring(0,2);
				var min = 	time.replace(/:/g,"").substring(2,4);
				var sec = 	time.replace(/:/g,"").substring(4,6);
				var totalsec = (Number(hour) * 3600) + (Number(min) * 60) + (Number(sec));
				return totalsec;
				
			}
		},
		setWorkingHours: function(evt){
			var detailModel = sap.ui.getCore().byId("app").getModel("detailModel");
			var detailRow = detailModel.oData.DetailRow;
			var workingHourId = this.getView().byId("workingHourId");
			var detailTimeBasSaat = this.getView().byId("detailTimeBasSaat");
			var detailTimeBitSaat = this.getView().byId("detailTimeBitSaat");
			var detailTimeBasSaatV = detailTimeBasSaat.getValue();
			var detailTimeBitSaatV =  detailTimeBitSaat.getValue();
			var detailTimeBasSaatVN = detailTimeBasSaatV.replace(/:/g,"");
			var detailTimeBitSaatVN = detailTimeBitSaatV.replace(/:/g,"");
			var workingHour = (this.numberToSeconds(detailTimeBitSaatVN) - this.numberToSeconds(detailTimeBasSaatVN))-(3600);
			if(workingHour <= 0){
				//Hata
				return;
			}
			
			var h = Math.floor(workingHour / 3600);
		    var m = Math.floor(workingHour % 3600 / 60);
		    var s = Math.floor(workingHour % 3600 % 60);
		    var workingHourSetValue = ( String(h) + "." + String(m));
//		    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
			workingHourId.setValue(workingHourSetValue);
			detailRow.CalismaSaat = workingHourSetValue;
			detailModel.refresh();
		},
		handleChangeDateDetail: function(evt){
			var detailModel = sap.ui.getCore().byId("app").getModel("detailModel");
			var detailRow = detailModel.oData.DetailRow.Gun;
			var date = evt.getSource().getProperty("dateValue");
			var dayofTheWeek = new Date(date).getDay();
			var days =  ["Pazar","Pazartesi","Sali","Çarşamba","Perşembe","Cuma","Cumartesi"];
			var weekDay =  days[dayofTheWeek];
			this.getView().byId("dayDetailDisplay").setValue(weekDay);
			detailRow = weekDay;
			detailModel.refresh();
			
			
		}
		
	});
});