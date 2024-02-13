const express = require('express');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Azure SQL Database connection configuration
const dbConfig = {
  user: 'azureuser',
  password: 'Pa$$w0rd1234',
  server: 'sqlsrver.database.windows.net',
  database: 'mydatabase',
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

// Function to read HTML file from local project files
const readLocalHtmlFile = () => {
  const filePath = path.join(__dirname, 'index.html');
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error('Error reading local HTML file:', error);
    throw error;
  }
};

app.get('/', async (req, res) => {
  try {
    // Fetch static content from local HTML file
    const staticContent = readLocalHtmlFile();

    // Connect to Azure SQL Database
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM UserInfo');

    // Use static content and database result in your response
    res.send(`<html><body>${staticContent}<br>${JSON.stringify(result.recordset)}</body></html>`);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the database connection
    await sql.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
