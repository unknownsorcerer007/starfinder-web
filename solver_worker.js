// StarFinder Web - Off-Thread Plate Solver Web Worker (solver_worker.js)

// Import dependencies (since workers operate in their own global scope)
self.importScripts("stars_db.js", "plate_solver.js");

self.onmessage = function (e) {
  const { action, imgData, sensorRA, sensorDec, fov } = e.data;

  if (action === "solve") {
    try {
      // 1. Run centroid blob detection on the ImageData passed from the main thread
      const detectedStars = PlateSolver.detectStars(imgData);

      // 2. Perform the geometric hashing template matching against STARS_DB
      const result = PlateSolver.solve(detectedStars, STARS_DB, sensorRA, sensorDec, fov);

      // 3. Post the resolved result back to the main thread
      self.postMessage({
        success: true,
        result: result
      });
    } catch (err) {
      console.error("[Web Worker] Error during off-thread plate solving:", err);
      self.postMessage({
        success: false,
        error: err.message
      });
    }
  }
};
