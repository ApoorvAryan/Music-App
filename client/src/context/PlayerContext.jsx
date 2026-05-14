import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';
const PlayerContext=createContext(null); export const usePlayer=()=>useContext(PlayerContext);
export function PlayerProvider({children}){
 const audioRef=useRef(new Audio()); const [queue,setQueue]=useState([]); const [index,setIndex]=useState(0); const [current,setCurrent]=useState(null); const [isPlaying,setIsPlaying]=useState(false); const [volume,setVolume]=useState(.75); const [progress,setProgress]=useState(0); const [duration,setDuration]=useState(0); const [repeat,setRepeat]=useState(false); const [shuffle,setShuffle]=useState(false);
 const playSong=(song,songs=[])=>{const q=songs.length?songs:[song];setQueue(q);setIndex(Math.max(0,q.findIndex(s=>s._id===song._id)));setCurrent(song);setIsPlaying(true);api.post(`/songs/${song._id}/play`).catch(()=>{});};
 const togglePlay=()=>setIsPlaying(p=>!p); const next=()=>{if(!queue.length)return;const n=shuffle?Math.floor(Math.random()*queue.length):(index+1)%queue.length;setIndex(n);setCurrent(queue[n]);setIsPlaying(true);}; const previous=()=>{if(!queue.length)return;const n=(index-1+queue.length)%queue.length;setIndex(n);setCurrent(queue[n]);setIsPlaying(true);}; const seek=(v)=>{audioRef.current.currentTime=v;setProgress(v);};
 useEffect(()=>{audioRef.current.volume=volume;},[volume]);
 useEffect(()=>{const a=audioRef.current;if(!current)return;if(a.src!==current.audioUrl)a.src=current.audioUrl;if(isPlaying)a.play().catch(()=>setIsPlaying(false));else a.pause();},[current,isPlaying]);
 useEffect(()=>{const a=audioRef.current;const time=()=>{setProgress(a.currentTime||0);setDuration(a.duration||0);};const ended=()=>repeat?(a.currentTime=0,a.play()):next();a.addEventListener('timeupdate',time);a.addEventListener('loadedmetadata',time);a.addEventListener('ended',ended);return()=>{a.removeEventListener('timeupdate',time);a.removeEventListener('loadedmetadata',time);a.removeEventListener('ended',ended);};},[repeat,shuffle,index,queue]);
 const value=useMemo(()=>({current,queue,isPlaying,volume,progress,duration,repeat,shuffle,playSong,togglePlay,next,previous,seek,setVolume,setRepeat,setShuffle}),[current,queue,isPlaying,volume,progress,duration,repeat,shuffle]); return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
