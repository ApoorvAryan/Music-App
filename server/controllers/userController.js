import User from '../models/User.js';
import Song from '../models/Song.js';
export const profile=async(req,res)=>{try{res.json(await User.findById(req.user._id).select('-password').populate('recentlyPlayed'));}catch(e){res.status(500).json({message:e.message});}};
export const listUsers=async(req,res)=>{try{res.json(await User.find().select('-password').sort({createdAt:-1}));}catch(e){res.status(500).json({message:e.message});}};
export const deleteUser=async(req,res)=>{try{if(req.params.id===req.user._id.toString())return res.status(400).json({message:'You cannot delete your own account here'}); const u=await User.findByIdAndDelete(req.params.id); if(!u)return res.status(404).json({message:'User not found'}); res.json({message:'User deleted'});}catch(e){res.status(500).json({message:e.message});}};
export const stats=async(req,res)=>{try{const [users,songs,plays]=await Promise.all([User.countDocuments(),Song.countDocuments(),Song.aggregate([{$group:{_id:null,total:{$sum:'$playCount'}}}])]);res.json({users,songs,plays:plays[0]?.total||0});}catch(e){res.status(500).json({message:e.message});}};
