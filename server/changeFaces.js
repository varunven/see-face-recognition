// handle changing faces

function handlechangeFaces(faceID, origName, newName) {
  // Process input and return data
  const result = { message: `${ faceID } has been renamed from ${ origName } to ${newName}` };
  return result;
}

module.exports.handlechangeFaces = handlechangeFaces;