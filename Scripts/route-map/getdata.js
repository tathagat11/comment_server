function fetch_n_load(){
    //alert('STOP')
    $("#loader").show();
    UnbindFilters();
    clearMarkers();
    clearPolygons();
    //let urlData = _cL.urlVars();
    let urlData = {
        org: sessionStorage.getItem("maporg"),
        tertry: sessionStorage.getItem("maptertry")
    };
    if(urlData.org && urlData.tertry){
        LOAD.CSV = true;    
        get_routeData();

    }
    else
        _cL.login();
}
async function get_routeData(){
    var cachedData = await _cacheManager.get(cacheInstance,"routeData");
    if(!cachedData){
        var req_2 = {
            "orgId" : parseInt(sessionStorage.getItem("orgId")),
            "user" : sessionStorage.getItem("username"),
            "data" : {
                "operation" : "routecache",
                "orgId" : atob(TAB_OBJ.routeOrg),
                "territoryId" : atob(TAB_OBJ.routeTertry),
                "distId" : atob(TAB_OBJ.routeDist),
                "getAll":false
            }
        }
        _cL.apiCall({
            service: 'getdata',
            body: req_2
        },async (err,data)=>{
            if(err){
                LOAD.CSV = false;
                if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
                    $("#loader").hide();
            }
            else{
                var loadLOCS = false;
                if(data.status == 'SUCCESS'){
                    loadCacheRouteData(data.data);
                    await _cacheManager.put(cacheInstance, "routeData", data.data);
                }
                else if(data.error == 'Unauthorized Token'){
                    sessionStorage.clear();
                    alert('Session Expired login again');
                    window.open("index.html", "_self");
                }
                else{
                    console.error(data);
                }
            }
        })
    }
    else{
        loadCacheRouteData(cachedData);
    }
}
function loadCacheRouteData(data){
    var loadLOCS = false;
    hasOrdr = data.hasOrdr;
    if(data.hasOwnProperty('LocData'))
        loadLOCS = true;
    if(loadLOCS){
        //Data = data.LocData;
        //bindChannels(data.CHANNELS);
        //groupAndPlot(data.SUBGROUPS, data.GROUPS);
        bindGroup(data.distName, data.Dist);
        PlotPoints(data.LocData, true);
    }
    else{
        LOAD.CSV = false;
        if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
            $("#loader").hide();
    }
}
async function fetchFromFile(file){
    return new Promise((resolve,reject)=>{
        let filename = '';
        if(file.indexOf('/')){
            let files = file.split('/');
            filename = files[files.length-1];
        }else{
            filename = file;
        }
        var inputJSON = {
            data:{
                operation:'getfiledata',
                File:{
                    name:filename
                }
            }
        }
        _cL.apiCall({
            service:'getdata',
            body:inputJSON
        },(err,data)=>{
            if(err){
                console.log(err)
                return resolve(null);
            }
            else{
                if(data.status == 'SUCCESS')
                    return resolve(data.data);
                else
                    return resolve(null)
            }
        })
    })
}

