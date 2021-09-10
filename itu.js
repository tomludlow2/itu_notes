$(function() {
	//Ready:
	$('#time_date').text(do_date());

	//Add event listener for key down (note using key up prevents tab from working correctly)
	$('#inputTA').on("keydown", process_key);
	$('#inputTA').on("keyup", proc_shorthand);
});

//Glossary provides shorthand => longhand equivalents for the components of the note
var glossary = {
	name_grade: "Your Name and Grade",
	age_gend: "Age/Gender",
	temp: "Temperature",
	pulse: "Pulse Rate",
	resp: "Resp Rate",
	sbp: "Systolic",
	dbp: "Diastolic",
	fio2: "FiO2",
	spo2: "SpO2",
	na: "Sodium",
	k: "Potassium",
	u: "Urea",
	cr: "Creatinine",
	egfr: "eGFR",
	gluc: "Glucose",
	wbc: "WCC",
	neut: "Neuts",
	hb: "Haemoglobin",
	plat: "Platelets",
	phos: "Phosphate",
	bili: "Bilirubin",
	alp: "Alk Phos",
	ggt: "GGT",
	alb: "Albumin",
	aca: "Adj Calcium",
	alt: "ALT",
	mg: "Magnesium",
	crp: "CRP",
	pH: "pH",
	pco2: "pCO2",
	po2: "pO2",
	hco3: "Bicarbonate",
	be: "Base Excess",
	lact: "Lactate",
	icp: "ICP",
	cpp: "CPP",
	airway: "Airway (Type)",
	mode: "Mode",
	ps: "Pressure Support",
	peep: "PEEP",
	ie: "I:E Ratio",
	vt: "Tidal Volume",
	balance: "Balance",
	uo: "Urine Output",
	lmwh: "LWMH",
	teds: "Physical VTE",
	ppi: "PPI",
	kinetic: "Kinetic",
	lax: "Laxatives",
	feed: "Feed",
	asps: "Aspirate",
	abx: "Antibiotics",
	cults: "Cultures",
	art: "Arterial Line",
	cvc: "Central Line",
	picc: "PICC Line",
	other_line: "Other Line",
	support: "Cardiovascular Support",
	sedation: "Sedation",
	paralysis: "Paralysis",
	pct: "Procalcitonin",
	gcs: "GCS",
	pupils: "Pupils"
}

//Shorthand provides a .x => long word for speed of entry. 
var shorthand = {
	airway: {
		o: "Own",
		e: "ETT",
		t: "Tracheostomy"
	},
	lmwh: {
		d: "Dalteparin",
		e: "Enoxaparin",
		n: "None",
		w: "Warfarin",
		a: "NOAC"
	},
	teds: {
		t: "TEDs",
		f: "FlowTrons"
	},
	ppi: {
		o: "Omeprazole",
		l: "Lansopraole",
		n: "Nil"
	},
	kinetic: {
		m: "Metoclopramide",
		e: "Erythromycin"
	},
	lax: {
		s: "Senna",
		m: "Macrogol",
		l: "Lactulose",
		i: "Isphagula",
		n: "None"
	},
	asps: {
		n: "Nil"
	},
	abx: {
		t: "Tazocin",
		m: "Meropenem",
		c: "Co-amoxiclav",
		g: "Gentamicin",
		f: "Ciprofloxacin",
		z: "Metronidazole"
	},
	art: {
		d: "Day ",
		k: " - Keep",
		r: " - Remove"
	},
	cvc: {
		d: "Day ",
		k: " - Keep",
		r: " - Remove"
	},
	picc: {
		d: "Day ",
		k: " - Keep",
		r: " - Remove"
	},
	other_line: {
		d: "Day ",
		k: " - Keep",
		r: " - Remove"
	},
	mode: {
		1: "SIMV",
		2: "APRV",
		3: "CPAP",
		4: "ASV"
	},
	support: {
		u: "Unsupported",
		n: "Noradrenaline",
		m: "Metaraminol",
		a: "Adrenaline",
		d: "Dobutamine",
		p: "Dopamine",
		h: "mls/hr"
	},
	sedation: {
		p: "Propofol",
		a: "Alfentanil",
		m: "Midazolam",
		d: "Dexdor",
		t: "Thiopentol",
		k: "Ketamine",
		h: "mls/hr"
	},
	paralysis: {
		a: "Atracurium",
		r: "Rocuronium"
	},
	pupils: {
		p: "PEARLA"
	}

}

