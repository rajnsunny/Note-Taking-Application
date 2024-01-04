const Throttler = (req, res, next) => {
    try {
      // Check resource usage (e.g., CPU, database calls)
      const cpuUsage = process.cpuUsage(); // Adjust criteria as needed
      if (cpuUsage.user > 80) {
        return res.status(429).json({ message: 'Server is overloaded, please try again later' });
      }
  
      next();
    } catch (err) {
      // Handle errors
    }
  }

module.exports = Throttler;