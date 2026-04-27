const mongoose = require("mongoose");
const Authority = require("../models/authority");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

async function seedAuthority() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing authorities (optional)
    await Authority.deleteMany({});

    // Insert test authorities
    const authorities = [
      {
        area: "Mehrauli, Delhi",
        issueType: "other",
        department: "Municipal Corporation of Delhi",
        email: "mehrauli@mcd.delhi.gov.in",
        phone: "+91-11-12345678"
      },
      {
        area: "Mehrauli, Delhi",
        issueType: "garbage",
        department: "MCD Waste Management",
        email: "waste@mcd.delhi.gov.in",
        phone: "+91-11-87654321"
      },
      {
        area: "Mehrauli, Delhi",
        issueType: "pothole",
        department: "MCD Roads Department",
        email: "roads@mcd.delhi.gov.in",
        phone: "+91-11-11111111"
      },
      {
        area: "Mehrauli, Delhi",
        issueType: "streetlight",
        department: "Delhi Electricity Board",
        email: "lights@deb.delhi.gov.in",
        phone: "+91-11-22222222"
      },
      {
        area: "Mehrauli, Delhi",
        issueType: "water",
        department: "Delhi Jal Board",
        email: "water@djb.delhi.gov.in",
        phone: "+91-11-33333333"
      }
    ];

    const result = await Authority.insertMany(authorities);
    console.log(`✓ Inserted ${result.length} authority records`);
    console.log("Authorities:", result);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding authorities:", error);
    process.exit(1);
  }
}

seedAuthority();