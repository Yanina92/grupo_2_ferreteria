
const guestMiddlewares = (req, res, next) => {
  if(req.session.user){
    return res.redirect('user/profile')
  }
  next();
}




module.exports = guestMiddlewares;