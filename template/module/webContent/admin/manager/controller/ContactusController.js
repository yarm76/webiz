Ext.define("SiteManager.controller.contactus.ContactusController", {
    extend: "Ext.app.Controller",
    views : [
        'SiteManager.view.contactus.ContactusSettingPanel'
    ],

    init : function() {
        this.control({
        	'contactusSettingPanel': {
	 			'itemclick': function(type, comp, item){
	        		var mainpanel = Ext.getCmp('x-pt-sitemanager-contactus-container');
	        		mainpanel.componentInfo = item.data;

	 				if(item.data.componentName=='contactus'){
	 					mainpanel.setDisabled(false);
	 					
		                var receivedPanel = mainpanel.down('contactusReceivedMessagePanel');
		                var categoryPanel = receivedPanel.down('contactusCategoryListPanel');
		                
	 					categoryPanel.sitePageNo = item.data.sitePageNo;
	 					categoryPanel.componentId = item.data.componentId;
	 					categoryPanel.doRefresh();
	 					
	 					var store = Ext.getCmp("x-pt-sitemanager-contactus-message-grid").store ;
    		    		store.proxy.extraParams['categoryNo'] = '';
    		    		store.proxy.extraParams['searchContentText'] = '';
    		    		store.load();
    	             	var mgrDetail = Ext.getCmp("x-pt-sitemanager-contactus-contactusMessageDetailPanel");
    	             	mgrDetail.setValue('');

	 				}else{
	 					mainpanel.setDisabled(true);
	 					mainpanel.sitePageNo = null;
					}
	 			}
        	}
        });
    }
});