//Defines a typical note object. 
var note = {
	queue_pos:0,
	queue_order: ["name_grade", "age_gend","temp","pulse","resp","sbp","dbp","fio2", "spo2","na","k","u","cr","egfr","gluc","wbc","neut","hb","plat","phos","bili","alp","ggt","alb","aca","alt","mg","crp","pH","pco2","po2","hco3","be","lact","icp","cpp","airway","mode","ps","peep","ie","vt","balance","uo","lmwh","teds","ppi","kinetic","lax","feed","asps","abx","cults","art","cvc","picc","other_line", "support", "sedation", "paralysis", "pct", "gcs", "pupils"],
	//Not used, but can be used to create a pure empty object for debugging. 
	init : function() {
		for (var i = 0; i <= this.queue_order.length; i++) {
			this[this.queue_order[i]] = null;
		}
		console.log(this);
	},
	next : function() {
		//Advance the queue position further along the array
		this.queue_pos++;
		if( this.queue_pos == this.queue_order.length) {
			this.queue_pos = 0;
		}
	},
	prev : function() {
		//Move back along the queue
		this.queue_pos--;
		if( this.queue_pos < 0 ) {
			this.queue_pos = this.queue_order.length-1;
		}
	}
}

//Called with every key press
function process_key(event) {
	console.log("Heard ", event.keyCode);
	var kc = event.keyCode;
	/*
	[Enter] = 13
	[Tab] = 9
	[Up] = 38
	[Down] = 40
	[Left] = 37
	[Right] = 39
	[Shift] = 16
	[Ctrl] = 17
	[Alt] = 18
	*/
	//If Down/Enter pressed - this field is "complete" - process
	if( kc == 13 || kc == 40 ) {
		//Stop typical events. 
		event.preventDefault();
		event.stopPropagation();
		//Set the note value to the new text box value
		note[note.queue_order[note.queue_pos]] = $("#inputTA").val();
		//Advance the queue
		note.next();
		//Update the GB div
		update_gb();
		//Prevent it displaying "undefined"
		if( note[note.queue_order[note.queue_pos]] == undefined ) {
			$("#inputTA").val("");
		}else {
			//If it is not "undefined" then prepopulate the input box with the last entered value from the object
			$("#inputTA").val(note[note.queue_order[note.queue_pos]]);
		}
	}else if( kc == 9 ) {
		event.preventDefault();
		event.stopPropagation();
		//Tab presssed - GO
		write_note(note);
	}else if( kc == 38 ){
		//Process the text input for any shorthand
		event.preventDefault();
		event.stopPropagation();
		note[note.queue_order[note.queue_pos]] = $("#inputTA").val();
		note.prev();
		update_gb();
		if( note[note.queue_order[note.queue_pos]] == undefined ) {
			$("#inputTA").val("");
		}else {
			$("#inputTA").val(note[note.queue_order[note.queue_pos]]);
		}
	}
}

function proc_shorthand(event) {
	if(event.keyCode == 13 || event.keyCode == 40 || event.keyCode == 9 || event.keyCode == 38 ) {
		return;
	}
	//Generate the shorthand string for regex, then a str replace with that for the longhand 
	//E.g. ".d" replaces to "Day " and ".k" to " - Keep"
	var cur_shorthand = shorthand[note.queue_order[note.queue_pos]];
	if( cur_shorthand != undefined ) {
		var str = $("#inputTA").val();
		for( const[key,val] of Object.entries(cur_shorthand) ) {
			//Replace the string with the correct regex
			const regex = new RegExp("\\." + key, "gmi");
			console.log( regex );
			str = str.replace(regex, val);
		}
		$("#inputTA").val(str);
	}
}

