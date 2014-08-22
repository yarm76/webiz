Pinetree.component.registerComponent('widget','wcontent',function($component,config){
	/*
	 * specify javascript handles when render front page.
	 */

	if(__$_pt_viewMode == 'design'){
        $(document).ready(function(){
            var compId = $component.attr('id');
            var	CrossEditor = null;
            var EleValTextWidget		= "";
            var oldEle		= null;
            var str;
            var oldoldel;

            $('#'+compId +' .pt-editable-content #NamoSE_Ifr__func_namoeditor1').remove();

//            var editBtnHTML = "<div style='background-color: white;' id='div_btn_"+compId+"_edit'  align='right'>" +
//                                "<input id='btn_"+compId+"_edit' type='button' title='edit' value='HTML' onclick='htmlEditBtn(event);'/>" +
//                                "</div>";

            doCommands = function(elId,ele,arg) {

                if (CrossEditor != null) {
                    CrossEditor.doCommand(elId, ele, arg);
                }
            }
            
            // ce3.0 크로스 에디터의 케럿 위치가 변경될 때, 케럿위치의 텍스트 포멧정보를 알려주는 콜백함수
            CE_OnTxtFormatChangeEvent = function(e) {
//console.log("======CE_OnTxtFormatChangeEvent====",e);            	
                if(e.bold){
                    toggleSiteViewToolbarButton('boldButton',true);
                }
                if(e.italic){
                    toggleSiteViewToolbarButton('italicButton',true);
                }
                if(e.underline){
                    toggleSiteViewToolbarButton('underlineButton',true);
                }
                if(e.strikethrough){
                    toggleSiteViewToolbarButton('strikethroughButton',true);
                }
                if (e.alignment == 'justifyleft') {
                    toggleSiteViewToolbarButton('justifyLeftButton',true);
                }
                if (e.alignment == 'justifyright') {
                    toggleSiteViewToolbarButton('justifyRightButton',true);
                }
                if (e.alignment == 'justifycenter') {
                    toggleSiteViewToolbarButton('justifyCenterButton',true);
                }
                if (e.alignment == 'justifyfull' || e.alignment == 'justify') {
                    toggleSiteViewToolbarButton('justifyBlockButtonn',true);
                }
                if (e.list == 'numberset') {
                    toggleSiteViewToolbarButton('listNumbersButton',true);
                }
                if (e.list == 'markset') {
                    toggleSiteViewToolbarButton('marksetButton',true);
                }

                toggleSiteViewToolbarButton('formatCombo', e.formatblock);
                toggleSiteViewToolbarButton('fontCombo', e.fontfamily);
                toggleSiteViewToolbarButton('sizeCombo', e.fontsize);
                toggleSiteViewToolbarButton('lineHeightCombo', e.lineheight);

            }

            createEditorForTextWidget = function(ele, frameWidth, frameHeight) {

            	SiteEditor.editor.maskSiteviewLoading("Component Loading...");

                // Should not get compId in the closure, since it's always the last inserted component id
                var compId = $(ele.dom).parent().attr('id');
                var $component = $('#'+compId);

                var getCurrentOverflowConfig = function($comp){
                    var oc = 'addsize-noscroll';
                    var classname = $comp.attr('class');
                    var arr = classname.match(/pt-items-overflow-([\w\-]+)/i);
                    if(arr && arr.length > 0) {
                        oc = arr[1];
                    }
                    return oc;
                }
            	var originalOverflowConfigClassname = getCurrentOverflowConfig($component);
                // ATTENTION:
                //
                // Declare local config to avoid closure problem: Config will mess up when one page have multiple config.
                // Should avoid to use global config variable of renderer function.
                var componentConfig = SiteEditor.getSiteviewController().getComponentConfig(compId);
                componentConfig.overflowConfig = originalOverflowConfigClassname;
                SiteEditor.getSiteviewController().saveComponentConfig(compId,componentConfig,true);
            	
            	//console.error('--- remove classname for original component : ','pt-items-overflow-'+originalOverflowConfigClassname);
            	$component.removeClass('pt-items-overflow-'+originalOverflowConfigClassname);
            	
                if (CrossEditor) {
                    CrossEditor.destroyEditor();
                    delete CrossEditor;
                    CrossEditor = null;
                }
                
            	CrossEditor = new NamoSE('func_namoeditor1');

                var minHeight = 62;
                if (frameHeight < minHeight) frameHeight = minHeight;

//				CrossEditor.params.UserLang = "auto";
                CrossEditor.params.Width = frameWidth + "px";
                CrossEditor.params.Height = (frameHeight+20 )+ "px";
                CrossEditor.params.UseDoCommand = true;
                CrossEditor.params.ParentEditor =  $(ele.dom).get(0);
                CrossEditor.params.ShowFrame = false;
                CrossEditor.params.IsSpliteToolbar = false;
                CrossEditor.params.TargetPluginFrame= window.frameElement;
                CrossEditor.params.Webtree = true;
                CrossEditor.params.ImageSavePath = Pinetree.util.filePathUtil.getProjectContentComponentPath(__$_pt_currentSiteId, 'widget', 'wcontent', compId);
//				CrossEditor.params.Css = "/common/css/base.css";
                //ele.dom.innerHTML = "";


//                $(editBtnHTML).insertBefore(ele.dom);
                CrossEditor.ownerText = EleValTextWidget;

                // parent Element의 내용 삭제하고 해당 내용을 CrossEditor에 삽입한다.
                CrossEditor.EditorStart();

            }


            // ce3.0 크로스에디터 로딩완료 시 호출되는 콜백함수
            OnInitCompleted = function(e){
                if(e.editorTarget.params.UseDoCommand){
                	
                	var styleCss = ''; 
                	$('link[rel="stylesheet"]').each(function (i, ele) {
                			var tagStr = '<link rel="'+ele.rel+'" type="'+ele.type+'" href="'+ele.href+'">';
                			styleCss += tagStr;
                	});
                	
                	$('body').bind("contextmenu",function(){
                		return false;
                	});
                	
                	e.editorTarget.SetHeadValue(styleCss);
                	
                    e.editorTarget.SetBodyValue(e.editorTarget.ownerText);
                    e.editorTarget.ShowToolbar(0, false);
                    e.editorTarget.ShowToolbar(1, false);
                    e.editorTarget.ShowToolbar(2, false);
                    e.editorTarget.ShowTab(false);

                    var layer = e.editorTarget.params.ParentEditor;
                    for (var i = layer.childNodes.length -1; i >= 0; i--) {
                        if (layer.childNodes[i].id != e.editorTarget.GetEditor().id) {
                            layer.childNodes[i].parentNode.removeChild(layer.childNodes[i]);
                        }
                    }
                    e.editorTarget.ShowEditor(true);
                    if (e.editorTarget.ParentEditor) {
        //				e.editorTarget.ParentEditor.style.overflow = "";
                    }

                    // Should not get compId in the closure, since it's always the last inserted component id
                    var compId = $(layer).parent().attr('id');
					var component = SiteEditor.getSiteviewController().getComponent(compId);
					component.editorInstance = e.editorTarget;

					// enable the text modify buttons now, because it is meaningless when the crosseditor is not activated.
					component.fireEvent('enableEditorButtons',compId, component);
                    
                }

                SiteEditor.editor.unmaskSiteviewLoading();

            }
            // 레이어를 클릭했을 때, 호출되는 함수
            onLayerClickedForContentWidget = function(ele,tempClientWidth,tempClientHeight) {

                if (CrossEditor) {
                    CrossEditor.destroyEditor();
                    delete CrossEditor;
                    CrossEditor = null;
                }

                oldEle = $(ele.dom).get(0);
                EleValTextWidget = "";
                if ($(ele.dom).get(0)) {
                    EleValTextWidget = $(ele.dom).get(0).innerHTML;
                }

                createEditorForTextWidget(ele,tempClientWidth,tempClientHeight);
            }

            htmlEditBtn = function(event, ativeTabNo){
            	
            	if(ativeTabNo==1 || ativeTabNo==0){
            		CrossEditor.SetActiveTab(ativeTabNo);
            	}
                // Prevent to propagate so that the layout does not take it and show mask.
//                e.stopPropagation();
            }

            destroyCEForTextWidget = function(){

                if (oldEle && CrossEditor) {
    //				oldEle.innerHTML = CrossEditor.GetBodyValue();
                    str = CrossEditor.GetBodyValue();
                }
                if(oldEle){
                    oldoldel = oldEle;
                    // Should not get compId in the closure, since it's always the last inserted component id
                    var compId = $(oldEle).parent().attr('id');
    				var component = SiteEditor.getSiteviewController().getComponent(compId);
    				component.editorInstance = null;
                }

                if (CrossEditor) {
                    CrossEditor.destroyEditor();
                    delete CrossEditor;
                    CrossEditor = null;
                }

                if(oldoldel){

                    oldoldel.innerHTML = str;
                }

                //edit button remove
//                $("#div_btn_"+compId+"_edit").remove();
            }

            toggleSiteViewToolbarButton = function(action,pressed){

                var activeSiteView = SiteEditor.editor.getActiveSiteview();
                var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');

                if(action == 'formatCombo' || action=="fontCombo" || action=="sizeCombo" || action=="lineHeightCombo"){
                    var combo = configPanel.query('combo[action='+ action +']', activeSiteView)[0];
                    if (configPanel) {
                        if(pressed){
                            combo.setValue(pressed);
                        }else{
                        	combo.setValue("");
                        }
                    }
                }else{
                    if (configPanel) {
                        var button = configPanel.query('button[action='+ action +']', activeSiteView)[0];
                        if (button) {
                            button.toggle(pressed);
                        }
                    }
                }
            }

            getSiteViewToolBarObjEle = function(action){
                var activeSiteView = SiteEditor.editor.getActiveSiteview();
                var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
                var objEle = null;

                if(action == 'formatCombo' || action=="fontCombo" || action=="sizeCombo" || action=="lineHeightCombo"){

                }else{
                    var button = configPanel.query('button[action='+ action +']', activeSiteView)[0];
    //            	objEle = $(button.btnIconEl.dom).get(0);
                }

                return objEle;
            }

        });
    }
},{
	    /*
	     * register component event listeners within ProjectEditor
	     */
	
	    doubleclickComponent:function(id,comp){
	        console.log('wcontent------doubleclickComponentForTextWidget :',arguments);
	        comp.fireEvent('startEditingComponentForWidget',id,comp);
	    },

	    startEditingComponentForWidget:function(id,comp){
	        console.log('wcontent------startEditingComponentForWidget :',arguments);
	        comp.onStartEditingComponent();
	        var childEl = comp.getEl().child('div');

	        var tempClientWidth = comp.el.getWidth(true);
	        var tempClientHeight = comp.el.getHeight(true);
	        
	        $(document).ready(function(){
		        onLayerClickedForContentWidget(childEl,tempClientWidth,tempClientHeight);
                //comp.getEl().removeCls("wcontentScrollContent");
	        	SiteEditor.fireEvent('prepareHistoryItem','componentConfig',id);
	        	
	        });
	    },

        /*beforeEndEditingComponent: function(id, component) {
            var result = true;
            // Should wait for CrossEditor to be fully loaded
            if (!component.editorInstance) {
                result = false;
            }
            return result;
        },*/

	    endEditingComponent:function(id, comp){
            var config;
			var saveContent = false;
			if (comp.editorInstance)
			{
				var ce = comp.editorInstance;
				if(ce && ce.IsDirty()) {
					// saveContent
					saveContent = true;
				} else {
					//skip save content
				}
			}

	        $(document).ready(function(){
		        destroyCEForTextWidget();
	        });
        	if(saveContent && parent.saveContentsHistory) {
				parent.saveContentsHistory();
			}
	        SiteEditor.editor.maskSiteviewLoading("Component Loading...");
	        
	        comp.onEndEditingComponent();
	
	        // Update the component width & height
	//        comp.fireEvent('afterResizeComponent', id, comp, true);
	        
	        if(comp) {
                //comp.getEl().addCls("wcontentScrollContent");
	        	//component)component.htmlContent=SiteEditor.editor.normalizeHtml(EleVal);
	        	$('#'+id +' .pt-editable-content #NamoSE_Ifr__func_namoeditor1').remove();
	        	
	        	var currentHtml = $('#'+id +' .pt-editable-content').html();
	        	if(currentHtml) currentHtml = currentHtml.trim();
                // Set config here
                config = SiteEditor.getSiteviewController().getComponentConfig(id);

                if(!!config.wcontentProperties && ("normal"=== config.wcontentProperties)) {
                    config.wcontentNormalText = currentHtml;
                    config.saveToFile = 'Y';
                    SiteEditor.getSiteviewController().saveComponentConfig(id, config, true);
                    // to save content information into a file : 
                    // -> just reload is enough - other things will be done at contentWidgetControl
                    SiteEditor.getSiteviewController().reloadComponent(id);
                    // reset the configs to default
                    config.wcontentNormalText = '';
                    delete config.saveToFile ;
                    SiteEditor.getSiteviewController().saveComponentConfig(id, config, true);
                    comp.fireEvent('disableEditorButtons');
                }

                
                // resize component as for the overflow config

                if (!config.overflowConfig) {
                	config.overflowConfig = 'addsize-noscroll';
                }
                
                if(config.overflowConfig == 'addsize-noscroll') {
                	// resize the component to fit with its content, only when overflowConfig is set addsize
                	comp.syncContentBox('.pt-editable-content');
                }
                
                //'pt-items-overflow-'
                comp.getEl().addCls('pt-items-overflow-'+config.overflowConfig);
                
                
                
	        	if(comp.htmlContent != currentHtml) {
	                SiteEditor.fireEvent('addHistoryItem','componentConfig',id);
	        	} else {
	                SiteEditor.fireEvent('cancelPrepareHistoryItem','componentConfig',id);
	        	}
	        }
	        
	        setTimeout(function() {
	        	SiteEditor.editor.unmaskSiteviewLoading();
	        },1300);

	    },
	    afterResizeComponent: function(id, comp, autoResize) {
	        console.log('***afterResizeComponentForTextWidget', arguments);
	
	        // Update the component height if it's less than the text content's height
	        var childEl = comp.getEl().child('div');
	        var textHeight = childEl.getHeight();
	        var compStyle = comp.getComponentStyle(),
	            compHeight = compStyle.height.replace('px', '');
	        if ((typeof autoResize == 'boolean' && autoResize)  && compHeight < textHeight) {
		        var minHeight = 52;
		        var height = textHeight + 10;
		        if (height < minHeight) height = minHeight;

	            compStyle.height = height + 'px';
	            console.log('***Updating component style', compStyle);
	            comp.setComponentStyle(compStyle, true, true);
	
	            //SiteEditor.getSiteviewController().doPageLayout();
	        }
	
	
	    },
	    addComponent:function(id,comp){
	    	var config = SiteEditor.getSiteviewController().getComponentConfig(id);
	    	if(config) {
                var noOfComponent = SiteEditor.getSiteDesignController().getComponentElsByType('widget', 'wcontent').getCount();
	    		config.currentCount = noOfComponent;
	    		SiteEditor.getSiteviewController().saveComponentConfig(id, config, true);
	    	}
	    },
	    reloadComponent:function(id,comp){
	    	var config = SiteEditor.getSiteviewController().getComponentConfig(id);
	    	if(config) {
	    		config.saveToFile = '';
	    		SiteEditor.getSiteviewController().saveComponentConfig(id, config, true);
	    	}
	    },

	    doCommands:function(elId,ele,arg){
	
	        $(document).ready(function(){
		        window.doCommands(elId,ele,arg);
	        });   		
	      	
	    },
	    onHtmlEditBtn:function(event, activeTabNo){
	        $(document).ready(function(){
		        window.htmlEditBtn(event, activeTabNo);
	        });   		
	    },
	    enableEditorButtons:function(id,comp) {
	    	var checkConfigPanel = function(){
		    	var configPanel = parent.Ext.getCmp('pt-componentconfig-wcontent-fieldset-textconfig');
				if(configPanel) {
			    	parent.enableTextConfigButtons();
					if(parent.Ext.getCmp('pt-btn-widget-wcontent-saveandapply')) {
		        		parent.Ext.getCmp('pt-btn-widget-wcontent-saveandapply').setDisabled(false);
					}
				}
				
	    	};
	    	
	    	setTimeout(checkConfigPanel,500);
	    },
	    disableEditorButtons:function(id,comp) {
	    	var checkConfigPanel = function(){
		    	var configPanel = parent.Ext.getCmp('pt-componentconfig-wcontent-fieldset-textconfig');
				if(configPanel) {
			    	parent.disableTextConfigButtons();
					if(parent.Ext.getCmp('pt-btn-widget-wcontent-saveandapply')) {
						parent.Ext.getCmp('pt-btn-widget-wcontent-saveandapply').setDisabled(true);
					}
				}
	    	};
	    	
	    	setTimeout(checkConfigPanel,500);
	    },

	    beforeSaveDocument:function(id,comp,config) {
	    	if(config.wcontentNormalText) {
	    		config.wcontentNormalText = '';
	    	}
	    	
	    	if(config.saveToFile) {
	    		delete config.saveToFile;
	    	}
	    	SiteEditor.getSiteviewController().saveComponentConfig(id,config,true);
	    }
//	}

});