import dotenv from "dotenv";
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";
import Property from "./models/property.js";

dotenv.config({ path: "../.env" });

const MONGO_URL = process.env.MONGO_URL;

const divisions = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

const districtsByDivision = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Narsingdi", "Manikganj", "Munshiganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Comilla", "Feni", "Noakhali", "Chandpur"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Sirajganj", "Natore", "Chapainawabganj"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail", "Magura"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Barishal: ["Barishal", "Bhola", "Patuakhali", "Pirojpur", "Jhalokathi", "Barguna"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat"],
  Mymensingh: ["Mymensingh", "Netrokona", "Sherpur", "Jamalpur"],
};

const areasByDistrict = {
  Dhaka: ["Dhanmondi", "Gulshan", "Banani", "Mirpur-10", "Mirpur-12", "Uttara Sector 7", "Uttara Sector 11", "Mohammadpur", "Bashundhara R/A", "Rampura", "Badda", "Khilgaon", "Tejgaon", "Farmgate", "Motijheel", "Shantinagar", "Wari", "Lalbagh"],
  Gazipur: ["Tongi", "Joydebpur", "Gazipur Sadar", "Kaliakair", "Kapasia"],
  Narayanganj: ["Narayanganj Sadar", "Fatullah", "Siddhirganj", "Sonargaon"],
  Chattogram: ["Agrabad", "Nasirabad", "Halishahar", "Khulshi", "Panchlaish", "GEC Circle", "Oxygen", "Muradpur", "Chandgaon"],
  Rajshahi: ["Rajpara", "Boalia", "Motihar", "Shah Makhdum", "Paba"],
  Khulna: ["Khalishpur", "Sonadanga", "Boyra", "Daulatpur", "Rupsha"],
  Sylhet: ["Zindabazar", "Ambarkhana", "Shahjalal Upashahar", "Tilagor"],
  Bogura: ["Bogura Sadar", "Sherpur Upazila", "Shibganj", "Gabtali"],
  Barishal: ["Kotwali", "Bandar", "Barisal Sadar", "Kawnia"],
  Rangpur: ["Rangpur Sadar", "Mithapukur", "Pirganj", "Badarganj"],
  Mymensingh: ["Mymensingh Sadar", "Trishal", "Muktagachha", "Bhaluka"],
};

const amenitiesList = [
  "Gas", "Electricity", "Water Supply", "Lift", "Generator Backup",
  "CCTV", "Security Guard", "Roof Access", "Prayer Room",
  "Gym", "Swimming Pool", "Community Hall", "Children's Play Area",
  "Garbage Disposal", "Internet Ready", "Intercom", "Visitor Parking",
];

const propertyTitles = [
  "Spacious 3 Bedroom Flat in Dhanmondi",
  "Modern 2 Bedroom Apartment in Gulshan",
  "Affordable Bachelor Flat in Mirpur-10",
  "Family Apartment with Roof Access in Uttara",
  "Luxurious 4 Bedroom Flat in Banani",
  "Cozy Studio Apartment in Farmgate",
  "Semi-Furnished 3 Bedroom in Bashundhara",
  "2 Bedroom Flat Near Lake in Dhanmondi",
  "Brand New Apartment in Khilgaon",
  "Budget Family Flat in Mohammadpur",
  "Well-Connected Flat in Tejgaon",
  "2 Bedroom with Parking in Uttara",
  "Ready Flat in Rampura",
  "Furnished Bachelor Flat in Badda",
  "Premium 3 Bedroom in Shantinagar",
  "Affordable 2 Bedroom Flat in Gazipur",
  "Newly Built Family Apartment in Tongi",
  "Spacious Flat with Gas in Narayanganj",
  "Bachelor Mess Room in Agrabad Chattogram",
  "Family Flat Near Sea in Halishahar",
  "Modern Apartment in Khulshi Chattogram",
  "2 Bedroom Flat in Rajpara Rajshahi",
  "Budget Flat in Boalia Rajshahi",
  "Well-Maintained Flat in Khulna Sadar",
  "Family Apartment in Sonadanga Khulna",
  "1 Bedroom Flat in Sylhet Zindabazar",
  "2 Bedroom Apartment in Ambarkhana Sylhet",
  "Bachelor Flat in Bogura Sadar",
  "Budget Family Flat in Barishal Kotwali",
  "Modern Flat in Rangpur Sadar",
  "Furnished 2 Bedroom in Mymensingh",
  "3 Bedroom with Lift in Gulshan-2",
  "Compact 1 Bedroom in Mirpur-12",
  "Corner Flat in Panchlaish Chattogram",
  "Green View 3 Bedroom in Bashundhara",
  "Bachelor Room in Motijheel",
  "Newly Renovated Flat in Wari Dhaka",
  "Spacious 4 Bedroom in GEC Circle Chattogram",
  "Affordable 2 Bedroom in Muradpur",
  "Family Duplex in Uttara Sector 11",
  "Ready Flat near BUET in Lalbagh",
  "2 Bedroom Flat in Chandgaon Chattogram",
  "Comfortable Bachelor Room in Farmgate",
  "Semi-Furnished Flat in Tilagor Sylhet",
  "Bright and Airy 3 Bedroom in Banani",
  "1 Bedroom Studio in Tejgaon",
  "3 Bedroom with Gym in Bashundhara",
  "Family Flat in Motihar Rajshahi",
  "Penthouse Style Flat in Gulshan-1",
  "Cozy 2 Bedroom in Rupsha Khulna",
];

