function UnbindFilters(){
    $("#PlotAllCheckBox").html(null);
    $("#GroupSelect").html(null);
    $("#SubGroupSelect").html(null);
    $("#Routecolorindicator").html(null);
    //$("#PolySelect").html(null);
    $("#wardSelect").html(null);
    $("#distSelect").html(null);
}
function selected(bval)//select all or reset if in select all bval is true
{
    $("input[name='Clusters']").prop('checked', bval);
    if (bval) {
        Checked_Clusters = [];
        Moved_Clusters = [];
    } else {
        Checked_Clusters = ids.slice();
        Moved_Clusters = ids.slice();
    }
    PlotPoints(true);
}
function checkchange(clusvalue)//on check box click event selection
{
    LOAD.CSV = true;
    $("#loader").show();
    var index = Checked_Clusters.indexOf(clusvalue);
    if (index < 0) {
        Checked_Clusters.push(clusvalue);
        Checked_Clusters = Checked_Clusters.filter(onlyUnique);
        Moved_Clusters.push(clusvalue);
        Moved_Clusters = Moved_Clusters.filter(onlyUnique);
    }
    else {
        Checked_Clusters.splice(index, 1);
        Moved_Clusters.splice(index, 1);
    }
    PlotPoints(true)
}
function selectedDSE(checkBOX)//select all or reset if in select all bval is true
{
    var bval = checkBOX.checked;
    $("input[name='dseLists']").prop('checked', bval);
    if (bval) {
        Checked_Clusters = [];
        Moved_Clusters = [];
    } else {
        Checked_Clusters = Clusters.slice();
        Moved_Clusters = Clusters.slice();
    }
    getAndPlotPoints(false);
}
function checkchangeDSE(checkBOX)//on check box click event selection
{
    LOAD.CSV = true;
    $("#loader").show();
    var clusvalue = checkBOX.value;
    var index = Checked_Clusters.indexOf(clusvalue);
    if (index < 0) {
        Checked_Clusters.push(clusvalue);
        Checked_Clusters = Checked_Clusters.filter(onlyUnique);
        Moved_Clusters.push(clusvalue);
        Moved_Clusters = Moved_Clusters.filter(onlyUnique);
    }
    else {
        Checked_Clusters.splice(index, 1);
        Moved_Clusters.splice(index, 1);
    }
    getAndPlotPoints(false)
}
function allChannel(allChannel){
    var isChecked = allChannel.checked;
    var channels = document.getElementsByName('Channels');
    for(var i=0; i<channels.length; i++)
        channels[i].checked = isChecked;
}
function openOrcloseDistr(open){
    var distDrops = document.getElementById('statedropchecks-list');
    if(distDrops.style.display == 'block'){
        if(ischangedDST){
            get_Data(true)
            ischangedDST = false;
        }
        distDrops.style.display = 'none';
    }
    else if(open){
        distDrops.style.display = 'block';
    }
}
function changeDistTrue(){
    ischangedDST = true;
}
function bounceMarker(markerId) {
    markerArray[markerId].bounce();
}
function stopBouncingMarker(markerId) {
    markerArray[markerId].stopBouncing();
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function clearMarkers() {
    mymap.removeLayer(markers);
    markers = new L.FeatureGroup();
    markerArray = [];

    $('#RangeSlide').html(null);
    $('.ticker').remove();
}

function expandOptions() {
    $('#Routecolorindicator').toggle();
}

function search() {
    var searchTxt = $('#searchText').val().toLowerCase();
    if (searchTxt != "") {

        var chckboxChecked = $('#chk_removeOthers').is(':checked');

        clearMarkers();

        //var Data = GetData();

        var count = 0;
        var sLat = "";
        var sLon = "";
        var myMarker;

        for (var i = 0; i < Data.length; i++) {
            var temp = Data[i].Id.split(":");
            var tempInx = parseInt(Data[i].Cluster, 10);
            var colorInx = 0;


            colorInx = tempInx % 25;

            if (Checked_Clusters.indexOf(temp[1]) > -1) {
                continue;
            }



            if (chckboxChecked) {
                if (Data[i].Id.toLowerCase().indexOf(searchTxt) !== -1) {
                    var myIcon = L.divIcon({
                        iconSize: [16, 16], // size of the icon
                        iconAnchor: [16, 16],
                        html: '<div class="fa fa-2x fa-map-marker" style="color:' + '#' + ColourValues[colorInx] + ';">'
                    });

                    let marker = new L.marker([parseFloat(Data[i].lat), parseFloat(Data[i].lng)], {
                        icon: myIcon
                    }).addTo(mymap);


                    sLat = Data[i].lat;
                    sLon = Data[i].lng;
                    count++;

                    marker.bindPopup(Data[i].Id);
                    myMarker = marker;

                    markers.addLayer(marker);
                }
            }
            else {
                var myIcon = L.divIcon({
                    iconSize: [16, 16], // size of the icon
                    iconAnchor: [16, 16],
                    html: '<div class="fa fa-2x fa-map-marker" style="color:' + '#' + ColourValues[colorInx] + ';">'
                });

                let marker = new L.marker([parseFloat(Data[i].lat), parseFloat(Data[i].lng)], {
                    icon: myIcon
                }).addTo(mymap);

                marker.bindPopup(Data[i].Id);
                if (Data[i].Id.toLowerCase().indexOf(searchTxt) !== -1) {
                    marker.bounce();

                    sLat = Data[i].lat;
                    sLon = Data[i].lng;

                    count++;
                    myMarker = marker;
                }

                markers.addLayer(marker);
            }
        }
        mymap.addLayer(markers);

        if (count == 1) {
            mymap.flyTo([sLat, sLon], 16)
            myMarker.openPopup();
        }
    }
}

function searchChanged(){
    var searchTxt = $('#searchText').val().toLowerCase();
    if(searchTxt == ""){
        PlotPoints(true);
    }
}
function ParseKML(line,isWard,dtCount){
    if(!line){
        if(!isWard)
            LOAD.KML_DB = false;
        else
            LOAD.KML_WD = false;
        return;
    }
    //clearPolygons()
    var Kmldata = {};
    var dup = 1;
    var polyCount = 1;
    var FolderName = '';
    if(!isWard)
        FolderName = 'Distributor';
    else
        FolderName = 'ward';
    var polyData = [];
    var heatData = [];
    var data;
    if(line.indexOf("<Folder") > 0){
        var folderStart = line.indexOf("<Folder");
        var folderEnd = line.indexOf ("</Folder>");
        data = line.substring(folderStart, folderEnd);
    }
    else
        data = line;
    while(data.indexOf('<Placemark') > 0){
        var index = data.indexOf("<Placemark");
        var endindex = data.indexOf ("</Placemark>");
        var subdata = data.substring(index, endindex);
        var tempname;
        var name = '';
        name = subdata.substring(subdata.indexOf("<name>"),subdata.indexOf("</name>")).replace("<name>","");
        if(name.indexOf('<![CDATA[') != -1){
            name = name.replace('<![CDATA[','');
            name = name.replace(']]>','');
        }
        var AdonProp = {};
        try{
            if(subdata.indexOf("<ExtendedData>") > 0){
                var ExtendedData = subdata.substring(subdata.indexOf("<ExtendedData>"),subdata.indexOf("</ExtendedData>")).replace("<ExtendedData>","");
                while(ExtendedData.indexOf("<Data")>0){
                    var Data = ExtendedData.substring(ExtendedData.indexOf("<Data")+1,ExtendedData.indexOf("</Data>"));
                    var DataName = Data.substring(Data.indexOf("<Data")+1,Data.indexOf(">")).replace("Data","").trim().split("=")[1].replace('"','').replace('"','');
                    var Value = "";
                    if(Data.indexOf("<value/>") < 0)
                        Value = Data.substring(Data.indexOf("<value>"),Data.indexOf("</value>")).replace("<value>").replace("undefined","").replace(" ","").trim();
                    DataName = DataName.toUpperCase();
                    AdonProp[DataName] = Value;
                    ExtendedData = ExtendedData.substring(ExtendedData.indexOf("</Data>")+5);
                }
            }
            else if(subdata.indexOf("<description>") > 0){
                var Descr = subdata.substring(subdata.indexOf("<description>"),subdata.indexOf("</description>")).replace("<description>","");
                if(Descr.indexOf('<table') > 0){
                    if(Descr.indexOf('WARD_NO') > 0){
                        Descr = Descr.substring(Descr.indexOf('WARD_NO')+10);
                        if(Descr.indexOf('<td>') >0){
                            var Dvalue = Descr.substring(Descr.indexOf('<td>'),Descr.indexOf('</td>')).replace('<td>');
                            AdonProp['WARD_NO'] = Dvalue;
                        }
                    }
                }
                else if(Descr.indexOf('WARD_NO') > 0){
                    Descr = Descr.substring(Descr.indexOf('WARD_NO'));
                    var Dvalue = Descr.substring(0,Descr.indexOf('<br')).trim().replace(' ','').replace('WARD_NO','');
                    AdonProp['WARD_NO'] = Dvalue;
                }
            }
            if(AdonProp['WARD_NO'] != null)
                AdonProp['WARD_NO'] = AdonProp['WARD_NO'].replace('undefined','');
        }catch{}
        while(subdata.indexOf('<coordinates>')>0){
            var polyColor = "5DADE2";
            var brdrColor = "FFFFFF";
            var colorIndx = polyCount % 25;//dtCount % 25;
            if(!isWard){
                polyColor = PolyColours[colorIndx];
                brdrColor = PolyColours[colorIndx];
                polyCount++;
            }
            var coordinates = "";
            coordinates = subdata.substring(subdata.indexOf("<coordinates>"), subdata.indexOf("</coordinates>"));
            coordinates = coordinates.replace("<coordinates>", "").trim();
            coordinates = coordinates.replace(",0 ", " ").trim();
            var cordArray = coordinates.split('\n');
            if(cordArray.length < 2) cordArray = coordinates.split(' ');
            var inCords = [];
            if(cordArray.length == 1){
                subdata = subdata.substring(subdata.indexOf("</coordinates>")+14);
                continue;
            }
            for (var i = 0; i < cordArray.length; i++)
            {
                cordArray[i] = cordArray[i].trim();
                var crds = cordArray[i].split(',');
                inCords.push([crds[0],crds[1]]);
            }
            if(Kmldata.hasOwnProperty(name)){
                tempname = name + "_" + dup;
                dup++;
            }
            else
                tempname = name;

            var AddHeat = false;
            if(isWard){
                if(AdonProp['WARD_NO'])
                    AdonProp['WARD_NO'] = AdonProp['WARD_NO'].replaceAll(' ','')
                else{
                    AdonProp['WARD_NO'] = tempname.replaceAll(' ','');
                    AdonProp['WARD_NO'] = AdonProp['WARD_NO'].toLowerCase().replaceAll('ward','');
                }

                var warddata = {};
                if(WardData.hasOwnProperty([AdonProp['WARD_NO']]) && WardData[AdonProp['WARD_NO']] != null){
                    if(WardData[AdonProp['WARD_NO']].length == 4)
                    warddata = {
                        Order: WardData[AdonProp['WARD_NO']][0],
                        Customer: WardData[AdonProp['WARD_NO']][1],
                        Population: WardData[AdonProp['WARD_NO']][2],
                        dpl: WardData[AdonProp['WARD_NO']][3]
                    }
                    AdonProp['Population'] = warddata.Population;
                    AdonProp['Outtlets'] = warddata.Customer;
                    AdonProp['DPL'] = warddata.dpl;
                    AddHeat = true;
                }
            }

            var poly = {
                type: 'Feature',
                properties: {
                    name: tempname,
                    color: '#'+polyColor,
                    border: '#'+brdrColor,
                    warddata: warddata,
                    AdonProp: AdonProp
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [inCords]
                }
            };
            Kmldata[tempname] = tempname;
            polyData.push(poly);
            if(AddHeat)
                heatData.push(poly);
            subdata = subdata.substring(subdata.indexOf("</coordinates>")+14);
        }
        data = data.substring(endindex + 5);
    }
    line = line.substring(folderEnd+5);
    if(polyData.length > 0)
        drawPolygons({name:FolderName,data:polyData,heat:heatData}, isWard);
}
function heatColors(MaxData, wData){
    var FullLength = MaxData.length;
    var Fraction = FullLength / 30;
    var Index = MaxData.indexOf(wData);
    
    var ColorCode = '#'+Heat_Color_Strip[0];
    var j = 0;
    for(var i=29; i>0; i--){
        if(Index > (Fraction*i)){
            ColorCode = '#'+Heat_Color_Strip[i];
            break;
        }
        j++;
    }
    return  ColorCode;
}

function heatMapPolygon(LayerName,feature){
    //alert('Name: '+LayerName+' , Feature: '+feature);
    $('#HeatLegend').html(null);
    if(Prev_HeatLayer != null)
        mymap.removeLayer(Prev_HeatLayer);
    if(feature == 'NORMAL'){
        $('#HeatLegend').html(null);
        legentLoaded = false;
        return;
    }
    $("#WardPOLY").prop('checked', true);
    var wardPoly = Poly_id_Layer[LayerName];
    //mymap.removeLayer(wardPoly);
    //wardPoly.addTo(mymap);
    if(Heat_id_Layer.hasOwnProperty(feature)){
        var htLayer = Heat_id_Layer[feature];
        htLayer.addTo(mymap);
        Prev_HeatLayer = Heat_id_Layer[feature];
    }
    /* var checks = document.getElementsByName('HeadPoly');
    for(var i=0; i<checks.length; i++){
        checks[i].checked = false;
        var SelectedLayer = Poly_id_Layer[checks[i].value];
        mymap.removeLayer(SelectedLayer);
        if(Poly_subLayers.hasOwnProperty(checks[i].value)){
            for(var j=0; j<Poly_subLayers[checks[i].value].length; j++){
                $('#'+Poly_subLayers[checks[i].value][j]).prop("checked", false);
            }
        }
    } */
    setOthersToTop();
    var sortRange = [];
    if(feature == "ORDER")
        sortRange = Ward_mx_Data.MaxOrdr;
    else if(feature == "CUSTOMER")
        sortRange = Ward_mx_Data.MaxCust;
    else if(feature == "POPULATION")
        sortRange = Ward_mx_Data.MaxPop;

    if(feature !== "DPL"){
        var legend = '<span>'+sortRange[0]+'&nbsp</span>';
        for(var j=0; j<Heat_Color_Strip.length; j++){
            legend += '<span style="background-color: #'+Heat_Color_Strip[j]+'">&nbsp</span>';
        }
        $('#HeatLegend').html(legend+'<span>&nbsp'+sortRange[sortRange.length-1]+'</span><hr/>');
        legentLoaded = true;
    }
    else{
        /* var legend = `<span>0 &nbsp</span>
        <span style="background-color: #FF0000">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
        <span style="background-color: #FF8C00">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
        <span style="background-color: #00FF00">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
        <span>&nbsp 250+</span><hr/>`;
        $('#HeatLegend').html(legend);
        legentLoaded = true; */
        color = ['FF0000', 'FF8C00', '00FF00'];

        var legend = '';
        for (var j = 0; j < 3; j++) {
            legend +=
            '<span style="background-color: #' +
            color[j] +
            '">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
        }
        
        var legendValue = '<span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + 0 + '</span>';
        
        legendValue += '<span >&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
        legendValue += '<span>&nbsp&nbsp&nbsp&nbsp&nbsp' + 150 + '</span>';
        legendValue += '<span >&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
        legendValue += '<span>&nbsp&nbsp' + 250 + '</span>';
        legendValue += '<span >&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
        legendValue=legendValue + '<span>&nbsp&nbsp>' + 250 + '&nbsp&nbsp&nbsp</span><hr/>'
        $('#HeatLegend').html(legend +'<br/>'+ legendValue);
        legentLoaded = true;
    }
}

function clearPolygons(){
    for(var i=0; i<PolyLayers.length; i++){
        mymap.removeLayer(PolyLayers[i]);
    }
    if(Prev_HeatLayer != null)
        mymap.removeLayer(Prev_HeatLayer);
    PolyLayers = [];
    Poly_id_Layer = {};
    Poly_subLayers = {};
    WholePolygon = new L.FeatureGroup();
    //$("#PolySelect").html('');
    $("#wardSelect").html('');
    $("#distSelect").html('');
    $("#PolyLayers").html('');
    $('#HeatLegend').html(null);
    legentLoaded = false;
}

function TogglePolygons(checkbox){
    if(!Poly_id_Layer.hasOwnProperty(checkbox.value))
        return;
    if(checkbox.id == 'WardPOLY'){
        $("#NormalWise").prop("checked", true);
        if(Prev_HeatLayer != null)
            mymap.removeLayer(Prev_HeatLayer);
    }
    var isChecked = true;
    var SelectedLayer = Poly_id_Layer[checkbox.value];
    if(checkbox.checked){
        SelectedLayer.addTo(mymap);
        isChecked = true;
    }
    else{
        mymap.removeLayer(SelectedLayer);
        isChecked = false;
    }
    if(Poly_subLayers.hasOwnProperty(checkbox.value)){
        for(var i=0; i<Poly_subLayers[checkbox.value].length; i++){
            $('#'+Poly_subLayers[checkbox.value][i]).prop("checked", isChecked)
        }
    }
    setOthersToTop();
}

function setOthersToTop(AdjustWidth){
    var checks = document.getElementsByName('OtherPOLY');
    for(var i=0; i<checks.length; i++){
        if(checks[i].checked){
            var SelectedLayer = Poly_id_Layer[checks[i].value];
            mymap.removeLayer(SelectedLayer);
            SelectedLayer.addTo(mymap);
        }
    }
}

function applyRange(value) {
    SELECT_RANGE = value;
    $('#SELECT_RANGE').val(SELECT_RANGE);
    PlotPoints(true);
}

function confirmRange() {
    var range = $('#SELECT_RANGE')[0];
    var value = range.value;
    if(value == '')
        value = 0;
    value = parseFloat(value);
    var min = parseFloat(range.min);
    var max = parseFloat(range.max);
    if(value > max)
        value = max;
    if(value < min)
        value = min;
    SELECT_RANGE = value;
    PlotPoints(true);
}

function changeRange(value) {
    $('#SELECT_RANGE').val(value);
}
function uploadLayer(){
    $('#loader').show();
    var filename = `${sessionStorage.getItem('sitename')}_Distributor-boundary.kml`
    var req = {
        data:{
            operation:"kmlupdate",
            orgId : atob(sessionStorage.getItem("maporg")),
            territoryId : atob(sessionStorage.getItem("maptertry")),
            filename:filename,
            kmlData:_editedBOUNDARY
        }
    }
    _cL.apiCall({
        service:"adminops",
        body:req
    },(err,data)=>{
        if(err){
            if(err.responseJSON){
                if(err.responseJSON.error == 'Unauthorized token'){
                    alert(" Login expired \n please login again.")
                    _cL.logout();
                }
            }
            alert('kml updation failed');
        }
        if(data.status == 'SUCCESS'){
            var dyn_elem = document.getElementById("uploadLyrBtn");
            if(dyn_elem)
                document.getElementById("MapLoad").removeChild(dyn_elem);
            _isEditedBOUNDARY = false;
        }
        else
            console.warn('kml updation failed'),console.warn(data);
        $('#loader').hide();
    })
}
async function refreshAllCache(){
    await _cacheManager.clear(cacheInstance);
    fetch_n_load();
}