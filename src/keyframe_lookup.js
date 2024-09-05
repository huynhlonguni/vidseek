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
	if (!index) return [-1, -1];
	const mapping = map_keyframes[video_name][index - 1];
	if (!mapping) return [-1, -1];
	if (parseInt(mapping['n']) != index) {
		alert(`Failed to lookup frame, index ${index} not found in mappings data`);
		return [-1, -1];
	}
	return [mapping["frame_idx"], parseFloat(mapping["pts_time"])];
};

export default GetKeyframeInfo;