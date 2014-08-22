Ext.define('SiteManager.view.contactus.ContactusSettingPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'SiteManager.view.contactus.ContactusManagementPanel',
        'SiteManager.view.common.CommonSiteMapTree'
    ],
    layout: {
        type: 'border'
    },
    bodyStyle: 'background: white;',
    title:'Contact Us Settings',
    alias:'widget.contactusSettingPanel',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items:[
                {
	                xtype: 'commonSiteMapTree',
	                width: 250,
	                notShowButton: true,
	                region:'west',
                    margin: '3 3 3 3',
	                componentFilters: [{
                    	text: 'Contact Us',
                    	value: 'contactus'
                    }]
	            },{
	                xtype:'contactusManagementPanel',
                    disabled: true,
	                id: 'x-pt-sitemanager-contactus-container',
                    margin: '3 3 3 3',
	                region: 'center',
	                layout:'fit'
                }
            ]
        });
        me.callParent(arguments);
    }
});