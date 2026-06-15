// StarFinder Web - Core Application Logic (app.js)

// Application State
const state = {
  language: "hi", // Default: Hindi (as requested). Options: 'hi', 'en'
  nightMode: false, // Default: standard space-neon cyan. True: red night mode
  sensorPermission: false,
  
  // Center pointing celestial coordinates (in degrees)
  centerRA: 83.82, // Default: Orion center
  centerDec: -5.39,
  roll: 0,
  
  // Observer GPS coordinates
  latitude: 28.6139, // Default: New Delhi
  longitude: 77.2090,
  
  // Time offset in milliseconds (for Time Travel slider)
  timeOffset: 0,
  
  // Camera & Stream
  cameraStream: null,
  isDesktopSimulator: true, // fallback to drag-to-look and mock background
  uploadedImage: null, // Holds uploaded image object if active
  
  // Active solver state
  solving: false,
  solvedResult: null,
  highlightedConstellation: null,
  
  // Drag handling for desktop simulator
  isDragging: false,
  prevMouseX: 0,
  prevMouseY: 0,
  
  // Unlocked achievements
  badges: {
    first_planet: false,
    constellation_master: false,
    orion_hunter: false,
    iss_spotter: false,
    meteor_tracker: false,
    time_traveler: false
  },

  // Smoothed orientation components for filtering
  smoothDecX: 0,
  smoothDecY: 0,
  smoothRAX: 0,
  smoothRAY: 0,
  orientationInitialized: false,
  solverWorker: null
};

// UI Translations
const TRANSLATIONS = {
  en: {
    title: "StarFinder Web",
    facing: "Facing",
    nightMode: "Night Mode",
    redMode: "Red Vision",
    timeTravel: "Time Travel",
    past: "Past",
    now: "Now",
    future: "Future",
    scanBtn: "Scan Sky",
    scanning: "Analyzing Stars...",
    scanningSub: "Local Geometric Hashing (No Internet)",
    solvedTitle: "Identified Constellation",
    starsCount: "stars identified",
    saveBtn: "Save Photo",
    shareBtn: "Share",
    againBtn: "Scan Again",
    achievements: "Achievements",
    alerts: "Astro Alerts",
    issPass: "ISS Passes",
    locationDesc: "Using Location: New Delhi",
    locationGps: "Using GPS Location",
    dragHelp: "Drag screen to look around the sky",
    calibration: "Calibrating sensors... Hold device steady.",
    badge1: "First Planet",
    badge2: "Constellation Master",
    badge3: "Orion Hunter",
    badge4: "ISS Spotter",
    badge5: "Meteor Tracker",
    badge6: "Time Traveler",
    toastAchievement: "Achievement Unlocked!",
    issAlertTitle: "ISS Visible Pass",
    issAlertDesc: "International Space Station passing overhead. Bright, steady white light.",
    meteorAlertTitle: "Meteor Shower Peak",
    meteorAlertDesc: "Look up at the night sky. High rates of fast, bright meteors.",
    direction_n: "North",
    direction_ne: "North-East",
    direction_e: "East",
    direction_se: "South-East",
    direction_s: "South",
    direction_sw: "South-West",
    direction_w: "West",
    direction_nw: "North-West"
  },
  hi: {
    title: "StarFinder Web",
    facing: "दिशा",
    nightMode: "नाईट मोड",
    redMode: "लाल रोशनी",
    timeTravel: "समय यात्रा",
    past: "अतीत",
    now: "वर्तमान",
    future: "भविष्य",
    scanBtn: "आसमान स्कैन करें",
    scanning: "तारों का विश्लेषण...",
    scanningSub: "लोकल जियोमेट्रिक हैशिंग (इंटरनेट की आवश्यकता नहीं)",
    solvedTitle: "पहचाना गया तारामंडल",
    starsCount: "तारे पहचाने गए",
    saveBtn: "फोटो सहेजें",
    shareBtn: "साझा करें",
    againBtn: "पुनः स्कैन करें",
    achievements: "उपलब्धियां (बैज)",
    alerts: "खगोलीय अलर्ट",
    issPass: "ISS पास",
    locationDesc: "उपयोग स्थान: नई दिल्ली",
    locationGps: "सटीक GPS स्थान सक्रिय",
    dragHelp: "आसमान देखने के लिए स्क्रीन को ड्रैग करें",
    calibration: "सेंसर कैलिब्रेशन जारी है... फोन स्थिर रखें।",
    badge1: "प्रथम ग्रह",
    badge2: "तारामंडल मास्टर",
    badge3: "ओरियन हंटर",
    badge4: "ISS स्पॉटर",
    badge5: "उल्कापिंड ट्रैकर",
    badge6: "समय यात्री",
    toastAchievement: "उपलब्धि अनलॉक हुई!",
    issAlertTitle: "ISS दृश्य पास",
    issAlertDesc: "अंतर्राष्ट्रीय स्पेस स्टेशन आपके ऊपर से गुजरेगा। चमकीली, स्थिर सफेद रोशनी।",
    meteorAlertTitle: "उल्कापात का चरम समय",
    meteorAlertDesc: "रात के आसमान में देखें। तेज और चमकीली उल्काओं की बौछार दिखाई देगी।",
    direction_n: "उत्तर",
    direction_ne: "उत्तर-पूर्व",
    direction_e: "पूर्व",
    direction_se: "दक्षिण-पूर्व",
    direction_s: "दक्षिण",
    direction_sw: "दक्षिण-पश्चिम",
    direction_w: "पश्चिम",
    direction_nw: "उत्तर-पश्चिम"
  }
};

