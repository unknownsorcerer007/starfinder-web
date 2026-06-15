// StarFinder Web - Offline Astronomical Database (stars_db.js)

const STARS_DB = {
  // Curated list of brightest stars visible to the naked eye (approx. magnitude < 4.0)
  // Coordinates are in J2000 epoch: Right Ascension (RA) in degrees, Declination (Dec) in degrees
  stars: [
    { id: 1, name: "Sirius", name_hi: "व्याध (Sirius)", ra: 101.287, dec: -16.716, mag: -1.46, con: "CMa", bay: "Alpha CMa" },
    { id: 2, name: "Canopus", name_hi: "अगस्त्य (Canopus)", ra: 95.988, dec: -52.696, mag: -0.74, con: "Car", bay: "Alpha Car" },
    { id: 3, name: "Rigel Kentaurus", name_hi: "मित्रक (Alpha Centauri)", ra: 219.902, dec: -60.833, mag: -0.27, con: "Cen", bay: "Alpha Cen" },
    { id: 4, name: "Arcturus", name_hi: "स्वाति (Arcturus)", ra: 213.915, dec: 19.182, mag: -0.05, con: "Boo", bay: "Alpha Boo" },
    { id: 5, name: "Vega", name_hi: "अभिजित (Vega)", ra: 279.235, dec: 38.784, mag: 0.03, con: "Lyr", bay: "Alpha Lyr" },
    { id: 6, name: "Capella", name_hi: "ब्रह्महृदय (Capella)", ra: 79.172, dec: 45.998, mag: 0.08, con: "Aur", bay: "Alpha Aur" },
    { id: 7, name: "Rigel", name_hi: "राजन्य (Rigel)", ra: 78.634, dec: -8.202, mag: 0.13, con: "Ori", bay: "Beta Ori" },
    { id: 8, name: "Procyon", name_hi: "सरमा (Procyon)", ra: 114.825, dec: 5.225, mag: 0.34, con: "CMi", bay: "Alpha CMi" },
    { id: 9, name: "Achernar", name_hi: "अग्रनद (Achernar)", ra: 24.429, dec: -57.237, mag: 0.46, con: "Eri", bay: "Alpha Eri" },
    { id: 10, name: "Betelgeuse", name_hi: "आर्द्रा (Betelgeuse)", ra: 88.793, dec: 7.407, mag: 0.50, con: "Ori", bay: "Alpha Ori" },
    { id: 11, name: "Hadar", name_hi: "हदार (Beta Centauri)", ra: 210.956, dec: -60.373, mag: 0.61, con: "Cen", bay: "Beta Cen" },
    { id: 12, name: "Altair", name_hi: "श्रवण (Altair)", ra: 297.696, dec: 8.868, mag: 0.76, con: "Aql", bay: "Alpha Aql" },
    { id: 13, name: "Acrux", name_hi: "त्रिशंकु-A (Acrux)", ra: 191.530, dec: -63.099, mag: 0.77, con: "Cru", bay: "Alpha Cru" },
    { id: 14, name: "Aldebaran", name_hi: "रोहिणी (Aldebaran)", ra: 68.980, dec: 16.509, mag: 0.86, con: "Tau", bay: "Alpha Tau" },
    { id: 15, name: "Spica", name_hi: "चित्रा (Spica)", ra: 201.298, dec: -11.161, mag: 0.98, con: "Vir", bay: "Alpha Vir" },
    { id: 16, name: "Antares", name_hi: "ज्येष्ठा (Antares)", ra: 247.352, dec: -26.432, mag: 1.05, con: "Sco", bay: "Alpha Sco" },
    { id: 17, name: "Pollux", name_hi: "पुनर्वसु-B (Pollux)", ra: 116.329, dec: 28.026, mag: 1.14, con: "Gem", bay: "Beta Gem" },
    { id: 18, name: "Fomalhaut", name_hi: "प्रथम मीन (Fomalhaut)", ra: 344.413, dec: -29.622, mag: 1.16, con: "PsA", bay: "Alpha PsA" },
    { id: 19, name: "Deneb", name_hi: "हंस-पुच्छ (Deneb)", ra: 310.358, dec: 45.280, mag: 1.25, con: "Cyg", bay: "Alpha Cyg" },
    { id: 20, name: "Mimosa", name_hi: "त्रिशंकु-B (Mimosa)", ra: 191.930, dec: -59.689, mag: 1.25, con: "Cru", bay: "Beta Cru" },
    { id: 21, name: "Regulus", name_hi: "मघा (Regulus)", ra: 152.093, dec: 11.967, mag: 1.35, con: "Leo", bay: "Alpha Leo" },
    { id: 22, name: "Castor", name_hi: "पुनर्वसु-A (Castor)", ra: 113.650, dec: 31.888, mag: 1.58, con: "Gem", bay: "Alpha Gem" },
    { id: 23, name: "Gacrux", name_hi: "त्रिशंकु-G (Gacrux)", ra: 187.791, dec: -57.113, mag: 1.59, con: "Cru", bay: "Gamma Cru" },
    { id: 24, name: "Shaula", name_hi: "शूला (Shaula)", ra: 263.402, dec: -37.103, mag: 1.62, con: "Sco", bay: "Lambda Sco" },
    { id: 25, name: "Bellatrix", name_hi: "बेलैट्रिक्स (Bellatrix)", ra: 81.283, dec: 6.350, mag: 1.64, con: "Ori", bay: "Gamma Ori" },
    { id: 26, name: "Elnath", name_hi: "एल्नाथ (Elnath)", ra: 81.573, dec: 28.604, mag: 1.65, con: "Tau", bay: "Beta Tau" },
    { id: 27, name: "Alnilam", name_hi: "मृगनाभि / अलनीलम", ra: 84.053, dec: -1.201, mag: 1.69, con: "Ori", bay: "Epsilon Ori" },
    { id: 28, name: "Alnitak", name_hi: "अलनीतक", ra: 85.190, dec: -1.943, mag: 1.74, con: "Ori", bay: "Zeta Ori" },
    { id: 29, name: "Alioth", name_hi: "अंगिरस (Alioth)", ra: 193.507, dec: 55.959, mag: 1.76, con: "UMa", bay: "Epsilon UMa" },
    { id: 30, name: "Dubhe", name_hi: "क्रतु (Dubhe)", ra: 165.933, dec: 61.751, mag: 1.81, con: "UMa", bay: "Alpha UMa" },
    { id: 31, name: "Alkaid", name_hi: "मरीचि (Alkaid)", ra: 206.885, dec: 49.313, mag: 1.85, con: "UMa", bay: "Eta UMa" },
    { id: 32, name: "Sargas", name_hi: "सर्गस (Sargas)", ra: 264.717, dec: -42.998, mag: 1.86, con: "Sco", bay: "Theta Sco" },
    { id: 33, name: "Alhena", name_hi: "अल्हना", ra: 99.428, dec: 16.399, mag: 1.93, con: "Gem", bay: "Gamma Gem" },
    { id: 34, name: "Polaris", name_hi: "ध्रुव तारा (Polaris)", ra: 37.955, dec: 89.264, mag: 1.97, con: "UMi", bay: "Alpha UMi" },
    { id: 35, name: "Algieba", name_hi: "अल्जीबा", ra: 154.993, dec: 19.841, mag: 2.01, con: "Leo", bay: "Gamma Leo" },
    { id: 36, name: "Saiph", name_hi: "सैफ (Saiph)", ra: 86.939, dec: -9.668, mag: 2.06, con: "Ori", bay: "Kappa Ori" },
    { id: 37, name: "Denebola", name_hi: "डेनेबोला", ra: 177.264, dec: 14.572, mag: 2.14, con: "Leo", bay: "Beta Leo" },
    { id: 38, name: "Gamma Cas", name_hi: "उरुपी / गामा कैस", ra: 14.177, dec: 60.717, mag: 2.15, con: "Cas", bay: "Gamma Cas" },
    { id: 39, name: "Mizar", name_hi: "वसिष्ठ (Mizar)", ra: 200.081, dec: 54.925, mag: 2.23, con: "UMa", bay: "Zeta UMa" },
    { id: 40, name: "Mintaka", name_hi: "मिंतका", ra: 83.002, dec: -0.299, mag: 2.23, con: "Ori", bay: "Delta Ori" },
    { id: 41, name: "Schedar", name_hi: "शेडार (Schedar)", ra: 10.127, dec: 56.537, mag: 2.24, con: "Cas", bay: "Alpha Cas" },
    { id: 42, name: "Caph", name_hi: "काफ (Caph)", ra: 2.294, dec: 59.150, mag: 2.28, con: "Cas", bay: "Beta Cas" },
    { id: 43, name: "Dschubba", name_hi: "नूरा (Dschubba)", ra: 240.413, dec: -22.621, mag: 2.29, con: "Sco", bay: "Delta Sco" },
    { id: 44, name: "Wei", name_hi: "वेई", ra: 252.535, dec: -34.298, mag: 2.29, con: "Sco", bay: "Epsilon Sco" },
    { id: 45, name: "Merak", name_hi: "पुलह (Merak)", ra: 165.460, dec: 56.382, mag: 2.34, con: "UMa", bay: "Beta UMa" },
    { id: 46, name: "Girtab", name_hi: "गिर्ताब", ra: 261.341, dec: -39.030, mag: 2.39, con: "Sco", bay: "Kappa Sco" },
    { id: 47, name: "Phecda", name_hi: "पुलस्त्य (Phecda)", ra: 178.458, dec: 53.695, mag: 2.41, con: "UMa", bay: "Gamma UMa" },
    { id: 48, name: "Acrab", name_hi: "अक्रब", ra: 241.134, dec: -19.805, mag: 2.56, con: "Sco", bay: "Beta Sco" },
    { id: 49, name: "Zosma", name_hi: "ज़ोस्मा", ra: 168.528, dec: 20.524, mag: 2.56, con: "Leo", bay: "Delta Leo" },
    { id: 50, name: "Ruchbah", name_hi: "रुचबाह", ra: 20.338, dec: 60.235, mag: 2.66, con: "Cas", bay: "Delta Cas" },
    { id: 51, name: "Lesath", name_hi: "लेसाथ", ra: 262.247, dec: -37.297, mag: 2.70, con: "Sco", bay: "Upsilon Sco" },
    { id: 52, name: "Imai", name_hi: "इमाई", ra: 183.854, dec: -58.749, mag: 2.79, con: "Cru", bay: "Delta Cru" },
    { id: 53, name: "Alcyone", name_hi: "अम्बा (Alcyone)", ra: 56.871, dec: 24.103, mag: 2.85, con: "Tau", bay: "Eta Tau" },
    { id: 54, name: "Tejat", name_hi: "तेजात", ra: 95.741, dec: 22.513, mag: 2.87, con: "Gem", bay: "Mu Gem" },
    { id: 55, name: "Mebsuta", name_hi: "मेब्सुता", ra: 100.983, dec: 25.132, mag: 3.06, con: "Gem", bay: "Epsilon Gem" },
    { id: 56, name: "Megrez", name_hi: "अत्रि (Megrez)", ra: 183.857, dec: 57.031, mag: 3.32, con: "UMa", bay: "Delta UMa" },
    { id: 57, name: "Chertan", name_hi: "चेरतान", ra: 168.790, dec: 15.432, mag: 3.33, con: "Leo", bay: "Theta Leo" },
    { id: 58, name: "Segin", name_hi: "सेगिन", ra: 26.583, dec: 63.670, mag: 3.35, con: "Cas", bay: "Epsilon Cas" },
    { id: 59, name: "Adhafera", name_hi: "अधफेरा", ra: 154.120, dec: 23.418, mag: 3.43, con: "Leo", bay: "Zeta Leo" },
    { id: 60, name: "Larawag", name_hi: "लरावाग", ra: 252.174, dec: -42.358, mag: 3.62, con: "Sco", bay: "Zeta2 Sco" },
    { id: 61, name: "Rasalas", name_hi: "रासलास", ra: 148.918, dec: 26.007, mag: 3.88, con: "Leo", bay: "Mu Leo" }
  ],

  // Constellations lines connecting the star IDs defined above
  constellations: [
    {
      id: "Ori",
      name: "Orion",
      name_hi: "कालपुरुष (Orion)",
      lines: [
        [10, 25], // Betelgeuse - Bellatrix (Shoulders)
        [25, 40], // Bellatrix - Mintaka
        [40, 27], // Mintaka - Alnilam (Belt)
        [27, 28], // Alnilam - Alnitak (Belt)
        [28, 10], // Alnitak - Betelgeuse
        [28, 36], // Alnitak - Saiph (Body right)
        [7, 40],  // Rigel - Mintaka (Body left)
        [7, 36]   // Rigel - Saiph (Hips)
      ]
    },
    {
      id: "UMa",
      name: "Ursa Major",
      name_hi: "सप्तर्षि मंडल (Ursa Major)",
      lines: [
        [30, 45], // Dubhe - Merak (Pointers)
        [45, 47], // Merak - Phecda (Bottom cup)
        [47, 56], // Phecda - Megrez (Cup joint)
        [56, 30], // Megrez - Dubhe (Top cup)
        [56, 29], // Megrez - Alioth (Handle 1)
        [29, 39], // Alioth - Mizar (Handle 2)
        [39, 31]  // Mizar - Alkaid (Handle end)
      ]
    },
    {
      id: "Cas",
      name: "Cassiopeia",
      name_hi: "शर्मिष्ठा (Cassiopeia)",
      lines: [
        [58, 50], // Segin - Ruchbah
        [50, 38], // Ruchbah - Gamma Cas
        [38, 41], // Gamma Cas - Schedar
        [41, 42]  // Schedar - Caph
      ]
    },
    {
      id: "Cru",
      name: "Crux",
      name_hi: "त्रिशंकु (Crux / Southern Cross)",
      lines: [
        [23, 13], // Gacrux - Acrux (Vertical beam)
        [20, 52]  // Mimosa - Imai (Horizontal beam)
      ]
    },
    {
      id: "Leo",
      name: "Leo",
      name_hi: "सिंह (Leo)",
      lines: [
        [21, 35], // Regulus - Algieba (Chest)
        [35, 59], // Algieba - Adhafera (Sickle 1)
        [59, 61], // Adhafera - Rasalas (Sickle 2)
        [21, 57], // Regulus - Chertan (Belly)
        [57, 49], // Chertan - Zosma (Hip)
        [49, 37], // Zosma - Denebola (Tail)
        [37, 57]  // Denebola - Chertan
      ]
    },
    {
      id: "Sco",
      name: "Scorpius",
      name_hi: "वृश्चिक (Scorpius)",
      lines: [
        [48, 43], // Acrab - Dschubba (Head claws)
        [43, 16], // Dschubba - Antares (Chest)
        [16, 44], // Antares - Wei (Body link)
        [44, 60], // Wei - Larawag
        [60, 32], // Larawag - Sargas (Tail curve)
        [32, 46], // Sargas - Girtab
        [46, 24], // Girtab - Shaula (Stinger)
        [24, 51]  // Shaula - Lesath
      ]
    },
    {
      id: "Gem",
      name: "Gemini",
      name_hi: "मिथुन (Gemini)",
      lines: [
        [22, 17], // Castor - Pollux (Twins heads)
        [22, 55], // Castor - Mebsuta (Castor body)
        [55, 54], // Mebsuta - Tejat
        [17, 33]  // Pollux - Alhena (Pollux body)
      ]
    },
    {
      id: "Tau",
      name: "Taurus",
      name_hi: "वृषभ (Taurus)",
      lines: [
        [14, 53], // Aldebaran - Alcyone (Pleiades link)
        [14, 26]  // Aldebaran - Elnath (Horn 1)
      ]
    }
  ],

  // Upcoming meteor shower events calendar (Offline alert data)
  meteorShowers: [
    {
      name: "Perseid Meteor Shower",
      name_hi: "पर्सीड उल्कापात (Perseids)",
      date: "August 12-13, 2026",
      date_hi: "12-13 अगस्त, 2026",
      status: "white",
      description: "One of the best meteor showers of the year, producing up to 100 meteors per hour."
    },
    {
      name: "Orionids",
      name_hi: "ओरियोनिड्स उल्कापात",
      date: "October 21-22, 2026",
      date_hi: "21-22 अक्टूबर, 2026",
      status: "white",
      description: "Associated with Halley's Comet, produces bright, fast meteors."
    },
    {
      name: "Geminid Meteor Shower",
      name_hi: "जेमिनिड उल्कापात (Geminids)",
      date: "December 13-14, 2026",
      date_hi: "13-14 दिसंबर, 2026",
      status: "white",
      description: "King of the meteor showers, producing up to 120 multicolored meteors per hour."
    },
    {
      name: "Lyrids",
      name_hi: "लायरिड उल्कापात",
      date: "April 22-23, 2027",
      date_hi: "22-23 अप्रैल, 2027",
      status: "white",
      description: "One of the oldest known meteor showers, active in late April."
    }
  ],

  // Simplified Keplerian elements for the International Space Station (ISS)
  // Configured relative to reference epoch: 2026-06-15T00:00:00Z
  issEpoch: {
    t0: 1781481600000, // Unix timestamp in milliseconds for 2026-06-15 00:00:00 UTC
    semiMajorAxis: 6780, // Altitude of ~402 km + Earth radius 6378 km
    inclination: 51.64 * Math.PI / 180, // Inclination in radians
    omegaDot: -5.0 * Math.PI / 180, // Precession of node in radians per day
    omega0: 120.0 * Math.PI / 180, // RA of ascending node at epoch in radians
    meanAnomaly0: 0.0, // Mean anomaly at epoch
    n: (2 * Math.PI) / (92.8 * 60 * 1000), // Mean motion in radians per millisecond (92.8 minute period)
    theta0: 180.0 * Math.PI / 180, // Earth rotation angle at epoch
    omegaEarth: (2 * Math.PI * 1.0027379093) / (24 * 3600 * 1000) // Earth rotation rate in rad/ms
  }
};

// Expose globally for browser environment compatibility
if (typeof window !== "undefined") {
  window.STARS_DB = STARS_DB;
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = STARS_DB;
}
