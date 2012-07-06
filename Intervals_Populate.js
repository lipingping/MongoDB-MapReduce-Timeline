// Remove old collection
db.videos.drop();

// Create index
db.videos.ensureIndex({camera_id:1, time_recorded: 1});

// Populate with fake data
var time_from = 1317431043; //2011-10-01 01:04:03
var time_to = 1320516061; //2011-11-05 18:01:01

for (i=0; i < 10000000; i++) {

	var rtime = Math.floor(Math.random() * (time_to - time_from + 1) + time_from);

	if (i%2500 == 0)
		print("Insert no: [" + i + "] (" + Math.round((i / 10000000) * 100) + "%) - Latest rtime: " + rtime);

	db.videos.insert({
		"camera_id": (i%10000),
		"recorded_time": rtime,
		"received_time": (rtime+10),
		"processed_time": (rtime+100),
		"last_updated": (rtime+100),
		"title": "",
		"description": "",
		"archived": 0,
		"deleted": 0,
		"viewed": 0,
		"is_alarm": (rtime % 2),
		"file_size": (rtime*2),
		"video": {
			"length": Math.round(rtime/10000),
			"fps": 29.2835,
			"avg_bitrate": Math.round(rtime/1000),
			"res_x": 640,
			"res_y": 480
		},
		"camera": {
			"ip": ((i%10000)*1000)
		}
	});
}
