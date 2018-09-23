
$(function(){
    $.ajaxSetup({beforeSend: function(xhr){
            if (xhr.overrideMimeType)
            {
                xhr.overrideMimeType("application/json");
            }
        }
    });

    $.getJSON('FAD.json',function(data){
        console.log('successful loading fad.json');
        $.each(data.features, function(i, feature) {
            if (feature.geometry != null) {
                L.marker(feature.geometry.coordinates.reverse())
                    .addTo(map)
                    .bindPopup(feature.properties.name)
                    .openPopup();
            }
        })

    }).error(function(){
        console.log('error');
    });
});