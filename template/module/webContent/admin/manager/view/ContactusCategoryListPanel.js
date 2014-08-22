Ext.define('SiteManager.view.contactus.ContactusCategoryListPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.grid.column.ActionButtonColumn'
    ],
    alias: 'widget.contactusCategoryListPanel',
    title: 'Category',
    autoScroll: true,
    collapsed: false,
    layout: 'fit',

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'grid',
                    id:'id-px-sitemanager-category-gridpanel',
                    store: categoryStore,
        	        autoScroll: true,
        	        hideHeaders: true,
        	        rowLines: false,
                    columns: [
	                    {	xtype:'gridcolumn',
							width:300,
							dataIndex:'categoryTitle'
	                    }
                    ],
                    listeners: {
        	        	cellclick: function(grid, td, cellIndex, record, tr, rowIndex,e){
        		    		var store = Ext.getCmp("x-pt-sitemanager-contactus-message-grid").store ;
        		    		store.proxy.extraParams['categoryNo'] = record.data.categoryNo;
        		    		store.proxy.extraParams['searchContentText'] = '';
        		    		store.load();
        	             	var mgrDetail = Ext.getCmp("x-pt-sitemanager-contactus-contactusMessageDetailPanel");
        	             	mgrDetail.setValue('');
        	        	}
        	        }
                }
            ]
        });

        me.callParent(arguments);
    },
    doRefresh: function(){
    	var grid = Ext.getCmp("id-px-sitemanager-category-gridpanel");
    	var store = grid.getStore();
    	store.proxy.extraParams = {};
    	store.proxy.extraParams['siteId'] = __$_pt_currentSiteId;
    	store.proxy.extraParams['sitePageNo'] = this.sitePageNo;
    	store.load();
    }
});

var categoryStore = Ext.create('Ext.data.Store', {
	fields:[
			{name: 'categoryTitle'},
			{name: 'categoryNo'},
			{name: 'adminName'},
			{name: 'adminEmail'}
		],
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url : '/admin/module/contactus/getCategoryList.json'
		},
		reader: {
			type: 'json',
			root: 'data'
		}
});
