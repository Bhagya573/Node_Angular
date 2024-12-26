const Quote = require('../models/Quote');
const logAction = require('../middlewares/actionLogger');

// Helper function to handle errors
const handleError = (res, error, customMessage = 'An error occurred') => {
  if (error.name === 'ValidationError') {
    const errorMessages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  }
  console.error(error);
  return res.status(500).json({ message: customMessage, error: error.message });
};

// Create Quote
exports.createQuote = async (req, res) => {
  const { quoteName, customerName, quoteType, serialNumber, planNumber, warrantyTerms, warrantyHours } = req.body;

  // Input validation
  if (!quoteName || !customerName || !quoteType) {
    return res.status(400).json({ message: 'Quote name, customer name, and quote type are required' });
  }

  try {
    // Optionally check for existing quotes with the same quoteName
    const existingQuote = await Quote.findOne({ quoteName });
    if (existingQuote) {
      return res.status(400).json({ message: 'Quote with this name already exists' });
    }

    // Create a new Quote
    const newQuote = new Quote({
      quoteName,
      customerName,
      quoteType,
      serialNumber,
      planNumber,
      warrantyTerms,
      warrantyHours,
    });

    // Save the new quote to the database
    await newQuote.save();
    logAction('Create Quote', `Quote created with name: ${quoteName} by user: ${req.user.username}`);
    
    res.status(201).json(newQuote);
  } catch (error) {
    handleError(res, error, 'Error creating quote');
  }
};

// Get Quote Types
exports.getQuoteTypes = async (req, res) => {
  try {
    // Define or fetch quote types, assuming static types or from DB
    const quoteTypes = ['NEW', 'USED']; 

    logAction('Get Quote Types', `Quote types fetched by user: ${req.user?.username}`);
    res.json({ quoteTypes });
  } catch (error) {
    handleError(res, error, 'Error fetching quote types');
  }
};

// Get Quotes with Pagination & Search
exports.getQuotes = async (req, res) => {
  const { page = 1, pageSize = 10, searchQuery = '' } = req.query;

  const pageNum = Math.max(parseInt(page, 10), 1);  
  const pageLimit = Math.max(parseInt(pageSize, 10), 10);

  // Construct the search query
  const regexQuery = searchQuery
    ? { quoteName: { $regex: searchQuery, $options: 'i' } }
    : {};

  try {
    // Fetch quotes with pagination
    const quotes = await Quote.find(regexQuery)
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit);

    // Get total number of quotes matching the query
    const totalQuotes = await Quote.countDocuments(regexQuery);
    const totalPages = Math.ceil(totalQuotes / pageLimit);

    logAction('Get Quotes', `Quotes fetched by user: ${req.user.username} with search query: "${searchQuery}"`);

    res.json({ quotes, totalQuotes, totalPages });
  } catch (error) {
    handleError(res, error, 'Error fetching quotes');
  }
};
