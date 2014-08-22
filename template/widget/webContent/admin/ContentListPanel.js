Ext.define('Component.widget.wcontent.admin.ContentListPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.contentListPanel',
    border: false,
    bodyStyle: 'background: white;',

    layout:{
        type:'vbox',
        align: 'stretch'
    },
    requires: [
        'Component.widget.wcontent.admin.SiteContentsConfigStore',
        'Ext.ux.LinkButton',
        'Ext.ux.grid.column.Component',
        'Ext.ux.form.SearchFieldUx'
    ],
    groupId: 0,

    initComponent: function () {
        var me = this;

        var store = Ext.create('Component.widget.wcontent.admin.SiteContentsConfigStore');
        store.proxy.extraParams['groupNo'] = me.groupId;
        store.load();
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    margin: '6 2 2 2',
                    border: false,
                    height: 30,
                    items:[
                        {
                            xtype: 'combobox',
                            name: 'searchField',
                            fieldLabel: '',
                            width: 120,
                            store: Ext.create('Ext.data.Store',{
                                fields:['text', 'value'],
                                data:[
                                    {text: $CODE('wcontent.title'), value: 'title'},
                                    {text: $CODE('wcontent.body'), value: 'body'},
                                    {text: $CODE('wcontent.titleBody'), value: 'titleBody'}
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'text',
                            valueField: 'value',
                            value: 'title',
                            listeners:{
                                change: function(cbo, newvalue, oldvalue){
                                    me.changeSearchField(me, oldvalue, newvalue);
                                }
                            }
                        },{
                            xtype: 'searchfieldux',
                            margin: '0 0 0 2',
                            store: store,
                            width: 200,
                            listeners: {
                                beforesearch: function (searchfield) {
                                    if (searchfield.store != null) {
                                        var cbo = me.down('combobox[name=searchField]');
                                        searchfield.store.proxy.extraParams['searchField'] = cbo.getValue();
                                    }

                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'gridpanel',
                    border: true,
                    style: 'border-left: 0px;',
                    margin: '2 2 2 2',
                    flex: 1,
                    store: store,
                    columns:[
                        {
                            xtype:'gridcolumn',
                            dataIndex:'contentsStatus',
                            sortable:false,
                            hideable:false,
                            width:100,
                            text: $CODE('wcontent.status'),
                            render:{

                            }
                        },
                        {
                            xtype:'gridcolumn',
                            dataIndex:'contentsTitle',
                            sortable:false,
                            hideable:false,
                            width: 150,
                            text: $CODE('wcontent.title')
                        },
                        {
                            xtype:'gridcolumn',
                            dataIndex:'regUserName',
                            sortable:false,
                            hideable:false,
                            width: 120,
                            text: $CODE('wcontent.createBy')
                        },
                        {
                            xtype:'gridcolumn',
                            dataIndex:'regDate',
                            sortable:false,
                            hideable:false,
                            width: 100,
                            text: $CODE('wcontent.createDate')
                        },
                        {
                            xtype:'gridcolumn',
                            dataIndex:'modUserName',
                            sortable:false,
                            hideable:false,
                            width: 120,
                            text: $CODE('wcontent.modifyBy')
                        },
                        {
                            xtype:'gridcolumn',
                            dataIndex:'modDate',
                            sortable:false,
                            hideable:false,
                            width: 100,
                            text: $CODE('wcontent.modifyDate')
                        }

                    ],
                    listeners: {
                        itemclick: function(treepanl, record, item, index, e, eOpts ){
                            me.openContentConfig(record);
                        }
                    }

                }
            ]
        });

        me.callParent(arguments);

    },


    doRefresh: function(){
        console.log(this.groupRecord.data);
        var grid = this.down('gridpanel');
        grid.getStore().proxy.extraParams['groupNo'] = this.groupRecord.data.groupNo;
        grid.getStore().proxy.extraParams['searchField'] = null;
        grid.getStore().load();

    },

    changeSearchField: function(me, oldvalue, newvalue){

    },


    openContentConfig: function(record){

        this.up('window').selectedRecord = record;
        //this.up('window').groupRecord = this.groupRecord;
        var previewPanel = this.up('window').down('tabpanel[name=preview]');
        previewPanel.removeAll();

        var localeSet = [];
        if(record.data.localeSet.length>0){
            localeSet = Ext.decode(record.data.localeSet);
        }


        var active = 0;

        Ext.iterate(localeSet, function(lc, index){
            previewPanel.add({
                xtype:'panel',
                title: lc.localeText,
                iconCls: '',
                name: lc.localeCd,
                tabConfig: {
                    width: 100
                }
            });
            if(lc.localeCd == record.data.localeCd) {
                active = index;
            }
        });

        previewPanel.setActiveTab(active);
        Ext.Ajax.request({
            url: '/app/sitemgr/content/getFinalSiteContentsHistoryList.html',
            params: {
                contentsConfigNo: record.data.contentsConfigNo
            },
            success: function(response, opts){

                var contentsHistoryList  = Ext.decode(response.responseText);
                Ext.iterate(contentsHistoryList, function(item){
                    var lg = item.localeCd;
                    var pI = previewPanel.down('panel[name=' + lg + ']');
                    if(pI) {
                        pI.removeAll();
                        pI.add({
                            xtype: 'container',
                            html: item.contentsData
                        });
                    }
                });

            },
            failure: function(form, action) {
                Ext.MessageBox.alert($CODE('common.namoWebtree'),$CODE('msg.unspecifiedError'));
            }
        });

    }


});