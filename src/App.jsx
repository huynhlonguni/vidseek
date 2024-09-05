import Embed from "./Embed.jsx";
import GetVideoID from "./video_lookup.js";
import GetKeyframeInfo from "./keyframe_lookup.js";
import { useState } from "react";

const Info = ({label, value}) => {
  return(
    <div className="flex gap-2">
      <div className="font-bold">{label}</div>
      <div className="">{value}</div>
    </div>
  )
}

function App() {
  const [input, setInput] = useState('');

  const regex = /(L\d{2}_V\d{3})(?:_(\d{3}))?/g;
  const match = regex.exec(input);
  
  const video = match ? match[1] : null;
  const keyframe = match ? match[2] : null;

  const info = GetKeyframeInfo(video, keyframe);
  const frame = info[0] == -1 ? null : info[0];
  const second = info[1] == -1 ? null : info[1];

  const video_id = GetVideoID(video);

  return (
    <div className="flex flex-col justify-start place-items-center p-4 gap-4 h-screen">
      <div className="bg-slate-200 rounded-lg w-1/2 p-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="video" className="font-bold text-xl">Keyframe</label>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" id="video" placeholder="L0X_V0XX_XXX" className="bg-white p-4 rounded-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value.toUpperCase())}/>
            <div className="grid grid-cols-2">
              <Info label="Video" value={video} />
              <Info label="Second" value={second} />
              <Info label="Keyframe" value={keyframe} />
              <Info label="Frame" value={frame} />
            </div>
          </div>
        </div>
      </div>
      {
        video && video_id ? 
          <Embed id={video_id} start={second && Math.floor(second)} className={"w-1/2 h-full rounded-lg"}/>
          :
          <div className="w-1/2 h-full rounded-lg bg-slate-400 flex justify-center font-bold text-2xl text-slate-700 place-items-center">
            {
              !video ? 'Waiting for input'
              : !video_id ? 'Video not found' : ''   
            }
          </div>
      }
    </div>
  );
}

export default App;