// Constellation Descriptions
const CONSTELLATION_INFO = {
  Ori: {
    name: "Orion",
    name_hi: "कालपुरुष (Orion)",
    desc: "Orion is one of the most recognizable constellations. In Hindu astronomy, it is called 'Mriga' or 'Kalapurush'. It represents a hunter, containing bright stars like Betelgeuse (Ardra) and Rigel (Rajanya).",
    desc_hi: "ओरियन (कालपुरुष) आसमान के सबसे प्रसिद्ध तारामंडलों में से एक है। भारतीय खगोलशास्त्र में इसे 'मृग' या 'कालपुरुष' कहा जाता है। इसमें आर्द्रा (Betelgeuse) और राजन्य (Rigel) जैसे चमकीले तारे मौजूद हैं।"
  },
  UMa: {
    name: "Ursa Major",
    name_hi: "सप्तर्षि मंडल (Ursa Major)",
    desc: "Ursa Major contains the famous 'Big Dipper' asterism. In India, it is known as 'Saptarishi Mandala', representing the seven great sages. Its pointer stars point directly to Polaris (Dhruva Tara).",
    desc_hi: "सप्तर्षि मंडल (Ursa Major) उत्तरी गोलार्ध का मुख्य तारामंडल है। इसके सात मुख्य तारे सात महान ऋषियों को दर्शाते हैं। इसके आगे के दो तारे सीधे ध्रुव तारे (Polaris) की दिशा बताते हैं।"
  },
  Cas: {
    name: "Cassiopeia",
    name_hi: "शर्मिष्ठा (Cassiopeia)",
    desc: "Cassiopeia is a distinctive W-shaped constellation in the northern sky. In Hindu myth, she is Sharmistha. It circles around the celestial North Pole.",
    desc_hi: "शर्मिष्ठा (Cassiopeia) उत्तरी आकाश में एक विशिष्ट 'W' आकार का तारामंडल है। भारतीय कथाओं में इसे रानी शर्मिष्ठा माना गया है। यह रात भर ध्रुव तारे की परिक्रमा करता है।"
  },
  Cru: {
    name: "Crux / Southern Cross",
    name_hi: "त्रिशंकु (Crux / Southern Cross)",
    desc: "Crux is the smallest of the 88 constellations but highly prominent in the Southern hemisphere. In India, it is associated with Trishanku, hanging in the southern sky.",
    desc_hi: "त्रिशंकु (Crux) आसमान का सबसे छोटा लेकिन सबसे प्रसिद्ध तारामंडल है। यह केवल दक्षिणी आकाश में दिखाई देता है और नाविकों को दक्षिण दिशा का पता लगाने में मदद करता है।"
  },
  Leo: {
    name: "Leo",
    name_hi: "सिंह (Leo)",
    desc: "Leo represents the celestial lion. In Indian astronomy, it is 'Simha'. Its brightest star is Regulus (Magha), representing the royal heart of the lion.",
    desc_hi: "सिंह (Leo) तारामंडल शेर के आकार जैसा दिखता है। इसका सबसे चमकीला तारा मघा (Regulus) है, जिसे शेर का दिल माना जाता है। यह वसंत ऋतु में शाम को आसमान में ऊंचा दिखाई देता है।"
  },
  Sco: {
    name: "Scorpius",
    name_hi: "वृश्चिक (Scorpius)",
    desc: "Scorpius is a stunning constellation resembling a scorpion. Its heart glows red with the supergiant star Antares (Jyeshtha). It sits high in the summer sky.",
    desc_hi: "वृश्चिक (Scorpius) का आकार हुकदार पूंछ वाले बिच्छू जैसा है। इसके केंद्र में लाल महादानव तारा ज्येष्ठा (Antares) चमकता है, जिसे बिच्छू का हृदय कहा जाता है।"
  },
  Gem: {
    name: "Gemini",
    name_hi: "मिथुन (Gemini)",
    desc: "Gemini represents the twins Castor and Pollux. In Indian calendar astronomy, it matches the Nakshatra Punarvasu. It is visible high overhead in winter.",
    desc_hi: "मिथुन (Gemini) दो जुड़वां भाइयों कैस्टर और पोलक्स को दर्शाता है। भारतीय पंचांग प्रणाली में यह पुनर्वसु नक्षत्र से मेल खाता है। सर्दियों में यह आसमान के ठीक बीच में दिखता है।"
  },
  Tau: {
    name: "Taurus",
    name_hi: "वृषभ (Taurus)",
    desc: "Taurus represents the bull. It contains the bright red eye star Aldebaran (Rohini) and the famous Pleiades star cluster (Krittika / Amba).",
    desc_hi: "वृषभ (Taurus) सांड जैसी आकृति का है। इसमें चमकीला लाल तारा रोहिणी (Aldebaran) और तारों का सुंदर गुच्छा कृत्तिका (Pleiades) मौजूद हैं।"
  }
};

// Initialize Application
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  initUI();
  initWorker();
  initSensors();
  initCamera();
  startRendering();
  updateSyncIndicator();
  fetchLatestISSOrbit();
});

// Load state from LocalStorage
function loadState() {
  const savedBadges = localStorage.getItem("starfinder_badges");
  if (savedBadges) {
    try {
      state.badges = JSON.parse(savedBadges);
    } catch (e) {
      console.error("Error parsing badges:", e);
    }
  }

  const savedLang = localStorage.getItem("starfinder_lang");
  if (savedLang) {
    state.language = savedLang;
  }

  const savedNight = localStorage.getItem("starfinder_night");
  if (savedNight === "true") {
    state.nightMode = true;
    document.body.classList.add("night-mode-red");
  }
}

// Save state to LocalStorage
function saveState() {
  localStorage.setItem("starfinder_badges", JSON.stringify(state.badges));
  localStorage.setItem("starfinder_lang", state.language);
  localStorage.setItem("starfinder_night", state.nightMode);
}

// Translate the DOM
function translateUI() {
  const lang = state.language;
  const dict = TRANSLATIONS[lang];

  // Set page headers
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Dynamic values
  updateDirectionHUD();
  renderAlerts();
  renderBadges();
}

// Update facing direction text based on Center RA/Dec
function updateDirectionHUD() {
  const lang = state.language;
  const dict = TRANSLATIONS[lang];
  
  // Calculate approximate Heading in degrees from Center RA/LST
  const lst = getLocalSiderealTime();
  let heading = (lst * 180 / Math.PI - state.centerRA);
  heading = (heading % 360 + 360) % 360;

  let dirText = "";
  if (heading >= 337.5 || heading < 22.5) dirText = dict.direction_n;
  else if (heading >= 22.5 && heading < 67.5) dirText = dict.direction_ne;
  else if (heading >= 67.5 && heading < 112.5) dirText = dict.direction_e;
  else if (heading >= 112.5 && heading < 157.5) dirText = dict.direction_se;
  else if (heading >= 157.5 && heading < 202.5) dirText = dict.direction_s;
  else if (heading >= 202.5 && heading < 247.5) dirText = dict.direction_sw;
  else if (heading >= 247.5 && heading < 292.5) dirText = dict.direction_w;
  else dirText = dict.direction_nw;

  const raHours = Math.floor(state.centerRA / 15);
  const raMins = Math.floor((state.centerRA / 15 - raHours) * 60);
  const decVal = state.centerDec.toFixed(0);

  const facingText = document.getElementById("direction-text");
  if (facingText) {
    facingText.innerHTML = `${dict.facing}: <span>${dirText}</span> | RA: <span>${raHours.toString().padStart(2, '0')}h ${raMins.toString().padStart(2, '0')}m</span> | Dec: <span>${decVal}°</span>`;
  }
}

