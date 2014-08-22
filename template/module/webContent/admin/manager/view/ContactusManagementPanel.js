Ext.define('SiteManager.view.contactus.ContactusManagementPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
	    'SiteManager.view.contactus.ContactusReceivedMessagePanel'
    ],
    alias:'widget.contactusManagementPanel',
    initComponent:function () {
        var me = this;
        Ext.applyIf(me, {
            items:[
                {
                    xtype:'tabpanel',
                    id: 'x-pt-sitemanager-contactus-contactusManagementTabPanel',
                    activeTab: 0,
                    layout: 'fit',
                    border: 0,
                    items:[
                        {
                            xtype:'contactusReceivedMessagePanel',
                            title:'Received Message'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
    
});