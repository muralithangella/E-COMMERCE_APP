class BaseRepository {
  constructor(model) {
    this.model = model;
    this.cache = require('../config/database').getRedis();
  }

  async findById(id, options = {}) {
    const cacheKey = `${this.model.modelName}:${id}`;
    
    if (options.useCache !== false) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const document = await this.model.findById(id).lean();
    if (document && options.useCache !== false) {
      await this.cache.setex(cacheKey, 300, JSON.stringify(document));
    }
    
    return document;
  }

  async find(query = {}, options = {}) {
    const { page = 1, limit = 20, sort = {}, populate = [], select = '' } = options;
    const skip = (page - 1) * limit;

    let queryBuilder = this.model.find(query);
    
    if (select) queryBuilder = queryBuilder.select(select);
    if (populate.length) queryBuilder = queryBuilder.populate(populate);
    if (Object.keys(sort).length) queryBuilder = queryBuilder.sort(sort);
    
    const [documents, total] = await Promise.all([
      queryBuilder.skip(skip).limit(limit).lean(),
      this.model.countDocuments(query)
    ]);

    return {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async create(data) {
    const document = new this.model(data);
    await document.save();
    await this.invalidateCache(document._id);
    return document.toObject();
  }

  async update(id, data) {
    const document = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    await this.invalidateCache(id);
    return document?.toObject();
  }

  async delete(id) {
    const result = await this.model.findByIdAndDelete(id);
    await this.invalidateCache(id);
    return result;
  }

  async invalidateCache(id) {
    const cacheKey = `${this.model.modelName}:${id}`;
    await this.cache.del(cacheKey);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }
}

module.exports = BaseRepository;