import NOT_FOUND from '../errors/notFound.js';

export default (req, res) => {
    console.log(NOT_FOUND)
    // res.status(NOT_FOUND.statusCode).send(NOT_FOUND);
}