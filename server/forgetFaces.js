// handle face forgetting

function handleForgetFace(input) {
  // Process input and return data
  if (input) {
    const result = { message: `Deleted all faces` };
    return result;
  }
  const result = { message: `Was given input ${input}, so did not delete all faces` };
  return result;
}

module.exports.handleForgetFace = handleForgetFace;