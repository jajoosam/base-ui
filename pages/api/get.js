const { Deta } = require("deta");

const valid = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

export default async (req, res) => {
  const deta = Deta(req.body.secret);
  const store = deta.Base(req.body.collection);
  let data = await store
    .fetch(valid(req.body.query) ? JSON.parse(req.body.query) : [])
    .next();
  return res.json(data);
};
