Ext.define('SiteManager.view.Contactus.ContactusMessageDetailPanel', {
    extend:'Ext.panel.Panel',
    alias:'widget.contactusMessageDetailPanel',
	requires: [
	           'Ext.ux.grid.column.ActionButtonColumn'
	    	],
	layout:'border',
	initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
    		items:[{
    			layout:'hbox',
    			region:'north',
    			padding:5,
    			border:false,
    			items:[{
    				xtype:'button',
    				iconCls: 'icon-email',
    				text:'Reply',
    				handler:function(btn){
    					var message = Ext.getCmp("x-pt-sitemanager-contactus-message-grid");
    					if (message.getSelectionModel().getSelection().length > 0) {
    						
    						//var messageNos = message.getSelectionModel().getSelection()[0].data.messageNo;
    						//var replyEmails = message.getSelectionModel().getSelection()[0].data.replyEmail;
    						
    						var messageNo = "";
    						var messageNos = message.getSelectionModel().getSelection();
    						
    						for(var i=0;i<messageNos.length;i++){
    							messageNo += messageNos[i].data.messageNo;
    							if (i!=messageNos.length-1) messageNo += ",";  
							} 
    						
    						var replyEmail = "";
    						var replyEmails = message.getSelectionModel().getSelection();
    						
    						for(var i=0;i<replyEmails.length;i++){
    							replyEmail += replyEmails[i].data.replyEmail;
    							if (i+1%5==0) replyEmail += "</br>";
    							if (i!=replyEmails.length-1) replyEmail += ", ";  
							}
    						
    						if (replyEmail != '') {
    							var gridpanel = Ext.getCmp('id-px-sitemanager-category-gridpanel');
    							
    							var adminName = gridpanel.getSelectionModel().getSelection()[0].data.adminName;
    							var adminEmail = gridpanel.getSelectionModel().getSelection()[0].data.adminEmail;
    							var messageText = Ext.getCmp("x-pt-sitemanager-contactus-contactusMessageDetailPanel"); 
    							if(replyEmails.length>1){ 
    								messageText.setValue(""); 
    							}

    							var win = Ext.create('SiteManager.view.contactus.ContactusReceivedMessageWindow',{
    								"messageNo" : messageNo,
    								"adminName" : adminName,
    								"adminEmail" : adminEmail,
    								"replyEmail" : replyEmail,
    								"messageContent":messageText.getValue()
    							});
    							win.show();
    						} else {
        						Ext.MessageBox.alert($CODE('common.namoWebtree'), '이메일이 존재하지 않습니다.');
            	    			return;
    						}
    					} else {
    						Ext.MessageBox.alert($CODE('common.namoWebtree'), '메세지를 선택해주세요.');
        	    			return;
    					}
    				}
    			},{
    				xtype:'tbfill'
    			},{
    				xtype:'button',
    				text:'Delete',
    				iconCls: 'icon-page-delete',
    				handler:function(btn){
    					Ext.Msg.confirm($CODE('common.namoWebtree'), '선택한 메세지를 삭제 하시겠습니까?', function(btn) {
                    		if(btn=='yes'){
            					var message = Ext.getCmp("x-pt-sitemanager-contactus-message-grid");
            					if (message.getSelectionModel().getSelection().length > 0) {
                					var messageNos = new Array();
                					messageNos.push(message.getSelectionModel().getSelection()[0].data.messageNo);
                					deleteMessages(messageNos);
            					} else {
            						Ext.MessageBox.alert($CODE('common.namoWebtree'), '메세지를 선택해주세요.');
                	    			return;
            					}
                    		}
                    	});

    				}
    			}]
    		},{
    			xtype  : 'panel',
    			region:'center',
    			layout : 'fit',
    			bodyPadding: 10,
    			autoScroll:true,
    			items: [{
    				xtype     : 'displayfield',
    				id        :'x-pt-sitemanager-contactus-contactusMessageDetailPanel',
    				fieldBodyCls: 'align-top',
    				name      : 'messageContent'
    			}]
    		}]
		});
    
        me.callParent(arguments);
    }
     
});

function deleteMessages(messageNos){
	$.ajax({
		url      : '/admin/module/contactus/deleteMessageDatas.json',
		dataType : 'json',
		data     : {
					"messageNos": messageNos
					}, 
		success  : function(data, textStatus){
			var gridpanel = Ext.getCmp('id-px-sitemanager-category-gridpanel');
			if (gridpanel.getSelectionModel().getSelection().length > 0) {
				var categoryNo = gridpanel.getSelectionModel().getSelection()[0].data.categoryNo;
				var searchContentText = Ext.getCmp('x-search-searchContentText').getValue();                                                    		
				var store = Ext.getCmp("x-pt-sitemanager-contactus-message-grid").store ;
				store.proxy.extraParams['categoryNo'] = categoryNo;
				store.proxy.extraParams['searchContentText'] = encodeURIComponent(searchContentText);
				store.load();
             	var mgrDetail = Ext.getCmp("x-pt-sitemanager-contactus-contactusMessageDetailPanel");
             	mgrDetail.setValue('');
			}
		},
        failure : function(){
 			Ext.MessageBox.alert($CODE('common.namoWebtree'), 'delete failed');
 			return;
 		}
	});
}
