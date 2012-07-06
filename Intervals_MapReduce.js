/*
 * (c) Joakim Berg 2012.
 * Generate a Timeline based on intervals.
 * If only MongoDB weren't so slow on M/R jobs, this would actually be a very neat way to get a timeline in realtime.
 * I'll write a better one with the New Aggregation Framework later on.
 */

db.runCommand({
	mapreduce: "videos",
	query: {
		camera_id: { '$in': [765, 543, 876, 432] },
		// Based on the first intervals 'start'-value and the last intervals 'end'-value
		recorded_time : { '$gte': 1317686400, '$lte': 1320451199},
		deleted: 0
	},
	map: function() {

		// These are to be generated.
		var ivals = [
			{start: 1317686400, end: 1317772799},
			{start: 1317772800, end: 1317859199},
			{start: 1317859200, end: 1317945599},
			{start: 1317945600, end: 1318031999},
			{start: 1318032000, end: 1318118399},
			{start: 1318118400, end: 1318204799},
			{start: 1318204800, end: 1318291199},
			{start: 1318291200, end: 1318377599},
			{start: 1318377600, end: 1318463999},
			{start: 1318464000, end: 1318550399},
			{start: 1318550400, end: 1318636799},
			{start: 1318636800, end: 1318723199},
			{start: 1318723200, end: 1318809599},
			{start: 1318809600, end: 1318895999},
			{start: 1318896000, end: 1318982399},
			{start: 1318982400, end: 1319068799},
			{start: 1319068800, end: 1319155199},
			{start: 1319155200, end: 1319241599},
			{start: 1319241600, end: 1319327999},
			{start: 1319328000, end: 1319414399},
			{start: 1319414400, end: 1319500799},
			{start: 1319500800, end: 1319587199},
			{start: 1319587200, end: 1319673599},
			{start: 1319673600, end: 1319759999},
			{start: 1319760000, end: 1319846399},
			{start: 1319846400, end: 1319932799},
			{start: 1319932800, end: 1320019199},
			{start: 1320019200, end: 1320105599},
			{start: 1320105600, end: 1320191999},
			{start: 1320192000, end: 1320278399},
			{start: 1320278400, end: 1320364799},
			{start: 1320364800, end: 1320451199}
		];

		var binSearch = function(ivals, start_idx, end_idx, target_val) {

			var mid_idx = Math.floor(start_idx + ((end_idx - start_idx) / 2));

			if (start_idx == mid_idx)
				return start_idx;

			if (end_idx == mid_idx)
				return end_idx;

			if (target_val >= ivals[mid_idx].start && target_val <= ivals[end_idx].end)
				return binSearch (ivals, mid_idx, end_idx, target_val);

			if (target_val >= ivals[start_idx].start && target_val <= ivals[mid_idx].end)
				return binSearch (ivals, start_idx, mid_idx, target_val);

			return -1;
		}

		var selected_start = 0;
		var selected_end = 0;

		var target_idx = binSearch(ivals, 0, ivals.length-1, this.recorded_time);

		var emitValues = {
			video_id			: this._id,
			recorded_time			: this.recorded_time,
			videos_count			: 1,
			videos_length_sec 		: this.video.length,
			unviewed_count 			: 0,
			unviewed_length_sec 		: 0,
			alarms_count 			: 0,
			alarms_length_sec 		: 0,
			alarms_count 			: 0,
			alarms_length_sec 		: 0,
			alarms_unviewed_count 		: 0,
			alarms_unviewed_length_sec 	: 0
		};

		if (this.viewed == 0) {
			emitValues.unviewed_count = 1;
			emitValues.unviewed_length_sec = this.video.length;
		}

		if (this.is_alarm == 1) {
			emitValues.alarms_count = 1;
			emitValues.alarms_length_sec = this.video.length;
			if (this.viewed == 0) {
				emitValues.alarms_unviewed_count = 1;
				emitValues.alarms_unviewed_length_sec = this.video.length;
			}
		}

		emit({ id: this.camera_id, start: selectedInterval_start, end: selectedInterval_end}, emitValues);
	},
	reduce: function(key, values) {

		var out = {
			latest_id			: null,
			latest_recorded_time		: 0,
			videos_count			: 0,
			videos_length_sec 		: 0,
			unviewed_count 			: 0,
			unviewed_length_sec 		: 0,
			alarms_count 			: 0,
			alarms_length_sec 		: 0,
			alarms_count 			: 0,
			alarms_length_sec 		: 0,
			alarms_unviewed_count 		: 0,
			alarms_unviewed_length_sec 	: 0
		};

		values.forEach(function(v) {

			out.videos_count 		+= v.videos_count;
			out.videos_length_sec 		+= v.videos_length_sec;
			out.unviewed_count 		+= v.unviewed_count;
			out.unviewed_length_sec 	+= v.unviewed_length_sec;
			out.alarms_count 		+= v.alarms_count;
			out.alarms_length_sec 		+= v.alarms_length_sec;
			out.alarms_count 		+= v.alarms_count;
			out.alarms_length_sec 		+= v.alarms_length_sec;
			out.alarms_unviewed_count 	+= v.alarms_unviewed_count;
			out.alarms_unviewed_length_sec 	+= v.alarms_unviewed_length_sec;

			if(v.recorded_time > out.latest_recorded_time){
				out.latest_recorded_time = v.recorded_time;
				out.latest_id = v.video_id;
			}
		});
		return out;
	},
	out: {inline: 1},
	verbose: true
	});
}}}
