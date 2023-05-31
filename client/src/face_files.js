const importAll = (context) => context.keys().map(context);

const images = importAll(require.context('./face_files', false, /\.(png)$/))
const audio_files = importAll(require.context('./face_files', false, /\.(wav)$/))

export { images, audio_files };
