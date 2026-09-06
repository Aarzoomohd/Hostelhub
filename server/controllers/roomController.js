import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";

export const createRoom = async(req,res)=>{
   try{
     const{roomNumber, capacity} = req.body;

     if(!roomNumber ||
        !capacity
     ){
        return res.status(400).json({
            message: "Please fill all the fields",
        });
     }

     const hostel = await Hostel.findOne({
        owner: req.ownerId,
     });
     if(!hostel){
        return res.status(404).json({
            message: "Hostel not found",
        });
     }


     const existingRoom = await Room.findOne({
        roomNumber,
        hostel: hostel._id,
     });

     if(existingRoom){
        return res.status(400).json({
            message: "Room number already exist",
        });
     }

     const room = await Room.create({
        roomNumber,
        capacity,
        hostel: hostel._id,
     });

     res.status(201).json({
        message: "Room created successfully",
        room
     })
   }
   catch(error){
      res.status(500).json({
        message: "Error creating room",
        error: error.message
      });
   }
};

export const getRooms = async (req, res) => {
  try {

    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const rooms = await Room.find({
      hostel: hostel._id,
    }).sort({
      roomNumber: 1,
    });

    res.status(200).json({
      message: "Rooms fetched successfully",
      rooms,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching rooms",
      error: error.message,
    });

  }
};

export const deleteRoom = async(req,res) =>{
  try {
    const{id} = req.params;
    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if(!hostel){
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const room = await Room.findOne({
      _id: id,
      hostel: hostel._id,
    });

    if(!room){
      return res.status(404).json({
        message: "Room not found",
      })
    }

    await Room.findByIdAndDelete(id),

    res.status(200).json({
      message: "Room deleted successfully",
    });
  }
  catch(error){
    res.status(500).json({
      message: "error deleting room",
      error: error.message,
    });
  }
};

export const updateRoom = async(req,res) => {
   try{
    const {id} = req.params;

    const{roomNumber,capacity} = req.body;
    if(!roomNumber || !capacity){
      return res.status(400).json({
        message: "Room number and capacity are required",
      });
    }

    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if(!hostel){
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

  const room = await Room.findById(id);

if (!room) {
  return res.status(404).json({
    message: "Room not found by ID at all",
  });
}

if (room.hostel.toString() !== hostel._id.toString()) {
  return res.status(404).json({
    message: "Room exists but belongs to a different hostel",
  });
}

    if(!room){
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const existingRoom = await Room.findOne({
      roomNumber,
      hostel: hostel._id,
      _id: {$ne: id},
    });

    if(existingRoom){
      return res.status(400).json({
        message: "Room number already exists",
      });
    }

    room.roomNumber = roomNumber;
    room.capacity = capacity;

    await room.save();

    res.status(200).json({
      message: "Room updated successfully",
      room
    });

   }catch(error){
    res.status(500).json({
      message: "error updating room",
      error: error.message,
    });
    
  }
};