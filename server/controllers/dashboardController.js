import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import Student from "../models/Student.js";

export const getDashboardStats = async (req, res) => {
    try{

        const hostel = await Hostel.findOne({ owner: req.ownerId });


        if(!hostel){
            return res.status(404).json({ message: "Hostel not found" });
        }


        // Total Rooms
        const totalRooms = await Room.countDocuments({
            hostel: hostel._id
        });

        //Total Students
        const totalStudents = await Student.countDocuments({
            hostel: hostel._id
        });

        //Total Capacity
        const rooms = await Room.find({ hostel: hostel._id });
        const totalBeds = rooms.reduce((total, room) => total + room.capacity, 0);

        //Available Beds
        const availableBeds = totalBeds - totalStudents;

        res.status(200).json({
            message: "Dashboard stats fetched successfully",
            stats: {
            totalRooms,
            totalStudents,
            totalBeds,
            occupiedBeds: totalStudents,
            availableBeds
            }
        });
    } catch (error) {
        console.error("GET DASHBOARD STATS ERROR:", error);

        res.status(500).json({
            message: "Error fetching dashboard stats",
            error: error.message
        });
    }
}