let info_results = {}
let particips_places = [];

let sort_result = false;
let sort_result_race_1 = true,sort_result_race_2 = true,sort_result_race_3 = true,sort_result_race_4 = true;

$(document).ready(function(){
	GetInformation();
	SetSortsTable();
});

//получаем всю инфу из "базы данных"
function GetInformation(){
	let dataForm_cars = new FormData();
    dataForm_cars.append("typeInform","cars");
	let info_cars = {},info_attempts = {};

	$.ajax({
		url:"db.php",
		method:"POST",
		dataType: 'json',
		data: dataForm_cars,
		contentType: false,
        processData: false,
        success: function(data)
        {   
			info_cars = data;
        } 
	});

	let dataForm_attempts = new FormData();
    dataForm_attempts.append("typeInform","attempts");

	$.ajax({
		url:"db.php",
		method:"POST",
		dataType: 'json',
		data: dataForm_attempts,
		contentType: false,
        processData: false,
        success: function(data)
        {   
			info_attempts = data;
			PreliminarilySetResults(info_cars, info_attempts);
			PreliminarilySortResults();
    		SortByResults(false);
			SetTableResults();
        } 
	})
}

//установка режима сортировки для конкретных столбцов
function SetSortsTable(){
	$("#sort_result_itog").on("click",function(){
		sort_result = !sort_result;
		SortByResults(sort_result);
		SetTableResults();
	})

	$("#sort_result_race_1").on("click",function(){
		sort_result_race_1 = !sort_result_race_1;
		SwitchSortRaceResult(sort_result_race_1, 0);
	})

	$("#sort_result_race_2").on("click",function(){
		sort_result_race_2 = !sort_result_race_2;
		SwitchSortRaceResult(sort_result_race_2, 1);
	})

	$("#sort_result_race_3").on("click",function(){
		sort_result_race_3 = !sort_result_race_3;
		SwitchSortRaceResult(sort_result_race_3, 2);
	})

	$("#sort_result_race_4").on("click",function(){
		sort_result_race_4 = !sort_result_race_4;
		SwitchSortRaceResult(sort_result_race_4, 3);
	})
}

function SwitchSortRaceResult(sortRise, numRace){
	SortByRace(sortRise,numRace);
	SetTableResults();
}

//генерирование результатов в таблицу
function SetTableResults(){
	$('#inform_participants').empty();
	
	for(let i = 0; i < particips_places.length;i++){

        let tr = $('<tr class="info_val"></tr>');
        $(tr).append(`
            <td><span>${particips_places[i].hum.place}</span></td>
            <td><span>${info_results[particips_places[i].hum.id].name}</span></td>
            <td><span>${info_results[particips_places[i].hum.id].city}</span></td>
            <td><span>${info_results[particips_places[i].hum.id].car}</span></td>
        `);

        info_results[particips_places[i].hum.id].results.forEach(res => {
            $(tr).append(`<td><span>${res}</span></td>`);
        });

        $(tr).append(`<td><span>${info_results[particips_places[i].hum.id].result_itog}</span></td>`);
        $('#inform_participants').append(tr);
    }
}

//предварительное создание объекта с объединением данных
function PreliminarilySetResults(info_cars, info_attempts){	
	for(let participant in info_cars){
        let id_participant = info_cars[participant].id;

        info_results[id_participant] = {
            "name": info_cars[participant].name,
            "city": info_cars[participant].city,
            "car": info_cars[participant].car,
            "results": [],
			"result_itog": 0
        }

        for(let attempt in info_attempts){
            if(info_attempts[attempt].id === info_cars[participant].id){
                info_results[id_participant].results.push(info_attempts[attempt].result);
            }
        }

		for(let i = 0; i < info_results[id_participant].results.length;i++){
			info_results[id_participant].result_itog += info_results[id_participant].results[i];
		}

    }
}

//предварительная сортировка данных и установление полученных мест для участников
function PreliminarilySortResults(){
    let k = {};

    for(let p in info_results) {
        particips_places.push({
			hum: {
				id: p,
				place: 0
			}
		});
    }

    for(let i = 0; i < particips_places.length - 1;i++){
        for(let j = i + 1; j < particips_places.length;j++){
            let result_i = info_results[particips_places[i].hum.id].result_itog;
			let result_j = info_results[particips_places[j].hum.id].result_itog;

            if(result_i < result_j){
                Object.assign(k, particips_places[i]);
                Object.assign(particips_places[i],particips_places[j]);
                Object.assign(particips_places[j],k);
            }
        }
    }

	for(let i = 0;i < particips_places.length;i++){
		particips_places[i].hum.place = i + 1;
	}
	
}

//сортировка результатов по общему итогу гонки
function SortByResults(rise){
    let k = {};

    for(let i = 0; i < particips_places.length - 1;i++){
        for(let j = i + 1; j < particips_places.length;j++){
            let result_i = info_results[particips_places[i].hum.id].result_itog;
			let result_j = info_results[particips_places[j].hum.id].result_itog;

            if(rise && (result_i > result_j) || !rise && (result_i < result_j)){
                Object.assign(k, particips_places[i]);
                Object.assign(particips_places[i], particips_places[j]);
                Object.assign(particips_places[j], k);
            }
        }
    }
}

//сортировка результатов по конкретному заезду
function SortByRace(rise, num){
    let k = {};

    for(let i = 0; i < particips_places.length - 1;i++){
        for(let j = i + 1; j < particips_places.length;j++){
            let result_i = info_results[particips_places[i].hum.id].results[num];
			let result_j = info_results[particips_places[j].hum.id].results[num];

            if(rise && (result_i > result_j) || !rise && (result_i < result_j)){
                Object.assign(k, particips_places[i]);
                Object.assign(particips_places[i], particips_places[j]);
                Object.assign(particips_places[j], k);
            }
        }
    }
}