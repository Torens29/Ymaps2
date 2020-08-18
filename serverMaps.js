 let express =  require('express');
const axios = require('axios');
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

let db, dbClient, collection, featuresDB =[];
let mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true ,useUnifiedTopology: true});

let objects = {
    type: 'FeatureCollection',
    features: []     
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

let app =  express();
app.use(express.static(__dirname + "/public"));
app.get('/', function (req, res){
        res.redirect('map.html');   
});

app.get('/q', function (req, res) {

    var requestBbox = req.query.bbox.split(',');

    requestBbox.forEach((element, index, arr) => {
        arr[index] = parseFloat(element);
    });
    console.log(requestBbox);
    sendFeatures(featuresDB,requestBbox).then(obj => res.jsonp(obj));
});

async function sendFeatures(featuresDB, requestBbox){
    await  fPush(featuresDB, requestBbox);//.catch(err => {console.log(err)});
    console.log('send:', objects);
    return(objects)
    // res.jsonp(objects);
}

async function fPush(featuresDB, requestBbox){
    console.log(featuresDB.length);
    for (i = 0; i < featuresDB.length; i++) {
        // console.log(i, featuresDB[i].coords)
        await check().then(res =>{
            if(res){
                if( objects.features.length == 0) {
                    objects.features.push({
                        'type': 'Feature',
                        'id': featuresDB[i].id,
                        'geometry': {
                            'type': "Point",
                            "coordinates": featuresDB[i].coords
                        },
                        'properties':{
                            "balloonContent": featuresDB[i].name + featuresDB[i].address,
                            // "clusterCaption": "Метка "+featuresDB[i].id,
                            "hintContent": featuresDB[i].address// featuresDB[i].name
                        }
                    });
                }else{
                    console.log('присутствует ', featuresDB[i].id, objects.features.includes(featuresDB[i]));
                    if(!objects.features.includes(featuresDB[i])){
                        objects.features.push({
                            'type': 'Feature',
                            'id': featuresDB[i].id,
                            'geometry': {
                                "type": "Point",
                                "coordinates": featuresDB[i].coords
                            },
                            'properties':{
                                "balloonContent": featuresDB[i].name + featuresDB[i].address,
                                // "clusterCaption": "Метка "+featuresDB[i].id,
                                "hintContent": featuresDB[i].address// featuresDB[i].name
                            }
                        });
                    }
                }
            }
           
        });
        
        async function check (){
            console.log('check', i)
            if (featuresDB[i].coords[0] >= requestBbox[0] && featuresDB[i].coords[0] <= requestBbox[2] &&
                featuresDB[i].coords[1] >= requestBbox[1] && featuresDB[i].coords[1] <= requestBbox[3]) {
                 
                        console.log('входит');
                        return true;
                    
                    // if( objects.features.length == 0) {
                    //     objects.features.push({
                    //         'type': 'Feature',
                    //         'id': featuresDB[i].id,
                    //         'geometry': {
                    //             'type': "Point",
                    //             "coordinates": featuresDB[i].coords
                    //         },
                    //         'properties':{
                    //             "balloonContent": featuresDB[i].name + featuresDB[i].dateStart,
                    //             // "clusterCaption": "Метка "+featuresDB[i].id,
                    //             "hintContent": featuresDB[i].name
                    //         }
                    //     });
                    // }else{
                    // objects.features.forEach((item, i, arr) => {
                    //         if(item.id != featuresDB[i].id){
                    //             console.log(item.id);
                    //             objects.features.push({
                    //                 'type': 'Feature',
                    //                 'id': featuresDB[i].id,
                    //                 'geometry': {
                    //                     "type": "Point",
                    //                     "coordinates": featuresDB[i].coords
                    //                 },
                    //                 'properties':{
                    //                     "balloonContent": featuresDB[i].name + featuresDB[i].dateStart,
                    //                     // "clusterCaption": "Метка "+featuresDB[i].id,
                    //                     "hintContent": featuresDB[i].name
                    //                 }
                    //             });
                    //         }else console.log(item.id,featuresDB[i].id ,item.id != featuresDB[i].id)

                    // });
                    // }
                
            } else{
                // console.log('не входит')
                return false;
            } 
        }
    }
    // return objects;
}

// process.on("SIGINT", () => {
//     dbClient.close();
//     process.exit();
//   });
  
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});