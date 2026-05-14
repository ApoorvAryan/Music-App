import Song from '../models/Song.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { uploadBuffer } from '../config/cloudinary.js';

export const getSongs = async (req, res) => {
  try {
    const q = req.query.search?.trim();

    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { artist: { $regex: q, $options: 'i' } },
            { album: { $regex: q, $options: 'i' } }
          ]
        }
      : {};

    const songs = await Song.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;

    const audio = req.files?.audio?.[0];
    const thumbnail = req.files?.thumbnail?.[0];

    if (!title || !artist || !audio || !thumbnail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [audioRes, thumbRes] = await Promise.all([
      uploadBuffer(audio.buffer, 'tune-fox/audio', 'video'),
      uploadBuffer(thumbnail.buffer, 'tune-fox/thumbnails', 'image')
    ]);

    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration: Number(duration) || 0,
      audioUrl: audioRes.secure_url,
      audioPublicId: audioRes.public_id,
      thumbnailUrl: thumbRes.secure_url,
      thumbnailPublicId: thumbRes.public_id,
      uploadedBy: req.user._id
    });

    res.status(201).json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isUploader = song.uploadedBy.toString() === req.user._id.toString();
    if (!isAdmin && !isUploader) {
      return res.status(403).json({ message: 'Not authorized to delete this song' });
    }

    await Promise.allSettled([
      cloudinary.uploader.destroy(song.audioPublicId, { resource_type: 'video' }),
      cloudinary.uploader.destroy(song.thumbnailPublicId)
    ]);

    await song.deleteOne();

    res.json({ message: 'Song deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const playSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyPlayed: song._id }
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        recentlyPlayed: {
          $each: [song._id],
          $position: 0,
          $slice: 12
        }
      }
    });

    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};