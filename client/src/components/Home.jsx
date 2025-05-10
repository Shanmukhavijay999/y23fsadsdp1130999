import { Link } from "react-router-dom";
import { carData } from "../data/carData";

const Home = () => {
  const featuredCars = carData.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to CarRental</h1>
        <p className="text-gray-600 mb-6">Find and book your perfect car today</p>
        <Link
          to="/cars"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Browse Cars
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCars.map((car) => (
          <div key={car.id} className="bg-white rounded shadow p-4">
            <img
              src={car.imageUrl}
              alt={car.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-bold text-xl mb-2">{car.name}</h3>
            <p className="text-gray-600 mb-2">{car.shortDescription}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">${car.pricePerDay}/day</span>
              <Link
                to={`/booking?car=${car.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;