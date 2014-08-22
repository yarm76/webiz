Ext.define('Component.widget.wcontent.admin.SelectGroupWindow', {
    extend: 'PineTree.lib.panel.CustomModalWindow',

    layout: 'fit',

    width: 400,
    height: 600,

    requires: [

    ],

    initComponent: function () {
        var me = this;
        me.title = $CODE('wcontent.selectGroupWindowTitle');

        var cellEditor = Ext.create('Ext.grid.plugin.CellEditing', {
            listeners: {
                edit: me.editGroupName,
                scope:me,
                beforeedit: function(editor, obj){
                    var node = obj.record;
                    if( node.data.groupNo == 0 || node.data.id == "0" ){
                        return false;
                    }

                    return true;
                }

            }
        });

        var store = Ext.create('Ext.data.TreeStore', {
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
        store.load({
                callback: function(records, operation, success){
                    var treepanel = me.down('treepanel');

                    var groupNo = me.configForm.down('hidden[name=config_wcontentGrpNo]').getValue();
                    if(!!groupNo) {
                        var childNode = store.getNodeById(parseInt(groupNo));
                        if(!!childNode) {
                            treepanel.getSelectionModel().select(childNode);
                        }
                    }
                }
            }
        );

        Ext.applyIf(me, {
            items:[{
                xtype: 'treepanel',
                useArrows: true,
                hideHeaders: true,
                autoScroll: true,
                rootVisible: false,
                bodyBorder: false,
                multiSelect: false,
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
                        },
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true,
                            allowBlank: false
                        }
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            '->',
                            {
                                text: $CODE('wcontent.addGroup'),
                                iconCls: 'icon-plus',
                                handler: function () {
                                    me.addGroup(cellEditor, this);
                                }
                            },
                            {
                                text: $CODE('wcontent.delGroup'),
                                iconCls: 'icon-delete',
                                componentId: 'toolbar-deleteGroupBtn',
                                disabled: true,
                                handler: function () {
                                    me.deleteGroup(cellEditor, this);
                                }
                            }
                        ]
                    }
                ],
                plugins: [
                    cellEditor
                ],
                listeners: {
                    select: function (treepanel, record, index, eOpts) {
                        me.selectNode(treepanel, record);
                    }
                },
                store: store
            }],
            buttonAlign: 'center',
            buttons:[
                {
                    xtype: 'button',
                    text: '적용',
                    handler: function(button){
                        var tree = me.down('treepanel');
                        var records = tree.getSelectionModel().getSelection();
                        if(records.length>0 && (records[0].data.groupNo > 0)){ // Must choose at least one and not All.
                            var record = records[0];

                            var groupNo = record.data.groupNo;
                            var wcontentGrpNo = me.configForm.down('hidden[name=config_wcontentGrpNo]');
                            wcontentGrpNo.setValue(groupNo);

                            var groupName = record.data.groupName;
                            var wcontentGrpName = me.configForm.down('textfield[name=config_wcontentGrpName]');
                            wcontentGrpName.setValue(groupName);

                            me.close();
                        }
                        else{
                            Ext.MessageBox.alert($CODE('common.namoWebtree'),'Please select Group!');
                        }


                    }
                },{
                    xtype: 'button',
                    text: $CODE('common.cancel'),
                    handler: function(button){
                        me.close();
                    }
                }
            ]
        });

        me.callParent(arguments);
    },
    selectNode: function (treepanel, record) {
        // Check to enable/disabled deleteBtn
        var deleteBtn = this.down("button[componentId=toolbar-deleteGroupBtn]");
        deleteBtn.setDisabled((record.get('groupNo') === 0) || (record.childNodes.length > 0) || (parseInt(record.get('contentsCount')) > 0));
    },
    editGroupName: function (cellEditor, obj) {
        var me = this,
            node = obj.record;
        node.set('text', obj.value);
        node.set('groupName', obj.value);
        if(node.data.id == "0" || node.data.groupNo == 0){
            return;
        }
        Ext.Ajax.request({
            url: '/app/sitemgr/content/editGroup.html',
            params: {
                groupNo: node.data.groupNo ,
                groupName: obj.value
            },
            success: function (form, action) {
                obj.record.commit();

                // Change group name of current config in case they do the cancel after edited.
                var wcontentGrpNo = me.configForm.down('hidden[name=config_wcontentGrpNo]');
                if(parseInt(wcontentGrpNo.getValue()) === parseInt(node.data.groupNo)) {
                    var wcontentGrpName = me.configForm.down('textfield[name=config_wcontentGrpName]');
                    wcontentGrpName.setValue(obj.value);
                }

            },
            failure: function (form, action) {
                Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('msg.unspecifiedError'));
            }
        });
    },
    addGroup: function (cellEditor, btnCtrl) {
        var me = this,
            treepanel = me.down('treepanel');
        // Prevent multiple click on slow server which cause duplicate all root node in bug: #3183
        btnCtrl.setDisabled(true);

        cellEditor.cancelEdit();
        var records = treepanel.getSelectionModel().getSelection();
        if (records.length > 0) {
            var node = records[0];

            var depth = me.getNodeDepth(node, -1);

//            if(depth>=me.LIMIT_TREE_DEPTH){
//                Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('projectOverview.msg_tree_depth'));
//                return;
//            }

            //calculate node order
            var leftOrder = 0;
            if (node.childNodes.length > 0) {
                var lastNode = node.childNodes[node.childNodes.length - 1];
                leftOrder = lastNode.data.sortNo + 1;
            }

            var groupName = 'Group ' + (node.childNodes.length + 1);

            var childNode = {
                id: '0',
                text: groupName,
                groupName: groupName,
                leaf: 'true',
                parentGroupNo: node.data.id,
                groupNo: 0,
                sortNo: leftOrder,
                groupDepth: node.data.groupDepth + 1,
                select: false
            };

            Ext.Ajax.request({
                url: '/app/sitemgr/content/addGroup.html',
                params: childNode,
                success: function (response, opts) {
                    var result = $.parseJSON(response.responseText);
                    console.log(result);
                    var store = treepanel.getStore();
                    store.load({
                        scope: this,
                        callback: function (records, operation, success) {
                            var childNode = store.getNodeById(result.group.groupNo);

                            treepanel.getSelectionModel().select(childNode);

                            var header = treepanel.headerCt.getHeaderAtIndex(0);

                            cellEditor.startEdit(childNode, header);
                            btnCtrl.setDisabled(false);
                        }
                    });
                },
                failure: function (form, action) {
                    Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('msg.unspecifiedError'));
                    btnCtrl.setDisabled(false);
                }
            });

        }
        else {
            Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('wcontent.selectGroupAdd'));
            btnCtrl.setDisabled(false);
        }
    },

    deleteGroup: function (cellEditor, btnDel) {
        var me = this,
            treepanel = me.down('treepanel');

        btnDel.setDisabled(true);

        cellEditor.cancelEdit();
        var records = treepanel.getSelectionModel().getSelection();

        if (records.length > 0) {
            var node = records[0];
            console.log(node);
            // Root node could not delete.
            if (node.raw.parentGroupNo == -1) {
                Ext.MessageBox.alert($CODE('common.namoWebtree'), 'Cannot delete this group!');
                return;
            }

            // Has sub group, do not permit to delete.
            if (node.childNodes.length > 0) {
                Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('wcontent.msg_del_group_has_child'));
                return;
            }

            // Default group do not permit to delete
            if (node.raw.defaultGroupYn == true) {
                Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('wcontent.msg_del_default_group'));
                return;
            }

            // If group has contents, ask for delete content or not.
            if (node.raw.contentsCount > 0) {
                Ext.Msg.show({
                    title: $CODE('common.namoWebtree'),
                    msg: $CODE('wcontent.askDeleteGroupWithContent'),
                    buttons: Ext.Msg.YESNOCANCEL,
                    icon: Ext.Msg.QUESTION,
                    fn: function (buttonId, text, opt) {
                        console.log("BUTTON ", buttonId, "....................clicked");
                        if (buttonId == "yes") {
                            // Ajax request to move the group and delete group.
                            console.log("MOVE THE CONTENT AND DELETE GROUP .......................Done");
                            me._deleteGroupRequest(me, node, "All");

                        } else if (buttonId == "no") {
                            me._deleteGroupRequest(me, node, "groupOnly");
                        } else {
                            // Cancel, do nothing.
                            btnDel.setDisabled(false);
                        }
                    },
                    buttonText: {yes: $CODE('wcontent.deleteGrpWithContent'), no: $CODE('wcontent.deleteGrpMvContent')}
                });
            } else {
                // Empty group delete. Remove group only.
                Ext.Msg.confirm($CODE('common.namoWebtree'), $CODE('wcontent.askDeleteGroup'), function (btn) {
                    if (btn == 'yes') { // Could not refactor due to
                        me._deleteGroupRequest(me, node, "groupOnly");
                    } else {
                        // Cancel, do nothing.
                        btnDel.setDisabled(false);
                    }
                });
            }

        }
        else {
            btnDel.setDisabled(true);
            Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('wcontent.no_select_group'));
        }
    },

    _deleteGroupRequest: function (me, node, deleteType) {
        var btnDel = me.down('button[componentId=toolbar-deleteGroupBtn]'),
            treepanel = me.down('treepanel');

        Ext.Ajax.request({
            url: '/app/sitemgr/content/deleteGroup.html',
            params: {
                groupNo: node.data.groupNo,
                deleteType: deleteType
            },
            success: function (form, action) {
                node.remove(true); //Should not use this because we need to refresh to show number on default group.
                treepanel.store.load({
                    callback: function() {
                        treepanel.view.refresh();
                        btnDel.setDisabled(true);
                    }
                });
            },
            failure: function (form, action) {
                Ext.MessageBox.alert($CODE('common.namoWebtree'), $CODE('msg.unspecifiedError'));
            }
        });
    },
    getNodeDepth: function (node, i) {
        if (node.parentNode != null) {
            i++;
            i = this.getNodeDepth(node.parentNode, i);
        }

        return i;
    }
});