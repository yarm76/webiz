var filterCheck = true;

function numKeyFilter(me){
	var key = event.keyCode;
	if(!(key==8||key==9||key==13||key==46||key==144||(key>=48&&key<=57)||key==190)){
		alert('input Only number!!')
		event.returnValue = false;
		filterCheck = false;
	}else{
		filterCheck = true;
	}
}

function emailFilter(me){
	var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   
	if(me.value!=''){
		if(regex.test(me.value) === false){  
		    alert("wrong mail address format!!");  
		    me.focus();
		    filterCheck = false;
		}else{
			filterCheck = true;
		}
	}
}

function validateMessage(){
	var notValidateCount=0;
	$("#contactusContent textarea").each(function () {
		console.log($(this).attr("name"), $(this).attr("required"), $(this).val());
		if($(this).attr("required")=="required" && ($(this).val()==null || $(this).val()=='')){
			$(this).unbind("click");
			$(this).attr("style", "background-color:#FFA07A;");
			$(this).bind("click", function(){
				$(this).attr("style", "");
			});
			$(this).focus();
			notValidateCount+=1;
		}
	});
	
	$("#contactusContent input").each(function () {
		console.log($(this).attr("name"), $(this).attr("required"), $(this).val());
		if($(this).attr("required")=="required" && ($(this).val()==null || $(this).val()=='')){
			$(this).unbind("click");
			$(this).attr("style", "background-color:#FFA07A;");
			$(this).bind("click", function(){
				$(this).attr("style", "");
			});
			$(this).focus();
			notValidateCount+=1;
		}

	});
	$("#contactusContent select").each(function () {
		console.log($(this).attr("name"), $(this).attr("required"), $(this).val());
		if($(this).attr("required")=="required" && ($(this).val()==null || $(this).val()=='')){
			$(this).unbind("click");
			$(this).attr("style", "background-color:#FFA07A;");
			$(this).bind("click", function(){
				$(this).attr("style", "");
			});
			$(this).focus();
			notValidateCount+=1;
		}

	});

	if(notValidateCount>0){
		return false;
	}
	return true;
	
}

function sendMessage(formNo,categoryNo, adminEmail, categoryTitle){
	var params = new Array();
	var tmpContent='';
	var tmpName='';

	if(!validateMessage())return false;

	$("#addFlag").val("1");
	textCount =$("#contactusContent input[type=text]").length;
	var i=1;
	$("#contactusContent input[type=text]").each(function () {
		
		if(tmpName!=$(this).attr("name")){
			if(tmpName.indexOf("PH")==0){
				tmpContent = tmpContent.substring(0, tmpContent.length-1);
				params.push(tmpName+'_,_'+encodeURIComponent(tmpContent));
			}
			
			tmpContent='';
		}
		
		if($(this).attr("name").indexOf("PH")==0){
			tmpContent += $(this).val() + "-";
		}else{
			params.push($(this).attr("name")+'_,_'+encodeURIComponent($(this).val()));
		}
		
		tmpName = $(this).attr("name");
		if(textCount==i && tmpContent!=''){
			if(tmpName.indexOf("PH")==0){
				tmpContent = tmpContent.substring(0, tmpContent.length-1);
				params.push(tmpName+'_,_'+encodeURIComponent(tmpContent));
			}
		}
		i++;
	});
	$("#contactusContent textarea").each(function () {
		console.log($(this).attr("name"), $(this).val());
		params.push($(this).attr("name")+'_,_'+encodeURIComponent($(this).val()))
	});
	
	$("#contactusContent input").each(function () {
		if($(this).attr("checked")=="checked"){
			console.log($(this).attr("name"), $(this).val());
			params.push($(this).attr("name")+'_,_'+encodeURIComponent($(this).val()))
		}
	});
	$("#contactusContent select").each(function () {
		console.log($(this).attr("name"), $(this).val());
		params.push($(this).attr("name")+'_,_'+encodeURIComponent($(this).val()))
	});
	console.log(params);
	params.sort()
	addMessage(params, formNo, categoryNo, adminEmail, categoryTitle);
	 
	return false;
}

function addMessage(params, formNo, categoryNo, adminEmail, categoryTitle){
	$.ajax({
		url      : '/user/view/contactus/addMessage.json',
		datatype : 'json',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data     : {
					"params": params,
					"formNo": formNo,
					"categoryNo": categoryNo,
					"adminEmail": adminEmail,
					"categoryTitle":categoryTitle
					}, 
		success  : function(data, textStatus){
			if (__$_pt_currentSiteId=='lgericsson'){
				alert("Thank you for your inquiry.\nWe will review and response to your inquiry soon.");
			} else {
				alert("message send complete!!");
			}
			
			$("#contactusContent input[type=text]").each(function () {
				$(this).val("");
			});
			$("#contactusContent textarea").each(function () {
				$(this).val("");
			});
			
			$("#contactusContent input").each(function () {
				$(this).attr("checked", false);
			});
			$("#contactusContent select").each(function () {
				$(this).val("");
			});
		},
		complete: function(){
		},
		error : function(){
		}
	});
	
}

