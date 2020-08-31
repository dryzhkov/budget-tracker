const fs = require('fs');

try {
  if (fs.existsSync('./.env')) {
    console.log('.env file already exists. will exit now.');
    process.exit(0);
  } else {
    // create .env file
    fs.writeFileSync(
      './.env',
      `JWT_SECRET=${process.env.JWT_SECRET}\n
        MONGODB_URI=${process.env.MONGODB_URI}\n
        MONGODB_USER=${process.env.MONGODB_USER}\n
        MONGODB_PSWD=${process.env.MONGODB_PSWD}\n
        MONGODB_NAME=${process.env.MONGODB_NAME}\n`
    );
    console.log('new .env created!');
    process.exit(0);
  }
} catch (e) {
  console.error('unexpected error happened: ' + e);
  process.exit(1);
}
