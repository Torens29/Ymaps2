
ymaps.ready(init);

function init () {


    var myMap = new ymaps.Map('map', {
        center: [55.831903, 37.411961], //0:48.500958, 1:55.846649
        zoom: 10
    }, {
        searchControlProvider: 'yandex#map'
    });

    loadingObjectManager = new ymaps.LoadingObjectManager('http://127.0.0.1:3000/q?bbox=%b', {   
        
        clusterize: true,
        // clusterHasBalloon: false,

        // geoObjectOpenBalloonOnClick: false,
        // splitRequests : true
    });

    myMap.geoObjects.add(loadingObjectManager);
}