function update_gb () {
	//Update the control box area
	var current = note.queue_pos;
	var prev = current-1;
	var next = current+1;
	if(prev < 0){
		prev = "<- Start ->";
	}else {
		prev = glossary[note.queue_order[prev]];
	}
	if(next == note.queue_order.length){
		next = "<- End ->";
	}else {
		next = glossary[note.queue_order[next]];
	}
	current = glossary[note.queue_order[current]];
	var str = "<h6>" + prev + "</h6>\n";
	str += " <h4> " + current + "</h4>\n";
	str += get_shorthand(note.queue_order[note.queue_pos]);
	str += "<h6>" + next + "</h6>";
	$('#glossary_box').html(str);
}

function get_shorthand(prop) {
	if( shorthand[prop] != undefined ) {
		console.log("Found Shorthand");
		var r = "<p class='gloss_descriptor'>";
		for( const[key,val] of Object.entries(shorthand[prop]) ) {
			r += "<span class='shorthand_short'>." + key + "</span> <span class='shorthand_long'>" + val + "</span>\n";
		}
		r += "</p>\n";
		return r;
	}else {
		return "";
	}
}

function write_note(note_full) {
	if( note_full.name_grade == ".t" ) note_full.name_grade = "Ludlow CT2 Review"; 
	$('#name_grade').html(note_full.name_grade);
	$('#age_gender').html(note_full.age_gend);
	var airway = "<p>" + note_full.airway + "</p>";

	var breathing = "<p>Mode: " + note_full.mode + "<br/>";
	var settings = "";
	if(note_full.ps != undefined) settings += "PS: " + note_full.ps + ", ";
	if(note_full.peep != undefined) settings += "PEEP: " + note_full.peep + ", ";
	if(note_full.ie != undefined) settings += "IE: " + note_full.ie + ", ";
	if(note_full.vt != undefined) settings += "VT: " + note_full.vt;
	if( settings != "" ) breathing += "Settings: " + settings + "<br/>";

	breathing += "RR: " + note_full.resp + " FiO2: " + note_full.fio2 + " SpO2: " + note_full.spo2 + "<br/>";
	breathing += "Gas: pH: " + note_full.pH + ", pCO2: " + note_full.pco2 + ", pO2: " + note_full.po2 + ", Bicarb: " + note_full.hco3 + ", BE: " + note_full.be + ", Lact: " + note_full.lact + "<br/>";
	breathing += "Examination:</p>";

	var cardiovascular = "<p>BP: " + note_full.sbp + "/" + note_full.dbp + " MAP: " + Math.round(note_full.sbp/3 + note_full.dbp*2/3) + "<br/>";
	if( note_full.supported != undefined) cardiovascular += "Supported: " + note_full.supported + "<br/>";
	cardiovascular += "HR: " + note_full.pulse + "<br/>";
	cardiovascular += "Examination:</p>";

	var disability = "<p>";
	if( note_full.sedation != undefined ) disability += "Sedation:" + note_full.sedation + "<br/>";
	if( note_full.paralysis != undefined ) disability += "Paralysis:" + note_full.paralysis + "<br/>";
	disability += "ICP: " + note_full.icp + ", CPP: " + note_full.cpp + "<br/>";
	disability += "GCS: " + note_full.gcs + ", Pupils: " + note_full.pupils + "<br/>";
	disability += "Examination:</p>";

	var renal = "<p>Na: " + note_full.na + ", K: " + note_full.k + ", Urea: " + note_full.u + ", Creat: " + note_full.cr + ", eGFR: " + note_full.egfr + "<br/>";
	renal += "Mg: " + note_full.mg + ", aCa:" + note_full.aca + ", Phos: " + note_full.phos + "<br/>";
	renal += "Bili: " + note_full.bili + ", ALP: " + note_full.alp + ", GGT: " + note_full.ggt + ", ALT: " + note_full.alt + ", Alb: " + note_full.alb + "<br/>";
	renal += "Balances: " + note_full.balance + "<br/>";
	renal += "Urine Output: " + note_full.uo + "<br/>";
	renal += "Feed: " + note_full.feed + "<br/>";
	renal += "Glucose: " + note_full.gluc + "<br/>";
	renal += "Aspirates: " + note_full.asps + "<br/>";
	renal += "PPI: " + note_full.ppi + ", Prokinetics: " + note_full.kinetic + ", Laxatives: " + note_full.lax + "<br/>";
	renal += "Examination:</p>";

	var micro = "<p>Antibiotics: " + note_full.abx + "<br/>";
	micro += "Cultures: " + note_full.cults + "<br/>";
	micro += "Temp: " + note_full.temp + "<br/>";
	micro += "WCC: " + note_full.wbc + ", Neuts: " + note_full.neut + ", Hb: " + note_full.hb + ", Plat: " + note_full.plat + "<br/>";
	micro += "CRP: " + note_full.crp + ", PCT: " + note_full.pct + "<br/>";

	var lines = "Art Line: " + note_full.art + "<br/>";
	lines += "CVC Line: " + note_full.cvc + "<br/>";
	lines += "PICC Line: " + note_full.picc + "<br/>";
	lines += "Other Lines: " + note_full.other_line + "<br/>";
	lines += "VTE: " + note_full.lmwh + ", " + note_full.teds + "</p>";

	airway = airway.replace(/undefined/g, "");
	breathing = breathing.replace(/undefined/g, "");
	cardiovascular = cardiovascular.replace(/undefined/g, "");
	disability = disability.replace(/undefined/g, "");
	renal = renal.replace(/undefined/g, "");
	micro = micro.replace(/undefined/g, "");
	lines = lines.replace(/undefined/g, "");

	$('#airway').html(airway);
	$('#breathing').html(breathing);
	$('#cardiovascular').html(cardiovascular);
	$('#disability').html(disability);
	$('#renal').html(renal);
	$('#micro').html(micro);
	$('#lines').html(lines);

}

