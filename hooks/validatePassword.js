module.exports = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password.length < 6) {
    req.session.formError = {
      error: null,
      passwordLengthNotValid: true,
      confirmPasswordNotMatch: false,
    };
    return res.redirect("/sign-up");
  }
  if (confirmPassword !== password) {
    req.session.formError = {
      error: null,
      confirmPasswordNotMatch: true,
      passwordLengthNotValid: false,
    };
    return res.redirect("/sign-up");
  }
  next();
};
