Ext.define('SiteManager.view.contactus.ContactusReceivedMessageWindow', {
    extend:'Ext.window.Window',
    alias:'widget.contactusReceivedMessageWindow',
    requires:[
              'Ext.ux.crosseditor.CrosseditorPanel'
          ],
    title:'Reply',
    modal:true,
    height: 800,
    width: 800,
    layout: 'fit',
    initComponent: function() {
        var me = this;
        
        var messageNo = me.messageNo;
        var adminName = me.adminName;
        var adminEmail = me.adminEmail;
        var replyEmail = me.replyEmail;
        var messageContent = me.messageContent;
        
        var lineSeparator = { 
    		xtype: 'box', 
    		autoEl:{ 
    			tag: 'div', 
    			style:'line-height:1px; font-size: 1px;margin-bottom:4px;border-top:1px solid #ccc;' 
    		} 
    	};
        var replyMessage = 'Reply Message<br/><br/><br/><br/><hr />' + messageContent;
        if ('' == messageContent) {
        	replyMessage = 'Reply Message<br/><br/>';
        }
        
        Ext.applyIf(me, {
            items:[
                {
                    xtype:'form',
                    url:'/admin/module/contactus/sendMail.json',
                    border:false,
                    bodyPadding:10,
                    defaults:{
                    	labelWidth:70,
                    	anchor:'100%'
                    },
	                items:[
	                	{
						    xtype	: 'hidden',
						    id		: 'id-contactus-messageNo',
						    name    : 'messageNo',
						    value   : messageNo
	                	},
	                    {
	    				    xtype: 'textfield',
	    				    emptyText:'admin name',
	    				    id: 'id-contactus-adminName',
	    				    fieldLabel: 'Name',
	    				    name: 'adminName',
	    				    value:adminName
	                    },{
	    				    xtype: 'textfield',
	    				    emptyText:'admin email',
	    				    id: 'id-contactus-adminEmail',
	    				    fieldLabel: 'Sender',
	    				    name: 'adminEmail',
	    				    validator: function(value){
	    				    	if('' == value) {
	    				    		Ext.MessageBox.alert($CODE('common.namoWebtree'), 'Email is a required field.');
                	    			return 'Email is a required field.';
	    				    	} else {
	    				    		return true;
	    				    	}
	    				    },
	    				    value:adminEmail
	                    },lineSeparator,{
	    				    xtype: 'displayfield',
	    				    id: 'id-contactus-receiver',
	    				    fieldLabel: 'Receiver',
	    				    name: 'receiver',
	    				    value:replyEmail
	                    },{
						    xtype	: 'hidden',
						    id		: 'id-contactus-replyEmail',
						    name    : 'replyEmail',
						    value   : replyEmail
						},{
	    				    xtype: 'textfield',
	    				    emptyText:'Title',
	    				    id: 'id-contactus-title',
	    				    fieldLabel: 'Title',
	    				    name: 'title'
	                    },{
	                        xtype	:'fieldset',
		                    height	: 550,
		                    layout	: 'hbox',
		                    padding	: 10,
		                    items: [
								{
								    xtype	:'hidden',
								    id		: 'x-pt-sitemanager-contactus-receivedmessagecontent',
								    name	:'replyMessageContent'
								},
								{
								    xtype	:'crosseditorPanel',
								    flex	: 1,
								    height	: 500,
								    margin	: '3 0 3 0',
								    value	: replyMessage,
	                                params: {
	                                    imageSavePath: Pinetree.util.filePathUtil.getProjectResourceComponentPath(__$_pt_currentSiteId, 'module', 'contactus')
	                                }
								}
		                    ]
	                    },{
	                    	buttons:[
                                {
                                    text:'Send',
                                    listeners:{
                                        click:{
                                            fn:function () {
                                                var xForm = this.up('form'),
                                                
                                                form = xForm.getForm();
                                                
                                                Ext.iterate(xForm.query('crosseditorPanel'), function (editor, index, allItems) {
                                                    editor.up('fieldset').down('hidden').setValue(editor.getBodyValue());
                                                });
                                                
                                                if (form.isValid()) {
                                                    form.submit({
                                                    	success:function (form, action) {
                                                    		Ext.MessageBox.alert($CODE('common.namoWebtree'), '메일 발송에 성공했습니다.');
                                                    		
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
                                                				me.close();
                                                			}
                                                        },
                                                        error : function(){
                                        	    			Ext.MessageBox.alert($CODE('common.namoWebtree'), '메일 발송에 실패했습니다. 다시 한번 시도해 주세요.');
                                        	    			return;
                                        	    		}
                                                    });
                                                }
                                            },
                                            buffer:200
                                        }
                                    }
                                },
                                {
                                    text:'Cancel',
                                    listeners:{
                                        click:{
                                            fn:function (btn) {
                                            	Ext.Msg.confirm($CODE('common.namoWebtree'), '메일을 발송하지 않았습니다. 정말 취소하시겠습니까?', function(btn) {
                                            		if(btn=='yes'){
                                            			me.destroy();
                                            		}
                                            	});
                                            },
                                            buffer:200
                                        }
                                    }
                                }
                            ]
	                    }
	                ]
                }
            ]
        });
        
        
        me.callParent(arguments);
    }
});
