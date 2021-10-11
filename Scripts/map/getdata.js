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
        LOAD.KML_DB = true;
        LOAD.KML_WD = true;
        LOAD.CSV = true;
        
        get_WardData();
        get_CustData();
        //get_DistData();
        
        var req_3 = {
            "orgId" : parseInt(sessionStorage.getItem("orgId")),
            "user" : sessionStorage.getItem("username"),
            "data" : {
                "operation" : "distdata",
                "orgId" : atob(sessionStorage.getItem("maporg")),
                "territoryId" : atob(sessionStorage.getItem("maptertry"))
            }
        }
        _cL.apiCall({
            service: 'getdata',
            body: req_3
        },(err,data)=>{
            if(err){
                LOAD.KML_DB = false;
                if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
                    $("#loader").hide();
            }
            else{
                if(data.status == 'SUCCESS'){
                    if(data.data.length > 0){
                        for(var i=0; i<data.data.length; i++){
                            dist_Cust[data.data[i].Name] = data.data[i].Cust;
                        }
                        FetchKMLData_DB(data.data[0]['DistFile']);
                    }
                    else{
                        LOAD.KML_DB = false;
                        if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
                            $("#loader").hide();
                    }
                } 
            }
        })
    }
    else
        _cL.login();
    //$("#loader").hide();
    
}
async function get_WardData(){
    var cachedData = await _cacheManager.get(cacheInstance,"wardData");
    if(!cachedData){
        var req_1 = {
            "orgId" : parseInt(sessionStorage.getItem("orgId")),
            "user" : sessionStorage.getItem("username"),
            "data" : {
                "operation" : "territorydata",
                "orgId" : atob(sessionStorage.getItem("maporg")),
                "territoryId" : atob(sessionStorage.getItem("maptertry"))
            }
        }
        _cL.apiCall({
            service: 'getdata',
            body: req_1
        },async (err,data)=>{
            if(err){
                LOAD.KML_WD = false;
                if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
                    $("#loader").hide();
            }
            else{
                if(data.status == 'SUCCESS'){
                    loadCacheWardData(data.data);
                    await _cacheManager.put(cacheInstance, "wardData", data.data);
                }
            }
        })
    }
    else{
        loadCacheWardData(cachedData);
    }
}
async function loadCacheWardData(data){
    if(data.hasOwnProperty('WardData'))
        WardData = data.WardData
    if(data.hasOwnProperty('Ward_mx_Data'))
        Ward_mx_Data = data.Ward_mx_Data
    if(data.hasOwnProperty('Ward_Stat')){
        hasWard = data.Ward_Stat.hasWard;
        hasPop = data.Ward_Stat.hasPop;
        hasdpl = data.Ward_Stat.hasdpl;
        if(hasWard)
            loadHeatMap = true;
        else
            loadHeatMap = false;
    }
    if(data.ward.length !== 0){
        FetchKMLData_Ward(data.ward[0].WardFile)
    }
    else{
        LOAD.KML_WD = false;
        if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
            $("#loader").hide();
    }
}
async function get_CustData(){
    var cachedData = await _cacheManager.get(cacheInstance,"custData");
    if(!cachedData){
        var req_2 = {
            "orgId" : parseInt(sessionStorage.getItem("orgId")),
            "user" : sessionStorage.getItem("username"),
            "data" : {
                "operation" : "custcache",
                "orgId" : atob(sessionStorage.getItem("maporg")),
                "territoryId" : atob(sessionStorage.getItem("maptertry"))
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
                if(data.status == 'SUCCESS'){
                    loadCacheCustData(data.data);
                    await _cacheManager.put(cacheInstance, "custData", data.data);
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
        loadCacheCustData(cachedData);
    }
}
async function loadCacheCustData(data){
    var loadLOCS = false;
    hasOrdr = data.hasOrdr;
    if(data.hasOwnProperty('LocData'))
        loadLOCS = true;
    if(loadLOCS){
        Data = data.LocData;
        /* bindChannels(data.CHANNELS);
        groupAndPlot(data.SUBGROUPS, data.GROUPS); */
        bindGroups(data.Dist)
        get_Data();
    }
    else{
        LOAD.CSV = false;
        if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
            $("#loader").hide();
    }
}

async function get_DistData(){
    var cachedData = await _cacheManager.get(cacheInstance,"distData");
    if(!cachedData){
        var req_2 = {
            "orgId" : parseInt(sessionStorage.getItem("orgId")),
            "user" : sessionStorage.getItem("username"),
            "data" : {
                "operation" : "custCache",
                "orgId" : atob(sessionStorage.getItem("maporg")),
                "territoryId" : atob(sessionStorage.getItem("maptertry")),
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
                if(data.status == 'SUCCESS'){
                   
                    await _cacheManager.put(cacheInstance, "distData", data.data);
                    get_Data();
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
       // loadCacheCustData(cachedData);
       get_Data();
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

                                   
function FormCluster(Clusters) {
    clearMarkers();
   // clearLayers();
    //layerGroup.clearLayers();
    mymap.removeLayer(layerGroup);
    var wardKeys = Object.keys(Clusters);
    var k = 0;
    //console.log('inside formclutsers', wardKeys, Clusters);
    for (var i = 0; i < wardKeys.length; i++) {
        var Clust = Clusters[wardKeys[k]];
        var Name = wardKeys[k];
        var Centre = [];
        if (Clust[0]['centroid'] != undefined) {
            
            Centre[0] = Clust[0].centroid.coordinates[0];
            Centre[1] = Clust[0].centroid.coordinates[1];
        }
        else 
        {
            Centre[0] = Clust[0].loc.coordinates[0];
            Centre[1] = Clust[0].loc.coordinates[1];
        }
        var Color = 'red';
        var Circle_Point = [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [Centre[0], Centre[1]],
            },
            properties: {
                name: '' + Name,
                count: '' + Clusters[wardKeys[k++]].length,
               
            },
        },
        ];
        var CircleOption = { color: Color, fillColor: Color, fillOpacity: 0.5 };
        var Circle_Draw = new L.geoJson(Circle_Point, {
        style: CircleOption,
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker([latlng.lat, latlng.lng], { radius: 10 });
    },
        onEachFeature: function (feature, layer) {
        var text = L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'text',
    })
        .setContent(feature.properties.count)
        .setLatLng(layer.getLatLng());
         layer.bindTooltip(text); 
        },
        });
        Circle_Draw.on('click', ClusterExpand);
       // Circle_Draw.addTo(mymap);
        layerGroup.addLayer(Circle_Draw);
        //mymap.addLayer(layerGroup);
        //console.log('Markers added');
    }
    layerGroup.addTo(mymap);
    LOAD.CSV=false;
    if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
        $("#loader").hide();
  }

function ClusterExpand(event) {
//console.log(event);
var Circle = event;
var index = Circle.layer.feature.properties.name;
var Name = Circle.layer.feature.properties.name;
//console.log(Name);

var arr = custDa.CustData.Data;

mymap.removeLayer(Circle.layer);
if(Name>0)
{
    //console.log(Name);
for (j = 0; j < arr[Name].length; j++) {
    var lats = arr[Name][j].loc.coordinates[1];
    var lngs = arr[Name][j].loc.coordinates[0];
    var distName=arr[Name][j].Distributor;
    //console.log(lats, lngs,distName);
    var inHtml = '<div class="fa fa-2x fa-map-marker" style="color:' + distColor[distName] + ';"></div>';

    var myIcon = L.divIcon({

    className: 'mrkr-label',
    html: inHtml
});

let marker = new L.marker([parseFloat(lats), parseFloat(lngs)], {
icon: myIcon
}).bindPopup(Name);//.addTo(mymap);

markers.addLayer(marker);
mymap.addLayer(markers);

}

}
}

function groupCustData(custWardDatas,distId){
//      return new Promise(function(resolve, reject){
  //console.log(Data,distId)
var custWrd = new Object();
custWrd['CustData'] = {};
custWrd['CustData']['Data'] = [];
for (var i = 0; i < custWardDatas.length; i++) {
    var lines = custWardDatas[i];
    if(lines.hasOwnProperty('DistId')) {
        if(distId.includes(lines['DistId'].toString())){
            if (lines.hasOwnProperty('WardNo')) {
        var wrdNum = lines['WardNo'];
    //    console.log('inside if', wrdNum);
        if (!custWrd['CustData']['Data'].hasOwnProperty(wrdNum)) {
            custWrd['CustData']['Data'][wrdNum] = [];
        }
     custWrd['CustData']['Data'][wrdNum].push(lines);
    }

        }
       
    }
   }
return custWrd;
}

async function get_Data(){
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
    if(Group_Sel.length == 1){
        $('#ShowRouteLinks').html(`<input type="button" value="Show Routes" class="button-link" onclick="_cL.openNewTab('Route-Map.html','routeOrg:${sessionStorage.getItem("maporg")},routeTertry:${sessionStorage.getItem("maptertry")},routeDist:${btoa(Group_Sel[0])},sitename:${sessionStorage.getItem("sitename")},outlets:${distAllData[Group_Sel[0]].Cust}')" style="padding: .5em 1em; margin: .5em 1em;"/>`)
    }
    else{
        $('#ShowRouteLinks').html(null);
    }
    const tId=atob(sessionStorage.getItem('maptertry'));
    var cachedData = await _cacheManager.get(cacheInstance,"custData");
    //console.log(cachedData);
    if(cachedData!=0 && cachedData!=undefined){
            //console.log("cache hit");
            custDa=  groupCustData(cachedData.LocData,Group_Sel);
            //console.log("custdata after processing",custDa); 
            FormCluster(custDa.CustData.Data);
    } 
    else {
        var InputJson = {
            orgId: parseInt(sessionStorage.getItem("orgId")),
            user: sessionStorage.getItem('orgId'),
            user: sessionStorage.getItem('username'),
            data: {
                "operation" : "custcache",
                "type":"custWithDist",
                "orgId" : parseInt(atob(sessionStorage.getItem("maporg"))),
                "territoryId" : atob(sessionStorage.getItem("maptertry")),
                distributor : Group_Sel
            }
        };
        _cL.apiCall({
            service:'getdata',
            body:InputJson
        },(err,data)=>{
            if(err){

            }
            else{

            }
        })
    }
}