const descriptions = [
  "A well-maintained flat with excellent natural ventilation. Located on a quiet street with easy access to markets, schools, and public transport. Ideal for a small family.",
  "Modern construction with quality fittings. The flat features spacious rooms, tiled flooring, and built-in wardrobes. Close to shopping centers and hospitals.",
  "Perfect for bachelors or young professionals. The apartment is in a secure building with 24/7 security. Nearby to major office areas and universities.",
  "This bright and airy flat is ideal for families seeking comfort and convenience. Surrounded by greenery, it offers a peaceful living environment.",
  "A premium apartment with premium amenities in one of the most sought-after areas. Features imported tiles, Italian kitchen, and modern bathrooms.",
  "Budget-friendly accommodation without compromising on quality. Clean, safe, and well-connected to the city center.",
  "Semi-furnished apartment with attached bathrooms in all bedrooms. Generator backup ensures no power disruptions. Parking space available.",
  "Located in a prime residential area with all modern conveniences. The flat offers excellent city views and is close to international schools and embassies.",
  "Brand new apartment never lived in before. Comes with modern fixtures, fresh paint, and quality tiles. The building has a reliable water supply system.",
  "This family apartment offers ample space for a growing family. The open kitchen, large dining area, and spacious living room create a warm home environment.",
  "Strategically located flat with easy commute options. Nearby schools, mosques, markets, and hospitals make it ideal for families.",
  "Well-designed apartment with separate servant quarters. The property features quality woodwork, branded sanitary fittings, and marble flooring.",
  "Cozy apartment in a friendly neighborhood. The building has a reliable water pump, generator backup, and rooftop access.",
  "Furnished flat ready to move in. All essential furniture included. Ideal for expats, relocated professionals, or temporary stays.",
  "This spacious flat features high ceilings, large windows, and modern design. Perfect for a medium-sized family looking for comfort and style.",
];

const phoneNumbers = [
  "01711234567", "01812345678", "01912345678", "01611234567", "01511234567",
  "01712345678", "01812234567", "01913456789", "01612345678", "01512345678",
  "01714567890", "01814567890", "01914567890", "01614567890", "01514567890",
  "01716789012", "01816789012", "01916789012", "01616789012", "01516789012",
  "01718901234", "01818901234", "01918901234", "01618901234", "01518901234",
  "01720123456", "01820123456", "01920123456", "01620123456", "01520123456",
  "01722345678", "01822345678", "01922345678", "01622345678", "01522345678",
  "01724567890", "01824567890", "01924567890", "01624567890", "01524567890",
  "01726789012", "01826789012", "01926789012", "01626789012", "01526789012",
  "01728901234", "01828901234", "01928901234", "01628901234", "01528901234",
];

const emails = [
  "rahman.landlord@gmail.com", "karim.properties@gmail.com", "alam.rentals@yahoo.com",
  "hossain.realty@gmail.com", "islam.house@gmail.com", "ahmed.flat@hotmail.com",
  "chowdhury.homes@gmail.com", "begum.rent@gmail.com", "khan.property@yahoo.com",
  "miah.rentals@gmail.com", "sarkar.flat@gmail.com", "mondal.homes@yahoo.com",
  "biswas.property@gmail.com", "das.realty@gmail.com", "paul.homes@gmail.com",
  "nayem.landlord@gmail.com", "sakib.rent@gmail.com", "tanvir.flats@gmail.com",
  "rashed.property@gmail.com", "farhan.rental@gmail.com",
];

// Picsum seeds for deterministic apartment-looking images
const imageSeedGroups = [
  ["apartment1", "apartment2", "apartment3"],
  ["flat10", "flat11", "flat12"],
  ["room20", "room21", "room22"],
  ["house30", "house31", "house32"],
  ["interior40", "interior41", "interior42"],
  ["building50", "building51", "building52"],
  ["residence60", "residence61", "residence62"],
  ["property70", "property71", "property72"],
  ["home80", "home81", "home82"],
  ["rental90", "rental91", "rental92"],
];

