import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DoctorByCategory = () => {
  const { category } = useParams();
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const getPosition = () =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

  const formatDistance = (d) => (d ? (d / 1000).toFixed(1) : null);

  const openDirections = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const pos = await getPosition();
        const res = await fetch(
          `https://farishtaa.onrender.com/api/doctor/nearby-search/${category}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          }
        );
        const data = await res.json();
        setDoctors(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [category]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {category} Specialists
            </h1>
            <p className="text-sm text-gray-500">
              Trusted doctors near your location
            </p>
          </div>

          {/* Farishtaa Logo */}
          <div className="text-right">
            <div className="text-xl font-bold text-[#D32F2F]">
              फरिश्ता
            </div>
            <div className="text-xs text-gray-500">
              Healthcare Companion
            </div>
          </div>
        </div>
      </div>

      {/* Doctor List */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {doctors.map((doctor) => {
          const address = doctor.address
            ? Object.values(doctor.address).filter(Boolean).join(", ")
            : "Address not available";

          return (
            <div
              key={doctor._id}
              className="bg-white border border-gray-200 hover:border-[#D32F2F] transition"
            >
              <div className="flex gap-5 p-5">

                {/* Image */}
                <div className="w-20 h-20 bg-gray-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/vector-1739803316910-1de9cb66fc2d"
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {doctor.name}
                  </h3>

                  <p className="text-sm font-medium text-[#D32F2F]">
                    {doctor.specialist}
                  </p>

                  <p className="text-xs text-gray-500">
                    {doctor.degree}
                  </p>

                  <div className="flex items-center gap-6 mt-2 text-sm">
                    <span className="text-gray-700">
                      ⭐ {doctor.avgRating?.toFixed(1) || "0.0"}
                    </span>

                    {doctor.distance && (
                      <span className="text-[#2E7D32] font-medium">
                        {formatDistance(doctor.distance)} km away
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    📍 {address}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => navigate(`/doctor/${doctor._id}`)}
                    className="px-4 py-2 bg-[#D32F2F] text-white text-sm font-medium hover:bg-[#B71C1C]"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() =>
                      openDirections(
                        doctor.location.coordinates[1],
                        doctor.location.coordinates[0]
                      )
                    }
                    className="px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Directions
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorByCategory;