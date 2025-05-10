import { useState, useEffect } from "react";

const Cars = () => {
  const [cars, setCars] = useState([]); // State to store fetched cars
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(""); // State to track errors

  const [formData, setFormData] = useState({ // State for adding or editing car
    id: null,
    name: "",
    type: "",
    imageUrl: "",
    shortDescription: "",
    pricePerDay: "",
  });

  const [isEditing, setIsEditing] = useState(false); // Track if editing a car

  // Fetch car data from the backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:9092/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();
        setCars(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:9092/api/cars/${formData.id}`
      : "http://localhost:9092/api/cars";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save car");
      }

      const updatedCar = await response.json();

      if (isEditing) {
        // Update car in the state
        setCars((prevCars) =>
          prevCars.map((car) =>
            car.id === updatedCar.id ? updatedCar : car
          )
        );
      } else {
        // Add new car to the state
        setCars((prevCars) => [...prevCars, updatedCar]);
      }

      setFormData({ id: null, name: "", type: "", imageUrl: "", shortDescription: "", pricePerDay: "" });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:9092/api/cars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      // Remove car from the state
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Edit
  const handleEdit = (car) => {
    setFormData(car);
    setIsEditing(true);
  };

  // Filter cars based on the search term
  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (loading) {
    return <div className="text-center py-8">Loading cars...</div>;
  }

  // Show error if fetching fails
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Cars</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search cars..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mb-8 px-4 py-2 border rounded"
      />

      {/* Form for Add/Edit */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-gray-100 p-4 rounded mb-8"
      >
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Car" : "Add New Car"}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="Car Name"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            placeholder="Car Type"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleFormChange}
            placeholder="Image URL"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleFormChange}
            placeholder="Short Description"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleFormChange}
            placeholder="Price Per Day"
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          {isEditing ? "Update Car" : "Add Car"}
        </button>
      </form>

      {/* Car List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div key={car.id} className="bg-white rounded shadow p-4">
            <img
              src={car.imageUrl}
              alt={car.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-bold text-xl mb-2">{car.name}</h3>
            <p className="text-gray-600 mb-2">{car.shortDescription}</p>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">{car.type}</div>
                <div className="font-bold">${car.pricePerDay}/day</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(car)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cars;