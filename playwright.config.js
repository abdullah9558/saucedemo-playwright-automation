module.exports = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  username: process.env.SAUCE_USERNAME || 'standard_user',
  password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  timeout: 30_000,
  headless: process.env.HEADED !== '1',
  slowMo: Number(process.env.SLOW_MO || 0)
};
