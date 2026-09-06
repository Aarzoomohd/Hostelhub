import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import Student from "../models/Student.js";

// =====================================================
// CREATE STUDENT
// =====================================================
export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, address, room } = req.body;

    if (!name || !email || !phone || !address || !room) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const hostel = await Hostel.findOne({ owner: req.ownerId });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const roomData = await Room.findOne({
      _id: room,
      hostel: hostel._id,
    });

    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    const studentCount = await Student.countDocuments({
      room: roomData._id,
    });

    if (studentCount >= roomData.capacity) {
      return res.status(400).json({ message: "Room is already full" });
    }

    const existingStudent = await Student.findOne({
      email,
      hostel: hostel._id,
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this email already exists",
      });
    }

    const student = await Student.create({
      name,
      email,
      phone,
      address,
      hostel: hostel._id,
      room: roomData._id,
    });

    const populatedStudent = await Student.findById(student._id).populate(
      "room",
      "roomNumber capacity"
    );

    res.status(201).json({
      message: "Student created successfully",
      student: populatedStudent,
    });
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);
    res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
};

// =====================================================
// GET STUDENTS
// =====================================================
export const getStudents = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ owner: req.ownerId });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const students = await Student.find({ hostel: hostel._id })
      .populate("room", "roomNumber capacity")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Students data fetched successfully",
      students,
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    res.status(500).json({
      message: "Error fetching students",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE STUDENT  (naya add kiya)
// =====================================================
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findOne({ owner: req.ownerId });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const student = await Student.findOne({ _id: id, hostel: hostel._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.findByIdAndDelete(id);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);
    res.status(500).json({
      message: "Error deleting student",
      error: error.message,
    });
  }
};



// export const updateStudent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, phone, address, room } = req.body;

//     if (!name || !email || !phone || !address || !room) {
//       return res.status(400).json({
//         message: "Please fill all the fields",
//       });
//     }

//     const hostel = await Hostel.findOne({ owner: req.ownerId });
//     if (!hostel) {
//       return res.status(404).json({ message: "Hostel not found" });
//     }

//     const student = await Student.findOne({ _id: id, hostel: hostel._id });
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // agar room change ho raha hai to naya room valid hai kya check karo
//     if (room !== student.room.toString()) {
//       const roomData = await Room.findOne({ _id: room, hostel: hostel._id });
//       if (!roomData) {
//         return res.status(404).json({ message: "Room not found" });
//       }

//       const studentCount = await Student.countDocuments({ room: roomData._id });
//       if (studentCount >= roomData.capacity) {
//         return res.status(400).json({ message: "Room is already full" });
//       }
//     }

//     // agar email change ho raha hai to duplicate check karo
//     if (email !== student.email) {
//       const existingStudent = await Student.findOne({
//         email,
//         hostel: hostel._id,
//         _id: { $ne: id },
//       });

//       if (existingStudent) {
//         return res.status(400).json({
//           message: "Student with this email already exists",
//         });
//       }
//     }

//     student.name = name;
//     student.email = email;
//     student.phone = phone;
//     student.address = address;
//     student.room = room;

//     await student.save();

//     const populatedStudent = await Student.findById(student._id).populate(
//       "room",
//       "roomNumber capacity"
//     );

//     res.status(200).json({
//       message: "Student updated successfully",
//       student: populatedStudent,
//     });
//   } catch (error) {
//     console.error("UPDATE STUDENT ERROR:", error);
//     res.status(500).json({
//       message: "Error updating student",
//       error: error.message,
//     });
//   }
// };


// =====================================================
// UPDATE STUDENT
// =====================================================
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, room } = req.body;

    // Check required fields
    if (!name || !email || !phone || !address || !room) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Find owner's hostel
    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    // Find student belonging to this hostel
    const student = await Student.findOne({
      _id: id,
      hostel: hostel._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Find selected room
    const roomData = await Room.findOne({
      _id: room,
      hostel: hostel._id,
    });

    if (!roomData) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Check room capacity only if room is changing
    const currentRoomId = student.room?.toString();
    const newRoomId = roomData._id.toString();

    if (currentRoomId !== newRoomId) {
      const studentCount = await Student.countDocuments({
        room: roomData._id,
        _id: { $ne: id },
      });

      if (studentCount >= roomData.capacity) {
        return res.status(400).json({
          message: "Room is already full",
        });
      }
    }

    // Check duplicate email
    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
      hostel: hostel._id,
      _id: { $ne: id },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this email already exists",
      });
    }

    // Update student
    student.name = name;
    student.email = email.toLowerCase();
    student.phone = phone;
    student.address = address;
    student.room = roomData._id;

    await student.save();

    // Populate room before sending response
    const populatedStudent = await Student.findById(student._id)
      .populate("room", "roomNumber capacity");

    res.status(200).json({
      message: "Student updated successfully",
      student: populatedStudent,
    });
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    res.status(500).json({
      message: "Error updating student",
      error: error.message,
    });
  }
};

