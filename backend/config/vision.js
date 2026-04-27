const cloudinary = require("./cloudinary");

// Maps Cloudinary auto-tags to issue types
const tagToIssueType = {
  garbage: "garbage",
  trash: "garbage",
  waste: "garbage",
  litter: "garbage",
  rubbish: "garbage",
  pothole: "pothole",
  road: "pothole",
  asphalt: "pothole",
  pavement: "pothole",
  crack: "pothole",
  water: "water",
  leak: "water",
  flood: "water",
  pipe: "water",
  electricity: "electricity",
  wire: "electricity",
  cable: "electricity",
  streetlight: "electricity",
  lamp: "electricity",
  light: "electricity",
  graffiti: "graffiti",
  vandalism: "graffiti"
};

async function detectIssue(imageUrl) {
  try {
    // Use Cloudinary's AI categorization on the already-uploaded image
    const publicId = imageUrl.split("/").pop().split(".")[0];
    const fullPublicId = imageUrl.includes("/upload/")
      ? imageUrl.split("/upload/")[1].replace(/\.[^/.]+$/, "")
      : publicId;

    const result = await cloudinary.api.resource(fullPublicId, {
      tags: true,
      categorization: "aws_rek_tagging",
      auto_tagging: 0.5
    });

    const tags = (result.tags || []).map(t => t.toLowerCase());
    console.log("Cloudinary AI tags:", tags);

    for (const tag of tags) {
      for (const [key, issueType] of Object.entries(tagToIssueType)) {
        if (tag.includes(key)) return issueType;
      }
    }

    return "other";
  } catch (err) {
    console.error("Cloudinary AI detection error:", err.message);
    return "other";
  }
}

module.exports = detectIssue;
