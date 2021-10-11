function InitiateMap(choice) {
    mymap = L.map('MapLoad').setView([22.760103170031, 80.8497196441866], 5);

    var satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: "&copy <a href='http://openstreetmap.org'>OpenStreetMap</a>"
    }),
    normal = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: "&copy <a href='http://openstreetmap.org'>OpenStreetMap</a>"
    });

    let baseLayers = {
        "satellite": satellite,
        "normal": normal,
        "toner": toner
    };

    L.control.zoomBox(options).addTo(mymap);
    L.control.layers(baseLayers, null, { position: 'topleft' }).addTo(mymap);
    
    mapColor(choice);
}

function mapColor(choice) {
    var defaultToDarkFilter;
    if (choice == "light") {
        defaultToDarkFilter = [
            'grayscale:0%',
            'invert:0%',
        ]
    }
    else if (choice == "gray") {
        defaultToDarkFilter = [
            'grayscale:100%',
            'invert:0%',
        ]
    }
    else if (choice == "darkgray") {
        defaultToDarkFilter = [
            'grayscale:100%',
            'invert:100%',
        ]
    }
    else if (choice == "dark") {
        defaultToDarkFilter = [
            'grayscale:0%',
            'invert:100%',
        ]
    }

    var tile_layer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
                        maxZoom: 20,
                        subdomains:['mt0','mt1','mt2','mt3']
                    });
    tile_layer.addTo(mymap);

    mymap.on(L.Draw.Event.EDITED, function (e) {
        var layers = e.layers;
        layers.eachLayer(function (layer) {
            if (layer instanceof L.Polygon) {
                var polygon = layer.toGeoJSON();
                var name = polygon.properties.name;
                _editedBOUNDARY[name] = polygon.geometry;
                if(!_isEditedBOUNDARY){
                    _isEditedBOUNDARY = true;
                    var saveBtn = document.createElement('div')
                    saveBtn.setAttribute('id','uploadLyrBtn')
                    saveBtn.setAttribute('class','upload-layer')
                    saveBtn.innerHTML = `<button class="upload-layer button-link" onclick="uploadLayer()">Upload</button>`;
                    document.getElementById("MapLoad").appendChild(saveBtn);
                }
            }
        });

    });

    mymap.on('draw:editstart', function (e) {
        _editMode = true;
    });
    
    mymap.on('draw:editstop', function (e) {
        _editMode = false;
    });
}
