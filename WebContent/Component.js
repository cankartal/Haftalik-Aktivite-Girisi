jQuery.sap.declare("sap.ui.prodea.solman.aktivite.Component");
sap.ui.define(
				[ "sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel" ,"sap/ui/model/resource/ResourceModel","sap/ui/Device"],
				function(UIComponent, JSONModel, ResourceModel, Device) {
					sap.ui.core.UIComponent
							.extend(
									"sap.ui.prodea.solman.aktivite.Component",
									{

										metadata : {
											"routing" : {
												"config" : {
													"routerClass" : "sap.m.routing.Router",
													"viewType" : "XML",
													"viewPath" : "sap.ui.prodea.solman.aktivite.view",
													"controlId" : "app",
													"controlAggregation" : "pages"
												},
												"routes" : [
														{
															"pattern" : "",
															"name" : "selection",
															"target" : "selection"
														},
														{
															"pattern" : "main",
															"name" : "main",
															"target" : "main"
														},
														{
															"pattern" : "mainlist/aktivitelistesi",
															"name" : "mainlist",
															"target" : "mainlist"
														},
														{
															"pattern" : "detail/ayrinntili",
															"name" : "detail",
															"target" : "detail"
														}],
												"targets" : {
													"selection" : {
														"viewName" : "selection",
														"viewLevel" : 1
													},
													"main" : {
														"viewName" : "main",
														"viewLevel" : 2
													},
													"mainlist" : {
														"viewName" : "mainlist",
														"viewLevel" : 2
													},
													"detail" : {
														"viewName" : "detail",
														"viewLevel" : 3
													}
												}
											}
										},

										init : function() {
											UIComponent.prototype.init.apply(
													this, arguments);
											
											this.getRouter().initialize();										
										},

										createContent : function() {

											// create root view
											var oView = sap.ui.view({
														id : "app",
														viewName : "sap.ui.prodea.solman.aktivite.view.app",
														type : "XML",
														viewData : {
															component : this
														}
													});
											// set i18n model on view
										    var i18nModel = new ResourceModel({
										       bundleName: "sap.ui.prodea.solman.aktivite.i18n.i18n"
										    });
										    oView.setModel(i18nModel, "i18n");
										    
										    // set which radio button selected
										    
										    var radioButtonModel = new sap.ui.model.json.JSONModel({
										    	danisman:  true,
										    	proje:	   true,
										    	musteri:   true,
										    	modul:     true,
										    	departman: true,
										    	lokasyon:  true,
										    	konu:	   true,
										    	iDanisman: true,
										    	gun:	   true,
										    	tarih:     true,
										    	basSaat:   true,
										    	bitSaat:   true,
										    	cSaat:     true,
										    	demandPopin: false
										    	
										    	 
										    					
										    });
										    oView.setModel(radioButtonModel,"radioModel");
										    
											// set device model
											var deviceModel = new sap.ui.model.json.JSONModel(
													{
														isPhone : jQuery.device.is.phone,
														isNoPhone : !jQuery.device.is.phone,
														listMode : (jQuery.device.is.phone) ? "None"
																: "SingleSelectMaster",
														listItemType : (jQuery.device.is.phone) ? "Active"
																: "Inactive",
														hideColumns: (jQuery.device.is.phone) ? true
																: false 
													});
											deviceModel.setDefaultBindingMode("OneWay");
											oView.setModel(deviceModel, "device");

											this.getSearchHelpData();
											
											// done
											return oView;
										},

										getSearchHelpData : function() {														
											var uri = "";
											//*ofis dışı URI Bağlantısı//											
//										    var oDataModel = new sap.ui.model.odata.ODataModel("proxy/http/212.156.48.162:8443/sap/opu/odata/sap/ZAKT_HAFTALIK_PLAN_SRV/");//																		          	
											var requestUri = "/sap/opu/odata/sap/ZAKT_SOLMAN_ORTAK_SRV";
											var requestUriLogin = "/sap/opu/odata/sap/ZAKT_AKTIVITE_PLAN_SRV/";
											var oDataModel = new sap.ui.model.odata.ODataModel(
													requestUri, false);
											sap.ui.getCore().setModel(oDataModel, 'oDataModel');
											var oDataModel2 = new sap.ui.model.odata.ODataModel(
													requestUriLogin, false);
											sap.ui.getCore().setModel(oDataModel2, 'oDataModel2');
//																this.setModel(oDataModel, "consultantOData");
											var danismanModel = new sap.ui.model.json.JSONModel({
												
											});
											var projectModel = new sap.ui.model.json.JSONModel({
												
											});
											var moduleModel = new sap.ui.model.json.JSONModel({
												
											});
											var musteriModel = new sap.ui.model.json.JSONModel({
												
											});
											var departmanModel = new sap.ui.model.json.JSONModel({
												
											});
											var sirketModel = new sap.ui.model.json.JSONModel({
												
											});
											
											
											var oActivityModel = new sap.ui.model.json.JSONModel({
												ActivityList: []
											});
                                            
											this.setModel(oActivityModel, "activityList");
											oActivityModel.setSizeLimit(99999);
											//danisman Data
											danismanModel.setSizeLimit(99999);
											this.setModel(danismanModel, "danismanModel");
											
											var userNameUri="/UserListSet";
										
											this.getData(userNameUri, danismanModel, oDataModel);
											//DateControll Model For Valid Dates
											 var dateControllModel = new sap.ui.model.json.JSONModel({
												 DateControllData: []
												});
											this.setModel(dateControllModel, "dateControllModel");
											//delete Switch For Temp Data or Database Data
											 var deleteSwitchModel = new sap.ui.model.json.JSONModel({
											    	dSwitch: false
												});
											this.setModel(deleteSwitchModel, "deleteSwitchModel");
											///project Data
											this.setModel(projectModel, "projectModel");
											projectModel.setSizeLimit(99999);
											var projectUri="/ProjectListSet";
											
											this.getData(projectUri, projectModel, oDataModel);
											//module Data
											this.setModel(moduleModel, "moduleModel");
											moduleModel.setSizeLimit(99999);
											
											var moduleUri="/ModuleListSet";
											
											this.getData(moduleUri, moduleModel, oDataModel);
											//müşteri data
											this.setModel(musteriModel, "musteriModel");
											musteriModel.setSizeLimit(99999);
											var  musteriUri ="/CustomerListSet";
											
											this.getData(musteriUri, musteriModel, oDataModel);
											//departman Data
											this.setModel(departmanModel, "departmanModel");
											departmanModel.setSizeLimit(99999);
											var departmanUri="/DepartmentListSet";
											this.getData(departmanUri, departmanModel, oDataModel);
											//sirket Data
											this.setModel(sirketModel, "sirketModel");
											sirketModel.setSizeLimit(99999);
											var sirketUri="/CompanyNameSet";
											
											this.getData(sirketUri, sirketModel, oDataModel);
											
											var oFilterModel = new sap.ui.model.json.JSONModel({
												filterValues: {}
											})
											this.setModel(oFilterModel, "filterList");
											
					
										
											var loginJsonModel = new sap.ui.model.json.JSONModel({});
											
											var loginUri = "/UserInfoSet"
										    this.getData(loginUri, loginJsonModel, oDataModel2);
										    this.setModel(loginJsonModel, "loginInfo");
										    var detailModel = new sap.ui.model.json.JSONModel({
										    	DetailRow : {}
										    });
										    this.setModel(detailModel, "detailModel");
										    
										    var selectedUsersModel = new sap.ui.model.json.JSONModel({
										    	
											});
										    
										    this.setModel(selectedUsersModel, "selectedUsersModel");
										    
										    var selectedProjectModel = new sap.ui.model.json.JSONModel({
										    	ProjectList: []
											}); 
										    this.setModel(selectedProjectModel, "selectedProjectModel");
										    
										    var editRowPath = new sap.ui.model.json.JSONModel({
										    	EditRow : {}
											});
										    
										    this.setModel(editRowPath, "editRowPath");
										    
										    var lokasyonModel = new sap.ui.model.json.JSONModel({
										    	LokasyonList: [{LokasyonT: "",
							    								Lokasyon: ""},
										    	               {LokasyonT: "Müşteri Ofisi",
										    					Lokasyon: "A"},
										    	               {LokasyonT: "Merkez Ofis",
										    					Lokasyon: "B"	},
										    	               {LokasyonT: "Home Ofis",
										    					Lokasyon: "C"	},
										    	               {LokasyonT: "Gebze Ofis",
										    					Lokasyon:	"D"	}]
											});
										    this.setModel(lokasyonModel, "lokasyonModel");
										    
										    var sehirModel = new sap.ui.model.json.JSONModel({
										    	SehirList: [{Sehir: "Sehir Ici"},
										    	               {Sehir: "Sehir Disi"},
										    	               {Sehir: "Yurt Disi"}]
											});
										    this.setModel(sehirModel, "sehirModel");
										    
										    var visibleModel = new sap.ui.model.json.JSONModel({
										    	visValueExp:"Navigation",
										    	visValueExpPlan:"Navigation"
											});
										    this.setModel(visibleModel, "visibleModel");
										    var activityTypeModel = new sap.ui.model.json.JSONModel({
										    	
											}); 
										    this.setModel(activityTypeModel, "activityTypeModel");
										    var activityTypeUri="/ActivityTypeListSet";
										    this.getData(activityTypeUri, activityTypeModel, oDataModel);
										},
										getData : function(uri, jsonModel, oDataModel) {
											oDataModel.read(
															uri,
															null,
															null,
															false,
															function(data,
																	response) {
																jsonModel.oData.dataList =data.results;
																jsonModel.refresh();

															},
															function(oError) {
																console
																		.log(oError);
															})
										},
										remove_duplicates: function(arr) {
											return arr.sort().filter(function(item, pos, ary) {
										        return !pos || item != ary[pos - 1];
										    })	
										},
//										
										
										setCustomerList: function(){
											var jsonModel = new sap.ui.model.json.JSONModel();
											
											var uri = "/MusteriKeySet";
											
											//*ofis dışı URI Bağlantısı//											
//										    var oDataModel = new sap.ui.model.odata.ODataModel("proxy/http/212.156.48.162:8443/sap/opu/odata/sap/ZAKT_HAFTALIK_PLAN_SRV/");//																		          	
											var requestUri = "/sap/opu/odata/sap/ZAKT_HAFTALIK_PLAN_SRV/";
											
											var oDataModel = new sap.ui.model.odata.ODataModel(
													requestUri, false);											
											this.getData(uri, jsonModel, oDataModel);
											
											if(jsonModel.oData){
												return jsonModel.oData;	
											}else{
												jsonModel;
											}												
																					
										},
										
										removeDuplicateFromCustomerList: function(json_all){
											   var arr = [],
										        collection = [];
										    
										    $.each(json_all, function (index, value) {
										        if ($.inArray(value.Musteri, arr) == -1) {
										            arr.push(value.Musteri);
										            collection.push(value);
										        }
										    });
										    return collection;											
										}
									});
				});
