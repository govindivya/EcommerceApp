class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    let category = queryCopy.category ? queryCopy.category : "";
    let name = queryCopy.keyword ? queryCopy.keyword:"";
    category = new RegExp(category + name, "i");
    console.log(category)
    this.query = this.query.find({
      $or: [{ category: { $regex: category } }, { name: { $regex: category } }],
    });

    const removeFields = ["keyword", "page", "limit", "category"];
    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
