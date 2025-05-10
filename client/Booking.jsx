import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios"; // Import axios
import { carData } from "../data/carData"; // Import car data

const Booking = () => {
  const [searchParams] = useSearchParams();
  const carId = searchParams.get("car");
  const [selectedCar, setSelectedCar] = useState(carId || "");
  const [formData, setFormData] = useState({
    pickupDate: "",
    returnDate: "",
    name: "",
    email: "",
    phone: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const bookingData = {
        carId: selectedCar,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      try {
        const response = await axios.post(
          "http://localhost:9091/api/bookings", // Replace with your backend URL
          bookingData,
          {
            auth: {
              username: "user", // Replace with your backend username
              password: "17765439-77bf-4bf1-a78d-1d00ecd04ccf" // Replace with your backend password
            }
          }
        );
        console.log("Booking Successful:", response.data);
        setIsSubmitted(true);
      } catch (error) {
        console.error("Error submitting booking:", error.response);
        setError("Booking failed. Please try again.");
      }
    } else {
      setError("Please fill all the fields correctly.");
    }
  };

  // Validate form fields
  const validateForm = () => {
    const { pickupDate, returnDate, name, email, phone } = formData;
    if (
      !pickupDate ||
      !returnDate ||
      !name ||
      !email ||
      !phone ||
      new Date(pickupDate) > new Date(returnDate)
    ) {
      return false;
    }
    return true;
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
        <p className="mb-4">Thank you for your booking. We’ll contact you shortly.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book a Car</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>} {/* Display error */}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-2">Select Car</label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">-- Select a car --</option>
            {carData.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name} - ${car.pricePerDay}/day
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Complete Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;