// Use specific Unsplash photo IDs for realistic apartment images
const unsplashApartmentIds = [
  "1560448204-e02f11c3d0e2", "1522708323590-d24dbb6b0267", "1484154218962-a197022b5858",
  "1556909114-f6e7ad7d3136", "1502672260266-1c1ef2d93688", "1560185893-a55cbc8c57e8",
  "1580587771525-78b9dba3b914", "1568605114967-8130f3a36994", "1570129477492-45c003edd2be",
  "1493809842364-78817add7ffb", "1554995207-c18203ef8b2a", "1600596542815-ffad4c1539a9",
  "1600585154340-be6161a56a0c", "1512917774080-9991f1c4c750", "1600047509807-ba8f99d2cdde",
  "1583608205776-bfd35f0d9f83", "1600566753086-00f18fb6b3ea", "1599427303058-f04b3ff4ad72",
  "1536376072261-38c75010e6c9", "1600121848594-d8644e57abcd", "1507652313519-a35c7a942d5f",
  "1587061949409-02df41d1b9a6", "1598928506311-c55ded91a20c", "1533779283741-cadd6e6a6c2f",
  "1549488344-1f9b8d2bd1f3", "1505873242700-f289a29e1e0f", "1562182816-c7c31e44e7fd",
  "1564013799919-ab600027ffc6", "1588854337236-6889d631faa8", "1574362848149-11496d93a7c7",
];

function getImageUrl(id, width = 800, height = 600) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&auto=format`;
}

function getImages(index) {
  const base = index % unsplashApartmentIds.length;
  const ids = [
    unsplashApartmentIds[base % unsplashApartmentIds.length],
    unsplashApartmentIds[(base + 1) % unsplashApartmentIds.length],
    unsplashApartmentIds[(base + 2) % unsplashApartmentIds.length],
    unsplashApartmentIds[(base + 3) % unsplashApartmentIds.length],
  ];
  return ids.map((id) => getImageUrl(id));
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAmenities() {
  const count = getRandomInt(3, 8);
  const shuffled = [...amenitiesList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateProperties() {
  const properties = [];

  for (let i = 0; i < 50; i++) {
    const division = getRandom(divisions);
    const districts = districtsByDivision[division];
    const district = getRandom(districts);
    const areas = areasByDistrict[district] || [`${district} Sadar`, `${district} Central`, `${district} North`];
    const area = getRandom(areas);
    const location = `${area}, ${district}`;

    const bedrooms = getRandomInt(1, 4);
    const bathrooms = getRandomInt(1, bedrooms);
    const areaSize = getRandomInt(600, 2400);
    const floor = getRandomInt(1, 12);
    const furnished = Math.random() > 0.5;
    const parking = Math.random() > 0.4;

    // Realistic BDT prices
    let basePrice;
    if (division === "Dhaka") {
      basePrice = getRandomInt(8000, 60000);
    } else if (["Chattogram", "Sylhet"].includes(division)) {
      basePrice = getRandomInt(6000, 40000);
    } else {
      basePrice = getRandomInt(4000, 20000);
    }

    // Add premium for furnished, parking, more bedrooms
    if (furnished) basePrice += getRandomInt(2000, 8000);
    if (parking) basePrice += getRandomInt(1000, 3000);
    basePrice += (bedrooms - 1) * getRandomInt(2000, 5000);

    const renterTypes = ["bachelor", "family", "any"];
    const renterType = getRandom(renterTypes);

    const availableMonth = getRandomInt(1, 12);
    const availableYear = getRandomInt(2025, 2026);

    const imageList = getImages(i);

    properties.push({
      title: propertyTitles[i] || `${bedrooms} Bedroom Flat in ${area}`,
      description: descriptions[i % descriptions.length],
      price: basePrice,
      location,
      district,
      division,
      image: imageList[0],
      images: imageList,
      renterType,
      availableMonth,
      availableYear,
      phoneNumber: phoneNumbers[i % phoneNumbers.length],
      email: emails[i % emails.length],
      bedrooms,
      bathrooms,
      area: areaSize,
      floor,
      furnished,
      parking,
      amenities: getRandomAmenities(),
      isAvailable: true,
      views: getRandomInt(0, 500),
      userRef: "",
      createdDate: new Date(Date.now() - getRandomInt(0, 90) * 24 * 60 * 60 * 1000),
    });
  }

  return properties;
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const properties = generateProperties();
    const result = await Property.insertMany(properties);
    console.log(`Successfully inserted ${result.length} properties`);

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
