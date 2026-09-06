import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHostel } from "../services/hostelService.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const HostelSetup = () =>{
  const navigate = useNavigate();

  const token =  localStorage.getItem("token");
  const [formData,setFormData] = useState({
    hostelName : "",
    address: "",
    city: "",
    state: "",
    pincode: ""
})

const handleChange = (e) =>{
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};
const handleSubmit =async (e) =>{
    e.preventDefault();

    try{
        const data = await createHostel(formData, token);

        toast.success(data.message || "Hostel creation successful");
        navigate("/dashboard")
    }catch (error) {

     console.error("Hostel creation error:", error);
      toast.error(
        error.response?.data?.message || "Hostel creation error:"
      );
    }
}

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Setup Your Hostel
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-6">
          Enter your hostel details
        </p>


        <form onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="hostelName"
            placeholder="Hostel Name"
            value={formData.hostelName}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
          <textarea
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Create Hostel
          </button>
        </form>
      </div>
    </div>
  );

}

export default HostelSetup;









