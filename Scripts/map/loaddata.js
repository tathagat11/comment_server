async function bindChannels(ch){
    $('#channelListHead').html(null);
    $('#channelList').html(null);
    if(ch){
        $('#channelListHead').html('<hr/><input class="innerCheckBox" type="checkbox" name="Channels" value="AllChannel" checked="" onclick="allChannel(this)"> &nbsp;<b>Channels</b> &nbsp&nbsp <span id="greenTick" class="greenTick" style="" onclick="get_Data();">Apply</span><hr/>');
        let ChannelList = '';
        for(let i=0; i<ch.length; i++){
            ChannelList += '<div class="divChkbox"><input class="innerCheckBox" type="checkbox" name="Channels" value="'+ch[i]+'" checked="" > &nbsp;'+ch[i]+'</div>'
        }
        ChannelList += '';
        $('#channelList').html(ChannelList);
    }
} 
function groupAndPlot(subGrp, Grp){
    if(Grp){
        $("#PlotAllCheckBox").html(null);
        $("#GroupSelect").html(null);
        /* var SELECTLIST = '<div class="GRPSHEAD">Distributor</div><hr/><select class="mySelect" style="width:100%">';
        for(let i = 0; i < Grp.length; i++){
            if(i == 0)
                    SELECTLIST += '<option value="'+Grp[i].id+'" selected> '+Grp[i].Distributor+' </option>';
            else
                SELECTLIST += '<option value="'+Grp[i].id+'"> '+Grp[i].Distributor+' </option>';
        }
        SELECTLIST += '</select>';
        $("#GroupSelect").html(SELECTLIST); */
        //$("#PlotAllCheckBox").html('<input type="checkbox" value="PLOTALL" id="PLOTALL"/> Plot all outlets<hr/>');
        var SELECTLIST = `<!--<div class="GRPSHEAD">Distributor</div><hr/>-->
        <div class="dropchecks">
            <!--<input type="text" id="City" placeholder="City" title="City" class="form-control rounded-0"  autocomplete="off"/>-->
            <select class="mySelect" style="width:100%" ><option style="display:none;">Select Distributors</option></select>
            <div id="statedropchecks-list" class="dropchecks-items" style="display:none;">`;
        for(let i = 0; i < Grp.length; i++){
            if(i == 0)
                    SELECTLIST += '<div class="mySelect"><input onchange="changeDistTrue()" name="dropcheckItems" type="checkbox" value="'+Grp[i].id+'" > '+Grp[i].Distributor+'</div>';
            else
                SELECTLIST += '<div class="mySelect"><input name="dropcheckItems" onchange="changeDistTrue()" type="checkbox"  value="'+Grp[i].id+'"> '+Grp[i].Distributor+'</div>';
        }
        SELECTLIST += '</div></div>';
        $("#GroupSelect").html(SELECTLIST);
    }
    else
        $('#PLOTALL').prop("checked", false);
    $("#SubGroupSelect").html(null);
    var SELECTLIST = '<div class="GRPSHEAD">Route</div><hr/><select class="mySelect" style="width:100%">';
    for(let i = 0; i < subGrp.length; i++){
        if(i == 0)
            SELECTLIST += '<option value="'+subGrp[i]+'" selected> '+subGrp[i]+' </option>';
        else
            SELECTLIST += '<option value="'+subGrp[i]+'"> '+subGrp[i]+' </option>';
    }
    SELECTLIST += '</select>';
    $("#SubGroupSelect").html(SELECTLIST);
    clearMarkers();
    $("#loader").hide();
  //  PlotPoints();
}

