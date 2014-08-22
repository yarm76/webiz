/**
 * Created with IntelliJ IDEA.
 * User: HP Elitebook
 * Date: 6/5/13
 * Time: 11:12 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Component.widget.wcontent.admin.ContentPoolWindow', {
    extend: 'PineTree.lib.panel.CustomModalWindow',

    title: $CODE('wcontent.contentPoolTitle'),

    width: 800,
    height: 600,
    layout: 'fit',
    componentId: null,
    groupId: null,
    initComponent: function () {
        var me = this;
        var groupStore = Ext.create('Ext.data.TreeStore', {
                fields:[
                    {name:'id',        type:'string'},
                    {name:'text',      type:'string'},
                    {name:'qtip',      type:'string'},
                    {name:'sortNo',      type:'int'},
                    {name:'groupDepth',      type:'int'},
                    {name: 'groupName'},
                    {name: 'groupNo'},
                    {name: 'parentGroupNo'},
                    {name: 'contentsCount'},
                    {name:'leaf',      type:'boolean', defaultValue:true},
                    {name:'cls',       type:'string'},
                    {name:'iconCls',       type:'string'},
                    {name:'select',       type:'boolean', defaultValue:false}
                ],

                proxy: {
                    type: 'ajax',
                    url   : '/app/sitemgr/content/getContentsGroupTree.html'
                }
            }
        );


        groupStore.load({
            callback: function(records, operation, success) {
                var treepanel = me.down('treepanel'),
                    rootNode = treepanel.getRootNode(),
                    currentNode = rootNode.childNodes[0],
                    node;

                // Should select default is current group id, all is for null case
                if(!!me.groupId) {
                    // Find record based on groupNo
                    node = rootNode.findChild("groupNo", me.groupId, this, true);
                    if(!!node) {
                        currentNode = node;
                    }
                }

                me.down('contentListPanel').groupRecord = currentNode;
                treepanel.getSelectionModel().select(currentNode);
            },
            scope: this
        });

        me.items = [{
            xtype: 'form',
            layout: 'border',
            items: [{
                xtype: 'treepanel',
                title: $CODE('wcontent.treeTile'),
                split: true,
                width: 250,
                region: 'west',
                useArrows: true,
                hideHeaders: true,
                autoScroll: true,
                rootVisible: false,
                bodyBorder: false,
                multiSelect: false,
                store: groupStore,
                columns: [
                    {
                        xtype: 'treecolumn',
                        flex: 1,
                        dataIndex: 'text',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, grid) {
                            if(record.data.contentsCount>0){
                                return value + '(' + record.data.contentsCount + ')';
                            }
                            return value;
                        }
                    }
                ],
                listeners: {
                    itemclick: function( treepanel, record){
                        me.selectGroup(record);
                    }
                }
            } ,{
                xtype: 'container',
                layout: 'border',
                region: 'center',
                items: [{
                    xtype: 'panel',
                    height: '40%',
                    split: true,
                    layout: 'fit',
                    region: 'north',
                    items: [{
                        xtype: 'contentListPanel',
                        groupId: me.groupId
                    }]
                }, {
                    name: 'preview',
                    xtype: 'tabpanel',
                    region: 'center',
                    defaults: {
                        layout: 'fit',
                        autoScroll:true
                    },
                    items: []
                }]
            }],
            buttonAlign: 'center',
            buttons: [{
                text: $CODE('wcontent.aplly'),
                handler: function(bnt){
                   me.linkContent();
                }
            }, {
                text: $CODE('wcontent.cancel'),
                handler: function(bnt){
                    bnt.up('window').close();
                }
            }]
        }];
        me.callParent(arguments);

    },


    selectGroup: function(record){
        var me = this;
        var cmsPanel = me.down('contentListPanel');
        if(cmsPanel){
            cmsPanel.groupRecord = record;
//            cmsPanel.setDisabled(record.data.groupNo ==0);
            cmsPanel.doRefresh();
        }
    },

    linkContent: function(){
        var me = this,
            treepanel = me.down('treepanel'),
            rootNode = treepanel.getRootNode(),
            node;
        if(me.selectedRecord) {
            //console.log("link to", me.selectedRecord, me.groupRecord.data);
            var setting = Ext.getCmp('x-st-wcontent-contentInfo').up('form');
            if(setting) {
                setting.suspendEvents();
                Ext.iterate(setting.query('textfield'), function(field){
                    if(field.name == "config_wcontentTitle"){
                        field.setValue(me.selectedRecord.data.contentsTitle);
                        field.setReadOnly(true);
                    } else if(field.name == "config_createdBy"){
                        field.setValue(me.selectedRecord.data.regUserName);
                        field.setReadOnly(true);
                    } else if(field.name == "config_createdDate"){
                        field.setValue(me.selectedRecord.data.regDate);
                        field.setReadOnly(true);
                    } else if(field.name == "config_modifiedBy"){
                        field.setValue(me.selectedRecord.data.modUserName);
                        field.setReadOnly(true);
                    } else if(field.name == "config_modifiedDate"){
                        field.setValue(me.selectedRecord.data.modDate);
                        field.setReadOnly(true);
                    } else if(field.name == "config_wcontentGrpName"){
                        // Lookup group name
                        // And set it.
                        // Find record based on groupNo
                        node = rootNode.findChild("groupNo", me.selectedRecord.data.groupNo, this, true);

                        field.setValue(node.data.groupName);
                        field.setReadOnly(true);
                    }

                   // console.log(field);
                });
                //set group no and fire event
                var wcontentLink = setting.down('hidden[name=config_wcontentLink]');
                var wcontentGrpNo = setting.down('hidden[name=config_wcontentGrpNo]');
                wcontentGrpNo.setValue(me.selectedRecord.data.groupNo);
                //setting.down('field[name=config_wcontentLocale]').setValue(__$_pt_currentLocale);
                setting.down('button[iconCls=icon-cog-edit]').disable();
                //setting.down('button[action=disconnect]').enable();
                //setting.down('button[action=disconnect]').show();
                setting.resumeEvents();
                wcontentLink.setValue(me.selectedRecord.data.contentsConfigNo);
                //call to  reload component
                SiteEditor.getSiteviewController().reloadComponent(me.componentId);
            }
        }
        me.close();
    }
});
