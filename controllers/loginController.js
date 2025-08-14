const loginUser = (req, res) => {
  res.json(req.user);
};


module.exports = {
  loginUser,
}