function bindGroups(Grp){
    distAllData = {};
    $("#PlotAllCheckBox").html(null);
    $("#GroupSelect").html(null);
    /* var SELECTLIST = '<div class="GRPSHEAD">Distributor</div><hr/><select class="mySelect" style="width:100%">';
    for(let i = 0; i < Grp.length; i++){
        if(i == 0)
                SELECTLIST += '<option value="'+Grp[i].id+'" selected> '+Grp[i].Distributor+' </option>';
        else
            SELECTLIST += '<option value="'+Grp[i].id+'"> '+Grp[i].Distributor+' </option>';
    }
    SELECTLIST += '</select>';
    $("#GroupSelect").html(SELECTLIST); */
    //$("#PlotAllCheckBox").html('<input type="checkbox" value="PLOTALL" id="PLOTALL"/> Plot all outlets<hr/>');
    var SELECTLIST = `<!--<div class="GRPSHEAD">Distributor</div><hr/>-->
    <div class="dropchecks">
        <!--<input type="text" id="City" placeholder="City" title="City" class="form-control rounded-0"  autocomplete="off"/>-->
        <select class="mySelect" style="width:100%" ><option style="display:none;">Select Distributors</option></select>
        <div id="statedropchecks-list" class="dropchecks-items" style="display:none;">`;
    for(let i = 0; i < Grp.length; i++){
        distAllData[Grp[i].id] = {
            Name:Grp[i].Name,
            Cust:Grp[i].Cust
        }
        if(i == 0)
                SELECTLIST += '<div class="mySelect"><input onchange="changeDistTrue()" name="dropcheckItems" type="checkbox" value="'+Grp[i].id+'" checked > '+Grp[i].Name+'</div>';
        else
            SELECTLIST += '<div class="mySelect"><input name="dropcheckItems" onchange="changeDistTrue()" type="checkbox"  value="'+Grp[i].id+'"> '+Grp[i].Name+'</div>';
    }
    SELECTLIST += '</div></div>';
    $("#GroupSelect").html(SELECTLIST);
}