update_gb();

function do_date() {
	var d = new Date();
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var m = month[d.getMonth()];

	var day = weekday[d.getDay()];
	var date = d.getDate();
	var year = d.getFullYear();
	return day + " " + date + " " + m + " " + year;
}


var note_full_2 ={
    "queue_pos": 0,
    "queue_order": [
        "temp",
        "pulse",
        "resp",
        "sbp",
        "dbp",
        "fio2",
        "spo2",
        "na",
        "k",
        "u",
        "cr",
        "egfr",
        "gluc",
        "wbc",
        "neut",
        "hb",
        "plat",
        "phos",
        "bili",
        "alp",
        "ggt",
        "alb",
        "aca",
        "alt",
        "mg",
        "crp",
        "pH",
        "pco2",
        "po2",
        "hco3",
        "be",
        "lact",
        "icp",
        "cpp",
        "airway",
        "rr",
        "mode",
        "ps",
        "peep",
        "ie",
        "vt",
        "balance",
        "uo",
        "lmwh",
        "teds",
        "ppi",
        "kinetic",
        "lax",
        "feed",
        "asps",
        "abx",
        "cults",
        "art",
        "cvc",
        "picc",
        "other_line"
    ],
    "temp": "36.7",
    "pulse": "110",
    "resp": "22",
    "sbp": "110",
    "dbp": "45",
    "fio2": "0.21",
    "spo2": "92",
    "na": "145",
    "k": "4.8",
    "u": "9.6",
    "cr": "124",
    "egfr": "84",
    "gluc": "10.4",
    "wbc": "12.8",
    "neut": "10",
    "hb": "120",
    "plat": "150",
    "phos": "0.88",
    "bili": "12",
    "alp": "190",
    "ggt": "120",
    "alb": "32",
    "aca": "2.25",
    "alt": "38",
    "mg": "0.88",
    "crp": "145",
    "pH": "7.320",
    "pco2": "6.68",
    "po2": "12.8",
    "hco3": "18",
    "be": "-2",
    "lact": "0.9",
    "icp": "8",
    "cpp": "62",
    "airway": "ETT",
    "rr": "24",
    "mode": "SIMV",
    "ps": "5",
    "peep": "5",
    "ie": "1:2",
    "vt": "420",
    "balance": "+420",
    "uo": "30mls/hr",
    "lmwh": "Dalteparin",
    "teds": "TEDs",
    "ppi": "Omeprazole",
    "kinetic": "NIl",
    "lax": "Senna Macrogol",
    "feed": "Jevity 1.5kcal",
    "asps": "Nil",
    "abx": "Tazocin d5",
    "cults": "Nil",
    "art": "Day 8 - Keep",
    "cvc": "Day 4 - Keep",
    "picc": "Day 44 - Remove",
    "other_line": ""
}