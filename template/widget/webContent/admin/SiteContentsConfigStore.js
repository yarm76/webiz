Ext.define('Component.widget.wcontent.admin.SiteContentsConfigStore', {
    extend: 'Ext.data.Store',
    fields: [
        {name: 'contentsConfigNo'},
        {name: 'groupNo'},
        {name: 'contentsTitle'},
        {name: 'localeSet'},
        {
            name: 'replaceLocaleSet',
            convert: function (value, record) {
                try{
                    return Ext.decode(value);
                }catch(err){
                    return [];
                }
            }
        },
        {
            name: 'contentsStatus',
            convert: function (value, record) {
                return $CODE('wcontent.applied');
            }
        },
        {name: 'regUserName'},
        {name: 'modUserName'},
        {
            name: 'regDate',
            convert: function (value, record) {
                var str = Pinetree.util.formatDateFromLong(value);
                return str;
            }
        },
        {
            name: 'creator_modifier',
            convert: function (value, record) {
                return record.data.regUserName + "(" + record.data.modUserName + ")"
            }
        },
        {
            name: 'modDate',
            convert: function (value, record) {
                var str = Pinetree.util.formatDateFromLong(value);
                return str;
            }
        },
        {
            name: 'localeCd'
        }
    ],
	autoLoad: false,
    pageSize: 50000,
    proxy: {
        type: 'ajax',
        url: '/admin/widget/wcontent/getContentsList.html',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});