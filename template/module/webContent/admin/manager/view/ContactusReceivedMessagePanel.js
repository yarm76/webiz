Ext.define('SiteManager.view.contactus.ContactusReceivedMessagePanel', {
    extend: 'Ext.panel.Panel',
    requires: [
	    'SiteManager.view.contactus.ContactusCategoryListPanel',
	    'SiteManager.view.contactus.ContactusMessageListPanel',
	    'SiteManager.view.contactus.ContactusMessageDetailPanel'
    ],
    alias:'widget.contactusReceivedMessagePanel',
    layout:'border',
    split:true,

    initComponent:function () {
        var me = this;
        Ext.applyIf(me, {
        	items: [
                {
                    xtype: 'panel',
                    region:'west',
                    layout:'fit',
                    width:300,
                    
                    id: 'x-pt-siteManager-contactusCategoryListParentPanel',
                    items: [
                        {
                            xtype: 'contactusCategoryListPanel',
                            id:'x-pt-siteManager-contactusCategoryListPanel'
                        }
                    
                    ]
                },
                {
                    xtype: 'panel',
                    layout:'fit',
                    region:'center',
                    flex:1,
                    layout:'border',
                    items:[{
                    	layout:'fit',
                    	region:'center',
                        id: 'x-pt-siteManager-contactusMessageListParentPanel',
                        items: [
                            {
                                xtype: 'contactusMessageListPanel',
                                id: 'x-pt-siteManager-contactusMessageListPanel'
                            }
                        ]
                    },{	
                        layout:'fit',
                        height:300,
                        region:'south',
                        flex:1,
                        id: 'x-pt-siteManager-contactusMessageDetailParentPanel',
                        items: [
                            {
                                xtype: 'contactusMessageDetailPanel',
                                id: 'x-pt-siteManager-contactusMessageDetailPanel'
                            }
                        ]
                    
                    }]
                }
            ]
        });

        me.callParent(arguments);
    }
    
});