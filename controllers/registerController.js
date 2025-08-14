const createAccount = (req, res) => {
  console.log(req.body);
  res.json({
    submitted: true,
  })
};


module.exports = {
  createAccount,
}