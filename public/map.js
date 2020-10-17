if(document.readyState == 'loading'){
    document.cookie = 'obj=';
}

let typeOfTender = document.querySelector('select[id=typeOfTender]');
let storeOfObj =[],
arrOfType = [['Полное строительство и реконструкция зданий и сооружений',
    'Строительно-монтажные работы, Монтаж конструкций и ограждений',
    'Ремонт зданий и сооружений',
    'Фасадные работы, Кровельные работы, Высотные работы',
    'Установка окон и дверей, Производство окон и дверей',
    'Подготовка площадей под строительство, Расчистка просек, Сооружение насыпей',
    'Сантехнические работы, Внутренние сети водо-, тепло-, газо-снабжения и канализации',
    'Электротехнические работы в зданиях',
    'Строительство и обслуживание объектов энергетики и электрических сетей',
    'Строительство и обслуживание сетей связи и сооружений связи',
    'Строительство, ремонт и обслуживание дорог, мостов, тоннелей и ЖД путей',
    'Строительство и ремонт трубопроводов и прочих инженерных коммуникаций',
    'Проектирование, монтаж и обслуживание систем вентиляции',
    'Строительство и обслуживание гидротехнических сооружений',
    'Огнезащитные и антикоррозийные работы',
    'Благоустройство и озеленение',
    'Водолазные работы',
    'Буровые работы (кроме бурения нефтегазовых скважин)'],
    []];

ymaps.ready(init);

    function init () {

    var myMap = new ymaps.Map('map', {
        center: [55.831903, 37.411961], 
        zoom: 10
    }, {
        searchControlProvider: 'yandex#map'
    });

    let loadingObjectManager = new ymaps.LoadingObjectManager('http://127.0.0.1:3000/q?bbox=%b', {   
        clusterize: true
    });

    myMap.geoObjects.add(loadingObjectManager);

    

   loadingObjectManager.objects.events.add(['add'], ObjsAddOnMap);

    function ObjsAddOnMap(e){
        let arrOfObjs=[];
        loadingObjectManager.objects.getAll().forEach(function(item, i, arr) {
            arrOfObjs.push(item.id);
        });
        document.cookie = `obj=${arrOfObjs}`;
    }
    
    typeOfTender.addEventListener('change', function(){
        let select = this.value;
        let includ=false;
        if(select == 'all'){
            loadingObjectManager.setFilter("true");
        } else{      
            loadingObjectManager.setFilter(function (object) { 
                includ=false;
                object.properties.type.forEach((item) =>{
                    
                    if(arrOfType[select].includes(item) == true){
                        console.log(object.id, item);
                        includ = true;
                    }
                });
                return includ;
            });
        }     
    });
    
}

