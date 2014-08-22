Ext.define('Component.widget.wcontent.admin.ConfirmUnlinkWindow', {
    extend: 'Ext.window.Window',
    height: 160,
    width: 400,
    border: false,
    layout: 'fit',
    title: "Disconnect Content",
    modal: true,
    targetForm: null,
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'radiogroup',
                            fieldLabel: '',
                            columns: 1,
                            vertical: true,
                            items: [
                                { boxLabel: 'Reset the Content widget', name: 'disconnect', inputValue: 'reset', checked: true, height: 30},
                                { boxLabel: 'Close the link to the Content Pool but keep the content.', name: 'disconnect', inputValue: 'unlink', height: 20}
                            ]
                        }
                    ],
                    buttons:[
                        {
                            xtype: 'button',
                            text: $CODE('common.save'),
                            name: 'saveBtn',
                            handler: function() {
                                var window = this.up('window');
                                var formValues = this.up('form').getForm().getValues(), form = window.targetForm;
                                if(form) {
                                    form.suspendEvents();
                                    form.down('hidden[name=config_wdisconnect]').setValue("disconnect");
                                    if (formValues.disconnect == 'reset') {
                                        form.down('hidden[name=config_wcontentLink]').setValue(null);
                                        form.down('textfield[name=config_wcontentTitle]').setValue("Content 01");
                                        form.down('textfield[name=config_wcontentTitle]').setReadOnly(false);
                                        form.down('textfield[name=config_createdBy]').setValue(__$_pt_currentUserId);
                                        form.down('textfield[name=config_createdDate]').setValue(Ext.Date.format(new Date(), 'Y.m.d'));
                                        form.down('textfield[name=config_modifiedBy]').setValue(null);
                                        form.down('textfield[name=config_modifiedDate]').setValue(null);
                                        form.down('textfield[name=config_wcontentGrpName]').setValue(null);
                                        form.down('field[name=config_wcontentNote]').setValue(null);
                                        form.down('hidden[name=config_wcontentGrpNo]').setValue(null);
                                        form.down('button[iconCls=icon-cog-edit]').enable();
                                    } else if (formValues.disconnect == 'unlink'){
                                        form.down('hidden[name=config_wcontentLink]').setValue(null);
                                        form.down('button[iconCls=icon-cog-edit]').enable();
                                        form.down('textfield[name=config_wcontentTitle]').setReadOnly(false);
                                    }
                                    form.resumeEvents();
                                }
                                window.close();
                            }
                        },
                        {
                            xtype: 'button',
                            text: $CODE('common.cancel'),
                            name: 'cancelBtn',
                            handler: function() {
                                var window = this.up('window');

                                window.close();
                            }
                        }
                    ],
                    buttonAlign: 'center'
                }
            ]
        });
        
        me.callParent(arguments);
    }
});


