exports.checkType = async (newComment) => {
  for (const key in newComment) {
    if (typeof newComment[key] !== "string") {
      return Promise.reject({
        status: 422,
        errorMessage:
          "Unprocessable Entity - Your comment object must only contain strings",
      });
    }
  }
  return Promise.resolve(newComment);
};
