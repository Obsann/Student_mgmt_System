const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function testUpload() {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find student
    const studentUser = await User.findOne({ username: 'mekdes.yilma.a1d' });
    if (!studentUser) {
      console.error('Student user not found');
      process.exit(1);
    }
    console.log('Current Avatar in DB:', studentUser.avatar);

    // Login to get token
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'mekdes.yilma.a1d', password: 'student123' })
    });
    const { token } = await loginRes.json();
    console.log('Logged in. Token retrieved.');

    // Prepare form data
    const form = new FormData();
    // Create a 1x1 transparent PNG blob
    const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    const blob = new Blob([pngBuffer], { type: 'image/png' });
    form.append('avatar', blob, 'avatar.png');

    console.log('Uploading avatar...');
    const uploadRes = await fetch('http://localhost:5001/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });

    console.log('Upload HTTP Status:', uploadRes.status);
    const responseData = await uploadRes.json();
    console.log('Upload Response Body:', responseData);

    // Re-check DB
    const updatedUser = await User.findById(studentUser._id);
    console.log('Updated Avatar in DB:', updatedUser.avatar);

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testUpload();
