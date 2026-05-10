import nodemailer from 'nodemailer';
import { loadEnvironment } from '../config/environment.js';

const env = loadEnvironment();

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: env.emailSecure,
  auth: {
    user: env.emailUser,
    pass: env.emailPass
  }
});

export default transporter;
