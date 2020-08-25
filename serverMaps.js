 let express =  require('express');
const axios = require('axios');
const MongoClient = require("mongodb").MongoClient;
// const { shouldSendSameSiteNone } = require('should-send-same-site-none');


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
        // client.close();
    });
});

let app =  express();
// app.use(shouldSendSameSiteNone);
app.use(express.static(__dirname + "/public"));
app.get('/', function (req, res){
        // res.cookie("foo", "bar", { sameSite: "none", secure: true });
        res.redirect('map.html');   
});

app.get('/q', function (req, res) {

    // res.cookie("foo", "bar", { sameSite: "none", secure: true });
    var requestBbox = req.query.bbox.split(',');

    requestBbox.forEach((element, index, arr) => {
        arr[index] = parseFloat(element);
    });
    console.log(requestBbox);
    sendFeatures(featuresDB,requestBbox).then(obj => res.jsonp(obj));
});

async function sendFeatures(featuresDB, requestBbox){
    // await  fPush(featuresDB, requestBbox);//.catch(err => {console.log(err)});
    await find(requestBbox);
    console.log('send:', objects);
    return(objects);
}

function find(requestBbox){
    let coordinates = [[
        [requestBbox[0],requestBbox[1]], [requestBbox[0],requestBbox[3]], [requestBbox[2], requestBbox[3]], [requestBbox[2], requestBbox[1]], [requestBbox[0],requestBbox[1]]
    ]];

    // console.log('coordinates',coordinates)

    collection.find({
        coords:{
            $geoWithin: {
                $geometry: {
                type : "Polygon" ,
                coordinates
                }
            }
        }    
    }).toArray(function(err, results){
                results.forEach(el =>{
                    if(!objects.features.includes(el)){
                        objects.features.push({
                            'type': 'Feature',
                            'id': el.id,
                            'geometry': {
                                "type": "Point",
                                "coordinates": el.coords
                            },
                            'properties':{
                                "balloonContent": el.name + el.address,
                                // "clusterCaption": "Метка "+featuresDB[i].id,
                                "hintContent": el.address// featuresDB[i].name
                            }
                        });
                    }
                });
        // console.log('ответ',results);
        // client.close();
    });
}

// process.on("SIGINT", () => {
//     dbClient.close();
//     process.exit();
//   });
  
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});