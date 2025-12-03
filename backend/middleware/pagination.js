const pagination = (defaultLimit = 20, maxLimit = 100) => {
  return (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit) || defaultLimit));
    const skip = (page - 1) * limit;

    req.pagination = {
      page,
      limit,
      skip,
      sort: req.query.sort || '-createdAt'
    };

    res.paginate = (data, total) => {
      const totalPages = Math.ceil(total / limit);
      
      return {
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null
        }
      };
    };

    next();
  };
};

module.exports = { pagination };