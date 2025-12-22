const Doctor=require('../model/Doctor');
const Hospital = require('../model/Hospital');
const Reviews = require('../model/Reviews');
const specialistsName=require('../utils/specialistsName');

exports.postAddDoctor=async (req,res,next)=>{
const {name ,photoUrl,specialist,experience,degree,languages,address,about,location }=req.body;
const doctor=new Doctor({
   name ,photoUrl,specialist,experience,degree,languages,address,about,location 
});
await doctor.save();
res.status(201).json({message : "Doctor Created", doctor : doctor});
}


exports.getCategories=async (req,res,next)=>{
try{
    
    const doctorcategories=await Doctor.distinct("specialist");
    const hospitalcategories=await Hospital.distinct('specialists');
    const categories=[...new Set([...doctorcategories,...hospitalcategories])];
    return res.status(200).json({categories});
}
catch(error){
    res.status(404).json({message : error});
}
}

exports.searchNearbyBySpecialist=async (req,res,next)=>{
 try{ 
 const {category}=req.params;
 if(!category || typeof(category)!== "string")
    return res.status(400).json({message : "Type Error : not string"})
 const {lat,lng,radius=15000}=req.body;
const specialist=category;
const doctorsNearby=await findDoctorsNearby(lat,lng,specialist,radius);
const hospitalsNearby=await findHospitalsNearby(lat,lng,specialist,radius);
const storedResults=[...doctorsNearby,...hospitalsNearby];
 res.status(200).json({data : storedResults});
 
loadFromOsm(lat,lng,radius);
 }catch(error){
    console.log("Error : ",error);
 }
}

const findDoctorsNearby=async (lat,lng,specialist,radius)=>{
return Doctor.find({
specialist : {
    $regex :new RegExp(specialist,"i"),
},
location : {
    $near : {
        $geometry :{
            type : "Point",
            coordinates : [lng,lat]
        },
         $maxDistance : radius,
    },
}
})
}
const loadFromOsm = async (lat, lng, radius) => {
  try {
    const fetchedHospitals = await fetchDatafromOSM(lat, lng, radius);
    if (!Array.isArray(fetchedHospitals) || fetchedHospitals.length === 0) {
      console.log("No Hospitals Found nearby");
      return;
    }

    for (const place of fetchedHospitals) {
      if (!place?.tags?.name) continue;

      let specialists = [];
      const detectedSpecialists = specialistsName.detectSpecialistsFromName(place.tags.name);
      specialists = [...new Set([...detectedSpecialists])];

      // Create hospital
      const hospital = new Hospital({
        name: place.tags.name || "Unknown",
        type: place.tags.amenity || place.tags.healthcare || "doctor",
        address: {
          street: place.tags?.["addr:full"] || "",
          district: place.tags?.["addr:district"] || "",
          state: place.tags?.["addr:state"] || "",
          postcode: place.tags?.["addr:postcode"] || "",
        },
        location: {
          type: "Point",
          coordinates: [place.lon, place.lat],
        },
        specialists,
      });

      await Hospital.findOneAndUpdate({
        name : hospital.name,
        "location.coordinates" : hospital.location.coordinates
      },hospital,{
        upsert : true,
        new : true,
      }
    );
    }
  } catch (error) {
    console.log(error);
  }
};


async function fetchDatafromOSM(lat,lng,radius){
    
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius}, ${lat}, ${lng});
        node["amenity"="clinic"](around:${radius}, ${lat}, ${lng});
        node["healthcare"="doctor"](around:${radius}, ${lat}, ${lng});
      );
      out body;
    `;
  
        const response = await fetch(`https://overpass-api.de/api/interpreter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: query,
    });

    const data=await response.text();
    return data.elements;
}


const findHospitalsNearby=(lat,lng,specialist,radius)=>{
    return Hospital.aggregate([{
   $geoNear : {
    near :{
        type :"Point",
        coordinates : [lng,lat],
    },
    distanceField : "distance",
    maxDistance : radius,
    spherical : true,
    query: {
        specialists : {$regex : new RegExp(specialist,"i")},
    },
   }
}]);
}





exports.postAddReview=async (req,res,next)=>{
    const {doctorId,patientId,rating,review}=req.body;
try{
let newreview=new Reviews({
    targetId : doctorId,
    targetModel : "Hospital",
    patientId,rating,review
});

newreview.populate({
    path : 'patientId',
    select : "firstName lastName"
});

await newreview.save();
const hospital=await Hospital.findById(doctorId);
hospital.reviews.push(newreview._id);
await hospital.save();
return res.status(201).json({message : "Review Created" , newreview});
}catch(error){
res.status(400).json({ message : "Error creating review",error});
}
}

exports.getDoctorById=async (req,res,next)=>{
    
   try{
    const {doctorId}=req.params;
  console.log("Doctor Id : ", doctorId)
   let details;
        details=await Doctor.findById(doctorId).populate({
            path : 'reviews',
            select : "rating review createdAt",
            populate : {
                path : 'patientId',
                select : "firstName lastName"
            }
        });
          if(!details){
             details=await Hospital.findById(doctorId).populate({
                path : 'reviews',
            select : "rating review createdAt",
            populate : {
                path : 'patientId',
                select : "firstName lastName"
            }
            });

          }
          if(!details){
          return res.status(404).json({error : "Doctor Not Found"});
          }
    return res.status(200).json({doctor:details});
    }catch(error){
      res.status(400).json({error : "Not known"});
    }
}
