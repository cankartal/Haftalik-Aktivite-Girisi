sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/m/MessageBox',
	"sap/ui/prodea/solman/aktivite/thirdParty/xmltojson"
], function (Controller, History, MessageBox, xmltojson) {
	"use strict";
	return Controller.extend("sap.ui.prodea.solman.aktivite.controller.BaseController", {
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onNavBack: function (oEvent) {
//			this.clearSelectedInputs();
			
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			var activityModel = sap.ui.getCore().byId("app").getModel("activityList");
			var detailModel = sap.ui.getCore().byId("app").getModel("detailModel");
			var detailRow = detailModel.oData.DetailRow;
			if(sPreviousHash == "main"){
				var editRowPath = sap.ui.getCore().byId("app").getModel("editRowPath");
				var editPlanPath = editRowPath.oData.EditRow.slice(-1);
				var activityModelRow = sap.ui.getCore().byId("app").getModel("activityList").oData.ActivityList[editPlanPath];
				activityModelRow = detailModel.oData.DetailRow;
				activityModel.refresh();
				
				detailModel.oData.DetailRow = [];
				detailModel.refresh();
				
				
				
				window.history.go(-1);
			}
			else if (sPreviousHash !== undefined) {
				activityModel.oData.ActivityList = [];
				detailRow = [];
				activityModel.refresh();
				detailModel.refresh();
				window.history.go(-1);
			}
			else if (sPreviousHash == "selection"){
				activityModel.oData.ActivityList = [];
				detailRow = [];
				activityModel.refresh();
				detailModel.refresh();
				window.history.go(-1);
			}
			else {
				this.getRouter().navTo("selection", {}, true /*no history*/);
			}

			
		},
		
		onInit: function(){
			ClientListBinding.prototype.getFilterFunction = function(oFilter){
			    if (oFilter.fnTest) {
			        return oFilter.fnTest;
			    }
			    var oValue1 = this.normalizeFilterValue(oFilter.oValue1),
			        oValue2 = this.normalizeFilterValue(oFilter.oValue2);
			    oValue1
			    switch (oFilter.sOperator) {
			        case "EQ":
			            oFilter.fnTest = function(value) { return value == oValue1; }; break;
			        case "NE":
			            oFilter.fnTest = function(value) { return value != oValue1; }; break;
			        case "LT":
			            oFilter.fnTest = function(value) { return value < oValue1; }; break;
			        case "LE":
			            oFilter.fnTest = function(value) { return value <= oValue1; }; break;
			        case "GT":
			            oFilter.fnTest = function(value) { return value > oValue1; }; break;
			        case "GE":
			            oFilter.fnTest = function(value) { return value >= oValue1; }; break;
			        case "BT":
			            oFilter.fnTest = function(value) { return (value >= oValue1) && (value <= oValue2); }; break;
			        case "Contains":
			            oFilter.fnTest = function(value) {
			                if (typeof value != "string") {
			                    throw new Error("Only \"String\" values are supported for the FilterOperator: \"Contains\".");
			                }
			                return value.indexOf(oValue1) != -1; 
			            }; 
			            break;
			        case "StartsWith":
			            oFilter.fnTest = function(value) { 
			                if (typeof value != "string") {
			                    throw new Error("Only \"String\" values are supported for the FilterOperator: \"StartsWith\".");
			                }
			                return value.indexOf(oValue1) == 0; 
			            }; 
			            break;
			        case "EndsWith":
			            oFilter.fnTest = function(value) { 
			                if (typeof value != "string") {
			                    throw new Error("Only \"String\" values are supported for the FilterOperator: \"EndsWith\".");
			                }
			                var iPos = value.lastIndexOf(oValue1);
			                if (iPos == -1){
			                    return false;                   
			                }
			                return iPos == value.length - new String(oFilter.oValue1).length; 
			            }; 
			            break;
			        default:
			            oFilter.fnTest = function(value) { return true; };
			    }
			    return oFilter.fnTest;
			};
		},
		
		
		clearSelectedInputs: function(){
			
		},
		returnToHomePage : function() {
			var origin = window.location.origin;
			var pathname = window.location.pathname;
			var search = window.location.search;
			var url = origin + pathname + search;
			window.parent.location.replace(url);
		},
	        showMessage: function(Title, Message) {
	            sap.m.MessageBox.show(
	                    Message, {
	                        icon: sap.m.MessageBox.Icon.INFORMATION,
	                        title: Title,
	                        actions: [sap.m.MessageBox.Action.OK]
	                    }
	                );
	            },
	            showServiceErrorMessages : function(messages, type) {
	    			var that = this;

	    			var messageStrips = [];
	    			for (var i = 0, len = messages.length; i < len; i++) {
	    				var strip = new sap.m.MessageStrip({
	    					text : messages[i]._text,
	    					showIcon : true,
	    					class : "sapUiMediumMarginBottom"
	    				});
	    				switch (type) {
	    				case "E":
	    					strip.setType("Error");
	    					break;
	    				case "S":
	    					strip.setType("Success");
	    					break;
	    				case "I":
	    					strip.setType();
	    					break;
	    				case "W":
	    					strip.setType("Warning");
	    					break;
	    				}
	    				messageStrips.push(strip);
	    			}
	    			var dialog = new sap.m.Dialog({
	    				title : "{i18n>dialogMessageListHeader}",
	    				content : messageStrips,
	    				beginButton : new sap.m.Button({
	    					text : "{i18n>close}",
	    					press : function(evt) {
	    						dialog.close();
//	    						that.returnToHomePage();
	    					}
	    				}),
	    				afterClose : function() {
	    					dialog.destroy();
	    				}
	    			});
	    			this.getView().addDependent(dialog);
	    			dialog.open();
	    		},
	    		showReturnMessages : function(messages, action) {
	    			var messageTitle;
	    			var that = this;
	                var messageRows = messages[0];
	    			var messageStrips = [];
	    			for (var i=0; i<messageRows.length; i++) {
	    				var messageRow = messageRows[i];
	    				//dönüş tipinde hata varsa launchpade yönlendirme.
	    				if(messageRow.Type=='E'){
	    					action = false;
	    				}	
	    				
	    				var strip = new sap.m.MessageStrip({
	    					text : messageRow.Message,
	    					showIcon : true,
	    					class : "sapUiMediumMarginBottom"
	    				});
	    				switch (messageRow.Type) {
	    				case "E":
	    					strip.setType("Error");
	    					messageTitle = "{i18n>hataBaslik}"
	    					break;
	    				case "S":
	    					strip.setType("Success");
	    					messageTitle = "{i18n>onayBaslik}"
	    					break;
	    				case "I":
	    					strip.setType();
	    					messageTitle = "{i18n>bilgiBaslik}"
	    					break;
	    				case "W":
	    					strip.setType("Warning");
	    					messageTitle = "{i18n>uyariBaslik}"
	    					break;
	    				}
	    				messageStrips.push(strip);
	    			}
	    			
	    			var dialog = new sap.m.Dialog({
	    				title : messageTitle,
	    				content : messageStrips,
	    				beginButton : new sap.m.Button({
	    					text : "{i18n>close}",
	    					press : function(evt) {
	    						dialog.close();
	    	//					that.returnToHomePage(action);
	    					}
	    				}),
	    				afterClose : function() {
	    					dialog.destroy();
	    				}
	    			});
	    			this.getView().addDependent(dialog);
	    			dialog.open();
	    			
	    		}
	});
	
});