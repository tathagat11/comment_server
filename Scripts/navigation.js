(function(window){
    // 'use strict';
      
    navigation = () => {
        var N = {};
        N.defltLnk = 'home-lnk';
        N.navlist = async () =>{
            try{
                let response = await fetch('./configurations/navigations.json');
                if(response.ok){
                    let data = await response.json();
                    return data;
                }
                else{
                    return [];
                }
            }
            catch(err){
                console.error(err);
                return [];
            }
        }

        N.getNavigation = async () => {
            var uType = atob(sessionStorage.getItem('Type'))
            var pNav = sessionStorage.getItem('pNav')
            var cNav = sessionStorage.getItem('cNav')
            if(pNav == 'null')
                pNav = null;
            if(!cNav)
                cNav = N.defltLnk;
            var navs = await N.navlist();
            var navContent = ``;
            const getNavObj = (NV,P,C) => {
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
                        return '';
                }
                var chld = ``,cls = `button-link-grey`,link = ``;
                /* if(NV.type == 'collapse')
                    cls = `button-box-grey`;
                else if(NV.type == 'item')
                    cls = `button-link-grey`; */
                if(NV.url && NV.url !== ''){
                    var adon =  ``;
                    if(NV.ses)
                        adon = `,'${NV.ses}'`;
                    if(NV.param){
                        if(adon !== '')
                            adon +=  `,`
                        else
                            adon += `,null,`
                        adon += `'${NV.param}'`;
                    }
                    link = `onclick="_cL.redirect('${NV.url}'${adon})"`
                }
                if(NV.id == P || NV.id == C)
                    cls += ` active`;
                if(cls.indexOf('active') != -1 && NV.children){
                    cls = `button-box-grey active`;
                    for(var j = 0; j < NV.children.length; j++){
                        chld += getNavObj(NV.children[j], P, C);
                    }
                }
                if(cls.indexOf('active') !== -1)
                    link = ``;
                return `<div class="${cls}" ${link}>${NV.name}${chld}</div>`
            }
            /* const getchilds = (NV,P,C) => {
                var chld = ``;
                for(var i = 0; i < NV.length; i++){
                    var inChld  = ``;
                    if(NV.children){
                        inChld = getchilds(NV.children);
                    }

                }
            } */
            for(var i=0; i<navs.length; i++){
                navContent += getNavObj(navs[i], pNav, cNav);
            }
            var nav = `
            <div class="sideBar col-12 col-md-3 responsive pr-0 fixed pd-20">
                <div class="img-box">
                    <img src="./images/Map_Logo.png" >
                </div>
                <div class="nav-content">
                    ${navContent}
                </div>
                <div id="downloads" class="downloads">
                    <div class="Download-Link" onclick="_cL.logout()"><i class="fa fa-sign-out icons"></i> &nbsp; Logout</div>
                </div>
            </div>`
            return nav;
        }

        return N;
    }
  
    if(typeof(window._nav) === 'undefined') window._nav = navigation();
  
  })(window);