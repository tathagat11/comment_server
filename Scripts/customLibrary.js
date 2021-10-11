(function(window){
  // 'use strict';
  validator = () => {
    var O = {};
    O.validate = async (u,t,k,pageId) => {
      var U = customLib().urlVars();
      if(btoa(u) !== U.u || atob(t) !== atob(U.t) || k !== U.k)
        customLib().logout();
      if(pageId)
        await O.pageValidate(pageId);
    }
    O.pageValidate = async (pageId) => {
      var navs = await _nav.navlist();
      const checkOpen = (NV,pageId) => {
        let res = {OK:false,open:false}
        if(NV.children){
          for(var j = 0; j < NV.children.length; j++){
            res = checkOpen(NV.children[j], pageId);
            if(res.OK)
              break;
          }
        }
        else{
          var uType = atob(sessionStorage.getItem('Type'))
          if(NV.id == pageId){
            res.OK = true;
            if(NV.openFor !== undefined && NV.openFor !== null){
              var noOpen = false;
              var openFor = NV.openFor.split(',');
              for(var n = 0; n < openFor.length; n++){
                  if(openFor[n] !== uType)
                      noOpen = true;
                  else{
                      noOpen = false;
                      break;
                  }
              }
              if(noOpen)
                  res.open = false;
              else
                res.open = true;
            }
            else
              res.open = true;
          }
        }
        return res;
      }
      let Res = {OK:false,open:false}
      for(var i=0; i<navs.length; i++){
        Res = checkOpen(navs[i], pageId);
        if(Res.OK)
          break;
      }
      if(!Res.open)
        customLib().logout();
    }
    return O;
  }

  customLib = () => {
    var O = {};
    O.suggestData = [];
    O.suggestHeaders = [];
    O.suggestConfig = {};
    O.show_Toast = (type,logo,msg) => {
      var toastBox = document.getElementById('TOAST-BOX');
      if(!toastBox){
        toastBox = document.createElement('div'); 
        toastBox.setAttribute('id','TOAST-BOX')
        document.body.appendChild(toastBox);
      }
      var toastCount = 1;
      var toasts = document.getElementsByName('snackbars');
      if(toasts)
        toastCount = toasts.length;
      var toast = document.createElement('div');
      toast.setAttribute('id',`snack${toastCount}`);
      toast.setAttribute('name',`snackbars`);
      toast.setAttribute('class',`snackbar ${type}-snack`);
      toast.setAttribute('onclick',`_cL.close_Toast('${toastCount}')`);
      toast.innerHTML = `<span style='font-size:25px;'>${logo};</span> ${msg}`;
      toastBox.prepend(toast);
      toast.className += ' show';
      /* setTimeout(function(){
         toast.className = toast.className.replace("show", ""); 
         setTimeout(function(){toastBox.removeChild(toast) }, 5000);
      }, 5000); */
    }
    O.close_Toast = (toastId) => {
      var toastBox = document.getElementById('TOAST-BOX');
      if(toastBox){
        var toast = document.getElementById(`snack${toastId}`);
        if(toast)
          toastBox.removeChild(toast)
      }
    }
    O.show_Toast_MSG = (msg,warn) => {
      var toastBox = document.getElementById('TOAST-MSG-BOX');
      if(!toastBox){
        toastBox = document.createElement('div'); 
        toastBox.setAttribute('id','TOAST-MSG-BOX')
        toastBox.setAttribute('class', 'MSG-snackbar ');
        toastBox.setAttribute('style', 'cursor:pointer; ');
        toastBox.setAttribute('onclick', '_cL.close_Toast_MSG();');
        document.body.appendChild(toastBox);
      }
      if(warn){
        toastBox.className = toastBox.className.replace("MSG-snackbar-simple", "");
        toastBox.className += ' MSG-snackbar-warn';
      }
      else{
        toastBox.className = toastBox.className.replace("MSG-snackbar-warn", "");
        toastBox.className += ' MSG-snackbar-simple';
      }
      toastBox.className = toastBox.className.replace("show", "");
      toastBox.innerHTML = "";
      toastBox.innerHTML = `${msg}`;
      toastBox.className += ' show';
      
      setTimeout(function(){
        toastBox.className = toastBox.className.replace("show", ""); 
      }, 5000);
    }
    O.close_Toast_MSG = ()=>{
      var toastBox = document.getElementById('TOAST-MSG-BOX');
      if(toastBox)
        toastBox.className = toastBox.className.replace("show", "");
    }
    O.showValidation = (arr) => {
      var invalid = false;
      try{
        for(var i = 0; i < arr.length; i++){
          if($(`#${arr[i]}`).val() == ''){
            $(`#${arr[i]}-invalid`).show();
            invalid =true;
            break;
          }
          else
            $(`#${arr[i]}-invalid`).hide();
        }
      }catch{}
      return invalid;
    }
    O.clearValidations = (arr) =>{
      try{
        for(var i = 0; i < arr.length; i++)
          $(`#${arr[i]}-invalid`).hide();
      }catch{}
    }
    O.urlVars = () => {
      var vars = [], hash = [];
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
          //hash = hashes[i].split('=');
          hash[0] = hashes[i].substring(0,hashes[i].indexOf('='))
          hash[1] = hashes[i].substring(hashes[i].indexOf('=')+1)
          //vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
    }
    O.logout = () => {
      sessionStorage.clear(), window.open('index.html','_self');
    }
    O.redirect = (loc,ses,param) => {
      if(!param) param = '';
      if(ses){
        var sessData = ses.split(',');
        for(var i=0; i<sessData.length; i++){
          var keys = sessData[i].split(':');
          sessionStorage.setItem(keys[0],keys[1]);
        }
      }
      window.open(`${loc}?u=${btoa(sessionStorage.getItem("username"))}&t=${sessionStorage.getItem("Type")}&k=${sessionStorage.getItem("token")}${param}`, "_self");
    }
    O.openNewTab = (loc,ses,param) => {
      if(!param) param = '';
      var tabObj = sessionStorage.getItem('TabDatas');
      var TabDatas;
      if(!tabObj){
        sessionStorage.setItem('TabDatas',JSON.stringify({}));
        TabDatas = {};
      }
      else{
        TabDatas = JSON.parse(tabObj);
      }
      var SESD = {};
      if(ses){
        var sessData = ses.split(',');
        for(var i=0; i<sessData.length; i++){
          var keys = sessData[i].split(':');
          SESD[keys[0]] = keys[1];
        }
      }
      var tabId = Object.keys(TabDatas) + 1;
      TabDatas[tabId] = {
        tabId : tabId
      }
      if(SESD){
        for(var key in SESD){
          TabDatas[tabId][key] = SESD[key]
        }
      }
      sessionStorage.setItem('TabDatas',JSON.stringify(TabDatas));
      window.open(`${loc}?u=${btoa(sessionStorage.getItem("username"))}&t=${sessionStorage.getItem("Type")}&k=${sessionStorage.getItem("token")}&tabId=${tabId}${param}`, "_blank");
    }
    O.login = () => {
      atob(sessionStorage.getItem("Type")) == "ASM" ?  O.redirect('userlanding.html') : atob(sessionStorage.getItem("Type")) == "SUPER ADMIN" || atob(sessionStorage.getItem("Type")) == "SUPPORT ADMIN" ? O.redirect('landing.html') : atob(sessionStorage.getItem("Type")) == "ADMIN" ? O.redirect('landing.html') : O.logout();//O.redirect('landing.html');
    }
    O.readConfigs = async (ConfigFile)=>{
      try{
        let data = [];
        try{
            let response = await fetch(ConfigFile);
            if(response.ok){
                data = await response.json();
            }
            else{
                data = [];
                console.warn('Configuration file failed to load');
            }
        }
        catch{
            data = [];
            console.warn('Configuration file failed to load');
        }
        if(data.length > 0)
          return data;
        else
          return null;
      }
      catch(err){
        console.log(err);
        return null;
      }
    }
    O.fetchListData = (op) => {
      return new Promise((resolve, reject)=>{
        $("#loader").show()
        try{
          var req = {
              "orgId" : parseInt(sessionStorage.getItem("orgId")),
              "user" : sessionStorage.getItem("username"),
              "data" : {
                  "operation" : "getlists",
                  "listType" : "" + op
              }
          }
          var ajax = $
              .ajax({
                  type : "POST",
                  url : "" + networkURL.URL + "/getdata",
                  headers : {token:sessionStorage.getItem('token')},
                  data : '' + JSON.stringify(req),
                  contentType : "application/json; charset=utf-8",
                  dataType : "json",
                  success : function(data) {
                      if(data.status == 'SUCCESS'){
                          if(data.data.length > 0)
                            resolve(data.data);
                          else
                            resolve(null)
                      }
                  },
                  error: function(err){
                      console.error(err)
                      resolve(null)
                  }
              });
        }
        catch(err){
          console.error(err);
          resolve(null);
        }
      });
    }
    O.suggestPopup = async (name ,op, vFld, vCol, hFld, hCol, isConfig) => {
      $("#loader").show()
      var dyn_elem = document.getElementById("dynamic-content");
      if(dyn_elem)
          document.body.removeChild(dyn_elem);
      let Datas;
      if(isConfig)
        Datas = await O.readConfigs(`./configurations/${op}.json`)
      else
        Datas = await O.fetchListData(op);
      if(Datas){
        O.suggestConfig = {
          name:name,
          vFld:vFld,
          vCol:vCol,
          hFld:hFld,
          hCol:hCol
        }
        O.suggestData = Datas;
        var Headers = [];
        var tHead = '<tr>';
        for(var Header in Datas[0]){
            tHead += '<td scope="col">'+Header+'</td>';
            Headers.push(Header);
        }
        tHead += '<td scope="col">select</td>'
        tHead += '</tr>';
        O.suggestHeaders = Headers;
        O.bindSuggestion(Datas,tHead);
      }  
      else
        O.suggestData = [];
      $("#loader").hide()
    }
    O.bindSuggestion = (Datas,tHead,isSearch) => {
      var searchVal = '';
      if(isSearch)
        searchVal = isSearch;
      var tRows = '';
      for(var i=0; i<Datas.length; i++){
          tRows += '<tr>';
          for(var j=0; j<O.suggestHeaders.length; j++){
              tRows += '<td>'+Datas[i][O.suggestHeaders[j]]+'</td>';
          }
          var visible = Datas[i][O.suggestConfig.vCol];
          var hidden = Datas[i][O.suggestConfig.hCol];
          tRows += `<td><input type="radio" name="selected${O.suggestConfig.name}" onclick="_cL.closeSuggestPopup('${O.suggestConfig.vFld}','${visible}','${O.suggestConfig.hFld}','${hidden}')"/></td>`
          tRows += '</tr>';
      }
      var table = `<div class="table-responsive" style="font-size: small; background-color: white; padding: 10px;">
                      <table id="dynamic-BindTable" class="table table-striped" style="font-size:11px; border:1px solid lightgrey;">
                          <thead>
                              ${tHead}
                          </thead>
                          <tbody>
                              ${tRows}
                          </tbody>
                      </table>
                  </div>`;
      var dyn_Content = `
      <div class="dyn-Comp">
          <div class="layer onTop"></div>
          <div class="dyn-list">
              <div class="top-bar">
                  <div><b>${O.suggestConfig.name}</b></div>
                  <div class="close" onclick='_cL.closeSuggestPopup()'>X</div>
              </div>
              <hr/>
              <div class="srch-bar">
                  Quick Search  &nbsp&nbsp
                  <form class="getTexts" action="javascript:void(0);" onsubmit="_cL.searchSuggestion(event)">
                      <input id="dynSrch" type="text" name="search2" placeholder="search" value="${searchVal}" oninput="_cL.suggestSRCHChanged();">
                      <button type="submit" ><i class="fa fa-search"></i></button>
                  </form>
              </div>
              ${table}
          </div>
      </div>`
      var element = document.createElement('div');
      element.setAttribute('id', 'dynamic-content');
      element.style.display = 'none';
      document.body.appendChild(element);
      $("#dynamic-content").html(dyn_Content);
      $("#dynamic-BindTable").dataTable({
          "bFilter": false,
          "bInfo": false,
          "bLengthChange":false,
          "aaSorting":[
              [0, "desc"]
          ]
      });
      $("#dynamic-content").show();
    }
    O.closeSuggestPopup = (vEl, vVal, hEl, hVal) => {
      if(vEl && vVal && hEl && hVal){
        document.getElementById(vEl).value = vVal;
        document.getElementById(hEl).value = hVal;
      }
      O.suggestConfig = {};
      O.suggestData = [];
      $("#dynamic-content").html(null);
      $("#dynamic-content").hide();
      var dyn_elem = document.getElementById("dynamic-content");
      if(dyn_elem)
          document.body.removeChild(dyn_elem);
    }
    O.searchSuggestion = (e) => {
      $('#loader').show();
      e.preventDefault();
      var searchText = $('#dynSrch').val().toLowerCase();
      if(searchText !== ''){
        var searched = [];
        var tHead = '<tr>';
        for(var j=0; j<O.suggestHeaders.length; j++){
            tHead += '<td scope="col">'+O.suggestHeaders[j]+'</td>';
        }
        tHead += '<td scope="col">select</td>'
        tHead += '</tr>';
        for(var i=0; i<O.suggestData.length; i++){
          for(var j=0; j<O.suggestHeaders.length; j++){
              var hD = O.suggestHeaders[j];
              if(O.suggestData[i][hD].toString().toLowerCase().indexOf(searchText) !== -1){
                searched.push(O.suggestData[i]);
                break;
              }
          }
        }
        O.bindSuggestion(searched,tHead,searchText);
      }
      $("#loader").hide()
    }
    O.suggestSRCHChanged = () => {
      var searchTxt = $('#dynSrch').val();
      if(searchTxt == ""){
        var tHead = '<tr>';
        for(var j=0; j<O.suggestHeaders.length; j++){
            tHead += '<td scope="col">'+O.suggestHeaders[j]+'</td>';
        }
        tHead += '<td scope="col">select</td>'
        tHead += '</tr>';
        O.bindSuggestion(O.suggestData,tHead);
      }
    }
    O.apiCall = (input, callback) => {
      try{
        input.body.orgId = parseInt(sessionStorage.getItem('orgId'));
        input.body.user = sessionStorage.getItem('username');
        var ajax = $
            .ajax({
                type : "POST",
                url : "" + networkURL.URL + "/" + input.service,
                headers : {token:sessionStorage.getItem('token')},
                data : '' + JSON.stringify(input.body),
                contentType : "application/json; charset=utf-8",
                dataType : "json",
                success : function(data) {
                  var status = '';
                  var logo = '';
                  if(data.status == 'SUCCESS'){
                    status = 'ok';
                    logo = '&#x2713';
                  }
                  else{
                    status = 'error';
                    logo = '&#9888';
                  }
                  if(data.message)
                    O.show_Toast(status,logo,data.message);
                  callback(null, data);
                },
                error: function(err){
                    console.error(err)
                    let error = '';
                    if(err.responseJSON){
                      if(err.responseJSON.error == 'Unauthorized token'){
                          O.show_Toast('error','&#9888','Session Expired!! login again')
                          alert(" Login expired \n please login again.")
                          _cL.logout();
                      }
                      if(err.responseJSON.message)
                        error = err.responseJSON.message;
                      else if(err.responseJSON.error){
                        try{
                          let strJSON = JSON.stringify(err.responseJSON.error);
                          let len = 30;
                          if(strJSON.length <30) len = strJSON.length - 1;
                          error = strJSON.substring(0,len);
                        }catch{
                          try{
                            let len = 30;
                            if(err.responseJSON.error.toString().length <30) len = err.responseJSON.error.toString().length - 1;
                            error = err.responseJSON.error.toString().substring(0,len);
                          }catch{
                              error = 'Internal server error'
                          }
                        }
                      }
                      else{
                        try{
                          let strJSON = JSON.stringify(err.responseJSON);
                          let len = 30;
                          if(strJSON.length <30) len = strJSON.length - 1;
                          error = strJSON.substring(0,len);
                        }catch{
                          try{
                            let len = 30;
                            if(err.responseJSON.toString().length <30) len = err.responseJSON.toString().length - 1;
                            error = err.responseJSON.toString().substring(0,len);
                          }catch{
                              error = 'Internal server error'
                          }
                        }
                      }
                    }
                    else 
                      error = 'Internal server error'
                    if(error == '')
                      error = 'Internal server error'
                    O.show_Toast('error','&#9888',error);
                    callback(err,null);
                }
            });
      }
      catch(err){
        console.error(err);
        callback(err,null);
      }
    }
    O.apiGet = (url, callback) => {
      var ajax = $
            .ajax({
                type : "POST",
                url : "" + url,
                success : function(data) {
                  callback(null, data);
                },
                error: function(err){
                    callback(err,null);
                }
            });
    }
    O.apiCallFormData = (input, callback) => {
      try{
        var ajax = $
            .ajax({
                type : "POST",
                url : "" + networkURL.URL + "/" + input.service,
                headers : {token:sessionStorage.getItem('token')},
                data : input.body,
                success : function(data) {
                  var status = '';
                  var logo = '';
                  if(data.status == 'SUCCESS'){
                    status = 'ok';
                    logo = '&#x2713';
                  }
                  else{
                    status = 'error';
                    logo = '&#9888';
                  }
                  if(data.message)
                    O.show_Toast(status,logo,data.message);
                  callback(null, data);
                },
                error: function(err){
                    console.error(err)
                    let error = '';
                    if(err.responseJSON){
                      if(err.responseJSON.error == 'Unauthorized token'){
                          O.show_Toast('error','&#9888','Session Expired!! login again')
                          alert(" Login expired \n please login again.")
                          _cL.logout();
                      }
                      if(err.responseJSON.message)
                        error = err.responseJSON.message;
                      else if(err.responseJSON.error){
                        try{
                          let strJSON = JSON.stringify(err.responseJSON.error);
                          let len = 30;
                          if(strJSON.length <30) len = strJSON.length - 1;
                          error = strJSON.substring(0,len);
                        }catch{
                          try{
                            let len = 30;
                            if(err.responseJSON.error.toString().length <30) len = err.responseJSON.error.toString().length - 1;
                            error = err.responseJSON.error.toString().substring(0,len);
                          }catch{
                              error = 'Internal server error'
                          }
                        }
                      }
                      else{
                        try{
                          let strJSON = JSON.stringify(err.responseJSON);
                          let len = 30;
                          if(strJSON.length <30) len = strJSON.length - 1;
                          error = strJSON.substring(0,len);
                        }catch{
                          try{
                            let len = 30;
                            if(err.responseJSON.toString().length <30) len = err.responseJSON.toString().length - 1;
                            error = err.responseJSON.toString().substring(0,len);
                          }catch{
                              error = 'Internal server error'
                          }
                        }
                      }
                    }
                    else 
                      error = 'Internal server error'
                    if(error == '')
                      error = 'Internal server error'
                    O.show_Toast('error','&#9888',error);
                    callback(err,null);
                },
                cache: false,
                contentType: false,
                processData: false
            });
      }
      catch(err){
        console.error(err);
        callback(err,null);
      }
    }
    O.clearFields = (fields)=>{
        for(var i=0; i<fields.length; i++)
            $('#'+fields[i]).val('');
    }
    O.previewFormat = async (name ,op) => {
      $("#loader").show()
      var dyn_elem = document.getElementById("dynamic-content");
      if(dyn_elem)
          document.body.removeChild(dyn_elem);
      let Data = await O.readConfigs(`./configurations/csv_formats.json`)
      if(Data){
        let Datas = Data[0][op];
        var Headers = [];
        var first = true;
        var tHead = '';
        var tRows = '';
        for(var i=0; i<Datas.length; i++){
            if(first){
                tHead += '<tr>';
                for(var Header in Datas[i]){
                    tHead += '<td scope="col">'+Header+'</td>';
                    Headers.push(Header);
                }
                tHead += '</tr>';
                first = false;
            }
            tRows += '<tr>';
            for(var j=0; j<Headers.length; j++){
                tRows += '<td>'+Datas[i][Headers[j]]+'</td>';
            }
            tRows += '</tr>';
        }
        var table = `<div class="table-responsive" style="font-size: small; background-color: white; padding: 10px;">
                        <table class="table table-striped" style="font-size:11px; border:1px solid lightgrey;">
                            <thead>
                                ${tHead}
                            </thead>
                            <tbody>
                                ${tRows}
                            </tbody>
                        </table>
                    </div>`;
        var dyn_Content = `
        <div class="dyn-Comp">
            <div class="layer onTop"></div>
            <div class="dyn-list">
                <div class="top-bar">
                    <div><b>${name}</b></div>
                    <div class="close" onclick='_cL.closeSuggestPopup()'>X</div>
                </div>
                <hr/>
                ${table}
                <div style="margin:10px;"></div>
            </div>
        </div>`
        var element = document.createElement('div');
        element.setAttribute('id', 'dynamic-content');
        element.style.display = 'none';
        document.body.appendChild(element);
        $("#dynamic-content").html(dyn_Content);
        $("#dynamic-content").show();
      }  
      $("#loader").hide()
    }
    O.deleteRow  = (t,i) => {
      var dyn_elem = document.getElementById("dynamic-content");
      if(dyn_elem)
          document.body.removeChild(dyn_elem);
      var dyn_Content = `
        <div class="dyn-Comp">
            <div class="layer onTop"></div>
            <div class="dyn-popup">
                <div>Confirm delete</div>
                <hr/>
                <div>
                  <button class="grey-btn" onclick='_cL.closeSuggestPopup()'>Cancel</button>
                  <button class="red-btn" onclick="_cL.deleteFromGrid('${t}','${i}')">Delete</button>
                </div>
            </div>
        </div>`
      var element = document.createElement('div');
      element.setAttribute('id', 'dynamic-content');
      element.style.display = 'none';
      document.body.appendChild(element);
      $("#dynamic-content").html(dyn_Content);
      $("#dynamic-content").show();
    }
    O.deleteFromGrid = (t,i) => {
      $("#loader").show();
      O.closeSuggestPopup();
      O.apiCall({
        service:'adminops',
        body:{
          data:{
            operation:'deleterow',
            rowType:t,
            rowId:i
          }
        }
      },(err,data)=>{
        $("#loader").hide();
        if(err){
        }
        else{
          if(data.status == 'SUCCESS'){
            $("#loader").show();
            loadData();
          }
        }
      })
    }
    O.storageToObject = (storage) => {
      let obj = {};
      try{
        for(var i = 0; i < sessionStorage.length; i++){
          var k = sessionStorage.key(i), v = sessionStorage.getItem(k);
          obj[k] = v;
        }
      }catch{}
      return obj;
    }
    O.getTabContent = (tabId) => {
      try{
        var tabObj = sessionStorage.getItem('TabDatas');
        if(!tabObj){
          return null;
        }
        else{
          var TabData = JSON.parse(tabObj);
          if(!TabData)
            return null;
          else
            return TabData[tabId];
        }
      }catch{return null;}
    }
    O.expiryAlert = (expired) => {
      if(!expired){
        const hasExpiry = sessionStorage.getItem('expireSub');
        if(hasExpiry !== undefined && hasExpiry !== null && hasExpiry !== ''){
          const expiry = JSON.parse(hasExpiry);
          if(expiry.date == 0)
            O.show_Toast_MSG(`Subscription will expire today`, true)
          else
            O.show_Toast_MSG(`Subscription will expire in ${expiry.date} day(s)`, true);
        }
      }
      else{
        O.show_Toast_MSG(`Subscription expired`, true)
      }
    }
    O.getObjectFromArray = (arr, config) => {
      for(var i = 0; i < arr.length; i++){
        if(arr[i][config.key] == config.val){
          return arr[i];
        }
      }
      return null;
    }
    return O;
  }

  if(typeof(window._vD) === 'undefined') window._vD = validator();
  if(typeof(window._cL) === 'undefined') window._cL= customLib();

})(window);