function PlotPoints(replot) {

    LOAD.CSV = true;
    $("#loader").show();

    clearMarkers();

    /* ids = [];
    Clusters = []; */
    if (!replot) {
        //Checked_Clusters = [];
        Clusters = [];
        Clusters2 = [];
        ids = [];
        groupList = {};
    }
    var MinAry = [];
    if (!replot && !movedFlag){
        Checked_Clusters = [];
        MAXORDER = 0;
        MINORDER = 0;
        SELECT_RANGE = 0;
        if(hasOrdr){
            for(var ii=0; ii< Data.length; ii++){
                var ORDER = parseFloat(Data[ii].Id.split(":")[5]);
                if(ORDER > MAXORDER)
                    MAXORDER = ORDER;
                if(ORDER > 0)
                    MinAry.push(ORDER);
                if(MinAry.length > 0){
                    MinAry.sort((a,b) => a-b);
                    MINORDER = MinAry[0];
                }
                SELECT_RANGE = MAXORDER;
            }
        }
        $("#Routecolorindicator").html(null);
    }
    //console.log(JSON.stringify(Data));
    var clustList = [];
    markerArray = [];

    var markerCount = 0;
    var firstMarker;
    var lastMarker;
    var FitToBound = false;
    

    for (var i = 0; i < Data.length; i++) {

        var temp = Data[i].Id.split(":");
        var tempInx = parseInt(Data[i].Cluster, 10);
        var colorInx = 0;
        var Type = 0;
        try{
            var seqNo = '1';//temp[3];

            colorInx = tempInx % 25;

            if (!replot || movedFlag) {

                if (movedFlag)
                    groupList = {};

                movedFlag = false;
                Checked_Clusters
                ids.push(temp[1]);
                Clusters.push(Data[i].Cluster);
                Clusters2.push(Data[i].Cluster);
                Clusters.sort((a,b)=>a-b);
                Clusters2.sort((a,b)=>a-b);

                ids = ids.filter(onlyUnique);
                Clusters = Clusters.filter(onlyUnique);
                var colordiv1 = "<div class=''><input type='button' style='width:50%;color: black;' value='Select All' onClick='selected(true)'></input><input type='button' style='width:50%;color: black;' value='Reset' onClick='selected(false)'></input>";
                colordiv1 = colordiv1 + "<div>";
                var grandTotal = 0;
                var vehTot = 0;

                for (var j = 0; j < ids.length; j++) {
                    var colindex = Clusters[j] % 25;
                    var ival = j + 1;

                    var count = 0;
                    var freqVal = 0;
                    for (var w = 0; w < Clusters2.length; ++w) {
                        if (Clusters2[w] == Clusters[j]) {
                            count++;

                            if (Data[i].Cluster == Clusters[j]) {
                                freqVal = parseInt(Data[i].Id.split(":")[3]);
                            }
                        }
                    }
                    var freqTotal = 0;
                    if (Object.keys(groupList).length > 0) {
                        if ((Clusters[j] in groupList)) {
                            freqTotal = groupList[Clusters[j]][1] + freqVal;
                        }
                        else {
                            freqTotal += freqVal;
                        }
                    }
                    else {
                        freqTotal += freqVal;
                    }

                    groupList[Clusters[j]] = [ids[j], freqTotal, count];

                    var Checked = 'checked';
                    if (Checked_Clusters.indexOf(ids[j]) > -1){
                        Checked = '';
                    }

                    colordiv1 = colordiv1
                        + "<div class='divChkbox' ><input class='innerCheckBox' type='checkbox' name='Clusters' value='" + Clusters[j] + "' " + Checked + " onClick='checkchange(\"" + ids[j] + "\");'> <span style='background-color:#"
                        + ColourValues[colindex] + "'> &nbsp&nbsp&nbsp</span>&nbsp" + ids[j] + " (" + count + ", " + freqTotal + ")</div>"//[" + freqTotal + "]</div>"



                    grandTotal += count;
                    vehTot++;


                }
                $("#Routecolorindicator").html(null);
                $("#Routecolorindicator").html(colordiv1 + "</div>Total SE:" + vehTot + " (" + grandTotal + ")<br/></div>");
            }


            if (Checked_Clusters.indexOf(temp[1]) > -1){
                continue;
            }

            if(hasOrdr){
                var ORDER = parseFloat(temp[5]);
                var RANGE = parseFloat(SELECT_RANGE);
                if(ORDER > RANGE)
                    continue;
            }

            if (clustList.indexOf(Data[i].Cluster) == -1) {
                clustList.push(Data[i].Cluster);
            }

            var inHtml = '<div class="fa fa-2x fa-map-marker" style="color:' + '#' + ColourValues[colorInx] + ';"></div>';

            var myIcon = L.divIcon({
                //iconSize: [16, 16], // size of the icon
                //iconAnchor: [16, 16],
                className: 'mrkr-label',
                html: inHtml
            });

            let marker = new L.marker([parseFloat(Data[i].lat), parseFloat(Data[i].lng)], {
                icon: myIcon
            })//.addTo(mymap);


            marker.bindPopup(Data[i].Id);

            if (markerCount == 0)
                firstMarker = marker;
            lastMarker = marker;
            markerCount++;
            //marker.addTo(mymap);
            markers.addLayer(marker);
            FitToBound = true;
            markerArray[marker._leaflet_id] = marker;

        }catch{
            console.log("PlotPoints Exception Line: "+i);
        }
    }

    if(hasOrdr){
        $('#RangeSlide').html(null);
        var SliderDiv = '<b>Range: </b><input  type="number" value="'+SELECT_RANGE+'" min="'+MINORDER+'" max="'+MAXORDER+'" id="SELECT_RANGE" oninput="$(\'#greenTick\').show()"/>&nbsp<span id="greenTick" class="greenTick" style="display:none;" onclick="confirmRange();">Apply</span>'
                      + '<input id="CustRange" type="range" min="'+MINORDER+'" max="'+MAXORDER+'" value="'+SELECT_RANGE+'" onchange="applyRange(this.value);" oninput="changeRange(this.value)">'
                      + '<div style="display: flex;flex-direction: row;justify-content: space-between;"><div>'+MINORDER+'</div><div>'+MAXORDER+'</div></div>'
        $('#RangeSlide').html(SliderDiv)
    }

    mymap.addLayer(markers);

    if(FitToBound)
        mymap.fitBounds(markers.getBounds().pad(0.1));
    if (clustList.length > 1) {
        $('.markerTooltip').hide();
    }
    else {
        $('.markerTooltip').hide();
        var latlngs = Array();
        markerArray.forEach(function (item) {
            latlngs.push(item.getLatLng());
        });



        $('.leaflet-routing-container-hide').hide();


    }

    LOAD.CSV = false;
    if(!LOAD.CSV && !LOAD.KML_WD && !LOAD.KML_DB)
        $("#loader").hide();

}
async function drawPolygons(DataArray, isWard){
    var innerBox = '';
    var NameAsId = 'POLY'+(PolyLayers.length+1);
    function eachLayerFeature(feature, layer) {
        layer.on({
        'mouseover': function (e) {
                e.target.setStyle({
                    weight: 3,
                    fillOpacity: .6
                });
            },
        'mouseout': function (e) {
                e.target.setStyle({
                    weight: 2,
                    fillOpacity: .5
                });
            },
        });
        let content = '<b>Name: </b>'+ feature.properties.name;
        for(var key in feature.properties.AdonProp)
            content = content + '<br/><b>'+key+': </b>'+feature.properties.AdonProp[key];
        layer.bindPopup('<div>'+content+'</div>');
        
        var nameId = 'POLYSUB'+(PolyInnerLayers.length+1);
        if(!isWard){
            if(!Poly_subLayers.hasOwnProperty(NameAsId))
                Poly_subLayers[NameAsId] = [];
            var otCunt = 0;
            if(dist_Cust[feature.properties.name])
                otCunt = dist_Cust[feature.properties.name];
            distColor[feature.properties.name]=feature.properties.color;
            //console.log(distColor);
               
            innerBox += '<hr/><div><input type="checkbox"  name="OtherPOLY" id="'+nameId+'" value="'+nameId+'" checked onclick="TogglePolygons(this);"/>&nbsp;<span style="background-color:'+feature.properties.color+'"> &nbsp;&nbsp;&nbsp;</span>&nbsp;'+feature.properties.name+' - '+otCunt+'</div>';
            Poly_id_Layer[nameId] = layer;
            Poly_subLayers[NameAsId].push(nameId);
            PolyInnerLayers.push(nameId);
            //_editLayer = layer;
            layer.on('click',(e)=>{
                /* if(_editLayer)
                    mymap.removeLayer(_editLayer); */
                if(e.target == _prevLayer || _editMode)
                    return;
                if(_drawControl)
                    _drawControl.remove();
                _editLayer = new L.FeatureGroup().addTo(mymap);
                _editLayer.addLayer(e.target)
                _drawControl = new L.Control.Draw({
                    draw: false,
                    edit: {
                        featureGroup: _editLayer,
                        remove:false
                    },
                    position: 'bottomleft'
                }).addTo(mymap);
                _prevLayer = e.target;
            })
        }
        else{
            if(feature.properties.AdonProp){
                if(feature.properties.AdonProp.WARD_NO == '72' || feature.properties.AdonProp.WARDNO == '72')
                    console.log('');
                if(feature.properties.AdonProp.hasOwnProperty('WARD_NO')){
                    layer.bindTooltip(
                        feature.properties.AdonProp.WARD_NO,
                        {
                            permanent:true,
                            direction:'center',
                            className: 'PolyLabel'
                        }
                    );//.openTooltip(layer.ge);
                }
                else if(feature.properties.AdonProp.hasOwnProperty('WARDNO')){
                    layer.bindTooltip(
                        feature.properties.AdonProp.WARDNO,
                        {
                            permanent:true,
                            direction:'center',
                            className: 'PolyLabel'
                        }
                    );
                }
            }
        }
    }


    var PolyLayer = L.geoJSON(DataArray.data,{
        style: function (feature) {
            return {
                weight: 1,
                opacity: 1,
                color: feature.properties.border,
                fillColor: feature.properties.color,
                fillOpacity: .5,
            };
        },
        onEachFeature: eachLayerFeature
    });

    WholePolygon.addLayer(PolyLayer);
    mymap.fitBounds(WholePolygon.getBounds());
    PolyLayer.addTo(mymap);
    

    if(isWard){
        $("#wardSelect").append('<div><b>WARD</b></div><hr/><div><input id="WardPOLY" type="checkbox" value="'+NameAsId+'" checked onclick="TogglePolygons(this);"/>&nbsp;<span style="background-color:#5DADE2"> &nbsp;&nbsp;&nbsp;</span>&nbsp;'+DataArray.name+'</div>');
        Poly_id_Layer[NameAsId] = PolyLayer;
        
        if(loadHeatMap && isWard)
            drawHeatMaps(NameAsId, DataArray.heat);
    }
    else{
        $("#distSelect").append('<div style="margin-top: 10px;"><input type="checkbox" value="'+NameAsId+'" checked onclick="TogglePolygons(this);" name="HeadPoly"/>&nbsp;<b>'+DataArray.name+'</b></div>'+innerBox);
        //$("#distSelect").append(innerBox);
        Poly_id_Layer[NameAsId] = PolyLayer;
        if(_editLayer == null)
            _editLayer = drawnItems = new L.FeatureGroup().addTo(mymap);
        _drawControl = new L.Control.Draw({
            draw: false,
            edit: {
                featureGroup: _editLayer,
                remove:false
            },
            position: 'bottomleft'
        }).addTo(mymap);
        editedLayer = PolyLayer;
    }
    PolyLayers.push(PolyLayer);
    
    if(!isWard)  
        LOAD.KML_DB = false;
    else
        LOAD.KML_WD = false;
    
    setOthersToTop();
    if(!LOAD.KML_WD && !LOAD.KML_DB && !LOAD.CSV)
        $("#loader").hide();
}

