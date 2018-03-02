sap.ui.define(
				[ "sap/ui/prodea/solman/aktivite/controller/BaseController",
						'sap/ui/model/ValidateException', 'sap/m/ComboBox',

				],
				function(BaseController, ValidateException, ComboBox) {
					"use strict";
					return BaseController.extend(
									"sap.ui.prodea.solman.aktivite.controller.selection",
									{
										onInit : function() {
											var oView = this.getView();
//											var fragmentView = sap.ui.getCore();
											var basTarih = oView.byId("baslangicTarih");
											var bitisTarih = oView.byId("bitisTarih");
											var loginModel = sap.ui.getCore().byId("app").getModel("loginInfo");
											basTarih.setValue(loginModel.oData.dataList["0"]["IlkTarih"]);
											bitisTarih.setValue(loginModel.oData.dataList["0"]["SonTarih"]);
											this.checkForAutor();
										},
										planInitialAktivies : function(){
											var pPlan = '';
											var aktivityModel = sap.ui.getCore().byId("app").getModel("activityList");
											var visibleModel = sap.ui.getCore().byId("app").getModel("visibleModel");
											var aktivite = '';
											var onayli= '';
											var onaysiz = '';
											var tumu = '';
											var loginModel = sap.ui.getCore().byId("app").getModel("loginInfo");
											var oView = this.getView();
											var radioButtonGroup = oView.byId("radioButtonGroup").getSelectedIndex();
											
											if(radioButtonGroup==0){
												
												onayli = 'O';
											}
											if(radioButtonGroup==1){
												onaysiz = ' ';
											}
											if(radioButtonGroup==2){
												tumu = '';
											}
											var danismanV = oView.byId("danismanSelection").getValue();
											var date1 = oView.byId("baslangicTarih").getDateValue();
											var date2 = oView.byId("bitisTarih").getDateValue();
											var dateHigh = (date1 > date2) ? new Date(date1) : new Date(date2);
								        	var dateLow = (date1 > date2) ? new Date(date2) : new Date(date1);	
								        	dateHigh = dateHigh.toJSON().slice(0, -5);	
								        	dateLow = dateLow.toJSON().slice(0, -5);
											var requestUri= "PlanActivitySet?$filter=Tarih2 le datetime'"+dateHigh+"' and Tarih1 ge datetime'"+dateLow+"' ";
											requestUri = requestUri + " and Kullanici eq '"+danismanV+"' and Plan eq '"+pPlan+"'";
											requestUri = requestUri + " and Onayli eq '"+onayli+"' and Onaysiz eq '"+onaysiz+"' and Tumu eq '" +tumu+"' and Aktivite eq '"+aktivite+"'";
											this.getAktivities(requestUri);
											if (aktivityModel.oData.ActivityList.length > 0) {
												visibleModel.oData.visValueExpPlan = "Inactive";
												visibleModel.oData.visValueExp = "Navigation";
												visibleModel.refresh();
												this.getRouter().navTo("main");
											}
											
										},
										
										checkForAutor : function(){
											var oView = this.getView();
											var loginModel = sap.ui.getCore().byId("app").getModel("loginInfo");
											if(loginModel.oData.dataList["0"]["GvYetki"]=='X'){
												oView.byId("createPlanButton").setEnabled(true);
											}
											else{
												oView.byId("danismanSelection").setEnabled(false);
												oView.byId("danismanSelection").setValue(loginModel.oData.dataList["0"]["Danisman"]);
											}
										},
										
										onSelectRadioButton : function(evt) {
											var oView = this.getView();
											var index = evt.getParameter("selectedIndex");
											if (index == 0) {
												
											}
											if (index == 1) {
												
											}
											if (index == 2) {
												
											}
											
										},
										dateValidate : function() {
											
										},
										//////////////////Open PopUp//////////////////////
										createAktivity : function(){
											
											var dialog = this._getDialog();
											
										},
										
										
										_getDialog : function () {
									         if (! this._oDialog) {
									            this._oDialog = sap.ui.xmlfragment("sap.ui.prodea.solman.aktivite.fragment.createPlan",this);
									            this.getView().addDependent(this._oDialog);
									            var loginModel = sap.ui.getCore().byId("app").getModel("loginInfo");
									            var formBitisTarih = sap.ui.getCore().byId("formBitisTarih");
												var formBaslangicTarih = sap.ui.getCore().byId("formBaslangicTarih");
												formBaslangicTarih.setValue(loginModel.oData.dataList["0"]["BasTarih"]);
												formBitisTarih.setValue(loginModel.oData.dataList["0"]["BitTarih"]);
									            
									         }
									         this.getView().addDependent(this._oDialog);
									         this._oDialog.open();				         
									      },
									      
									      afterClose: function() {
												dialog.destroy();
										  },
											
									      onExitFragment : function () {
												if (this._oDialog) {																
													this._oDialog.close();
												}
											},
										////////////////////////Opem PopUp END/////////////////////////////
										checkTekno: function(){
											var isChecked = sap.ui.getCore().byId("tekno").getSelected();
											var checkV = '';
											if(isChecked){
												checkV = 'X';
												
											}else{
												checkV = '';
											}
											return checkV;
										},
										
										
										onSaveAktivity: function(){
											var oView = this.getView();
											var resourceModel = oView.getModel('i18n');
											var errorTitle =  resourceModel.getProperty('errorTitle');
						                    var danismanError = resourceModel.getProperty('danismanAlani');
											var selectedUsersModel = sap.ui.getCore().byId("app").getModel("selectedUsersModel");
											var visibleModel = sap.ui.getCore().byId("app").getModel("visibleModel");
											var that= this;
//											var requestUri = "/sap/opu/odata/sap/ZAKT_AKTIVITE_PLAN_SRV/";
//											var oDataModel = new sap.ui.model.odata.ODataModel(
//									                requestUri, false);
											var aktivityModel = sap.ui.getCore().byId("app").getModel("activityList");
											
											var sirketV = sap.ui.getCore().byId("sirketName").getValue();
											var danismanV = sap.ui.getCore().byId("danisman").getSelectedKeys();
											selectedUsersModel.oData = danismanV;	//get seleceted Users
											selectedUsersModel.refresh();			// refresh selected users for projects
											var projeV = sap.ui.getCore().byId("proje").getValue();
											var departmanV = sap.ui.getCore().byId("departman").getValue();
											var moduleV = sap.ui.getCore().byId("module").getValue();
											var musteriV = sap.ui.getCore().byId("musteri").getValue();
											var date1 = sap.ui.getCore().byId("formBaslangicTarih").getDateValue();
											var date2 = sap.ui.getCore().byId("formBitisTarih").getDateValue();
											var isTekno = this.checkTekno();
											var pPlan = 'X';
											
											if(danismanV.length == 0){
												this.showMessage(errorTitle,danismanError);
												return
											}
											
											var dateHigh = (date1 > date2) ? new Date(date1) : new Date(date2);
								        	var dateLow = (date1 > date2) ? new Date(date2) : new Date(date1);	
								        	dateHigh = dateHigh.toJSON().slice(0, -5);	
								        	dateLow = dateLow.toJSON().slice(0, -5);
											var requestUri= "ItemSet?$filter=SonTarih le datetime'"+dateHigh+"' and IlkTarih ge datetime'"+dateLow+"' ";
											
											var uriCreateor = function(value, name, uri) {
								                if (value) {
								                    if (requestUri.slice(-1) == "=") {
								                        requestUri = uri + name + " eq '" + value + "'";
								                    } else {
								                        requestUri = uri + " and " + name + " eq '" + value + "'";
								                    }
								                }
								            }

								            var param = [{
								                name: 'SirketKodu',
								                val: sirketV
								            }, {
								                name: 'Proje',
								                val: projeV
								            }, {
								                name: 'Departman',
								                val: departmanV
								            }, {
								                name: 'Modul',
								                val: moduleV
								            }, {
								                name: 'Musteri',
								                val: musteriV
								            }, {
								            	name: 'Tekno',
								            	val: isTekno
								            }
								            , {
								            	name: 'Plan',
								            	val: pPlan
								            }];

								            for (var i = 0, len = param.length; i < len; i++) {
								                uriCreateor(param[i].val, param[i].name, requestUri);
								            }

								          
//								            for(var i = 0, len = werks.length; i < len; i++){
//								            	if(i == 0){
//								                	requestUri = requestUri + " and ( Werks eq '"+werks[i]+"'";
//								            	}
//								            	if(i == len -1){
//								                	requestUri = requestUri + " or Werks eq '"+werks[i]+"' )";
//								            	}else{
//								                	requestUri = requestUri + " or Werks eq '"+werks[i]+"'";
//								            	}
//								            }
								            
								            for(var i = 0, len = danismanV.length; i < len; i++){
								            	if(i == 0){
								                	requestUri = requestUri + " and ( Kullanici eq '"+danismanV[i]+"'";
								            	}
								            	if(i == len -1){
								                	requestUri = requestUri + " or Kullanici eq '"+danismanV[i]+"' )";
								            	}else{
								                	requestUri = requestUri + " or Kullanici eq '"+danismanV[i]+"'";
								            	}
								            	  if (i == len - 1) {
								                  	that.getAktivities(requestUri)
								                  }
								            }

											
								            if (aktivityModel.oData.ActivityList.length > 0) {
								            	visibleModel.oData.visValueExpPlan = "Navigation";
												visibleModel.oData.visValueExp = "Inactive";
												visibleModel.refresh();
												this.getRouter().navTo("main");
											}
											
								            

											
										},
										
										getAktivities:function(uri){
									        	var oDataModel2 = sap.ui.getCore().getModel('oDataModel2');
									        	var oActivityModel = this.getView().getModel('activityList');
									        	var errMsg = "";
									            var i18n = this.getView().getModel('i18n');
									        	var that = this;
									        	var title = "Uyarı";
//									        	var busyDialog = new sap.m.BusyDialog();
//									            that.getView().addDependent(busyDialog);
//									            busyDialog.open();
									            oDataModel2.read(uri,
														null,
														null,
														false,
														function(data,response){
									            		var messages = [];
														if(data.results.length>0){
															console.log(response);
//							                    			messages.push(data.results);
//							                    			that.showReturnMessages(messages, true);
//															that.closeDialog();
															oActivityModel.getData().ActivityList = data.results;
														}else{
															 var result = xmlToJSON.parseString(response.body);
										                        var messages = result.error[0].message;
										                        that.showServiceErrorMessages(messages, 'E');
														}
														oActivityModel.refresh();
//														busyDialog.close();
														},
														function(err){
//															 console.log(oError);
									                        var result = xmlToJSON.parseString(err.response.body);
									                        var messages = result.error[0].message;
									                        that.showServiceErrorMessages(messages, 'E');
									                        
														});
									        	
									        	
									        },
									
										clearAllFilters : function() {

											this.getView().byId("musteriId")
													.setValue();
											this.getView().byId("sirketName")
													.setValue();
											this.getView().byId("proje")
													.setValue();
											this.getView().byId("modul")
													.setValue();
											this.getView().byId("danisman")
													.setValue();
											this.getView().byId("departman")
													.setValue();
										}
									});
				});