async function FetchKMLData_Ward(filePath) {
    LOAD.KML_WD = true;
    $("#loader").show();
    if(filePath != null && filePath != ''){
        try {
            let data = await fetchFromFile(filePath);
            if(data)
                ParseKML(data, true);
            else{
                LOAD.KML_WD = false;
                CONFIG.kmlUpload = true;
                console.warn('KML file failed to load : please use upload method');
            }
        }
        catch{
            LOAD.KML_WD = false;
            CONFIG.kmlUpload = true;
            console.warn('KML file failed to load : please use upload method');
        }
    }
    else{
        LOAD.KML_WD = false;
        CONFIG.kmlUpload = true;
        console.warn('KML file missing in configuration : please use upload method');
    }
    if(!LOAD.KML_WD && !LOAD.KML_DB && !LOAD.CSV )
        $("#loader").hide();
}
async function FetchKMLData_DB(filePath,dtCount) {
    LOAD.KML_DB = true;
    $("#loader").show();
    //filePath = './dummy-Data/Hyderabad_Distributor Boundary.kml'
    if(filePath != null && filePath != ''){
        try {
            let data = await fetchFromFile(filePath);
            if(data)
                ParseKML(data, false);
            else{
                LOAD.KML_DB = false;
                CONFIG.kmlUpload = true;
                console.warn('KML file failed to load : please use upload method');
            }
        }
        catch{
            LOAD.KML_DB = false;
            CONFIG.kmlUpload = true;
            console.warn('KML file failed to load : please use upload method');
        }
    }
    else{
        LOAD.KML_DB = false;
        CONFIG.kmlUpload = true;
        console.warn('KML file missing in configuration : please use upload method');
    }
    if(!LOAD.KML_WD && !LOAD.KML_DB && !LOAD.CSV)
        $("#loader").hide();
}
async function get_Data(getSubs, all){
    LOAD.CSV = true;
    $("#loader").show();
    var Group_Sel = []
    var onecheck = false;
    var dropchecks = document.getElementsByName('dropcheckItems');
    if(dropchecks){
        for(let i=0; i<dropchecks.length; i++){
            if(dropchecks[i].checked == true){
                onecheck = true;
                Group_Sel.push(dropchecks[i].value);
            }
        }
        if(!onecheck)
            Group_Sel.push('');
    }
    /* var grp_sel = $('#GroupSelect option:selected').val();
    Group_Sel.push(grp_sel); */
    var SubGroup_Sel = $('#SubGroupSelect option:selected').val();
    var channels = document.getElementsByName('Channels');
    var chnlFltr = [];
    onecheck = false;
    if(channels){
        for(let i=0; i<channels.length; i++){
            if(channels[i].checked == true){
                if(channels[i].value !== 'AllChannel'){
                    onecheck = true;
                    chnlFltr.push(channels[i].value);
                }
            }
        }
        if(!onecheck)
            chnlFltr.push('');
    }
    var PlotAll = false;
    if(all)
        PlotAll = $('#PLOTALL').prop("checked");
    else
        $('#PLOTALL').prop("checked", false);
    var InputJson = {
        orgId: parseInt(sessionStorage.getItem("orgId")),
        user: sessionStorage.getItem('orgId'),
        user: sessionStorage.getItem('username'),
        data: {
            "operation" : "custdata",
            "orgId" : parseInt(atob(sessionStorage.getItem("maporg"))),
            "territoryId" : atob(sessionStorage.getItem("maptertry")),
            distributor : Group_Sel,
            route : SubGroup_Sel,
            channel : chnlFltr,
            getAll: false,
            getSubData: true,
        }/* ,
        config: {
            Bucket: "" + BUCKET_NAME,
            MasterFile: "" + MASTER_FILE,
            OrderFile: "" + ORDER_FILE
        },
        conditions:[
            {
                field: "GROUP_CD",
                value: "" + Group_Sel,
                operation: "EQ",
                AND: true
            }
        ] */
    };
    if(!getSubs){
        InputJson.data.getSubData = false;
    }
    if(PlotAll)
        InputJson.data.getAll = true;
    var callAjax = $.ajax({
        type: "POST",
        url:  "" + networkURL.URL + "getdata",
        headers : {token:sessionStorage.getItem('token')},
        data: "" + JSON.stringify(InputJson),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (data) => {
            if(data.status == 'SUCCESS'){
                Data = data.data.LocData;
                hasOrdr = data.data.hasOrdr;
                if(getSubs)
                    groupAndPlot(data.data.SUBGROUPS);
                else
                    PlotPoints();
            }
            else if(data.error == 'Unauthorized Token'){
                sessionStorage.clear();
                alert('Session Expired login again');
                window.open("index.html", "_self");
            }
            else{
                console.error(data);
            }
        },
        error: (err) => {
            LOAD.CSV = false;
            if(err.responseJSON){
                if(err.responseJSON.error == 'Unauthorized token'){
                    alert(" Login expired \n please login again.")
                    _cL.logout();
                }
            }
            $("#loader").hide();
        }
    });
}

function getfromOSRM(Data, isDist){
    return new Promise((resolve, reject)=>{
        var osrm_port = 'https://osrmsigma.dhisigma.com/trip/v1/driving/';
        if(isDist)
            osrm_port = osrm_port.replace('trip','route');
        var ltlngs = '';
        for(var i=0; i<Data.length; i++){
            if(ltlngs !== '')
                ltlngs += ';';
            let lat = Data[i].loc[0];
            let lng = Data[i].loc[1];
            ltlngs += `${lng},${lat}`;
        }
        var reqst = `${osrm_port}${ltlngs}?annotations=distance`;
        _cL.apiGet(reqst,(err,data)=>{
            resolve(data);
        })
    })
}