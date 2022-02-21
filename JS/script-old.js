
        var map = L.map('map', {
            center: [9.2, -84], // CR
            zoom: 8
        });

        var defaultBase = L.tileLayer.provider('OpenStreetMap').addTo(map);

        var baseLayers = {
            'OSM': defaultBase,
            'HOT':L.tileLayer.provider('OpenStreetMap.HOT'),
            //'Stamen Toner':L.tileLayer.provider('Stamen.TonerLite'),
            'USGS TNM': L.tileLayer.provider('USGSTNM'),
            'ESRI Imagery': L.tileLayer.provider('Esri.WorldImagery'),
            'ESRI Ocean Basemap': L.tileLayer.provider('Esri.OceanBasemap'),
            'OSM Topo': L.tileLayer.provider('OpenTopoMap')
        };


        //Using a relative url to call layer instead of http
        /*
        var CantonesIndivLayer = L.tileLayer.wms('http://geomapa.tk:8080/geoserver/costarica-geoinn/wms?', {
            layers: 'Cantones_de_Costa_Rica',
            format: 'image/png',
            opacity: 0.5,
            tiled: 'true'
        });

        var options = {
            transparent: 'true',
            format: 'image/png',
            opacity: 0.5,
            tiled: 'true'
            //info_format: 'text/html'
        };
        */

        //Using a relative url to call layer instead of http
        var source = L.WMS.source('http://geomapa.tk:8080/geoserver/costarica-geoinn/wms?', options);
        var CantonesLayer = source.getLayer('costarica-geoinn:Cantones_de_Costa_Rica');
        var DistritosLayer = source.getLayer('costarica-geoinn:Distritos_de_Costa_Rica');
        var ProvinciasLayer = source.getLayer('costarica-geoinn:Provincias_de_Costa_Rica');

        var source = L.WMS.source('http://geos.snitcr.go.cr/be/IGN_5/wms?', options);
        var CantonesSNIT = source.getLayer('IGN_5:limitecantonal_5k');
        var DistritosSNIT = source.getLayer('IGN_5:limitedistrital_5k');
        var ProvinciasSNIT = source.getLayer('IGN_5:limiteprovincial_5k');

        var source = L.WMS.source('http://geos.snitcr.go.cr/be/IGN_GNSS/wms?', options);
        var GNSS_SNIT = source.getLayer('IGN_GNSS:estaciones_gnss');

        //Load OSM Buildings then disable it on first load; can only be viewed at certain scales
        var osmb = new OSMBuildings(map).load();
        map.removeLayer(osmb);

        //Overlay grouped layers    
        var groupOverLays = {
            "Example Layers": {
                "Provincias": ProvinciasLayer,
                "Cantones": CantonesLayer,
                "Distritos": DistritosLayer,
                
            },
            "SNIT":{
                "Provincias": ProvinciasSNIT,
                "Cantones": CantonesSNIT,
                "Distritos": DistritosSNIT,
                "Estaciones GNSS": GNSS_SNIT,
            }

        };

        //add layer switch control
        L.control.groupedLayers(baseLayers, groupOverLays).addTo(map);


        //add scale bar to map
        L.control.scale({
            position: 'bottomleft'
        }).addTo(map);

        // Overview mini map
        var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        });

        var miniMap = new L.Control.MiniMap(Esri_WorldTopoMap, {
            toggleDisplay: true,
            minimized: false,
            position: 'bottomleft'
        }).addTo(map);

        //define Drawing toolbar options
        var options = {
            position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
            drawMarker: true, // adds button to draw markers
            drawPolyline: true, // adds button to draw a polyline
            drawRectangle: true, // adds button to draw a rectangle
            drawPolygon: true, // adds button to draw a polygon
            drawCircle: true, // adds button to draw a cricle
            cutPolygon: true, // adds button to cut a hole in a polygon
            editMode: true, // adds button to toggle edit mode for all layers
            removalMode: true, // adds a button to remove layers
        };

        // add leaflet.pm controls to the map
        map.pm.addControls(options);

        //Logo position: bottomright
        var credctrl = L.controlCredits({
            image: "Images/opengislab_106x23.png",
            link: "https://www.opengislab.com/",
            text: "Leaflet map example by Stephanie @ <u>opengislab.com<u/>"
        }).addTo(map);

        //boton RUN button-play

        var button  = document.getElementById("button-play");
        button.addEventListener('click', run)
        //console.log("Se hizo click en button play");

        function run(){
            var zoom = 12;
            var lat = document.getElementById("lat").value;
            var lng = document.getElementById("lng").value;

            var marker = L.marker([lat, lng],{}).addTo(map);
            map.flyTo([lat, lng], zoom);
        }