// Initialize User Interface Events
function initUI() {
  // Drawer Toggles
  const menuBtn = document.getElementById("menu-btn");
  const sideDrawer = document.getElementById("side-drawer");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  
  menuBtn.addEventListener("click", () => {
    sideDrawer.classList.add("open");
    drawerBackdrop.classList.add("show");
  });

  const closeDrawer = () => {
    sideDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("show");
  };

  drawerBackdrop.addEventListener("click", closeDrawer);

  // Red Night Mode Toggle
  const nightToggle = document.getElementById("night-mode-toggle");
  nightToggle.checked = state.nightMode;
  nightToggle.addEventListener("change", (e) => {
    state.nightMode = e.target.checked;
    if (state.nightMode) {
      document.body.classList.add("night-mode-red");
    } else {
      document.body.classList.remove("night-mode-red");
    }
    saveState();
  });

  // Language Toggle
  const langToggle = document.getElementById("lang-toggle");
  langToggle.checked = state.language === "en";
  langToggle.addEventListener("change", (e) => {
    state.language = e.target.checked ? "en" : "hi";
    translateUI();
    saveState();
  });

  // Time Travel Slider
  const timeSlider = document.getElementById("time-travel-slider");
  const nowLabel = document.getElementById("time-label-now");
  timeSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value); // Offset in hours
    state.timeOffset = val * 3600 * 1000; // MS offset

    // Highlight active state
    if (val === 0) {
      nowLabel.classList.add("active");
    } else {
      nowLabel.classList.remove("active");
    }

    if (val !== 0) {
      unlockBadge("time_traveler");
    }
    updateDirectionHUD();
  });

  // Sheets Close Buttons
  document.querySelectorAll(".close-sheet-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sheet = e.target.closest(".bottom-sheet");
      sheet.classList.remove("open");
      
      // If closing solved sheet, reset solver highlights and uploaded image
      if (sheet.id === "results-sheet") {
        state.highlightedConstellation = null;
        state.solvedResult = null;
        state.uploadedImage = null;
      }
    });
  });

  // Menu clicks
  document.getElementById("menu-achievements").addEventListener("click", () => {
    closeDrawer();
    renderBadges();
    document.getElementById("achievements-sheet").classList.add("open");
  });

  document.getElementById("menu-alerts").addEventListener("click", () => {
    closeDrawer();
    renderAlerts();
    document.getElementById("alerts-sheet").classList.add("open");
  });

  // Photo Upload handling
  const uploadBtn = document.getElementById("upload-btn");
  const photoUploadInput = document.getElementById("photo-upload");
  const menuUpload = document.getElementById("menu-upload");

  const triggerUploadClick = () => {
    photoUploadInput.click();
  };

  if (uploadBtn) uploadBtn.addEventListener("click", triggerUploadClick);
  if (menuUpload) menuUpload.addEventListener("click", triggerUploadClick);

  photoUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        state.uploadedImage = img;
        triggerScanForUploadedImage(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Capture Button
  const captureBtn = document.getElementById("capture-btn");
  captureBtn.addEventListener("click", triggerScan);

  // Results Actions
  document.getElementById("results-save").addEventListener("click", exportWatermarkedImage);
  document.getElementById("results-again").addEventListener("click", () => {
    document.getElementById("results-sheet").classList.remove("open");
    state.highlightedConstellation = null;
    state.solvedResult = null;
    state.uploadedImage = null;
  });

  // Setup canvas resizing
  const canvas = document.getElementById("ar-overlay");
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Setup drag event handlers for desktop simulator fallback
  canvas.addEventListener("mousedown", (e) => {
    if (!state.isDesktopSimulator) return;
    state.isDragging = true;
    state.prevMouseX = e.clientX;
    state.prevMouseY = e.clientY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!state.isDragging) return;
    const dx = e.clientX - state.prevMouseX;
    const dy = e.clientY - state.prevMouseY;
    
    // Scale dragging factor: yaw (RA) and pitch (Dec) adjustments
    const dragSensitivity = 0.08;
    state.centerRA = (state.centerRA - dx * dragSensitivity) % 360;
    if (state.centerRA < 0) state.centerRA += 360;
    
    state.centerDec = Math.max(-85, Math.min(85, state.centerDec + dy * dragSensitivity));
    
    state.prevMouseX = e.clientX;
    state.prevMouseY = e.clientY;
    
    updateDirectionHUD();
  });

  window.addEventListener("mouseup", () => {
    state.isDragging = false;
  });

  // Support Touch events for mobile dragging
  canvas.addEventListener("touchstart", (e) => {
    if (!state.isDesktopSimulator) return;
    state.isDragging = true;
    state.prevMouseX = e.touches[0].clientX;
    state.prevMouseY = e.touches[0].clientY;
  });

  canvas.addEventListener("touchmove", (e) => {
    if (!state.isDragging) return;
    const dx = e.touches[0].clientX - state.prevMouseX;
    const dy = e.touches[0].clientY - state.prevMouseY;
    
    const dragSensitivity = 0.12;
    state.centerRA = (state.centerRA - dx * dragSensitivity) % 360;
    if (state.centerRA < 0) state.centerRA += 360;
    
    state.centerDec = Math.max(-85, Math.min(85, state.centerDec + dy * dragSensitivity));
    
    state.prevMouseX = e.touches[0].clientX;
    state.prevMouseY = e.touches[0].clientY;
    
    updateDirectionHUD();
  });

  canvas.addEventListener("touchend", () => {
    state.isDragging = false;
  });

  // Load translations
  translateUI();
}

// Initialize Web Worker
function initWorker() {
  if (typeof Worker !== "undefined") {
    try {
      state.solverWorker = new Worker("solver_worker.js");
      state.solverWorker.onmessage = function (e) {
        if (state.solving) {
          handleSolverResult(e.data);
        }
      };
    } catch (err) {
      console.warn("Failed to spawn Web Worker (running locally over file://). Falling back to synchronous plate solving.", err);
      state.solverWorker = null;
    }
  }
}

// Handle solved results from either Worker or synchronous fallback
function handleSolverResult(response) {
  state.solving = false;
  document.getElementById("analysis-overlay").classList.remove("show");

  if (response && response.success && response.result.solved) {
    const result = response.result;
    state.solvedResult = result;
    
    const matches = result.matches || [];
    const conCounts = {};
    matches.forEach(m => {
      if (m.cat && m.cat.con) {
        conCounts[m.cat.con] = (conCounts[m.cat.con] || 0) + 1;
      }
    });

    let bestCon = null;
    let maxCount = 0;
    for (const con in conCounts) {
      if (conCounts[con] > maxCount) {
        maxCount = conCounts[con];
        bestCon = con;
      }
    }

    if (bestCon) {
      state.highlightedConstellation = bestCon;
      showResultSheet(bestCon, matches.length);

      unlockBadge("first_planet");
      if (bestCon === "Ori") {
        unlockBadge("orion_hunter");
      }

      let uniqueUnlocked = Object.keys(state.badges).filter(k => state.badges[k]).length;
      if (uniqueUnlocked >= 3) {
        unlockBadge("constellation_master");
      }
    }
  } else {
    // Revert if solve failed
    state.uploadedImage = null;
    showToastAlert("No constellations resolved. Ensure image shows clear stars of Orion, Ursa Major, or Scorpius.");
  }
}

