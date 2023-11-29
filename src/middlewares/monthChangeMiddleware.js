// Middleware to check the change of month in each request.
let currentMonth = -1;

// Sales
export const checkMonthChangeMiddlewareSales = (req, res, next) => {
    const now = new Date();
    const month = now.getMonth() + 1; 
  
    if (month !== currentMonth) {
      currentMonth = month;
    }
  
    next();
};


// Purchases
export const checkMonthChangeMiddlewarePurchases = (req, res, next) => {
    const now = new Date();
    const month = now.getMonth() + 1;
  
    if (month !== currentMonth) {
      currentMonth = month;
    }
  
    next();
};


// Improvements
export const checkMonthChangeMiddlewareImprovements = (req, res, next) => {
    const now = new Date();
    const month = now.getMonth() + 1;
  
    if (month !== currentMonth) {
      currentMonth = month;
    }
  
    next();
};

// Exchanges
export const checkMonthChangeMiddlewareExchanges = (req, res, next) => {
    const now = new Date();
    const month = now.getMonth() + 1;
  
    if (month !== currentMonth) {
      currentMonth = month;
    }
  
    next();
};