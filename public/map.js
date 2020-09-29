
ymaps.ready(init);

function init () {


    var myMap = new ymaps.Map('map', {
        center: [55.831903, 37.411961], 
        zoom: 10
    }, {
        searchControlProvider: 'yandex#map'
    });

    let Manager = new ymaps.LoadingObjectManager('http://127.0.0.1:3000/q?bbox=%b', {   
        
        clusterize: true
        // clusterHasBalloon: false,

        // geoObjectOpenBalloonOnClick: false,
        // splitRequests : true
    });

    myMap.geoObjects.add(Manager);
}

