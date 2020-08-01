const { Deta } = require("deta");
const HJSON = require("hjson");
const valid = (data) => {
  try {
    HJSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

export default async (req, res) => {
  const deta = Deta(req.body.secret);
  const store = deta.Base(req.body.collection);
  let data = await store
    .fetch(
      req.body.query && valid(req.body.query) ? HJSON.parse(req.body.query) : []
    )
    .next();
  return res.json(data);
};