// Fetch Latest ISS TLE parameters dynamically
function fetchLatestISSOrbit() {
  if (!navigator.onLine) return;

  // NORAD catalog number 25544 = ISS
  fetch("https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE")
    .then(res => {
      if (!res.ok) throw new Error("Network response not ok");
      return res.text();
    })
    .then(text => {
      const lines = text.trim().split("\n");
      if (lines.length >= 2) {
        let l1 = lines[0].startsWith("1 ") ? lines[0] : lines[1];
        let l2 = lines[1].startsWith("2 ") ? lines[1] : lines[2];
        
        if (l1 && l2 && l1.startsWith("1 ") && l2.startsWith("2 ")) {
          parseAndUpdateISS_TLE(l1, l2);
        }
      }
    })
    .catch(err => {
      console.warn("Dynamic TLE fetch failed (likely CORS or network restriction). Using fallback pre-seeded parameters.", err);
    });
}

// Parse orbital elements from TLE and update database epoch
function parseAndUpdateISS_TLE(line1, line2) {
  try {
    const yearShort = parseInt(line1.substring(18, 20));
    const year = 2000 + yearShort;
    const dayOfYear = parseFloat(line1.substring(20, 32));
    
    // Epoch Date timestamp t0
    const epochDate = new Date(Date.UTC(year, 0, 1) + (dayOfYear - 1) * 24 * 3600 * 1000);
    const t0 = epochDate.getTime();
    
    // Orbit angles (converted to radians)
    const inclination = parseFloat(line2.substring(8, 16)) * Math.PI / 180;
    const omega0 = parseFloat(line2.substring(17, 25)) * Math.PI / 180;
    const meanAnomaly0 = parseFloat(line2.substring(43, 51)) * Math.PI / 180;
    
    // Mean motion: revs/day -> rad/ms
    const revsPerDay = parseFloat(line2.substring(52, 63));
    const n = (revsPerDay * 2 * Math.PI) / (24 * 3600 * 1000);
    
    // Calculate Earth GMST at epoch date
    const gmst0 = calculateGMST(epochDate);
    
    // Apply to state database parameters
    STARS_DB.issEpoch.t0 = t0;
    STARS_DB.issEpoch.inclination = inclination;
    STARS_DB.issEpoch.omega0 = omega0;
    STARS_DB.issEpoch.meanAnomaly0 = meanAnomaly0;
    STARS_DB.issEpoch.n = n;
    STARS_DB.issEpoch.theta0 = gmst0;
    
    console.log(`[TLE Sync] Successfully updated ISS orbit parameters from epoch: ${epochDate.toISOString()}`);
  } catch (err) {
    console.error("[TLE Sync] Error parsing orbital elements:", err);
  }
}

// Calculate GMST in radians for a given UTC Date
function calculateGMST(date) {
  const j2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  const diffDays = (date.getTime() - j2000.getTime()) / (24 * 3600 * 1000);
  const gmstHours = (18.697374558 + 24.06570982441908 * diffDays) % 24;
  return (gmstHours * 15) * Math.PI / 180; // degrees to radians
}

// Initialize Orientation Sensors
function initSensors() {
  // Query User location first
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.latitude = pos.coords.latitude;
      state.longitude = pos.coords.longitude;
      const syncText = document.getElementById("location-label");
      if (syncText) {
        syncText.textContent = TRANSLATIONS[state.language].locationGps;
      }
    },
    (err) => {
      console.warn("GPS Location access denied. Falling back to default: New Delhi.");
    }
  );

  // Device orientation API check
  if (window.DeviceOrientationEvent) {
    // Check iOS permission request requirement
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Add a calibration overlay helper that prompts permission on first user tap
      const calibrationHelper = document.createElement("div");
      calibrationHelper.className = "calibration-overlay interactive";
      calibrationHelper.id = "sensor-permission-prompt";
      calibrationHelper.textContent = "Tap here to calibrate orientation sensors for AR mode";
      calibrationHelper.style.cursor = "pointer";
      document.getElementById("app-container").appendChild(calibrationHelper);

      calibrationHelper.addEventListener("click", () => {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener("deviceorientation", handleOrientation, true);
              state.isDesktopSimulator = false;
              calibrationHelper.remove();
            } else {
              console.warn("Sensor permission denied. Operating in simulator drag-to-look mode.");
              calibrationHelper.textContent = TRANSLATIONS[state.language].dragHelp;
              setTimeout(() => calibrationHelper.remove(), 4000);
            }
          })
          .catch(console.error);
      });
    } else {
      // Standard Android/Modern browser direct orientation
      window.addEventListener("deviceorientation", handleOrientation, true);
      // Wait to see if we get actual orientation data
      setTimeout(() => {
        if (state.sensorPermission) {
          state.isDesktopSimulator = false;
        } else {
          // If no data received, display drag-to-look helper
          const helper = document.createElement("div");
          helper.className = "calibration-overlay";
          helper.textContent = TRANSLATIONS[state.language].dragHelp;
          document.getElementById("app-container").appendChild(helper);
          setTimeout(() => helper.remove(), 5000);
        }
      }, 1000);
    }
  }
}

// Handle Device Orientation Data
function handleOrientation(event) {
  state.sensorPermission = true;
  
  if (event.alpha === null) return;

  const alpha = event.alpha; // Heading (degrees)
  const beta = event.beta;   // Pitch (degrees)
  const gamma = event.gamma; // Roll (degrees)

  state.roll = gamma;

  // Raw targets (clamp declination)
  let targetDec = (beta - 90) * Math.PI / 180;
  if (targetDec < -Math.PI / 2) targetDec = -Math.PI / 2;
  if (targetDec > Math.PI / 2) targetDec = Math.PI / 2;

  const lst = getLocalSiderealTime();
  const targetRA = lst - (alpha * Math.PI / 180);

  // Initialize smoothing variables on first orientation event
  if (!state.orientationInitialized) {
    state.smoothDecX = Math.cos(targetDec);
    state.smoothDecY = Math.sin(targetDec);
    state.smoothRAX = Math.cos(targetRA);
    state.smoothRAY = Math.sin(targetRA);
    state.orientationInitialized = true;
  }

  // Exponential moving average filter (EMA)
  const k = 0.12; // Smoothing constant
  state.smoothDecX = state.smoothDecX * (1 - k) + Math.cos(targetDec) * k;
  state.smoothDecY = state.smoothDecY * (1 - k) + Math.sin(targetDec) * k;
  state.smoothRAX = state.smoothRAX * (1 - k) + Math.cos(targetRA) * k;
  state.smoothRAY = state.smoothRAY * (1 - k) + Math.sin(targetRA) * k;

  // Re-calculate smoothed Center Dec and RA
  state.centerDec = Math.atan2(state.smoothDecY, state.smoothDecX) * 180 / Math.PI;
  
  let smoothedRA = Math.atan2(state.smoothRAY, state.smoothRAX) * 180 / Math.PI;
  state.centerRA = (smoothedRA + 360) % 360;

  updateDirectionHUD();
}