function getForm(formNo, categoryNo, adminEmail, categoryTitle){
	$.ajax({
		url      : '/user/view/contactus/getQuestionItemList.json',
        dataType: 'json',
		data     : {
					"formNo": formNo
					}, 
		success  : function(data, textStatus){
			var qstItems = data;

			$("#contactusContent").html(getQstItem(qstItems));
			$("#sendButton").unbind("click");
			$("#sendButton").bind("click",{fno:formNo, cno:categoryNo, ae:adminEmail, ct:categoryTitle}, function(event){
				
				sendMessage(event.data.fno, event.data.cno, event.data.ae, event.data.ct);
			});

			$('#content').css('height','');
			Pinetree.page.syncContentHeight();
			
		},
		complete: function(){
		},
		error : function(){
			
		}
	});
	
}

function getQstItem(config){
	var content="<form id='contactusForm' method='post'><input type='hidden' id='addFlag' name='addFlag' value='0'>";
	var temp="";
	
	for(var i=0;i<config.length;i++){
		
		temp = '<div class="m_contactus_list">';
		switch (config[i].itemTypeCode) {
		  case 'TB': temp += getQstTextBox(config[i]); break;
		  case 'TA': temp += getQstTextArea(config[i]); break;
		  case 'RB': temp += getQstRadioButton(config[i]); break;
		  case 'CB': temp += getQstCheckBox(config[i]); break;
		  case 'SB': temp += getQstSelectBox(config[i]); break;
		  case 'AD': temp += getQstAddress(config[i]); break;
		  case 'EM': temp += getQstEmail(config[i]); break;
		  case 'PH': temp += getQstPhone(config[i]); break;
		  default  : temp += getQstTextBox(config[i]); 
		}
		temp += '</div>';
		content+=temp;
	}
	content += '</form>'
	return content;
	
}

function getQstTextBox(config){
	var required="";
	var attr="";
	if(config.isRequired==1){
		required="*";
		attr="required"
	}
	var content = '<label for="m_name">'+config.itemTitle+'</label><span class="m_contactus_esen">'+required+'</span>';
    content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
    content += '<input type="text" name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'" class="input_txt1 input_size50" '+attr+'/>';
    return content;
}

function getQstTextArea(config){
	var required="";
	var attr="";
	if(config.isRequired==1){
		required="*";
		attr="required"
	}
	var content = '';
	content += '<label for="m_question">'+config.itemTitle+'</label><span class="m_contactus_esen">'+required+'</span>';
	content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
	content += '<textarea name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'" class="input_txt1 txtbox_size70" '+attr+'></textarea>';
	return content;
}

function getQstRadioButton(config){
	var required="";
	var attr="";
	if(config.isRequired==1){
		required="*";
		attr="required"
	}
	var content = '';
		content += '<h4>'+config.itemTitle+'</h4><span class="m_contactus_esen">'+required+'</span>';
		content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
		for(var i=0;i<config.multiItemList.length;i++){
			if(i==0){
				content += '<p><input type="radio" name="'+config.itemTypeCode+config.itemNo+'" class="input_radio1" value="'+config.multiItemList[i].multiItemValue+'" checked/><label for="'+config.itemTypeCode+config.itemNo+'" class="label_txt1">'+config.multiItemList[i].multiItemDescription+'</label></p>';				
			}else{
				content += '<p><input type="radio" name="'+config.itemTypeCode+config.itemNo+'" class="input_radio1" value="'+config.multiItemList[i].multiItemValue+'"/><label for="'+config.itemTypeCode+config.itemNo+'" class="label_txt1">'+config.multiItemList[i].multiItemDescription+'</label></p>';
			}

			
		}
	return content;
}

function getQstCheckBox(config){
	var required="";
	if(config.isRequired==1){
		required="*";
	}
	var content = '';
		content += '<h4>'+config.itemTitle+'</h4><span class="m_contactus_esen">'+required+'</span>';
		content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
		for(var i=0;i<config.multiItemList.length;i++){
			content += '<p><input type="checkbox" name="'+config.itemTypeCode+config.itemNo+'" class="input_radio1" value="'+config.multiItemList[i].multiItemValue+'"/><label for="'+config.itemTypeCode+config.itemNo+'" class="label_txt1">'+config.multiItemList[i].multiItemDescription+'</label></p>';
		}
	return content;
}

