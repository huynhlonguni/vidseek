/* eslint import/no-webpack-loader-syntax: off */
const context = require.context('./map-keyframes', true, /.csv$/);
const map_keyframes = {};
context.keys().forEach((key) => {
	const fileName = key.replace('./', '');
	const resource = require(`!!dsv-loader!./map-keyframes/${fileName}`);
	const namespace = fileName.replace('.csv', '');
	map_keyframes[namespace] = resource;
 
});


const GetKeyframeInfo = (video_name, index) => {
	const error = [null, null, null];
	if (!index)
		return error;

	if (!(video_name in map_keyframes))
		return error;

	const mapping = map_keyframes[video_name][index - 1];
	if (!mapping)
		return error;

	if (parseInt(mapping['n']) != index) {
		alert(`Failed to lookup frame, index ${index} not found in mappings data`);
		return error;
	}
	return [parseInt(mapping["frame_idx"]), parseFloat(mapping["pts_time"]), parseFloat(mapping["fps"])];
};

const GetNearestKeyframes = (video_name, currentFrame) => {
	const error = [null, null, null, null, null, null];

	const mapping = map_keyframes[video_name];
	if (!mapping)
		return error;

	let low = 0;
	let high = mapping.length;

	while (low < high) {
		let mid = Math.floor(low + (high - low) / 2);

		const mid_keyframe = parseInt(mapping[mid]["frame_idx"]);
		
		if (currentFrame <= mid_keyframe)
			high = mid;
		else
			low = mid + 1;
	}

	if (low < mapping.length && parseInt(mapping[low]["frame_idx"]) < currentFrame)
		low++;

	if (low <= 0) 
		low = 1;

	let next = low + 1;
	if (parseInt(mapping[next - 1]["frame_idx"]) == currentFrame)
		next++;

	return [low, mapping[low - 1]["frame_idx"], `${video_name}_${String(low).padStart(3, '0')}`,
			next, mapping[next - 1]["frame_idx"], `${video_name}_${String(next).padStart(3, '0')}`];
};

export {
	GetKeyframeInfo,
	GetNearestKeyframes
};