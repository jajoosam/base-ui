const { Deta } = require("deta");

export default (req, res) => {
  const deta = Deta(req.body.secret);
  const store = deta.Base(req.body.collection);
  Promise.all(
    req.body.oldRows.filter((e) => e).map((row) => store.delete(row.key))
  ).then(() => {
    Promise.all(req.body.newRows.map((row, i) => store.put(row))).then(() =>
      res.end()
    );
  });
};
