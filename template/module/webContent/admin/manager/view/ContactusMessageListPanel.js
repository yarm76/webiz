Ext.define('SiteManager.view.Contactus.ContactusMessageListPanel', {
    extend:'Ext.panel.Panel',
    alias:'widget.contactusMessageListPanel',
	requires: [
	           'Ext.grid.*',
	           'Ext.ux.grid.column.ActionButtonColumn'
	    	],
    layout:'fit',
	initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
        	items:[{
        		region:'center',
        		title:'메세지 검색 결과',
				style:'padding: 0px 0px 0px 0px',
				layout:{
					type:'vbox',
					align:'stretch'
				},
        		items:[{
	        		xtype:'panel',
        			layout:'hbox',
        			padding:10,
					width:300,
					border:false,
        			items:[{
        				xtype:'button',
        				iconCls: 'icon-page-delete',
        				text:'DELETE',
        				handler:function(btn){
                        	Ext.Msg.confirm($CODE('common.namoWebtree'), '선택한 메세지를 삭제 하시겠습니까?', function(btn) {
                        		if(btn=='yes'){
                        			var messageNos = new Array();
                					var records = Ext.getCmp('x-pt-sitemanager-contactus-message-grid').getSelectionModel().getSelection();
                					if (records.length > 0) {
                						for(var i=0;i<records.length;i++){
                							messageNos.push(records[i].data.messageNo);
                						}
                						deleteMessages(messageNos);
                					} else {
                    					Ext.MessageBox.alert($CODE('common.namoWebtree'), '메세지를 선택해주세요.');
                    	    			return;
                					}
                        		}
                        	});
        				}
        			},{
        				xtype:'tbfill'
        			},{
        				xtype:'container',
        				layout:'hbox',
        				items:[
        				{
							xtype:'textfield',
							width:250,
							id: 'x-search-searchContentText',
							emptyText:'메세지 내용을 입력하세요',
							name:'searchContentText'
						},
        				{
        					width:5,
        					border:false
        				},
        				{
        					xtype:'button',
        					width:60,
        					text:'SEARCH',
        					handler:function(btn){
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
        					}
        				}]
        			}]
        		},{
					xtype:'panel',
					flex:1,
					layout:'fit',
					border: false,
					items:[{
						xtype:'container',
						flex:1,
						layout:'fit',
						anchor:'100%',
						items:[{
							xtype:'grid',
							id:'x-pt-sitemanager-contactus-message-grid',
							store: messageListStore,
							columns:[
								{
									xtype:'gridcolumn',
									sortable:false,
									hideable:true,
									width:5,
									dataIndex:'messageNo'
								},
								{
									xtype:'gridcolumn',
									text:'No',
									sortable:false,
									hideable:false,
									width:40,
									dataIndex:'messageNo'
								},
								{
									xtype:'gridcolumn',
									text:'Form',
									sortable:false,
									hideable:false,
									width:150,
									dataIndex:'formTitle'
								},							         
								{
									xtype:'gridcolumn',
									text:'Category',
									sortable:false,
									hideable:false,
									width:150,
									dataIndex:'extCategoryName'
								},
								{
									xtype:'gridcolumn',
									sortable:false,
									hideable:false,
									width:200,
									text:'Received Date',
									dataIndex:'regDateStr'
								},
								{
									xtype:'gridcolumn',
									sortable:false,
									hideable:false,
									width:150,
									text:'Reply',
									dataIndex:'replyYnStr'
								},
								{
									xtype:'gridcolumn',
									sortable:false,
									hideable:false,
									text:'Email',
									flex:1,
									dataIndex:'replyEmail'
								}
							],
							listeners: {
		        	        	cellclick: function(grid, td, cellIndex, record, tr, rowIndex,e){
		                			Ext.Ajax.request({
		                	            method: 'POST',
		                	            url: '/admin/module/contactus/getMessageDetail.json',
		                	    		datatype : 'json',
		                	            params: {
		                	            	messageNo : record.data.messageNo
		                	            },
		                	            success: function (result) {
		                	            	var value = result.responseText;
		 				                	var mgrDetail = Ext.getCmp("x-pt-sitemanager-contactus-contactusMessageDetailPanel");
		 				                	mgrDetail.setValue(value);
		                	            },
		                	    		error : function(){
		                	    			Ext.MessageBox.alert($CODE('common.namoWebtree'), 'search failed');
		                	    			return;
		                	    		}
		                	        });
		        	        	}
		        	        },
							viewConfig:{
								listeners:{
									itemdblclick:function (dataview, record, item, index, e) {
									}
								}
							},
					        selModel:Ext.create('Ext.selection.CheckboxModel', {
					        }),
							dockedItems:[
								{
									xtype:'pagingtoolbar',
									displayInfo:true,
									store:messageListStore,
									dock:'bottom'
								}
							]
						}]					
					}]
				}]
			}]
		});
    
        me.callParent(arguments);
    }	
     
});

var messageListStore = Ext.create('Ext.data.Store',{
	fields:[
			{name: 'messageNo'},
			{name: 'extCategoryName'},
			{name: 'formTitle'},
			{name: 'regDateStr'},
			{name: 'replyYnStr'},
			{name: 'replyEmail'}
		],
		pageSize: 10000000,
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url : '/admin/module/contactus/getContactusMessageList.json',
			reader: {
				type: 'json',
				root: 'data'
			}
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
