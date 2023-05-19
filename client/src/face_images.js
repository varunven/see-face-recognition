const importAll = (context) => context.keys().map(context);

const images = importAll(require.context('./face_images', false, /\.(png)$/));
export default images;
