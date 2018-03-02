sap.ui.define([
	"sap/ui/prodea/solman/aktivite/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat"
//	"sap/ui/prodea/solman/aktivite/util/Formatter"
], function (BaseController, JSONModel, DateFormat) {
	"use strict";
	
	return BaseController.extend("sap.ui.prodea.solman.aktivite.controller.main", {
		
		onInit: function () {
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("main").attachMatched(this._onRouteMatched, this);
			this.onDanismanProje();
			
			
		},
		_onRouteMatched : function (oEvent) {
			if (oEvent.getParameter("name") !== "main") {
		        return;
		}
			var oView = this.getView();
			
			
		},
		
//		_onObjectMatched: function(oEvent) {
//		      //Bind the Context to Detail View
//		      this.getView().bindElement({
//		        path: "/" + oEvent.getParameter("listItem").editPlanPath,
//		        model: "view"
//		      });
//		    },
		
		setSelectedProject: function(evt){
			var templateModel = sap.ui.getCore().byId("app").getModel("activityList");
			var count;
	//		var countModel = sap.ui.getCore().byId("app").getModel('selectedProjectCount').oData.CountValue["0"].Count;
			var selectedRow = evt.getSource().getParent().getBindingContext("activityList").getObject();
			var selectedUser = selectedRow.Kullanici;
			var selectedProjectForUser = sap.ui.getCore().byId("app").getModel('selectedProjectModel');
			var selectedProperties = evt.getSource().getSelectedItem().getBindingContext("selectedProjectModel").getObject();
			selectedRow.Musteri = selectedProperties.Musteri;
			selectedRow.Proje = selectedProperties.Proje;
			selectedRow.SirketKodu=selectedProperties.SirketKodu;
			selectedRow.Modul=selectedProperties.Modul;
			templateModel.refresh();

//		         if(selectedProjectForUser.oData.ProjectList.length>0){
//		        	selectedProjectForUser.oData.ProjectList = [];
//			 		selectedProjectForUser.refresh();
////		        	 this.onDanismanProje(evt); 
//		        	 
//
//		 			}

		},
		
		
		onLokasyonPress: function(evt){
			var lokasyonObj =  evt.getSource().mProperties;
			var selectedUser = evt.getSource().getParent().getBindingContext("activityList").getObject();
//			selectedUser.Lokasyon = lokasyonObj.value;
			selectedUser.Lokasyon = lokasyonObj.selectedKey;
			var activityModel = sap.ui.getCore().byId("app").getModel('activityList');
			activityModel.refresh();
		},
//		onDanismanProje: function(evt){
//			var selectedProjectForUser = sap.ui.getCore().byId("app").getModel('selectedProjectModel');
//			selectedProjectForUser.oData.ProjectList = [];
//	 		selectedProjectForUser.refresh();			
//			var selectedUser = evt.getSource().getParent().getBindingContext("activityList").getObject().Kullanici;
//
	
//			var requestUri="/UserProjectsSet?$filter=";
//                	requestUri = requestUri + "Kullanici eq '"+selectedUser+"'";
//                	this.getProjectsForUsers(requestUri);
//    
//		},
		
		
		loadFilter: function(evt){
			var selectedProjectForUser = sap.ui.getCore().byId("app").getModel('selectedProjectModel');
			var filterForUser = evt.getSource().getParent().getBindingContext("activityList").getObject().Kullanici;

		    var oBindingComboBox = this.getView().byId("musteriTable").mBindingInfos.items;
//		    var oBindingComboBox = selectedProjectForUser.oData.ProjectList;
		    

		    var aFiltersComboBox = [];
		    var oFilterComboBox = new sap.ui.model.Filter("Danisman", "Contains", filterForUser);
		    aFiltersComboBox.push(oFilterComboBox);
		    oBindingComboBox.filter(aFiltersComboBox);
		},
		
		
		
		onDanismanProje: function(){
			var that = this;
			var requestUri="/UserProjectsSet?$filter=";
			var selectedProjectForUser = sap.ui.getCore().byId("app").getModel('selectedProjectModel');
			selectedProjectForUser.oData.ProjectList = [];
	 		selectedProjectForUser.refresh();			
	 		var selectedUsersModel = sap.ui.getCore().byId("app").getModel("selectedUsersModel");
	 		var danismanV = selectedUsersModel.oData;

			
			
			for(var i = 0, len = danismanV.length; i < len; i++){
//            	if(i == 0){
//                	requestUri = requestUri + " and ( Kullanici eq '"+danismanV[i]+"'";
//            	}
//            	if(i == len -1){
//                	requestUri = requestUri + " or Kullanici eq '"+danismanV[i]+"' )";
//            	}else{
//                	requestUri = requestUri + " or Kullanici eq '"+danismanV[i]+"'";
//            	}
//            	  if (i == len - 1) {
//                  	that.getProjectsForUsers(requestUri)
//                  }
				if(i == 0){
					requestUri = requestUri + "Kullanici eq '"+danismanV[i]+"'" ;
				}
//				if(i == len -1){
//                	requestUri = requestUri + " or Kullanici eq '"+danismanV[i]+"'";
//            	}
				else{
                	requestUri = requestUri + " or Kullanici eq '"+danismanV[i]+"'";
            	}             
            }
			that.getProjectsForUsers(requestUri)
			
			
			
			
//			var requestUri="/UserProjectsSet?$filter=";
//                	requestUri = requestUri + "Kullanici eq '"+selectedUser+"'";
//                	this.getProjectsForUsers(requestUri);
    
		},
		
		dateControll: function(evt){
			var templateModel = sap.ui.getCore().byId("app").getModel("activityList");
			var selectedRowUser = evt.getSource().getParent().getBindingContext("activityList").getObject();
			var selectedUser = selectedRowUser.Kullanici;
			var selectedDate = evt.getParameter("newValue");
			selectedDate = selectedDate.replace(/\//g , "");
			var day = selectedDate.slice(0,2);
			var mouth = selectedDate.slice(2,4);
			var year = selectedDate.slice(4,8);
			selectedDate = year + mouth + day;
			
			// and '"+selectedDate+"' 
			var requestUri="/DateControllSet?$filter=";
			requestUri = requestUri + "Kullanici eq '"+selectedUser+"' and Tarih eq'"+selectedDate+"'";
			this.dateControllForUser(requestUri);
			
			var date = selectedRowUser.Tarih;
			var dayofTheWeek = new Date(date).getDay();
			var days =  ["Pazar","Pazartesi","Sali","Çarşamba","Perşembe","Cuma","Cumartesi"];
			var weekDay =  days[dayofTheWeek];
			selectedRowUser.Gun = weekDay;
			templateModel.refresh();
		},
		
		dateControllForUser: function(requestUri){
			var that = this;
			var dateControllModel = sap.ui.getCore().byId("app").getModel('dateControllModel');
			var oDataModel2 = sap.ui.getCore().getModel('oDataModel2');

			oDataModel2.read(requestUri,
					null,
					null,
					false,
					function(data,response){
					if(data.results.length != 0){
						dateControllModel.getData().DateControllData = data.results;
						
					}else{
						dateControllModel.getData().DateControllData = [];
					}
					dateControllModel.refresh();
//					busyDialog.close()
					
					},
					function(oError){
//						var messages = [];
                        console.log(oError);
//                      messages.push(oError.results);
//          			that.showReturnMessages(messages, true);
//						that.closeDialog();	
                      var result = xmlToJSON.parseString(oError.response.body);
                      var messages = result.error[0].message;
                      that.showServiceErrorMessages(messages, 'E');
					});
		},
		getProjectsForUsers : function(requestUri){
			var that = this;
			var selectedProject = sap.ui.getCore().byId("app").getModel('selectedProjectModel');
			var oDataModel = sap.ui.getCore().getModel('oDataModel');
//			var busyDialog = new sap.m.BusyDialog();
//            that.getView().addDependent(busyDialog);
			oDataModel.read(requestUri,
					null,
					null,
					false,
					function(data,response){
					if(data.results.length != 0){
						selectedProject.getData().ProjectList = data.results;
						selectedProject.oData.ProjectList.unshift(" ");
					}else{
						selectedProject.getData().ProjectList = [];
						errMsg = i18n.getProperty('noItemFound');
						MessageToast.show(errMsg);
					}
					selectedProject.refresh();
//					busyDialog.close()
					
					},
					function(err){
//						busyDialog.close();
						console.log(err);
//						var result = xmlToJSON.parseString(err.response.body);
//                        var messages = result.error[0].message;
//                        that.showServiceErrorMessages(messages, 'E', false);
                        
					});
		},
		
		tableDeleteRow: function(evt){
			var dSwitch = sap.ui.getCore().byId("app").getModel("deleteSwitchModel");
			var theSwitch = dSwitch.oData.dSwitch;
			theSwitch = false;
			dSwitch.refresh();
			var oDataModel2 = sap.ui.getCore().getModel('oDataModel2');
			var templateModel = sap.ui.getCore().byId("app").getModel("activityList");
			var templateItems = templateModel.getData().ActivityList;
			var index = -1;
			var deleteIcon = evt.getSource().getParent().getBindingContext("activityList").getObject();
			var deleteIndex = evt.getSource().getParent().getBindingContext("activityList").getPath();
			var theIndex = deleteIndex.slice(-1);
			index = theIndex;
			
			if(deleteIcon.AktiviteId){						
				deleteIcon.BasSaat = this.timeFormatWithOutDots(deleteIcon.BasSaat);
				deleteIcon.BitSaat = this.timeFormatWithOutDots(deleteIcon.BitSaat);
				deleteIcon.Cputm = this.timeFormatWithOutDots(deleteIcon.Cputm);
				deleteIcon.Erdat = this.dateWithOutDotsFormat((new Date(new Date(deleteIcon.Erdat).getTime())).toLocaleDateString());
				deleteIcon.Plan = "X";
				var dateStr = (deleteIcon.Tarih);
				deleteIcon.Tarih = this.dateWithOutDotsFormat((new Date(new Date(dateStr).getTime())).toLocaleDateString());
	
				var uri = "/DeleteActivitySet('"+deleteIcon.AktiviteId+"')";
				this.deleteActivity(uri, oDataModel2);
			}
			if(!theSwitch){
				return;
			}
			if (index != -1) {
				templateItems.splice(index, 1);
				templateModel.getData().ActivityList = templateItems;
				templateModel.refresh();

            }
			
		},
		
		deleteActivity: function(uri, oDataModel){
			var dSwitch = sap.ui.getCore().byId("app").getModel("deleteSwitchModel");
			var theSwitch = dSwitch.oData.dSwitch;
			var that = this;
            oDataModel.remove(
                    uri,
                    null,
                    function(data, response) {
                    	var messages = [];
                    	if(data.results){
//                    			console.log(response);
                    			messages.push(data.results);
                    			that.showReturnMessages(messages, true);
								that.closeDialog();		
//                        var result = xmlToJSON.parseString(response.body);
//                        var messages = result.error[0].message;
//                        that.showServiceErrorMessages(messages, 'E');
                    	}
                    	else{
                    		that.showMessage(title,noData);
//                    		jsonModel.oData.MaterialList = [];
//                    		jsonModel.refresh();
                    	}
                    },
                    function(oError) {
                    	var messages = [];
                        console.log(oError);
//                        messages.push(oError.results);
//            			that.showReturnMessages(messages, true);
//						that.closeDialog();	
                        var result = xmlToJSON.parseString(oError.response.body);
                        var messages = result.error[0].message;
                        that.showServiceErrorMessages(messages, 'E');
//						controlls the ui prevents delete row if fails!                        
                        theSwitch = true;
                        dSwitch.refresh();
                        
                    });
			
			
			
		},
		timeFormatWithOutDots: function(time){
			if(time){
				var hour = time.slice(2, 4);
				var min =  time.slice(5, 7);
				var sec =  time.slice(8, 10);
			}
			return hour + min + sec;
		},
		
		dateWithOutDotsFormat:  function(time){
			if(time){
				var newTime = time.replace(/\./g, "");
				var day = newTime.slice(0,2);
				var mouth = newTime.slice(2,4);
				var year = newTime.slice(4,8);
				newTime = year + mouth + day
			}
			return newTime;
		},
		
		onPressAddRow : function(){
			var oTable = this.getView().byId("planTemplateTable");
			var oModel = oTable.getModel("activityList").getProperty("/ActivityList");
			var oNewObject = {  
					Aciklama : "",
					AciklamaPlan: "",
					Aktivite : "1",
					AktiviteId : "",
					BasSaat: "PT09H00M00S",
					BitSaat : "PT18H00M00S",
					CalismaSaat : "8.0",
					Cputm : "PT00H00M00S",
					DanismanOrtak : "",
					Departman : "",
					Durum : "",
					Erdat: null,
					Faturalama : "",
					Fiili : "",
					FtrNumber : "",
					Gun : "",
					IlkTarih : null,
					Kullanici: "",
					Lokasyon : "",
					Modul : "",
					Musteri : "",
					Plan : "",
					Proje : "",
					Sehir : "Sehir Ici",
					SirketKodu : "",
					SonTarih : null,
					Tarih : "",
					Tekno : "",
					TicketNo : ""
							  };
			oModel.push(oNewObject);
			oTable.getModel("activityList").setProperty("/ActivityList", oModel);
		},
		
		saveSelectedActivities: function(evt){
//			var dateFormatA = sap.ui.core.format.DateFormat.getDateInstance().oFormatOptions.pattern;
//			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" }); 
//		    var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss a"});
		    var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
//		    var dateStr = dateFormat.format(new Date(FlightDate.getTime() + TZOffsetMs)); //05-12-2012
//		    var parsedDate = new Date(dateFormat.parse(dateStr).getTime() - TZOffsetMs);
			var uri = "/BridgeSet";
			var oDataModel2 = sap.ui.getCore().getModel('oDataModel2');
			var selectedactivities = this.getView().byId("planTemplateTable").getSelectedContexts();
			var obj = {};
			var totalItems = [];
			for(var i=0;selectedactivities.length>i;i++){
				obj = {};
				delete obj['__proto__'];
				obj.AciklamaPlan = selectedactivities[i].getObject().AciklamaPlan;
				obj.Aciklama = selectedactivities[i].getObject().Aciklama;
				obj.Aktivite = selectedactivities[i].getObject().Aktivite;
				obj.AktiviteId = selectedactivities[i].getObject().AktiviteId;			
				obj.BasSaat = this.timeFormatWithOutDots(selectedactivities[i].getObject().BasSaat);
				obj.BitSaat = this.timeFormatWithOutDots(selectedactivities[i].getObject().BitSaat);
				obj.CalismaSaat = selectedactivities[i].getObject().CalismaSaat;
				obj.Cputm = this.timeFormatWithOutDots(selectedactivities[i].getObject().Cputm);
				obj.DanismanOrtak = selectedactivities[i].getObject().DanismanOrtak;
//				obj.Departman = selectedactivities[i].getObject().Departman;
				obj.Durum = selectedactivities[i].getObject().Durum;
				obj.Erdat = this.dateWithOutDotsFormat((new Date(new Date(selectedactivities[i].getObject().Erdat).getTime())).toLocaleDateString());
				obj.Faturalama = selectedactivities[i].getObject().Faturalama;
				obj.Fiili = selectedactivities[i].getObject().Fiili;
				obj.FtrNumber = selectedactivities[i].getObject().FtrNumber;
				obj.Gun = selectedactivities[i].getObject().Gun;
//				obj.IlkTarih = "";
				obj.Kullanici = selectedactivities[i].getObject().Kullanici;
				obj.Lokasyon = selectedactivities[i].getObject().Lokasyon;			///LOkasyon İçin Key Gönder
				obj.Modul = selectedactivities[i].getObject().Modul;
				obj.Musteri = selectedactivities[i].getObject().Musteri;
//				obj.Plan = selectedactivities[i].getObject().Plan;
				obj.Plan = "X";
				obj.Proje = selectedactivities[i].getObject().Proje;
				obj.Sehir = selectedactivities[i].getObject().Sehir;
				var dateStr = (selectedactivities[i].getObject().Tarih);
				obj.Tarih = this.dateWithOutDotsFormat((new Date(new Date(dateStr).getTime())).toLocaleDateString());
				obj.SirketKodu = selectedactivities[i].getObject().SirketKodu;
//				obj.SonTarih = "";
//				obj.Tarih = selectedactivities[i].getObject().Tarih;
				obj.Tekno = selectedactivities[i].getObject().Tekno;
				obj.TicketNo = selectedactivities[i].getObject().TicketNo;
				
				
				totalItems.push(obj);
			}
			this.sendActivitiesData(uri, oDataModel2, totalItems);
		},
		
		
        sendActivitiesData: function(uri, oDataModel, activitiesObj) {
//        	var title = this.getI18nValue("hataBaslik");
//        	var noData = this.getI18nValue("noData");
            var that = this;
            var userData =  {"Kullanici":"Keremci",
            "ActivityList":activitiesObj};
            oDataModel.create(
                    uri,
                    userData,
                    null,
                    function(data, response) {
                    	var messages = [];
                    	if(data.ActivityList.results){
                    			console.log(response);
                    			messages.push(data.ActivityList.results);
                    			that.showReturnMessages(messages, true);
								that.closeDialog();		
//                        var result = xmlToJSON.parseString(response.body);
//                        var messages = result.error[0].message;
//                        that.showServiceErrorMessages(messages, 'S');
                    	}
                    	else{
                    		that.showMessage(title,noData);
//                    		jsonModel.oData.MaterialList = [];
//                    		jsonModel.refresh();
                    	}
                    },
                    function(oError) {
                        console.log(oError);
                        var result = xmlToJSON.parseString(oError.response.body);
                        var messages = result.error[0].message;
                        that.showServiceErrorMessages(messages, 'E');
                    });           
        },
		
		
		
		onListItemPressed : function(evt){
			var editRowPathModel = sap.ui.getCore().byId("app").getModel("editRowPath");
			var detailPlanPath = evt.getSource().getParent().getBindingContext("activityList");
			var detailPlan = detailPlanPath.getObject();
//			var aktivityListModel = sap.ui.getCore().byId("app").getModel("activityList").getProperty(detailPlan);
			var detailModel = sap.ui.getCore().byId("app").getModel("detailModel");
			if(detailPlan){
				detailModel.oData.DetailRow = detailPlan;
				detailModel.refresh();	
			}
			 editRowPathModel.oData.EditRow = detailPlanPath.getPath().substr(1);
			 editRowPathModel.refresh();
			 
				this.getRouter().navTo("detail");
			},
		
		
		
		handleSearch : function(evt) {
			// create model filter
			var filters = [];
			var table = this.getView().byId("employeeTableId");
			var binding = table.getBinding("items");
			var query = evt.getSource().getValue();
			if (query && query.length > 0) {
				binding
						.filter([ new sap.ui.model.Filter(
								[
										new sap.ui.model.Filter(
												"Kullanici",
												sap.ui.model.FilterOperator.Contains,
												query),
										new sap.ui.model.Filter(
												"Modul",
												sap.ui.model.FilterOperator.Contains,
												query) ], false) ]);
			} else {
				binding.filter([]);
			}
		}
//		onItemPressed : function(evt){
//		var detailPlan = evt.getParameter("listItem").getBindingContext("activityList");
//			this.getRouter().navTo("detail");
//		}
	});
});
 