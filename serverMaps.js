 let express =  require('express');
 cookieParser = require('cookie-parser');
const axios = require('axios');
const MongoClient = require("mongodb").MongoClient;
// const { shouldSendSameSiteNone } = require('should-send-same-site-none');


let db, dbClient, collection, arrOfcookies = [];
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
        // client.close();
    });
});

let app =  express();
// app.use(shouldSendSameSiteNone);
app.use(express.static(__dirname + "/public"));
app.use(cookieParser('secret key'));

app.get('/', function (req, res){
        // res.cookie("foo", "bar", { sameSite: "none", secure: true });
        res.redirect('map.html');   
});

app.get('/q', function (req, res) {

    if(typeof req.cookies.obj === undefined ){
        arrOfcookies = req.cookies.obj.split(',');
    }
    

    var requestBbox = req.query.bbox.split(',');

    requestBbox.forEach((element, index, arr) => {
        arr[index] = parseFloat(element);
    });
    console.log(requestBbox);
    
    sendFeatures(requestBbox).then(obj => res.jsonp(obj));
    objects = {
         type: 'FeatureCollection',
         features: []     
     };
});

async function sendFeatures(requestBbox){
    // await  fPush(featuresDB, requestBbox);//.catch(err => {console.log(err)});
    await find(requestBbox);
    console.log('send:', objects);
    return(objects);
}

function find(requestBbox){
    let coordinates = [
        
        [requestBbox[1],requestBbox[0]],
        [requestBbox[3],requestBbox[0]],
        [requestBbox[3], requestBbox[2]], 
        [requestBbox[1], requestBbox[2]], 
        [requestBbox[1],requestBbox[0]]
    ];

    // console.log('coordinates',coordinates);

    collection.find({
        coords:{
            $geoWithin: {
                $geometry: {
                type : "Polygon" ,
                coordinates: [coordinates]
                }
            }
        }    
    }).toArray(function(err, results){
                // console.log("results", results);

                results.forEach(el =>{

                    if(!arrOfcookies.includes(el.id.toString())){
                        
                        console.log('EL true', arrOfcookies, el.id.toString());

                        objects.features.push({
                            'type': 'Feature',
                            'id': el.id,
                            'geometry': {
                                "type": "Point",
                                "coordinates": [el.coords.coordinates[1], el.coords.coordinates[0]]
                            },
                            'properties':{
                                "balloonContent": el.name + el.address,
                                // "clusterCaption": "Метка "+featuresDB[i].id,
                                "hintContent": el.address// featuresDB[i].name
                            }
                        });
                    }
                });
    });
}

  
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});
