ymaps.ready(init);

function init () {


    var myMap = new ymaps.Map('map', {
        center: [55.831903, 37.411961], //0:48.500958, 1:55.846649
        zoom: 7
    }, {
        searchControlProvider: 'yandex#map'
    });

    loadingObjectManager = new ymaps.LoadingObjectManager('http://127.0.0.1:3000/q?bbox=%b', {   
        // Включаем кластеризацию.
        clusterize: true,
        // Зададим опции кластерам.
        // Опции кластеров задаются с префиксом cluster.
        clusterHasBalloon: false,
        // Опции объектов задаются с префиксом geoObject.
        geoObjectOpenBalloonOnClick: false,
        splitRequests : false
    });

    myMap.geoObjects.add(loadingObjectManager);



    // ObjMang
    // var myMap = new ymaps.Map('map', {
    //         center: [55.76, 37.64],
    //         zoom: 10
    //     }, {
    //         searchControlProvider: 'yandex#search'
    //     }),
    //     objectManager = new ymaps.ObjectManager({
    //         // Чтобы метки начали кластеризоваться, выставляем опцию.
    //         clusterize: true,
    //         // ObjectManager принимает те же опции, что и кластеризатор.
    //         gridSize: 32,
    //         clusterDisableClickZoom: true
    //     });

    // // Чтобы задать опции одиночным объектам и кластерам,
    // // обратимся к дочерним коллекциям ObjectManager.
    // objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    // objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    // myMap.geoObjects.add(objectManager);

    // $.ajax({
    //     url: "data.json"
    // }).done(function(data) {
    //     objectManager.add(data);
    // });

}

