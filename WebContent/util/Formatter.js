jQuery.sap.declare("sap.ui.prodea.solman.aktivite.util.Formatter");

jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.prodea.solman.aktivite.util.Formatter = {

	dateFormatter : function(date) {
		if (date) {
			var year = date.substring(0, 4);
			var month = date.substring(4, 6);
			var day = date.substring(6, 8);
			return day + "." + month + "." + year;
		}
	},
	
	dateFormatterOnlyDate : function() {
		if (date) {
			var year = date.substring(0, 4);
			var month = date.substring(4, 6);
			var day = date.substring(6, 8);
			return day +  month +  year;
		}
	},
	
	timeFormatter : function(time) {
		if (time) {
			var hour = time.substring(0, 2);
			var min = time.substring(2, 4);
			var seconds = time.substring(4, 8);
			return hour + ":" + min + ":" + seconds;
		}
	},
	
	charFormatter : function(char){
		var charLength;
		if (char) {
			charLength = char.length;
			var firstChar = char.substring(0,1)
			var restChar = char.substring(1,charLength).toLowerCase();
			
			return firstChar + restChar;
		}
		else{
			return char="";
		}
		
	},
	quantity : function(value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	}
};