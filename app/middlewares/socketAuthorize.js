module.exports = function socketAuthorize(permission) {
  return (socket, next) => {
    if (!socket.user) {
      return next(new Error("Unauthenticated"));
    }

    if (!socket.user.permissions.includes(permission)) {
      return next(new Error("Forbidden"));
    }

    next();
  };
};
