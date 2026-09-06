import Hostel from "../models/Hostel.js";
import Owner from "../models/Owner.js";

export const createHostel = async(req,res) =>{
    try{
        const{hostelName, address, city, state, pincode} = req.body;

        if(!hostelName ||
            !address ||
            !city ||
            !state ||
            !pincode
        ){
            return res.status(400).json({
                message: "Please fill all the fields",
            });
        }

        const hostel = await Hostel.create({
            hostelName,
            address, 
            city,
            state,
            pincode,
            owner: req.ownerId,
        });

            // Link hostel with owner
    await Owner.findByIdAndUpdate(
      req.ownerId,
      {
        hostelId: hostel._id,
      }
    );

        res.status(201).json({
            message: "Hostel created successfully",
            hostel,
        });
    } catch(error){
        res.status(500).json({
           message: "Error creating hostel",
           error: error.message,
        });
    }
}

export const getHostelDetails = async (req,res) => {
    try {
        const hostel = await Hostel.findOne({
            owner: req.ownerId,
        });

        if(!hostel){
            return res.status(404).json({
                message: "Hostel not found",
            })
        }

        res.status(200).json({
            message: "Hostel details fetched successfully",
            hostel,
        });


    }
    catch(error) {
        console.error("Get hostel details error:", error);

        res.status(500).json({
            message: "Error fetching details",
            error: error.message,
        });
    }
};

export const updateHostel = async(req,res) => {
     try {
        const {hostelName, address, city, state, pincode} = req.body;

        if(!hostelName ||
            !address ||
            !city ||
            !state ||
            !pincode
        ){
            return res.status(500).json({
                message: "Please fill the all fields",
            })
        }

        const hostel = await Hostel.findOne({
            owner: req.ownerId,
        });

        if(!hostel){
            return res.status(404).json({
                message: "Hostel not found",
            });
        }

        hostel.hostelName = hostelName;
        hostel.address = address;
        hostel.city = city;
        hostel.state = state;
        hostel.pincode = pincode;

        await hostel.save();

        res.status(200).json({
            message: "Hostel updated successfully",
            hostel
        })
     }
     catch(error) {
            console.log("Update hostel error",error);

            res.status(500).json({
                message: "Error updating hostel",
                error: error.message,
            });
     }
};