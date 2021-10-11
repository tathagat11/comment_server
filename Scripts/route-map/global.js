// Booleans
let loadHeatMap = false, hasWard = false, hasPop = false, hasOrdr = false, hasdpl = false, movedFlag = false, legentLoaded = false,ischangedDST=false, _isEditedBOUNDARY = false;

// Numbers
let MAXORDER = 0, MINORDER = 0, SELECT_RANGE = 0;

// Strings
let BUCKET_NAME = '', MASTER_FILE = '', ORDER_FILE = '', cacheInstance = '', tabId;

// Objects
let CONFIG = {}, LOAD = {KML_WD:false,KML_DB:false,CSV:false}, Poly_id_Layer = {}, Poly_subLayers = {}, Heat_id_Layer = {}, WardData = {}, 
    Ward_mx_Data = {}, options = {modal: true, title: "Box area zoom"}, groupList = {}, dist_Cust = {}, _editedBOUNDARY = {}, clusterVAL = {}, TAB_OBJ = {};

// Arrays
let Data, ids = [], Clusters = [], Clusters2 = [], Checked_Clusters = [], Moved_Clusters = [], PolyLayers = [], PolyInnerLayers = [], 
    ColourValues = [
        "FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000",
        "800000", "008000", "000080", "808000", "800080", "008080", "808080",
        "C00000", "00C000", "0000C0", "C0C000", "C000C0", "00C0C0", "C0C0C0",
        "400000", "004000", "000040", "404000", "400040", "004040", "404040",
        "200000", "002000", "000020", "202000", "200020", "002020", "202020",
        "600000", "006000", "000060", "606000", "600060", "006060", "606060",
        "A00000", "00A000", "0000A0", "A0A000", "A000A0", "00A0A0", "A0A0A0",
        "E00000", "00E000", "0000E0", "E0E000", "E000E0", "00E0E0", "E0E0E0",
    ], 
    PolyColours = [
        "E00000", "00E000", "0000E0", "E0E000", "E000E0", "00E0E0", "E0E0E0",
        "A00000", "00A000", "0000A0", "A0A000", "A000A0", "00A0A0", "A0A0A0",
        "600000", "006000", "000060", "606000", "600060", "006060", "606060",
        "200000", "002000", "000020", "202000", "200020", "002020", "202020",
        "400000", "004000", "000040", "404000", "400040", "004040", "404040",
        "C00000", "00C000", "0000C0", "C0C000", "C000C0", "00C0C0", "C0C0C0",
        "800000", "008000", "000080", "808000", "800080", "008080", "808080",
        "FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000",
    ], 

    /* interchange the variable names to change the low-high format */

    // FOR GREEN TO RED - LOW-GREEN - HIGH-RED
    TMP_Heat_Color_Strip = [ 
        '00FF00','12FF00','24FF00','35FF00','47FF00','58FF00','6AFF00','7CFF00','8DFF00','9FFF00',
        'B0FF00','C2FF00','D4FF00','E5FF00','F7FF00','FFF600','FFE400','FFD300','FFC100','FFAF00',
        'FF9E00','FF8C00','FF7B00','FF6900','FF5700','FF4600','FF3400','FF2300','FF1100','FF0000'
    ],

    // FOR RED TO GREEN - LOW-RED - HIGH-GREEN
    Heat_Color_Strip = [
        "FF0000","FF1100","FF2300","FF3400","FF4600","FF5700","FF6900","FF7B00","FF8C00","FF9E00",
        "FFAF00","FFC100","FFD300","FFE400","FFF600","F7FF00","E5FF00","D4FF00","C2FF00","B0FF00",
        "9FFF00","8DFF00","7CFF00","6AFF00","58FF00","47FF00","35FF00","24FF00","12FF00","00FF00"
    ];

// Custom
var mymap = null;
var markers = new L.FeatureGroup();
var WholePolygon = new L.FeatureGroup();
var _editLayer;
var _drawControl;
var _prevLayer;
var _editMode = false;
var markerArray = new Array();
var Prev_HeatLayer;
var editedLayer;
var layerGroup = L.layerGroup();

window.onload = async function() {
    //alert('STOP')
}
