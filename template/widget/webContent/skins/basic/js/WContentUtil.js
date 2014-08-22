(function() {
	WContentUtil = {
        // Get button from action and toggle it.
        toggleSiteViewToolbarButton: function(action, pressed) {
            var activeSiteView = SiteEditor.editor.getActiveSiteview();

            var configPanel = SiteEditor.editor.getSiteEditorComp('x-componentConfig-configForm');
            if(configPanel){
                var button = configPanel.query('button[action=' + action + ']', activeSiteView)[0];
                if (button) {
                    button.toggle(pressed);
                }
            }

        },
        enableSiteViewToolbarButton: function(action, enabled) {
            var activeSiteView = SiteEditor.editor.getActiveSiteview();

            var configPanel = SiteEditor.editor.getSiteEditorComp('x-componentConfig-configForm');
            if(configPanel){
                var button = configPanel.query('component[action=' + action + ']', activeSiteView)[0];
                if (button) {
                    button.setDisabled(!enabled);
                }
            }
        },
        // Just register event when change style, toggle button.
        registerStyleChangeToggleButton : function(editor, style, buttonId) {
            editor.attachStyleStateChange(style, function(state) {
                    var pressed = (state == CKEDITOR.TRISTATE_ON);
                // Get button from config and toggle status of it.
                    WContentUtil.toggleSiteViewToolbarButton(buttonId, pressed);
                });

        },
        // Just register event when change style, enable/disable button.
        registerStyleChangeButton : function(editor, style, buttonId) {
            editor.attachStyleStateChange(style, function(state) {
                    var enabled = (state == CKEDITOR.TRISTATE_ON);
                // Get button from config and toggle status of it.
                WContentUtil.enableSiteViewToolbarButton(buttonId, enabled);
                });

        },

        getCKEditor: function() {
            var cmp = SiteEditor.editor.getActiveSiteviewIframeComponent();
            if (cmp && cmp.getFrameBase()) {
                var iframeWindow = cmp.getFrameBase();
                if (iframeWindow.CKEDITOR) {
                    return iframeWindow.CKEDITOR;
                }
            }
            return null;
        },

        getCKEditorInstance: function(instancesObj) {
            for (var editor in instancesObj) {
                if (instancesObj.hasOwnProperty(editor) && editor != 'commonCKEditor') {
                    return instancesObj[editor];
                }
            }
        },

        /**
         * Execute a command for an editing text element or selected text elements
         * @param {} command, E.g "bold", "italic"
         */
        execCommand: function(command, arg1) {
            var /*me = this,*/
                siteDesignController = SiteEditor.getSiteDesignController();
            var CKEDITOR = WContentUtil.getCKEditor(),
                htmlEditor = null;
            var isEditing = (siteDesignController.componentContentEditing != null);
            if (isEditing) {
                // Text element is in edit mode, just exec the command
                console.log('****execCommand for editing text element: ', siteDesignController.componentContentEditing)
                htmlEditor = WContentUtil.getCKEditorInstance(CKEDITOR.instances); // The CKEditor instance of the text element

                switch (command) {
                    case 'font':
                    case 'size':
                        WContentUtil.execFontCommand(CKEDITOR, htmlEditor, arg1, command, true);
                        break;
                    case 'fore':
                    case 'back':
                        WContentUtil.execColorCommand(CKEDITOR, htmlEditor, arg1, command);
                        break;
                    case 'format':
                        WContentUtil.execFormatCommand(CKEDITOR, htmlEditor, arg1);
                        break;
                    case 'lineHeight':
                        WContentUtil.execLineHeightCommand(CKEDITOR, htmlEditor, arg1, true);
                        break;
                    case 'letterSpacing':
                        WContentUtil.execLetterSpacingCommand(CKEDITOR, htmlEditor, arg1, true);
                        break;
                    default:
                        htmlEditor.execCommand(command); // Testing here.
                }
            }/* else {
                // Text elements are in design mode
                //FIXME: Do we need this??? Have a dummy editor. Format and redistribute to each of text component in a page.

                htmlEditor = CKEDITOR.instances.commonCKEditor;// The commonCKEditor instance
                var siteviewController = SiteEditor.getSiteviewController(),
                    selectedElements = siteviewController.getSelectedComponent();
                var componentArr = [];
                selectedElements.each(function(el) {
                    var component = siteviewController.getComponent(el.dom.id);
                    // Fix me here.
                    if (component.componentName === 'text' || component.componentName === 'content') {
                        componentArr.push(component);
                    }
                });
                if (componentArr.length > 0) {
                    this.execCommandForTextElement(componentArr, 0, CKEDITOR, htmlEditor, command, arg1);
                }
            }*/
        },
        execFormatCommand: function(CKEDITOR, editor, value) {
            if (editor) {
                var config = editor.config;

                // Gets the list of tags from the settings of ckeditor format plugin.
                var tags = config.format_tags.split(';');

                // Create style objects for all defined styles.
                var styles = {};
                for ( var i = 0 ; i < tags.length ; i++ ) {
                    var tag = tags[ i ];
                    styles[ tag ] = new CKEDITOR.style( config[ 'format_' + tag ] );
                    styles[ tag ]._.enterMode = editor.config.enterMode;
                }

                editor.focus();
                editor.fire( 'saveSnapshot' );

                var style = styles[value],
                    elementPath = new CKEDITOR.dom.elementPath(editor.getSelection().getStartElement());

                style[style.checkActive( elementPath ) ? 'remove' : 'apply'](editor.document);

                // Save the undo snapshot after all changes are affected. (#4899)
                setTimeout(function() {
                    editor.fire('saveSnapshot');
                    editor.focus();
                }, 0);

            }
        },
        execFontCommand: function(CKEDITOR, editor, styleName, type, isEditing) {
            if (editor) {
                var config = editor.config;
                var styleType = 'family';
                var styleDefinition = config.font_style;
                var entries = config.font_names;
                if (type == 'size') {
                    styleType = 'size';
                    styleDefinition = config.fontSize_style;
                    entries = config.fontSize_sizes;
                }

                // Gets the list of fonts from the settings.
                var names = entries.split( ';' ),
                    values = [];

                // Create style objects for all fonts.
                var styles = {};
                for ( var i = 0 ; i < names.length ; i++ ) {
                    var parts = names[ i ];

                    if ( parts ) {
                        parts = parts.split( '/' );

                        var vars = {},
                            name = names[ i ] = parts[ 0 ];

                        vars[ styleType ] = values[ i ] = parts[ 1 ] || name;

                        styles[ name ] = new CKEDITOR.style( styleDefinition, vars );
                        styles[ name ]._.definition.name = name;
                    }
                    else
                        names.splice( i--, 1 );
                }
                editor.focus();
                editor.fire('saveSnapshot');

                var style = styles[styleName];
                style.apply(editor.document);

                editor.fire('saveSnapshot');
                var me = this;
                if (isEditing) {
                    setTimeout(function() {
                        editor.focus();
//	                me.moveCursorToNewElement(editor);
                    }, 0);
                }
            }
        },

        execColorCommand: function(CKEDITOR, editor, color, type) {
            function isUnstylable( ele ) {
                return ( ele.getAttribute( 'contentEditable' ) == 'false' ) || ele.getAttribute( 'data-nostyle' );
            }

            if (editor && color) {
                editor.focus();
                editor.fire( 'saveSnapshot' );
                var config = editor.config;

                // Clean up any conflicting style within the range.
                new CKEDITOR.style( config['colorButton_' + type + 'Style'], { color : 'inherit' } ).remove( editor.document );
                var colorStyle = config['colorButton_' + type + 'Style'];

                colorStyle.childRule = type == 'back' ?
                    function( element ) {
                        // It's better to apply background color as the innermost style. (#3599)
                        // Except for "unstylable elements". (#6103)
                        return isUnstylable( element );
                    }
                    :
                    function( element ) {
                        // Fore color style must be applied inside links instead of around it. (#4772,#6908)
                        return !( element.is( 'a' ) || element.getElementsByTag( 'a' ).count() ) || isUnstylable( element );
                    };

                var style = new CKEDITOR.style( colorStyle, { color : color } );
                style.apply( editor.document );

                editor.fire( 'saveSnapshot' );
            }
        },

        execLineHeightCommand: function(CKEDITOR, editor, value, isEditing) {
            if (editor) {
                var vars = {};

                vars['lineheight'] = value;
                var style = new CKEDITOR.style(CKEDITOR.config.lineheight_style, vars);

                editor.focus();
                editor.fire( 'saveSnapshot' );

                var selection = editor.getSelection() || editor.document, enterMode = editor.config.enterMode;
                var bookmarks = selection.createBookmarks(), ranges = selection.getRanges(true);

                var iterator, block;

                for (var i = ranges.length - 1; i >= 0 ; i--) {
                    iterator = ranges[i].createIterator();
                    iterator.enlargeBr = enterMode != CKEDITOR.ENTER_BR;

                    while ((block = iterator.getNextParagraph(enterMode == CKEDITOR.ENTER_P ? 'p' : 'div'))) {
                        block.removeStyle('line-height');
                        block.setStyle('line-height', value);
                    }
                }

                editor.focus();
                editor.forceNextSelectionCheck();
                selection.selectBookmarks(bookmarks);

                //style.apply(editor.document);

                editor.fire('saveSnapshot');
                var me = this;
                if (isEditing) {
                    setTimeout(function() {
                        editor.focus();
//                    me.moveCursorToNewElement(editor);
                    }, 0);
                }
            }
        },

        execLetterSpacingCommand: function(CKEDITOR, editor, value, isEditing) {
            if (editor) {
                var vars = {};

                vars['letterspacing'] = value;
                var style = new CKEDITOR.style(CKEDITOR.config.letterspacing_style, vars);

                editor.focus();
                editor.fire( 'saveSnapshot' );

                style.apply(editor.document);

                editor.fire('saveSnapshot');
                var me = this;
                if (isEditing) {
                    setTimeout(function() {
                        editor.focus();
//                    me.moveCursorToNewElement(editor);
                    }, 0);
                };
            }
        },

        onSelectionChange : function(e) {
            // Update the alignment buttons state
            WContentUtil.updateAlignmentState(e);
            
            // Update the line height & letter spacing combo
            WContentUtil.updateLineHeightState(e);
            WContentUtil.updateLetterSpacingState(e);
            
            // Update the format combo
            WContentUtil.updateFormatComboState(e);

            // Update the style combo
//            WContentUtil.updateStyleComboState(e);

            // Update the font & fontSize combo
            WContentUtil.updateFontComboState(e);
            WContentUtil.updateFontSizeComboState(e);
            
            // Update color and background color
//            WContentUtil.updateColorPickerState(e);
//            WContentUtil.updateBackgroundColorPickerState(e);
            
            
		},
		
		getAlignment: function(element, useComputedState) {
            useComputedState = useComputedState === undefined || useComputedState;

            var align;
            if (useComputedState)
                align = element.getComputedStyle('text-align');
            else {
                while (!element.hasAttribute || !(element.hasAttribute('align') || element.getStyle('text-align'))) {
                    var parent = element.getParent();
                    if (!parent)
                        break;
                    element = parent;
                }
                align = element.getStyle('text-align') || element.getAttribute('align') || '';
            }

            // Sometimes computed values doesn't tell.
            align && (align = align.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, ''));

            !align && useComputedState && (align = element.getComputedStyle('direction') == 'rtl' ? 'right' : 'left');

            return align;
        },
        
        updateAlignmentState: function(e) {
        	var element = e.data.element;
            var alignment = WContentUtil.getAlignment(element, false);
            if (alignment == '')
                alignment = 'left';

            switch (alignment) {
                case 'left' :
                    WContentUtil.toggleSiteViewToolbarButton('justifyLeftButton', true);
                    break;

                case 'center' :
                    WContentUtil.toggleSiteViewToolbarButton('justifyCenterButton', true);
                    break;

                case 'right' :
                    WContentUtil.toggleSiteViewToolbarButton('justifyRightButton', true);
                    break;

                case 'justify' :
                    WContentUtil.toggleSiteViewToolbarButton('justifyBlockButton', true);
                    break;
            }
        },
		
        updateLineHeightState: function(e) {
//        	var lineHeightCombo = SiteEditor.editor.getSiteViewToolbarCmp('lineHeightCombo');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var lineHeightCombo = configPanel.query('combo[action=lineHeightCombo]', activeSiteView)[0];
			var elementPath = e.data.path,
				elements = elementPath.elements;

			// For each element into the elements path and find the style.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				var lineHeight = element.getStyle('line-height');
				if (lineHeight) {
					lineHeightCombo.setValue(lineHeight);
					return;
				}
			}

			// If no styles match, just empty it.
			lineHeightCombo.setValue('');
        },
        
        updateLetterSpacingState: function(e) {
//        	var letterSpacingCombo = SiteEditor.editor.getSiteViewToolbarCmp('letterSpacingCombo');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var letterSpacingCombo = configPanel.query('combo[action=letterSpacingCombo]', activeSiteView)[0];
			var elementPath = e.data.path,
				elements = elementPath.elements;

			// For each element into the elements path and find the style.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				var letterSpacing = element.getStyle('letter-spacing');
				if (letterSpacing) {
					letterSpacingCombo.setValue(letterSpacing);
					return;
				}
			}

			// If no styles match, just empty it.
			letterSpacingCombo.setValue('');
        },
        
        updateFormatComboState: function(e) {
//            var combo = SiteEditor.editor.getSiteViewToolbarCmp('formatCombo');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var combo = configPanel.query('combo[action=formatCombo]', activeSiteView)[0];
            var elementPath = e.data.path,
				elements = elementPath.elements;

			// For each element into the elements path and find the tag.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				var tagName = element.getName();
				if (tagName == 'h1' || tagName == 'h2' || tagName == 'h3' || tagName == 'h4' || tagName == 'h5' || tagName == 'h6' || tagName == 'pre' || tagName == 'address' || tagName == 'p' || tagName == 'div') {
					combo.setValue(tagName);
					return;
				}
			}

			// If no styles match, just empty it.
			combo.setValue('');
        },

        updateStyleComboState: function(e) {
//            var combo = SiteEditor.editor.getSiteViewToolbarCmp('styleCombo');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var combo = configPanel.query('combo[action=styleCombo]', activeSiteView)[0];
            var elementPath = e.data.path,
				elements = elementPath.elements;

			// For each element into the elements path and find the tag.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				
			}

			// If no styles match, just empty it.
			combo.setValue('');
        },

        updateFontComboState: function(e) {
//            var combo = SiteEditor.editor.getSiteViewToolbarCmp('fontCombo');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var combo = configPanel.query('combo[action=fontCombo]', activeSiteView)[0];
            var elementPath = e.data.path,
				elements = elementPath.elements;

			// For each element into the elements path and find the tag.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				var fontFamily = element.getStyle('font-family');
				if (fontFamily) {
					fontFamily = fontFamily.replace(/\'/g, '');
					combo.setValue(fontFamily);
					return;
				}
			}

			// If no styles match, just empty it.
			combo.setValue('');
        },
        
        updateFontSizeComboState: function(e) {
//            var combo = SiteEditor.editor.getSiteViewToolbarCmp('sizeCombo');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var combo = configPanel.query('combo[action=sizeCombo]', activeSiteView)[0];
            var elementPath = e.data.path,
				elements = elementPath.elements;

			// For each element into the elements path and find the tag.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				var fontSize = element.getStyle('font-size');
				if (fontSize) {
					combo.setValue(fontSize);
					return;
				}
			}

			// If no styles match, just empty it.
			combo.setValue('');
        },

        updateColorPickerState: function(e) {
//            var colorPicker = SiteEditor.editor.getSiteViewToolbarCmp('colorPicker');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var colorPicker = configPanel.query('customcolorpicker[action=colorPicker]', activeSiteView)[0];
            var elementPath = e.data.path,
				elements = elementPath.elements;
				
			// For each element into the elements path and find the tag.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				// First try the attribute color in <font color="#xxxxxx"> first
				var color = element.getAttribute('color');
				if (!color) {
					// Then we try the attribute style="color:#xxxxxx"
					color = element.getStyle('color');
				}
				if (color) {
					color = WContentUtil.colorToHex(color);
					color = color.replace('#', ''); // Remove the #
					colorPicker.setValue(color);
					return;
				}
			}

			// If no styles match, just empty it.
			colorPicker.setValue('');
        },
        
        updateBackgroundColorPickerState: function(e) {
//            var colorPicker = SiteEditor.editor.getSiteViewToolbarCmp('backgroundColorPicker');
            var configPanel = SiteEditor.editor.getProjectEditorComp('x-componentConfig-configForm');
            var activeSiteView = SiteEditor.editor.getActiveSiteview();
            var colorPicker = configPanel.query('customcolorpicker[action=backgroundColorPicker]', activeSiteView)[0];
            var elementPath = e.data.path,
				elements = elementPath.elements;
				
			// For each element into the elements path and find the tag.
			for ( var i = 0, element ; i < elements.length ; i++ ) {
				element = elements[i];
				// First try the attribute color in <font color="#xxxxxx"> first
				var color = element.getAttribute('background-color');
				if (!color) {
					// Then we try the attribute style="color:#xxxxxx"
					color = element.getStyle('background-color');
				}
				if (color) {
					color = WContentUtil.colorToHex(color);
					color = color.replace('#', ''); // Remove the #
					colorPicker.setValue(color);
					return;
				}
			}

			// If no styles match, just empty it.
			colorPicker.setValue('');
        },
        
        colorToHex: function(color) {
		    if (color.substr(0, 1) === '#') {
		        return color;
		    }
		    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
		    
		    var red = parseInt(digits[2]);
		    var green = parseInt(digits[3]);
		    var blue = parseInt(digits[4]);
		    
		    var rgb = blue | (green << 8) | (red << 16);
		    return digits[1] + '#' + rgb.toString(16);
		}/*,
		
		enableTextElementToolbarButtons: function(enabled) {
//			var textElementToolbar = SiteEditor.editor.getActiveSiteview().getToolbar().getTextElementToolbar();
			if (textElementToolbar) {
				// Enable or disable format dropdownlist
				var buttons = textElementToolbar.items.items;
				for (var i = 0; i < buttons.length; i++) {
					var button = buttons[i];
					if (enabled) {
						button.enable();
					} else {
						button.disable();
					}
				}
			}
		}*/
	}

})();