function drawHeatMaps(NameAsId, data){
    var PolyLayer = Poly_id_Layer[NameAsId];
    function orderHeatStyle (feature){
        var COLOR = heatColors(Ward_mx_Data.MaxOrdr, feature.properties.warddata.Order)
        return {
            weight: .5,
            opacity: 1,
            color: '#FFFFFF',//COLOR,
            fillColor: COLOR,
            fillOpacity: .85,
            gradient: true,
        };
    }
    function custHeatStyle (feature){
        var COLOR = heatColors(Ward_mx_Data.MaxCust, feature.properties.warddata.Customer)
        return {
            weight: .5,
            opacity: 1,
            color: '#FFFFFF',//COLOR,
            fillColor: COLOR,
            fillOpacity: .85,
            gradient: true,
        };
    }
    function popHeatStyle (feature){
        var COLOR = heatColors(Ward_mx_Data.MaxPop, feature.properties.warddata.Population)
        return {
            weight: .5,
            opacity: 1,
            color: '#FFFFFF',//COLOR,
            fillColor: COLOR,
            fillOpacity: .85,
            gradient: true,
        };
    }
    function dplHeatStyle (feature){
        //var COLOR = heatColors(Ward_mx_Data.MaxOrdr, feature.properties.warddata.Order)
        var COLOR = '';
        /* if(feature.properties.warddata.dpl == 0)
            COLOR = '#5DADE2';
        else */ 
        if(feature.properties.warddata.dpl > 250)
            COLOR = '#00FF00'
        else if(feature.properties.warddata.dpl >= 150)
            COLOR = '#FF8C00'
        else
            COLOR = '#FF0000'
        return {
            weight: .5,
            opacity: 1,
            color: '#FFFFFF',//COLOR,
            fillColor: COLOR,
            fillOpacity: .85,
            gradient: true,
        };
    }
    function eachOrderHeatLayer(feature,layer){
        layer.bindPopup('Order: '+feature.properties.warddata.Order);
    }
    function eachCustHeatLayer(feature,layer){
        layer.bindPopup('Customers: '+feature.properties.warddata.Customer);
    }
    function eachPopHeatLayer(feature,layer){
        layer.bindPopup('Population: '+feature.properties.warddata.Population);
    }
    function eachdplHeatLayer(feature,layer){
        layer.bindPopup('DPL: '+feature.properties.warddata.Population);
    }
    function eachALLHeatLayer(feature,layer){
        let Name = ''
        if(feature.properties.name !== feature.properties.AdonProp['WARD_NO'] && feature.properties.name !== '')
            Name = `${feature.properties.name}<br/>`;
        let popup = `${Name}
        Ward No: ${feature.properties.AdonProp['WARD_NO']}<br/>
        Population: ${feature.properties.warddata.Population}<br/>
        Outlets: ${feature.properties.warddata.Customer}<br/>
        DPL: ${feature.properties.warddata.dpl}<br/>`
        layer.bindPopup(popup);
    }

    Heat_id_Layer = {}
    Heat_id_Layer.NORMAL = PolyLayer;
    
    var radioBtns = '<b>Ward layering</b><hr/>'
                  + '<input type="radio" id="NormalWise" name="WardLayerFilter" value="NormalWise" checked onclick="heatMapPolygon(\''+NameAsId+'\',\'NORMAL\')">&nbsp None<br>';
    if(hasOrdr){
        Heat_id_Layer.ORDER = L.geoJSON(data,{style:orderHeatStyle,onEachFeature:eachALLHeatLayer});
        radioBtns += '<input type="radio" id="OrderWise" name="WardLayerFilter" value="OrderWise" onclick="heatMapPolygon(\''+NameAsId+'\',\'ORDER\')">&nbsp Order<br>';
    }
    if(hasWard){
        Heat_id_Layer.CUSTOMER = L.geoJSON(data,{style:custHeatStyle,onEachFeature:eachALLHeatLayer});
        radioBtns += '<input type="radio" id="CustWise" name="WardLayerFilter" value="CustWise" onclick="heatMapPolygon(\''+NameAsId+'\',\'CUSTOMER\')">&nbsp Outlet<br>';
    }
    if(hasPop){
        Heat_id_Layer.POPULATION = L.geoJSON(data,{style:popHeatStyle,onEachFeature:eachALLHeatLayer});
        radioBtns += '<input type="radio" id="PopuWise" name="WardLayerFilter" value="PopuWise" onclick="heatMapPolygon(\''+NameAsId+'\',\'POPULATION\')">&nbsp Population<br>';
    }
    if(hasdpl){
        Heat_id_Layer.DPL = L.geoJSON(data,{style:dplHeatStyle,onEachFeature:eachALLHeatLayer});
        radioBtns += '<input type="radio" id="DPLWise" name="WardLayerFilter" value="DPLWise" onclick="heatMapPolygon(\''+NameAsId+'\',\'DPL\')">&nbsp DPL<br>';
    }                 
                        
    $("#PolyLayers").html(radioBtns);
}
