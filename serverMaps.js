 let express =  require('express');
const axios = require('axios');
const MongoClient = require("mongodb").MongoClient;

let db, dbClient, collection, featuresDB =[];
let mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true ,useUnifiedTopology: true});

let objects = {
    type: 'FeatureCollection',
    features: []           
};




mongoClient.connect(function(err, client){

    if(err) return console.log(err);    
    db = client.db("Tenders");
    collection =  db.collection('tenderInfo');
    dbClient = client;
    
  
    collection.find().toArray(function(err, results){
                 
        featuresDB = results;
        client.close();
    });
});

// var clusterId = 10001;
let app =  express();
app.use(express.static(__dirname + "/public"));
app.get('/', function (req, res){
        // res.sendFile( __dirname + '/map.html');
        res.redirect('map.html');   
});

app.get('/q', function (req, res) {

    var requestBbox = req.query.bbox;
    console.log(req.query.bbox);
    // var arrayBbox = requestBbox.split(',');
    // var bbox = [];
    // var filteredFeatures = [];
    // var sortedFeatures;
    // var clusteredFeatures = [];
    // var clusterPresets = ["islands#yellowClusterIcons"];
    // var tempFeatures = [];
    // var types = ['школа', 'кафе', 'аптека', 'банк'];

    // for (var i = 0; i < arrayBbox.length; i++) {
    //     bbox[i] = parseFloat(arrayBbox[i]);
    // }


    sendFeatures(featuresDB,requestBbox).then(obj => res.jsonp(obj));
});

async function sendFeatures(featuresDB, requestBbox){
    await  fPush(featuresDB, requestBbox);
    console.log('send:', objects);
    return(objects)
    // res.jsonp(objects);
}

async function fPush(featuresDB, requestBbox){
    for (i = 0; i < featuresDB.length; i++) {
        searchPoint(featuresDB[i], i, requestBbox)
            .then((feature)=>{
                // console.log('dssdsd '); Попробовать вместе с key проходить по Obj и forEach по масиву
                // console.log('ob ', objects.features.length)
                if(objects.features.length == 0){
                    objects.features.push(feature);
                }else{
                    for(j = 0; j < objects.features.length; j++)
                        o = objects.features[j];
                        // console.log("o", o);
                        for(key in o){
                            // console.log(key)
                            if(key == 'id'){
                                if(feature.id != key.id){
                                    arr.push(feature);
                                    // console.loп(arr)
                                }else{
                                    console.log('есть элемент ', feature.id)
                                }
                            }
                        }
                }
                
                console.log('WQWQWQWQWQW ',objects);
                console.log(objects.features[0].geometry.coordinates)
                
            })
            .catch(err =>{
                // console.log(err)
            })
        
    }
}

async function searchPoint(address, i, requestBbox) {
    const geocoderUrl = 'https://geocode-maps.yandex.ru/1.x?apikey=28d74b24-f33d-4b35-8949-88142b0c9d92&lang=ru_RU&format=json&geocode=' +
    encodeURIComponent(address.address) +
    `bbox=${requestBbox[0]},${requestBbox[1]} ~ 
            ${requestBbox[2]}, ${requestBbox[3]}`;
    let res = await axios.get(geocoderUrl).then(res => res.data);
            // console.log('point Search  '+ i, res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' '));
    let coordinates = res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
    // console.log(res.response.GeoObjectCollection.featureMember[0])
    coordinates[0] = parseFloat(coordinates[1]);
    coordinates[1] = parseFloat(coordinates[0]);
    let feature = {
        type: "Feature",
        id: i,
        geometry:{
            type: "Point", 
            coordinates: coordinates,
            properties: {
                balloonContent: "Содержимое балуна",
                clusterCaption: "Метка 1",
                hintContent: "Текст подсказки"
            }
        } 
    }
    // console.log('in fuc', feature)
    return feature;
}


// process.on("SIGINT", () => {
//     dbClient.close();
//     process.exit();
//   });
  
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});