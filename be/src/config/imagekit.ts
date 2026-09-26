import ImageKit from 'imagekit';
import { ENV } from './env';

export const imagekit = new ImageKit({
  publicKey: ENV.IMAGEKIT.PUBLIC_KEY,
  privateKey: ENV.IMAGEKIT.PRIVATE_KEY,
  urlEndpoint: ENV.IMAGEKIT.URL_ENDPOINT
});
