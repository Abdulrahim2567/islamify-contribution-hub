import { StatusCodes, ReasonPhrases } from "http-status-codes";

const notFound = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);

export default notFound;