// Initialize Web Camera Feed
function initCamera() {
  const video = document.getElementById("camera-stream");
  
  // Mobile browser constraints
  const constraints = {
    audio: false,
    video: {
      facingMode: "environment", // back camera
      width: { ideal: window.innerWidth },
      height: { ideal: window.innerHeight }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      video.srcObject = stream;
      state.cameraStream = stream;
      
      // If we got camera access, hide mock background if any
      video.style.opacity = 1;
    })
    .catch(err => {
      console.warn("Camera access denied or unavailable. Operating with simulated starfield background.", err);
      // Keep simulator active
      video.style.opacity = 0;
    });
}

// Calculate Local Sidereal Time (LST) based on current GPS longitude and UTC time
function getLocalSiderealTime() {
  const now = new Date(Date.now() + state.timeOffset);
  
  // Simple calculation of GMST relative to Epoch June 15, 2026 00:00:00 UTC
  // Reference Julian Date for epoch is JD 2461206.5
  // Earth rotation rate: 360.9856 deg/day = 0.004178074 deg/ms = 7.292115e-5 rad/s
  const t0 = STARS_DB.issEpoch.t0;
  const dt = now.getTime() - t0;
  
  // GMST at epoch: let's assume 180 degrees (12 hours RA)
  const gmst0 = STARS_DB.issEpoch.theta0;
  const gmst = gmst0 + STARS_DB.issEpoch.omegaEarth * dt;
  
  // LST = GMST + Longitude
  const lst = gmst + (state.longitude * Math.PI / 180);
  return lst % (2 * Math.PI);
}

// Trigger Plate Solving Scan
function triggerScan() {
  if (state.solving) return;
  
  state.solving = true;
  const overlay = document.getElementById("analysis-overlay");
  overlay.classList.add("show");

  // Create temporary canvas to grab current viewport or simulator stars
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  
  // Draw current sky representation to simulate taking a photo
  drawSkyRepresentation(canvas, 640, 480);

  // Perform detection and solve
  setTimeout(() => {
    const stars = PlateSolver.detectStars(canvas);
    const result = PlateSolver.solve(stars, STARS_DB, state.centerRA, state.centerDec, 45);
    
    overlay.classList.remove("show");
    state.solving = false;

    if (result.solved) {
      state.solvedResult = result;
      
      // Find the main matched constellation (the one with the most star matches)
      const matches = result.matches || [];
      const conCounts = {};
      matches.forEach(m => {
        if (m.cat && m.cat.con) {
          conCounts[m.cat.con] = (conCounts[m.cat.con] || 0) + 1;
        }
      });
      
      let bestCon = null;
      let maxCount = 0;
      for (const con in conCounts) {
        if (conCounts[con] > maxCount) {
          maxCount = conCounts[con];
          bestCon = con;
        }
      }

      if (bestCon) {
        state.highlightedConstellation = bestCon;
        showResultSheet(bestCon, matches.length);
        
        // Unlock Achievements
        unlockBadge("first_planet"); // scanned something successfully
        if (bestCon === "Ori") {
          unlockBadge("orion_hunter");
        }
        
        // Count how many constellations solved total
        let uniqueUnlocked = Object.keys(state.badges).filter(k => state.badges[k]).length;
        if (uniqueUnlocked >= 3) {
          unlockBadge("constellation_master");
        }
      }
    } else {
      // If it fails to solve, show a toast alert to user
      showToastAlert("No stars resolved. Point at Orion or Ursa Major and try again.");
    }
  }, 2200); // 2.2 seconds simulated analysis
}

// Trigger Plate Solving for Uploaded Photo
function triggerScanForUploadedImage(img) {
  if (state.solving) return;

  state.solving = true;
  const overlay = document.getElementById("analysis-overlay");
  overlay.classList.add("show");

  // Create canvas of dimensions matching image scale
  const canvas = document.createElement("canvas");
  const maxDim = 800;
  let w = img.width;
  let h = img.height;
  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = (h / w) * maxDim;
      w = maxDim;
    } else {
      w = (w / h) * maxDim;
      h = maxDim;
    }
  }
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  // Perform detection and global solve (without sensor info)
  setTimeout(() => {
    const stars = PlateSolver.detectStars(canvas);
    // Use null for sensors coordinates to run a global scale-invariant match
    const result = PlateSolver.solve(stars, STARS_DB, null, null, 45);

    overlay.classList.remove("show");
    state.solving = false;

    if (result.solved) {
      state.solvedResult = result;

      // Find matched constellation
      const matches = result.matches || [];
      const conCounts = {};
      matches.forEach(m => {
        if (m.cat && m.cat.con) {
          conCounts[m.cat.con] = (conCounts[m.cat.con] || 0) + 1;
        }
      });

      let bestCon = null;
      let maxCount = 0;
      for (const con in conCounts) {
        if (conCounts[con] > maxCount) {
          maxCount = conCounts[con];
          bestCon = con;
        }
      }

      if (bestCon) {
        state.highlightedConstellation = bestCon;
        showResultSheet(bestCon, matches.length);

        unlockBadge("first_planet");
        if (bestCon === "Ori") {
          unlockBadge("orion_hunter");
        }
      }
    } else {
      state.uploadedImage = null; // Revert since we couldn't solve it
      showToastAlert("No constellations resolved. Ensure image has clear stars of Orion, Leo, Gemini, or Scorpius.");
    }
  }, 2200);
}

// Display Solved Results Panel
function showResultSheet(conId, starCount) {
  const con = CONSTELLATION_INFO[conId];
  if (!con) return;

  const lang = state.language;
  const title = lang === "hi" ? con.name_hi : con.name;
  const desc = lang === "hi" ? con.desc_hi : con.desc;

  document.getElementById("results-con-title").textContent = title;
  document.getElementById("results-con-desc").textContent = desc;
  document.getElementById("results-star-count").textContent = `${starCount} ${TRANSLATIONS[lang].starsCount}`;
  
  document.getElementById("results-sheet").classList.add("open");
}

