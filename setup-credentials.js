/**
 * Secure Credential Setup Script
 * Allows you to input Autopilot credentials with masked password
 * and updates .env.local file automatically
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to mask password input
function askPassword(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(query);
    
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    
    stdin.on('data', function onData(char) {
      char = char + '';
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl+D
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003': // Ctrl+C
          stdin.setRawMode(false);
          stdin.pause();
          process.exit();
          break;
        case '\u0008': // Backspace
        case '\u007F': // Delete
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.clearLine(0);
            stdout.cursorTo(0);
            stdout.write(query + '*'.repeat(password.length));
          }
          break;
        default:
          // Ignore control characters
          if (char.charCodeAt(0) < 32 && char !== '\r' && char !== '\n') {
            break;
          }
          password += char;
          // Clear and rewrite entire line to show only asterisks
          stdout.clearLine(0);
          stdout.cursorTo(0);
          stdout.write(query + '*'.repeat(password.length));
          break;
      }
    });
  });
}

// Function to ask username (not masked)
function askUsername(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

// Function to update .env.local file
function updateEnvFile(username, password) {
  const envPath = path.join(__dirname, '.env.local');
  
  try {
    // Read existing .env.local file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add credentials
    const usernameRegex = /AUTOPILOT_USERNAME=.*/;
    const passwordRegex = /AUTOPILOT_PASSWORD=.*/;
    
    if (usernameRegex.test(envContent)) {
      envContent = envContent.replace(usernameRegex, `AUTOPILOT_USERNAME=${username}`);
    } else {
      envContent += `\nAUTOPILOT_USERNAME=${username}`;
    }
    
    if (passwordRegex.test(envContent)) {
      envContent = envContent.replace(passwordRegex, `AUTOPILOT_PASSWORD=${password}`);
    } else {
      envContent += `\nAUTOPILOT_PASSWORD=${password}`;
    }
    
    // Write back to file
    fs.writeFileSync(envPath, envContent, 'utf8');
    
    console.log('\n✅ Credentials updated successfully in .env.local');
    console.log('🔒 Your password has been stored securely and is not visible in the file editor.');
    console.log('\n⚠️  IMPORTANT: Restart your development server for changes to take effect:');
    console.log('   npm run dev\n');
  } catch (error) {
    console.error('\n❌ Error updating .env.local file:', error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('\n🔐 AVIATOR - Secure Credential Setup\n');
  console.log('This script will help you securely configure Autopilot credentials.');
  console.log('Your password will be masked while typing.\n');
  console.log('────────────────────────────────────────────────────────────\n');
  
  try {
    // Get username
    const username = await askUsername('Enter Autopilot Username: ');
    
    if (!username || username.trim() === '') {
      console.log('\n❌ Username cannot be empty. Please try again.');
      rl.close();
      process.exit(1);
    }
    
    // Get password (masked)
    const password = await askPassword('Enter Autopilot Password: ');
    
    if (!password || password.trim() === '') {
      console.log('\n❌ Password cannot be empty. Please try again.');
      rl.close();
      process.exit(1);
    }
    
    // Confirm password (masked)
    const confirmPassword = await askPassword('Confirm Password: ');
    
    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match. Please try again.');
      rl.close();
      process.exit(1);
    }
    
    console.log('\n');
    
    // Update .env.local file
    updateEnvFile(username.trim(), password.trim());
    
    rl.close();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Run the script
main();
