 let express =  require('express');
 cookieParser = require('cookie-parser');
const MongoClient = require("mongodb").MongoClient;


let db, dbClient, collection, arrOfcookies = [];
let mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true ,useUnifiedTopology: true});

let objOfObjs;

// let objects = {
//     type: 'FeatureCollection',
//     features: []     
// };

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
app.use(express.static(__dirname + "/public"));
app.use(cookieParser('secret key'));

app.get('/', function (req, res){
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
    // console.log(requestBbox);

    sendFeatures(requestBbox)
            .then(obj =>{
                res.jsonp(obj);
            });
           
});

async function sendFeatures(requestBbox){
    // await find(requestBbox);
    console.log('send:', await find(requestBbox));
    return(await find(requestBbox));
}

function find(requestBbox){
    let coordinates = [
        [requestBbox[1],requestBbox[0]],
        [requestBbox[3],requestBbox[0]],
        [requestBbox[3], requestBbox[2]], 
        [requestBbox[1], requestBbox[2]], 
        [requestBbox[1],requestBbox[0]]
    ];

    // let objects = {
    //     type: 'FeatureCollection',
    //     features: []     
    // };

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
        let objects = {
            type: 'FeatureCollection',
            features: []     
        };
        results.forEach(el =>{

            if(!arrOfcookies.includes(el.id.toString())){
                
                // console.log('EL true', arrOfcookies, el.id.toString());
                
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
        objOfObjs = objects;
    });
    return objOfObjs;
}

  
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});
