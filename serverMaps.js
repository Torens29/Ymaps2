 let express =  require('express');
const axios = require('axios');
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

let db, dbClient, collection, featuresDB =[];
let mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true ,useUnifiedTopology: true});

let objects = {
    type: 'FeatureCollection',
    features: [{
        "type": "Feature",
        "id": 0,
        "geometry": {
          "type": "Point",
          "coordinates": [55.831903, 37.411961]
        }
    }]           
};

mongoClient.connect(function(err, client){

    if(err) return console.log(err);    
    db = client.db("Tenders");
    collection =  db.collection('tenderInfo2');
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
        res.redirect('map.html');   
});

app.get('/q', function (req, res) {

    var requestBbox = req.query.bbox;
    console.log(req.query.bbox);
    sendFeatures(featuresDB,requestBbox).then(obj => res.jsonp(obj));
});

async function sendFeatures(featuresDB, requestBbox){
    await  fPush(featuresDB, requestBbox);
    console.log('send:', objects);
    return(objects)
    // res.jsonp(objects);
}

async function fPush(featuresDB, requestBbox){
    console.log(featuresDB.length)
    for (i = 0; i < featuresDB.length; i++) {
        console.log(i, featuresDB[i].coords)
        if (featuresDB[i].coords[1] >= requestBbox[0] && featuresDB[i].coords[1] <= requestBbox[2] &&
            featuresDB[i].coords[0] >= requestBbox[1] && featuresDB[i].coords[0] <= requestBbox[3]) {
            objects.features.forEach((item, i, arr) => {
                if(item.id != featuresDB.id){
                    console.log('pushss')
                    objects.features.push(featuresDB);
                }
            });
        }
    }
    console.log('obj: ', objects)
    return objects;
    //     searchPoint(featuresDB[i], i, requestBbox)
    //         .then((feature)=>{
    //             // console.log('dssdsd '); Попробовать вместе с key проходить по Obj и forEach по масиву
    //             // console.log('ob ', objects.features.length)
    //             if(feature == null){
    //                 console.log('feature', feature)
    //             }else
    //             if(objects.features.length == 0){
    //                 objects.features.push(feature);
    //                 console.log('равно 0 ', feature);
    //             }else{
    //                 for(j = 0; j < objects.features.length; j++)
    //                     o = objects.features[j];
    //                     // console.log("o", o);
    //                     for(key in o){
    //                         // console.log(key)
    //                         if(key == 'id'){
    //                             if(feature.id != key.id){
    //                                 objects.features.push(feature);
    //                                 // console.loп(arr)
    //                             }else{
    //                                 console.log('есть элемент ', feature.id)
    //                             }
    //                         }
    //                     }
    //             }
                
    //             console.log('WQWQWQWQWQW ',objects);
    //             console.log(objects.features[0].geometry.coordinates)
                
    //         })
    //         .catch(err =>{
    //             // console.log('ERR',err)
    //             fs.appendFile("hello.txt", err+'/\n/', function(error){
    //                 if(error) throw error; // если возникла ошибка
                                 
    //                 // console.log("Запись файла завершена.");
    //             });
    //         });
        
    // }
}

async function searchPoint(IfeaturesDB, i, requestBbox) {
    if(IfeaturesDB.coords[0] >= requestBbox[0] &&
        IfeaturesDB.coords[0] <= requestBbox[2] &&
        IfeaturesDB.coords[1] >= requestBbox[1] &&
        IfeaturesDB.coords[1] <= requestBbox[3]) {
        
        return feature;
    }
    
}


// process.on("SIGINT", () => {
//     dbClient.close();
//     process.exit();
//   });
  
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});