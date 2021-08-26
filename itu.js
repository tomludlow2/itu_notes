$(function() {
	//Ready:
	$('#time_date').text(do_date());
	$('#process_meds').on("click", process_meds);
	$('#clipboard').on("click", copy_clipboard);
});

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

function process_meds() {
	var raw = $('#medsTA').val().split(/(Repeat Medication|Past Medication)/gmi)[4];
	$('#medsTA').val("DATA DELETED");
	var op = "";
	if( raw.match(/there are no/gmi) ){
		console.log("No repeats");
		op = "No Repeats Found";
		$('#meds_output').html(op);
	}
	var meds = [];
	var holder = [];
	var bits = raw.match(/^[0-9]{2}-[a-zA-Z]{3}-[0-9]{4} .*/gm);
	for (var i = 0; i < bits.length; i++) {
		var date = bits[i].match(/^[0-9]{2}-[a-zA-Z]{3}-[0-9]{4}/gm)[0];
		var bits2 = bits[i].split(/^[0-9]{2}-[a-zA-Z]{3}-[0-9]{4}/gm)[1].split(",");
		var med = bits2[0].replace("modified-release", "MR").replace(/(\(.*\)|sugar free|gastro-resistant|tablets|capsules|dispersible|sachets)/gm,"");
		var dose = bits2[1].replace(/(to be taken|capsules|tablets|capsule|tablet|dispersible|to be used|to be inhaled)/gmi,"").replace(/(as required|as needed|when required)/gmi,"prn").replace(/(each morning|once in the morning|in the morning)/gmi, "om").replace(/(twice a day|two times a day|two times daily|twice daily)/gmi, "bd").replace(/(thrice a day|three times a day|three times daily|thrice daily)/gmi, "tds").replace(/(four times a day|four times daily)/gmi, "qds").replace(/(once a day|once daily|daily|each day)/gmi, "od").replace(/at night/gmi, "on").replace(/One/gmi,"1").replace(/Two/gmi,"2").replace(/Three/gmi,"3").replace(/Four/gmi,"4").replace(/Five/gmi,"5").toLowerCase();
		var new_med = 1;
		for( var j = 0; j < meds.length; j++ ) {
			if( med == meds[j]) {
				new_med = 0;
				continue
			}
		}
		if( new_med ) {
			meds.push(med);
			holder.push({medication:med,dose:dose});
			var str = med + " " + dose;
			str = str.replace(/(  |   |    )/gm," ");
			op += "<br/>" + str;
		}
	}
	$('#meds_output').html(op);
	var txt = $('#meds_output').html().replace(/(\<br\>|\<br\/\>)/gmi,"\n");
	var data = [new ClipboardItem({ "text/plain": new Blob([txt], { type: "text/plain" }) })];
	navigator.clipboard.write(data).then(function() {
	  console.log("Copied to clipboard successfully!");
	  $('#clipboard').removeClass("btn-primary").addClass("btn-success").html("Copied Successfully to Clipboard");
	}, function() {
	  console.error("Unable to write to clipboard. :-(");
	  $('#clipboard').removeClass("btn-primary").addClass("btn-warning").html("Browser Doesn't Support This");
	});
}

function copy_clipboard() {
	var txt = $('#meds_output').html().replace(/(\<br\>|\<br\/\>)/gmi,"\n");
	var data = [new ClipboardItem({ "text/plain": new Blob([txt], { type: "text/plain" }) })];
	navigator.clipboard.write(data).then(function() {
	  console.log("Copied to clipboard successfully!");
	  $('#clipboard').removeClass("btn-primary").addClass("btn-success").html("Copied Successfully to Clipboard");
	}, function() {
	  console.error("Unable to write to clipboard. :-(");
	  $('#clipboard').removeClass("btn-primary").addClass("btn-warning").html("Browser Doesn't Support This");
	});

}