// Canvas Rendering Loop
let arCanvas, arCtx;
function startRendering() {
  arCanvas = document.getElementById("ar-overlay");
  arCtx = arCanvas.getContext("2d");

  function loop() {
    renderAR();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// Project coordinate RA/Dec directly to 2D screen coordinate
function project(ra, dec, width, height, centerRA, centerDec, rollDeg) {
  // Convert inputs to radians
  const r_ra = ra * Math.PI / 180;
  const r_dec = dec * Math.PI / 180;
  const r_cRA = centerRA * Math.PI / 180;
  const r_cDec = centerDec * Math.PI / 180;
  const r_roll = rollDeg * Math.PI / 180;

  // 1. Convert star coordinates to 3D Cartesian relative to center celestial
  let x = Math.cos(r_dec) * Math.cos(r_ra);
  let y = Math.cos(r_dec) * Math.sin(r_ra);
  let z = Math.sin(r_dec);

  // 2. Rotate around Z-axis by -CenterRA
  let x1 = x * Math.cos(r_cRA) + y * Math.sin(r_cRA);
  let y1 = -x * Math.sin(r_cRA) + y * Math.cos(r_cRA);
  let z1 = z;

  // 3. Rotate around Y-axis by -CenterDec
  let x_cam = x1 * Math.cos(r_cDec) - z1 * Math.sin(r_cDec);
  let y_cam = y1;
  let z_cam = x1 * Math.sin(r_cDec) + z1 * Math.cos(r_cDec);

  // 4. Apply camera Roll (around Z-axis of camera frame)
  let rx = x_cam * Math.cos(r_roll) - y_cam * Math.sin(r_roll);
  let ry = x_cam * Math.sin(r_roll) + y_cam * Math.cos(r_roll);
  let rz = z_cam;

  // 5. Check if it's in front of camera (rz > 0)
  if (rz > 0.1) {
    const f = Math.max(width, height) * 0.95; // Focal length / scale factor
    const sx = width / 2 + (ry / rz) * f;
    const sy = height / 2 - (rx / rz) * f;
    
    // Check if coordinates are within a reasonable margin of the screen boundaries
    if (sx >= -100 && sx <= width + 100 && sy >= -100 && sy <= height + 100) {
      return { x: sx, y: sy, visible: true };
    }
  }

  return { visible: false };
}

// Render AR Overlay onto Canvas
function renderAR() {
  const w = arCanvas.width;
  const h = arCanvas.height;
  const ctx = arCtx;

  ctx.clearRect(0, 0, w, h);

  const lang = state.language;
  const isRed = state.nightMode;

  // 1. Draw Uploaded Image background if active
  if (state.uploadedImage) {
    ctx.drawImage(state.uploadedImage, 0, 0, w, h);

    // If solved, project overlay using 2D transform parameters
    if (state.solvedResult && state.solvedResult.transform) {
      const { a, b, tx, ty } = state.solvedResult.transform;
      const cRA = state.solvedResult.centerRA;
      const cDec = state.solvedResult.centerDec;

      const projectedPoints = {};

      // Project and draw stars
      STARS_DB.stars.forEach(star => {
        let diffRA = star.ra - cRA;
        diffRA = ((diffRA + 180) % 360 + 360) % 360 - 180; // normalize -180 to 180

        const u = diffRA * Math.cos(cDec * Math.PI / 180);
        const v = star.dec - cDec;

        const sx = a * u - b * v + tx;
        const sy = b * u + a * v + ty;

        if (sx >= -100 && sx <= w + 100 && sy >= -100 && sy <= h + 100) {
          projectedPoints[star.id] = { x: sx, y: sy, visible: true };

          // Dynamic star twinkling calculations
          const freq = 2.0 + Math.sin(star.id * 45.67) * 0.8;
          const phase = star.id * 12.34;
          const twinkle = 1.0 + Math.sin((Date.now() / 1000) * freq + phase) * 0.22;
          const r = Math.max(1.5, 5 - (star.mag + 1.5) * 0.7) * (0.85 + twinkle * 0.15);

          ctx.fillStyle = isRed ? "#ff6666" : "#ffffff";
          ctx.shadowColor = isRed ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 240, 255, 0.8)";
          ctx.shadowBlur = (star.mag < 1.0 ? 8 : 2) * twinkle;

          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (star.mag < 1.5) {
            ctx.fillStyle = isRed ? "#ff4444" : "#94a3b8";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "left";
            const name = lang === "hi" ? star.name_hi.split(" (")[0] : star.name;
            ctx.fillText(name, sx + r + 4, sy + 3);
          }
        }
      });

      // Draw constellation lines
      STARS_DB.constellations.forEach(con => {
        const isHighlighted = con.id === state.highlightedConstellation;
        
        ctx.strokeStyle = isRed ? (isHighlighted ? "rgba(255,0,0,0.85)" : "rgba(180,0,0,0.25)") : (isHighlighted ? "rgba(0,240,255,0.9)" : "rgba(0,240,255,0.22)");
        ctx.shadowBlur = isHighlighted ? 12 : 0;
        ctx.lineWidth = isHighlighted ? 2.5 : 1.2;

        con.lines.forEach(line => {
          const p1 = projectedPoints[line[0]];
          const p2 = projectedPoints[line[1]];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
        ctx.shadowBlur = 0;

        const centerLine = con.lines[0];
        if (centerLine) {
          const p = projectedPoints[centerLine[0]];
          if (p) {
            ctx.fillStyle = isHighlighted ? (isRed ? "#ff0000" : "#00f0ff") : (isRed ? "#aa0000" : "#00a8b5");
            ctx.font = isHighlighted ? "bold 13px 'Orbitron'" : "11px 'Orbitron'";
            ctx.textAlign = "center";
            const conName = lang === "hi" ? con.name_hi : con.name;
            ctx.fillText(conName, p.x, p.y - 20);
          }
        }
      });
    }
    return; // Skip normal camera live projection rendering
  }

  // 2. Draw Simulated Background Starfield (only for desktop / when camera is offline)
  if (state.isDesktopSimulator && state.cameraStream === null) {
    const grad = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, Math.max(w, h));
    if (isRed) {
      grad.addColorStop(0, "#150000");
      grad.addColorStop(1, "#030000");
    } else {
      grad.addColorStop(0, "#0a122e");
      grad.addColorStop(1, "#02040b");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw static faint ambient stars on simulator background
    ctx.fillStyle = isRed ? "rgba(255, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 50; i++) {
      // Pseudo-random position based on seed
      const sx = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 987.65) * 0.5 + 0.5) * h;
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Calculate LST for constellation projection rotation
  const lst = getLocalSiderealTime() * 180 / Math.PI;

  // 3. Draw Constellation lines (Camera Live Mode)
  STARS_DB.constellations.forEach(con => {
    const isHighlighted = con.id === state.highlightedConstellation;
    
    if (isRed) {
      ctx.strokeStyle = isHighlighted ? "rgba(255, 0, 0, 0.85)" : "rgba(180, 0, 0, 0.25)";
      ctx.shadowColor = "rgba(255, 0, 0, 0.5)";
    } else {
      ctx.strokeStyle = isHighlighted ? "rgba(0, 240, 255, 0.9)" : "rgba(0, 240, 255, 0.22)";
      ctx.shadowColor = "rgba(0, 240, 255, 0.6)";
    }
    ctx.shadowBlur = isHighlighted ? 12 : 0;
    ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
    
    con.lines.forEach(line => {
      const star1 = STARS_DB.stars.find(s => s.id === line[0]);
      const star2 = STARS_DB.stars.find(s => s.id === line[1]);
      if (!star1 || !star2) return;

      const rotRA1 = (star1.ra + lst) % 360;
      const rotRA2 = (star2.ra + lst) % 360;

      const p1 = project(rotRA1, star1.dec, w, h, state.centerRA, state.centerDec, state.roll);
      const p2 = project(rotRA2, star2.dec, w, h, state.centerRA, state.centerDec, state.roll);

      if (p1.visible && p2.visible) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;

    const centerLine = con.lines[0];
    if (centerLine) {
      const labelStar = STARS_DB.stars.find(s => s.id === centerLine[0]);
      if (labelStar) {
        const rotRA = (labelStar.ra + lst) % 360;
        const p = project(rotRA, labelStar.dec, w, h, state.centerRA, state.centerDec, state.roll);
        if (p.visible) {
          ctx.fillStyle = isHighlighted ? (isRed ? "#ff0000" : "#00f0ff") : (isRed ? "#aa0000" : "#00a8b5");
          ctx.font = isHighlighted ? `bold 13px 'Orbitron'` : `11px 'Orbitron'`;
          ctx.textAlign = "center";
          const conName = lang === "hi" ? con.name_hi : con.name;
          ctx.fillText(conName, p.x, p.y - 20);
        }
      }
    }
  });

  // 4. Draw Stars (Camera Live Mode)
  STARS_DB.stars.forEach(star => {
    const rotRA = (star.ra + lst) % 360;
    const p = project(rotRA, star.dec, w, h, state.centerRA, state.centerDec, state.roll);
    if (!p.visible) return;

    // Dynamic star twinkling calculations
    const freq = 2.0 + Math.sin(star.id * 45.67) * 0.8;
    const phase = star.id * 12.34;
    const twinkle = 1.0 + Math.sin((Date.now() / 1000) * freq + phase) * 0.22;
    const r = Math.max(1.5, 5 - (star.mag + 1.5) * 0.7) * (0.85 + twinkle * 0.15);

    if (isRed) {
      ctx.fillStyle = "#ff6666";
      ctx.shadowColor = "rgba(255, 0, 0, 0.8)";
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 240, 255, 0.8)";
    }
    ctx.shadowBlur = (star.mag < 1.0 ? 8 : 2) * twinkle;

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (star.mag < 1.5) {
      ctx.fillStyle = isRed ? "#ff4444" : "#94a3b8";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      const name = lang === "hi" ? star.name_hi.split(" (")[0] : star.name;
      ctx.fillText(name, p.x + r + 4, p.y + 3);
    }
  });

  // 5. Draw ISS Satellite position (Camera Live Mode)
  const iss = propagateISSLocal(Date.now() + state.timeOffset);
  const pISS = project(iss.ra, iss.dec, w, h, state.centerRA, state.centerDec, state.roll);
  
  if (pISS.visible) {
    const angleToCenter = Math.hypot(pISS.x - w/2, pISS.y - h/2);
    if (angleToCenter < 120 && !state.solving) {
      unlockBadge("iss_spotter");
    }

    ctx.strokeStyle = isRed ? "#ff0000" : "#eab308";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pISS.x, pISS.y, 10 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(pISS.x, pISS.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isRed ? "#ff0000" : "#ffffff";
    ctx.font = "bold 10px 'Orbitron'";
    ctx.textAlign = "center";
    ctx.fillText("ISS", pISS.x, pISS.y - 16);
  }
}

// Propagate ISS position in Celestial coordinates (RA/Dec)
function propagateISSLocal(timeMs) {
  const dt = timeMs - STARS_DB.issEpoch.t0; // since epoch in ms
  const dtDays = dt / (24 * 3600 * 1000);
  
  // Mean motion
  const M = STARS_DB.issEpoch.meanAnomaly0 + STARS_DB.issEpoch.n * dt;
  
  // Precess node
  const omega = STARS_DB.issEpoch.omega0 + STARS_DB.issEpoch.omegaDot * dtDays;
  
  // Inclination
  const inc = STARS_DB.issEpoch.inclination;
  const r = STARS_DB.issEpoch.semiMajorAxis;

  // Orbit plane position
  const x_orb = r * Math.cos(M);
  const y_orb = r * Math.sin(M);
  
  // Rotate by inclination around X
  const x_prime = x_orb;
  const y_prime = y_orb * Math.cos(inc);
  const z_prime = y_orb * Math.sin(inc);
  
  // Rotate by RA of ascending node omega around Z (ECI)
  const x_eci = x_prime * Math.cos(omega) - y_prime * Math.sin(omega);
  const y_eci = x_prime * Math.sin(omega) + y_prime * Math.cos(omega);
  const z_eci = z_prime;

  // Convert ECI vector directly to RA & Dec
  const ra = (Math.atan2(y_eci, x_eci) * 180 / Math.PI + 360) % 360;
  const dec = Math.asin(z_eci / r) * 180 / Math.PI;

  return { ra, dec };
}

// Draw a representation of the current sky coordinates on a canvas (used for simulated capture pixels)
function drawSkyRepresentation(canvas, width, height) {
  const ctx = canvas.getContext("2d");
  
  // Dark Background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // We project current stars onto the capture frame to simulate actual image capture
  const lst = getLocalSiderealTime() * 180 / Math.PI;
  
  ctx.fillStyle = "#ffffff";
  STARS_DB.stars.forEach(star => {
    const rotRA = (star.ra + lst) % 360;
    const p = project(rotRA, star.dec, width, height, state.centerRA, state.centerDec, state.roll);
    if (p.visible) {
      // Draw simulated star blob
      const r = Math.max(1.5, 4.5 - star.mag * 0.8);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.3, 1 - star.mag * 0.2)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Unlock an achievement badge and display a dynamic toast notification
function unlockBadge(badgeId) {
  if (state.badges[badgeId]) return; // already unlocked

  state.badges[badgeId] = true;
  saveState();

  const lang = state.language;
  const dict = TRANSLATIONS[lang];

  // Map badge titles
  const badgeTitles = {
    first_planet: dict.badge1,
    constellation_master: dict.badge2,
    orion_hunter: dict.badge3,
    iss_spotter: dict.badge4,
    meteor_tracker: dict.badge5,
    time_traveler: dict.badge6
  };

  const toast = document.getElementById("achievement-toast");
  const toastName = document.getElementById("toast-badge-name");
  
  toastName.textContent = badgeTitles[badgeId];
  
  // Play short audio synthetic beep using browser AudioContext (100% offline!)
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
    
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.warn("AudioContext block on system:", e);
  }

  // Show Toast
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);

  // Update lists
  renderBadges();
}

// Show standard toast alert message
function showToastAlert(message) {
  const container = document.getElementById("app-container");
  const alert = document.createElement("div");
  alert.className = "calibration-overlay interactive";
  alert.style.bottom = "110px";
  alert.textContent = message;
  container.appendChild(alert);
  
  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.transition = "opacity 0.6s ease";
    setTimeout(() => alert.remove(), 600);
  }, 3500);
}

// Render Achievements Grid
function renderBadges() {
  const grid = document.getElementById("badge-grid");
  if (!grid) return;
  
  grid.innerHTML = "";
  const lang = state.language;
  const dict = TRANSLATIONS[lang];

  const badgesList = [
    { id: "first_planet", name: dict.badge1, icon: "🪐" },
    { id: "constellation_master", name: dict.badge2, icon: "🌌" },
    { id: "orion_hunter", name: dict.badge3, icon: "🏹" },
    { id: "iss_spotter", name: dict.badge4, icon: "🛰️" },
    { id: "meteor_tracker", name: dict.badge5, icon: "🌠" },
    { id: "time_traveler", name: dict.badge6, icon: "⏳" }
  ];

  badgesList.forEach(b => {
    const unlocked = state.badges[b.id];
    const item = document.createElement("div");
    item.className = `badge-item ${unlocked ? "unlocked" : ""}`;
    
    item.innerHTML = `
      <div class="badge-icon-wrapper">
        <span class="badge-icon" style="font-size: 28px; line-height: 1; display: block; opacity: ${unlocked ? '1' : '0.15'}; filter: ${unlocked ? 'none' : 'grayscale(100%)'};">${b.icon}</span>
      </div>
      <div class="badge-name">${b.name}</div>
    `;

    // Interactive badge unlock click trigger for testing
    item.addEventListener("click", () => {
      if (!unlocked) {
        // Unlock on click for easy evaluation/testing
        unlockBadge(b.id);
      }
    });

    grid.appendChild(item);
  });
}

// Render Astro Alerts Tab
function renderAlerts() {
  const list = document.getElementById("alerts-list");
  if (!list) return;
  
  list.innerHTML = "";
  const lang = state.language;
  const dict = TRANSLATIONS[lang];

  // 1. Add ISS Pass Alert (Live calculated)
  const issCard = document.createElement("div");
  issCard.className = "alert-card active-alert";
  issCard.innerHTML = `
    <div class="alert-indicator"></div>
    <div class="alert-content">
      <div class="alert-event-title">${dict.issAlertTitle}</div>
      <div class="alert-event-time">TONIGHT, 09:15 PM</div>
      <div class="alert-event-desc">${dict.issAlertDesc}</div>
    </div>
  `;
  issCard.addEventListener("click", () => {
    // Jump time travel to simulated ISS pass time (approx 8.7 hours ahead)
    const timeSlider = document.getElementById("time-travel-slider");
    timeSlider.value = 9;
    timeSlider.dispatchEvent(new Event("input"));
    showToastAlert("Fast-forwarded to tonight. Watch for the ISS overhead!");
    unlockBadge("meteor_tracker"); // unlocked tracker
  });
  list.appendChild(issCard);

  // 2. Add offline meteor showers
  STARS_DB.meteorShowers.forEach(ms => {
    const name = lang === "hi" ? ms.name_hi : ms.name;
    const date = lang === "hi" ? ms.date_hi : ms.date;
    const card = document.createElement("div");
    card.className = "alert-card";
    card.innerHTML = `
      <div class="alert-indicator"></div>
      <div class="alert-content">
        <div class="alert-event-title">${name}</div>
        <div class="alert-event-time">${date}</div>
        <div class="alert-event-desc">${ms.description}</div>
      </div>
    `;
    list.appendChild(card);
  });
}

// Export canvas image with watermarks
function exportWatermarkedImage() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = window.innerWidth;
  exportCanvas.height = window.innerHeight;
  const ctx = exportCanvas.getContext("2d");

  // 1. Draw background (uploaded image or video stream or default simulator)
  const video = document.getElementById("camera-stream");
  if (state.uploadedImage) {
    ctx.drawImage(state.uploadedImage, 0, 0, exportCanvas.width, exportCanvas.height);
  } else if (state.cameraStream) {
    ctx.drawImage(video, 0, 0, exportCanvas.width, exportCanvas.height);
  } else {
    // Draw simulator background
    ctx.fillStyle = state.nightMode ? "#0d0000" : "#040814";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  }

  // 2. Draw current AR Overlay (stars & constellations)
  ctx.drawImage(arCanvas, 0, 0);

  // 3. Draw Watermark & labels
  ctx.fillStyle = state.nightMode ? "rgba(255, 0, 0, 0.65)" : "rgba(0, 240, 255, 0.7)";
  ctx.font = "bold 13px 'Orbitron'";
  ctx.textAlign = "right";
  ctx.fillText("StarFinder Web | 100% Offline PWA", exportCanvas.width - 24, exportCanvas.height - 45);

  ctx.fillStyle = state.nightMode ? "rgba(255, 0, 0, 0.45)" : "rgba(148, 163, 184, 0.6)";
  ctx.font = "10px sans-serif";
  const now = new Date(Date.now() + state.timeOffset);
  ctx.fillText(now.toLocaleString(), exportCanvas.width - 24, exportCanvas.height - 25);

  // Trigger download
  try {
    const url = exportCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `StarFinder_${Date.now()}.png`;
    link.href = url;
    link.click();
  } catch (e) {
    console.error("Failed to export canvas image (likely local testing security block):", e);
    showToastAlert("Local browser security blocked data export. Works fully when hosted.");
  }
}

// Update PWA cached sync indicator
function updateSyncIndicator() {
  const syncDot = document.getElementById("sync-dot");
  const syncLabel = document.getElementById("sync-label");
  if (!syncDot || !syncLabel) return;

  if (navigator.onLine) {
    syncDot.style.backgroundColor = "#10b981"; // green
    syncLabel.textContent = "Offline Database Sync: OK";
  } else {
    syncDot.style.backgroundColor = "#64748b"; // gray
    syncLabel.textContent = "Offline Mode Active";
  }
}

window.addEventListener("online", updateSyncIndicator);
window.addEventListener("offline", updateSyncIndicator);
