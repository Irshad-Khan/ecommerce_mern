class ApiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    // small i mean search is not case-sensitive
    search(){
        const keyword  = this.queryString.keyword ? {
            name:{
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        }:{};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(){
        const queryStringCopy = { ...this.queryString };
        const excludedFields = ['keyword', 'limit', 'page'];
        excludedFields.forEach(field => delete queryStringCopy[field]);

        let queryString = JSON.stringify(queryStringCopy);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }


    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skip = (currentPage - 1) * resultPerPage;
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;