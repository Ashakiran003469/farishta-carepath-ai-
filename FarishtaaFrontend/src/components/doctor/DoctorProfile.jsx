import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addReview, setReviews } from "../../store/slices/reviewSlice";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  const { token, userId } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.review);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/doctor/view-profile/${doctorId}`
        );
        const data = await res.json();
        setDoctor(data.doctor);
        dispatch(setReviews(data.doctor.reviews || []));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, dispatch]);

  const handleAddReview = async () => {
    if (!reviewText) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/doctor/add-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: doctor._id,
            rating,
            review: reviewText,
            patientId: userId,
          }),
        }
      );

      const response = await res.json();
      dispatch(addReview(response.newreview));
      setReviewText("");
      setRating(5);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!doctor) return <p className="text-center mt-10">Not found</p>;

  const address = doctor.address
    ? `${doctor.address.street}, ${doctor.address.district}, ${doctor.address.state} - ${doctor.address.postcode}`
    : "Address not available";

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6">

          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src="https://images.unsplash.com/vector-1739803316910-1de9cb66fc2d"
              alt={doctor.name}
              className="w-36 h-36 rounded-xl object-cover border"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {doctor.name}
            </h1>

            <p className="text-sm text-red-600 font-medium mt-1">
              {doctor.type === "clinic" ? "Clinic" : "Hospital"}
            </p>

            {/* Specialists */}
            <div className="flex flex-wrap gap-2 mt-3">
              {doctor.specialists?.map((s, i) => (
                <span
                  key={i}
                  className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium"
                >
                  {s.replace("_", " ")}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-4">
              📍 {address}
            </p>

            <div className="mt-3 text-sm text-gray-500">
              ⭐ {doctor.ratings || 0} / 5
            </div>
          </div>
        </div>

        {/* ADD REVIEW */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">
            Write a Review
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm">Rating</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded-md px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={3}
            className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-red-400 outline-none"
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <button
            onClick={handleAddReview}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Submit Review
          </button>
        </div>

        {/* REVIEWS */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">
            Patient Reviews
          </h2>

          {reviews?.length > 0 ? (
            reviews.map((r, i) => (
              <div
                key={i}
                className="border-b last:border-b-0 pb-4 mb-4"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">
                    {r.patientId?.firstName
                      ? `${r.patientId.firstName} ${r.patientId.lastName}`
                      : "Anonymous"}
                  </p>
                  <span className="text-yellow-500 text-sm">
                    ⭐ {r.rating}/5
                  </span>
                </div>

                <p className="text-gray-600 mt-1">
                  {r.review}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorProfile;