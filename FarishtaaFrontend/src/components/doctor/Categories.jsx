import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Syringe,
  Eye,
  Activity,
  Bone,
  HandHeart,
  Smile
} from "lucide-react";

// Icon mapping (keys in lowercase)
const iconMap = {
  "general physician": Stethoscope,
  "cardiologist": HeartPulse,
  "neurologist": Brain,
  "pediatrician": Baby,
  "dermatologist": HandHeart,
  "dentist": Smile,
  "orthopedic": Bone,
  "ophthalmologist": Eye,
  "physician": Activity,
  "diabetologist": Syringe,
  "gynecologist": HandHeart, // example, add more as needed
  "psychiatrist": Brain,     // example
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://farishtaa.onrender.com/api/doctor/categories`);
        const { categories } = await response.json();

        if (Array.isArray(categories)) {
          // Remove null/undefined and duplicates, trim spaces
          const filtered = [...new Set(
            categories
              .filter(cat => cat && cat.toString().trim() !== "")
              .map(cat => cat.toString().trim())
          )];
          setCategories(filtered);
        }
      } catch (error) {
        console.log("Error fetching categories :", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (category) => {
    navigate(`/nearby-search/${category}`);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Select a Specialist
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category, idx) => {
          // Use lowercase for matching icon
          const Icon = iconMap[category.toLowerCase()] || Stethoscope;

          return (
            <div
              key={idx}
              onClick={() => handleClick(category)}
              className="bg-white shadow-md p-4 rounded-xl cursor-pointer
                         hover:shadow-lg hover:bg-blue-50 transition-all flex flex-col 
                         items-center text-center border border-gray-100"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <Icon size={26} className="text-blue-600" />
              </div>

              <p className="text-gray-800 font-medium text-sm">{category}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;