function getQstSelectBox(config){
	var required="";
	var attr="";
	if(config.isRequired==1){
		required="*";
		attr="required"
	}
	var content = '';
		content += '<label for="m_select">'+config.itemTitle+'</label></label><span class="m_contactus_esen">'+required+'</span>';
		content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
		content += '<select name="'+config.itemTypeCode+config.itemNo+'" title="select" class="input_txt1 input_select1" '+attr+'>';
		
		if (__$_pt_currentSiteId=='lgericsson' || __$_pt_currentSiteId=='ericssonlg_ko'){
			if(config.formNo=='1' || config.formNo=='2'){
				content += '<option value="" selected>choose...</option>';
			}else{
				content += '<option value="" selected>제품을 선택해주세요.</option>';
			}
		} else if (__$_pt_currentSiteId=='fasoo' || __$_pt_currentSiteId=='fasoo_eng'){
			if(config.formNo=='1'){
				content += '<option value="" selected>선택해주세요</option>';
			}else if(config.formNo=='2'){
				content += '<option value="" selected>choose...</option>';
			}else{
				content += '<option value="" selected>choose...</option>';
			}
		}
		for(var i=0;i<config.multiItemList.length;i++){
			content += '<option value="'+config.multiItemList[i].multiItemValue+'">'+config.multiItemList[i].multiItemDescription+'</option>';
		}
		content += '</select>';
	return content;
}

function getQstAddress(config){
	var required="";
	var attr="";
	if(config.isRequired==1){
		required="*";
		attr="required"
	}
	var content = '';
		content += '<label for="m_address">'+config.itemTitle+'</label><span class="m_contactus_esen">'+required+'</span>';
		content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
		/*content += '<p><input type="text" readonly name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'_post1" placeholder="" class="input_txt1" />&nbsp;-&nbsp;';
		content += '<input type="text" readonly name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'_post2" placeholder="" class="input_txt1" />';
		content += '<a href="/app/view/contactus/popupAddress.do?field='+config.itemTypeCode+config.itemNo+'" onclick="window.open(this.href, \'_blank\', \'width=400, height=446, toolbars=no, scrollbars=no, status=no\'); return false;" class="m_contactus_btn1">Find Address</a></p>';*/
		content += '<p><input type="text" name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'_addr1" placeholder="Address 1" class="input_txt1 input_size50" '+attr+'/></p>';
		//content += '<p><input type="text" name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'_addr2" placeholder="Address 2" class="input_txt1 input_size50" /></p>';
	
	return content	
}

function getQstEmail(config){
	var required="";
	var attr="";
	if(config.isRequired==1){
		required="*";
		attr="required"
	}
	var content = '<label for="m_name">'+config.itemTitle+'</label><span class="m_contactus_esen">'+required+'</span>';
	    content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
	    content += '<input type="text" name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'" class="input_txt1 input_size50" onblur="javascript:emailFilter(this)" '+attr+'/>';
    return content;
    
}
function getQstPhone(config){
	var required="";
	var attr="";
	if(config.isRequired==1){
		required="*";
		attr="required"
	}
	var content = '';
		content += '<label for="m_phone">'+config.itemTitle+'</label><span class="m_contactus_esen">'+required+'</span>';
		content += '<p class="m_contactus_desc">'+config.itemDescription+'</p>';
		content += '<input type="text" maxlength="5" name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'_tel1" placeholder="" class="input_txt1" onkeypress="javascript:numKeyFilter(this);" '+attr+'/>&nbsp;-&nbsp;';
		content += '<input type="text" maxlength="5" name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'_tel2" placeholder="" class="input_txt1" onkeypress="javascript:numKeyFilter(this);" '+attr+'/>&nbsp;-&nbsp;';
		content += '<input type="text" maxlength="5" name="'+config.itemTypeCode+config.itemNo+'" id="'+config.itemTypeCode+config.itemNo+'_tel3" placeholder="" class="input_txt1" onkeypress="javascript:numKeyFilter(this);" '+attr+'/>';
		return content;
}

function addAddress(_address, field) {
    if (_address.split(';').length >= 2) {
        var zipcode = _address.split(';')[0];
        var address = _address.split(';')[1];
        var zip1 = zipcode.substring(0, 3);
        var zip2 = zipcode.substring(3, 6);
        $('#'+field+'_post1').val(zip1);
        $('#'+field+'_post2').val(zip2);
        $('#'+field+'_addr1').val(address);
    }
}

function tabColarChang(el) {
	$('.m_contactus_tab li').attr('class','');
	if (__$_pt_currentSiteId=='lgericsson' || __$_pt_currentSiteId=='ericssonlg_ko'){
		el.attr('class','m_contactus_tab_on_lgericsson');
	} else {
		el.attr('class','m_contactus_tab_on_fasoo');
	}
}
