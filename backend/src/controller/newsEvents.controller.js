import NewsEvent from "../model/newsEvents.model.js";
import path from "path";
import fs from "fs"
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createNewsEvent = async (req, res) => {
    try {
      const { title, date, time } = req.body;
  
      // Save image paths in an array
      const imagePaths = req.files?.map(file => path.join('uploads/media', file.filename));
  
      // Create a new NewsEvent document
      const newsEvent = new NewsEvent({
        title,
        date,
        time,
        images: imagePaths,
      });
  
      // Save to database
      await newsEvent.save();
  
      return res.status(201).json({
        message: 'News/Event created successfully',
        data: newsEvent
        });
    } catch (error) {
      return res.status(500).json({
        error: error.message
        });
    }
};

// Get all News/Events
const getAllNewsEvents = async (req, res) => {
    try {
      const newsEvents = await NewsEvent.find().sort({ createdAt : -1});

      return res.status(200).json({
        data:newsEvents
    });
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching news/events' });
    }
};

// Get a single News/Event by ID
const getNewsEventById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const newsEvent = await NewsEvent.findById(id);
  
      if (!newsEvent) {
        return res.status(404).json({ message: 'News/Event not found' });
      }
  
      return res.status(200).json(newsEvent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
};

const updateNewsEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, time } = req.body;
  
    try {
      // Find the news/event by ID and update only the provided fields
      const updatedEvent = await NewsEvent.findByIdAndUpdate(
        id,
        { title, date, time },  // Only updating the text fields
        { new: true }
      );
      
      if (!updatedEvent) {
        return res.status(404).json({ message: 'News/Event not found' });
      }
  
        return res.status(200).json({
        message: 'News/Event updated successfully',
        data: updatedEvent 
        });
    } catch (error) {
      console.error('Error updating news/event:', error);
      return res.status(500).json({
        message: 'Server error'
        });
    }
};

// Delete Controller
const deleteNewsEvent = async (req, res) => {
  const { id } = req.params;
  
  try {
      // Find the news event
      const newsEvent = await NewsEvent.findById(id);
      
      if (!newsEvent) {
          return res.status(404).json({ 
              message: 'News event not found' 
          });
      }

      // Delete images from file system
      const deleteFilePromises = newsEvent.images.map(async (imagePath) => {
          try {
              // Construct the absolute path
              // Since imagePath is already 'uploads/media/filename'
              const absolutePath = path.resolve(__dirname, '..','..', imagePath);
              
              // Check if file exists before attempting to delete
              if (fs.existsSync(absolutePath)) {
                  await fs.promises.unlink(absolutePath);
                  console.log(`Successfully deleted: ${absolutePath}`);
              } else {
                  console.log(`File not found: ${absolutePath}`);
              }
          } catch (err) {
              console.error(`Error deleting file ${imagePath}:`, err);
          }
      });

      // Wait for all file deletions to complete
      await Promise.all(deleteFilePromises);

      // Delete the news event from database
      await NewsEvent.findByIdAndDelete(id);

      return res.status(200).json({
          message: 'News event and associated images deleted successfully'
      });

  } catch (error) {
      console.error('Error in deleteNewsEvent:', error);
      return res.status(500).json({
          error: error.message
      });
  }
};

export {createNewsEvent, getAllNewsEvents, getNewsEventById, updateNewsEvent, deleteNewsEvent}